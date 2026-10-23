using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Automation;

public static class ChatGptDesktopBridge {
  [DllImport("user32.dll")] static extern bool IsIconic(IntPtr window);
  [DllImport("user32.dll")] static extern bool SetForegroundWindow(IntPtr window);
  [DllImport("user32.dll")] static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] static extern uint GetClipboardSequenceNumber();
  [DllImport("user32.dll")] static extern bool ShowWindow(IntPtr window, int command);
  [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr window);
  [DllImport("user32.dll")] static extern bool SetWindowPos(IntPtr window, IntPtr after, int x, int y, int width, int height, uint flags);
  delegate bool EnumWindowProc(IntPtr window, IntPtr data);
  [DllImport("user32.dll")] static extern bool EnumWindows(EnumWindowProc callback, IntPtr data);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetWindowText(IntPtr window, StringBuilder title, int length);
  [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr window, out uint processId);
  static readonly JavaScriptSerializer Json = new JavaScriptSerializer();
  static AutomationElement root;
  static AutomationElement[] Nodes() {
    var cache = new CacheRequest();
    cache.Add(AutomationElement.ControlTypeProperty); cache.Add(AutomationElement.NameProperty);
    cache.Add(AutomationElement.IsEnabledProperty); cache.Add(AutomationElement.IsOffscreenProperty);
    using (cache.Activate()) return root.FindAll(TreeScope.Descendants, Condition.TrueCondition).Cast<AutomationElement>().ToArray();
  }
  static string Text(AutomationElement element) {
    object pattern;
    if (element.Current.ControlType == ControlType.Edit && element.TryGetCurrentPattern(ValuePattern.Pattern, out pattern)) return ((ValuePattern)pattern).Current.Value;
    if (element.TryGetCurrentPattern(TextPattern.Pattern, out pattern)) return ((TextPattern)pattern).DocumentRange.GetText(-1);
    if (element.TryGetCurrentPattern(ValuePattern.Pattern, out pattern)) return ((ValuePattern)pattern).Current.Value;
    return "";
  }
  static string Canonical(string value) { return Regex.Replace(value ?? "", @"\s+", " ").Trim(); }
  static AutomationElement NamedAction(params string[] names) {
    foreach (var name in names) {
      var matches = root.FindAll(TreeScope.Descendants, new AndCondition(
        new PropertyCondition(AutomationElement.NameProperty, name),
        new PropertyCondition(AutomationElement.IsEnabledProperty, true)));
      foreach (AutomationElement e in matches) {
        try { if (e.Current.ControlType == ControlType.Button || e.Current.ControlType == ControlType.MenuItem) return e; }
        catch (ElementNotAvailableException) { }
      }
    }
    // ChatGPT combines menu captions and descriptions in some accessibility names.
    foreach (AutomationElement e in root.FindAll(TreeScope.Descendants, new PropertyCondition(AutomationElement.IsEnabledProperty, true))) {
      try {
        if (e.Current.ControlType != ControlType.Button && e.Current.ControlType != ControlType.MenuItem) continue;
        string caption = e.Current.Name ?? "";
        if (names.Any(name => caption.StartsWith(name + " ", StringComparison.Ordinal) || caption.StartsWith(name + "\n", StringComparison.Ordinal))) return e;
      } catch (ElementNotAvailableException) { }
    }
    return null;
  }
  static bool HasButton(string name) { return root.FindFirst(TreeScope.Descendants, new AndCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button), new PropertyCondition(AutomationElement.NameProperty, name))) != null; }
  static bool VoiceActive() { return HasButton("Stop voice chat") || ((HasButton("Mute microphone") || HasButton("Unmute microphone")) && (HasButton("Mute speakers") || HasButton("Unmute speakers"))); }
  static string ConversationText() {
    var documents = root.FindAll(TreeScope.Descendants, new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Document)).Cast<AutomationElement>().ToArray();
    string text = String.Join("\n", documents.Select(Text));
    // Some Voice documents expose only the focused composer through TextPattern.
    var names = root.FindAll(TreeScope.Descendants, Condition.TrueCondition).Cast<AutomationElement>()
      .Where(e => e.Current.ControlType == ControlType.Text || e.Current.Name == "You said:" || e.Current.Name == "ChatGPT said:")
      .Select(e => e.Current.Name ?? "").Where(name => name.Length > 0).ToArray();
    string fallback = String.Join("\n", names);
    return fallback.Contains("You said:") && Regex.Matches(fallback, "You said:").Count > Regex.Matches(text, "You said:").Count ? fallback : text;
  }
  static void Invoke(AutomationElement element) {
    object pattern;
    if (element == null) throw new Exception("Attachment control is unavailable. Nothing was submitted.");
    if (!element.TryGetCurrentPattern(InvokePattern.Pattern, out pattern)) {
      if (element.TryGetCurrentPattern(TogglePattern.Pattern, out pattern)) {
        ((TogglePattern)pattern).Toggle(); return;
      }
      if (element.TryGetCurrentPattern(ExpandCollapsePattern.Pattern, out pattern)) {
        var expansion = (ExpandCollapsePattern)pattern;
        if (expansion.Current.ExpandCollapseState != ExpandCollapseState.Expanded) expansion.Expand();
        return;
      }
      throw new Exception("Attachment control is unavailable. Nothing was submitted.");
    }
    // File-picker Invoke may block until its modal closes. Poll the dialog on this thread.
    System.Threading.Tasks.Task.Run(() => ((InvokePattern)pattern).Invoke());
  }
  static bool AttachmentPresent(string filename) {
    return Nodes().Any(e => {
      try {
        string name = e.Cached.Name ?? "";
        return (!String.IsNullOrEmpty(filename) && name.IndexOf(filename, StringComparison.OrdinalIgnoreCase) >= 0) ||
          Regex.IsMatch(name, @"^Remove (image|file|attachment)", RegexOptions.IgnoreCase);
      } catch (ElementNotAvailableException) { return false; } catch (COMException) { return false; }
    });
  }
  static bool UploadInProgress() {
    return Nodes().Any(e => {
      try { return e.Cached.ControlType == ControlType.ProgressBar || Regex.IsMatch(e.Cached.Name ?? "", @"^Uploading", RegexOptions.IgnoreCase); }
      catch (ElementNotAvailableException) { return false; } catch (COMException) { return false; }
    });
  }
  static void WaitForAttachment(string filename) {
    var deadline = DateTime.UtcNow.AddSeconds(45); DateTime? stable = null;
    while (DateTime.UtcNow < deadline) {
      try {
        bool present = AttachmentPresent(filename);
        bool uploading = UploadInProgress();
        if (present && !uploading && NamedAction("Send") != null) {
          if (!stable.HasValue) stable = DateTime.UtcNow;
          if ((DateTime.UtcNow - stable.Value).TotalMilliseconds >= 1000) return;
        } else stable = null;
      } catch (ElementNotAvailableException) { stable = null; }
        catch (COMException) { stable = null; }
      Thread.Sleep(150);
    }
    throw new Exception("Screenshot attachment could not be verified. Nothing was submitted; inspect the draft before retrying.");
  }
  static void PasteImageThroughAccessibility(string filePath) {
    var menu = NamedAction("Add files and more"); object expansion;
    if (menu != null && menu.TryGetCurrentPattern(ExpandCollapsePattern.Pattern, out expansion)) {
      var expanded = (ExpandCollapsePattern)expansion;
      if (expanded.Current.ExpandCollapseState == ExpandCollapseState.Expanded) expanded.Collapse();
    }
    var composer = root.FindFirst(TreeScope.Descendants, new AndCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit),
      new OrCondition(new PropertyCondition(AutomationElement.NameProperty, "Ask ChatGPT"), new PropertyCondition(AutomationElement.NameProperty, "Work with ChatGPT"))));
    if (composer == null) throw new Exception("The same chat composer is unavailable for image paste. Nothing was submitted.");
    composer.SetFocus();
    var previous = System.Windows.Forms.Clipboard.GetDataObject(); uint installedSequence = 0;
    try {
      using (var image = System.Drawing.Image.FromFile(filePath)) {
        System.Windows.Forms.Clipboard.SetImage(image); installedSequence = GetClipboardSequenceNumber();
      }
      Invoke(NamedAction("Edit"));
      AutomationElement paste = null; var deadline = DateTime.UtcNow.AddSeconds(5);
      while (paste == null && DateTime.UtcNow < deadline) { paste = NamedAction("Paste"); if (paste == null) Thread.Sleep(100); }
      if (paste == null) throw new Exception("Edit > Paste is unavailable through accessibility. No keyboard or coordinate fallback was used.");
      Invoke(paste); WaitForAttachment(Path.GetFileName(filePath));
    } finally {
      if (installedSequence != 0 && GetClipboardSequenceNumber() == installedSequence) {
        if (previous != null) System.Windows.Forms.Clipboard.SetDataObject(previous, true); else System.Windows.Forms.Clipboard.Clear();
      }
    }
  }
  static void AttachImage(string filePath, IntPtr owner) {
    if (!Path.IsPathRooted(filePath) || !File.Exists(filePath) || !filePath.EndsWith(".png", StringComparison.OrdinalIgnoreCase)) throw new Exception("Screenshot file is missing or invalid. Nothing was submitted.");
    if (AttachmentPresent(null)) throw new Exception("ChatGPT already has an attachment. Remove it before capturing another screen. Nothing was submitted.");
    SetForegroundWindow(owner);
    Thread.Sleep(250);
    var attach = NamedAction("Add photos & files", "Add photos and files", "Add images", "Upload image", "Attach image", "Images", "Attach files");
    if (attach == null) {
      var menu = NamedAction("Add files and more", "Add files", "Attach");
      if (menu == null) throw new Exception("ChatGPT attachment menu was not found. Open the regular chat composer. Nothing was submitted.");
      Invoke(menu);
      var menuDeadline = DateTime.UtcNow.AddSeconds(5);
      while (attach == null && DateTime.UtcNow < menuDeadline) { Thread.Sleep(100); attach = NamedAction("Add photos & files", "Add photos and files", "Add images", "Upload image", "Attach image", "Images", "Upload from computer", "Upload files"); }
    }
    if (attach == null) { PasteImageThroughAccessibility(filePath); return; }
    string uploadAction = attach.Current.Name;
    Invoke(attach);
    AutomationElement dialog = null;
    uint ownerPid; GetWindowThreadProcessId(owner, out ownerPid);
    var deadline = DateTime.UtcNow.AddSeconds(10);
    while (dialog == null && DateTime.UtcNow < deadline) {
      // The native picker can be an owned descendant of ChatGPT rather than a
      // top-level desktop child (and so is omitted from ordinary window lists).
      dialog = root.FindFirst(TreeScope.Descendants, new AndCondition(
        new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Window),
        new PropertyCondition(AutomationElement.NameProperty, "Open")));
      if (dialog == null) dialog = AutomationElement.RootElement.FindAll(TreeScope.Children, new AndCondition(
        new PropertyCondition(AutomationElement.ProcessIdProperty, (int)ownerPid),
        new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Window))).Cast<AutomationElement>()
        .FirstOrDefault(e => e.Current.NativeWindowHandle != owner.ToInt32() && e.Current.Name == "Open");
      if (dialog == null) Thread.Sleep(100);
    }
    if (dialog == null) throw new Exception("ChatGPT file picker did not open after accessibility action '" + uploadAction + "'. Nothing was submitted.");
    var filenameControl = dialog.FindFirst(TreeScope.Descendants, new AndCondition(
      new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit),
      new PropertyCondition(AutomationElement.AutomationIdProperty, "1148")));
    if (filenameControl == null) filenameControl = dialog.FindFirst(TreeScope.Descendants, new AndCondition(
      new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit),
      new PropertyCondition(AutomationElement.NameProperty, "File name:")));
    object value;
    if (filenameControl == null || !filenameControl.TryGetCurrentPattern(ValuePattern.Pattern, out value)) throw new Exception("File picker filename field is unavailable. Nothing was submitted.");
    ((ValuePattern)value).SetValue(filePath);
    var open = dialog.FindFirst(TreeScope.Descendants, new AndCondition(
      new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button),
      new PropertyCondition(AutomationElement.AutomationIdProperty, "1")));
    Invoke(open);
    deadline = DateTime.UtcNow.AddSeconds(45);
    DateTime? stableSince = null;
    while (DateTime.UtcNow < deadline) {
      try {
        bool present = AttachmentPresent(Path.GetFileName(filePath));
          bool uploading = UploadInProgress();
        bool canSend = NamedAction("Send") != null;
        if (present && !uploading && canSend) {
          if (!stableSince.HasValue) stableSince = DateTime.UtcNow;
          if ((DateTime.UtcNow - stableSince.Value).TotalMilliseconds >= 1000) return;
        } else stableSince = null;
      } catch (ElementNotAvailableException) { stableSince = null; }
      Thread.Sleep(150);
    }
    throw new Exception("Screenshot upload could not be verified. The draft was not submitted; inspect ChatGPT before retrying.");
  }
  static int WatchVoice() {
    string previous = null;
    while (true) {
      try {
        // Read only. Invoking scroll controls can activate ChatGPT while the user types elsewhere.
        var documents = root.FindAll(TreeScope.Descendants, new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Document)).Cast<AutomationElement>().ToArray();
        if (documents.Length == 0) throw new Exception("ChatGPT's conversation is not accessible. Open and restore the conversation window before starting the text mirror.");
        string text = ConversationText();
        if (text != previous) {
          previous = text;
          Console.WriteLine(Json.Serialize(new { text = text, observedAtMs = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds }));
          Console.Out.Flush();
        }
      } catch (ElementNotAvailableException) { }
        catch (InvalidOperationException) { }
        catch (COMException) { }
      Thread.Sleep(150);
    }
  }
  [STAThread] public static int Main(string[] args) {
    // Save before Voice expands its composer or opens attachment controls.
    var previousWindow = GetForegroundWindow();
    IntPtr attachmentWindow = IntPtr.Zero;
    Action restoreAttachmentFocus = () => {
      if (attachmentWindow == IntPtr.Zero || previousWindow == IntPtr.Zero) return;
      uint attachmentProcess, foregroundProcess;
      GetWindowThreadProcessId(attachmentWindow, out attachmentProcess);
      GetWindowThreadProcessId(GetForegroundWindow(), out foregroundProcess);
      // Respect a user who has already switched to a different application.
      if (attachmentProcess != 0 && foregroundProcess == attachmentProcess) SetForegroundWindow(previousWindow);
      attachmentWindow = IntPtr.Zero;
    };
    try {
      Console.OutputEncoding = new UTF8Encoding(false);
      var elapsed = Stopwatch.StartNew();
      if (args.Length == 2 && args[0] == "--trigger-overlay-screen") {
        int requestedOverlayPid;
        if (!Int32.TryParse(args[1], out requestedOverlayPid) || requestedOverlayPid <= 0) throw new Exception("A valid overlay process ID is required.");
        string expectedElectron = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "node_modules", "electron", "dist", "electron.exe"));
        var overlayPids = new HashSet<int>(Process.GetProcessesByName("electron").Where(p => {
          try { return p.Id == requestedOverlayPid && String.Equals(p.MainModule.FileName, expectedElectron, StringComparison.OrdinalIgnoreCase); }
          catch (System.ComponentModel.Win32Exception) { return false; }
        }).Select(p => p.Id));
        var screenshotButtons = new List<AutomationElement>();
        foreach (AutomationElement appWindow in AutomationElement.RootElement.FindAll(TreeScope.Children, Condition.TrueCondition)) {
          try {
            if (!overlayPids.Contains(appWindow.Current.ProcessId)) continue;
            screenshotButtons.AddRange(appWindow.FindAll(TreeScope.Descendants, new AndCondition(
              new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button),
              new PropertyCondition(AutomationElement.NameProperty, "Send screenshot to ChatGPT"),
              new PropertyCondition(AutomationElement.IsEnabledProperty, true))).Cast<AutomationElement>());
          } catch (ElementNotAvailableException) { }
        }
        if (screenshotButtons.Count != 1) throw new Exception("Expected one enabled overlay Screen action; found " + screenshotButtons.Count + ". No coordinate fallback was used.");
        object screenInvoke;
        if (!screenshotButtons[0].TryGetCurrentPattern(InvokePattern.Pattern, out screenInvoke)) throw new Exception("The overlay Screen action is not invokable through accessibility.");
        ((InvokePattern)screenInvoke).Invoke();
        Console.WriteLine(Json.Serialize(new { triggered = true, accessibility = true })); return 0;
      }
      if (args.Length == 1 && args[0] == "--probe-windows") {
        Console.WriteLine(Json.Serialize(Process.GetProcessesByName("ChatGPT").Select(p => new { id = p.Id, handle = p.MainWindowHandle.ToInt64(), title = p.MainWindowTitle }).ToArray())); return 0;
      }
      var processIds = new HashSet<int>(Process.GetProcessesByName("ChatGPT").Select(p => p.Id));
      if (args.Length == 1 && args[0] == "--probe-dialogs") {
        var dialogs = AutomationElement.RootElement.FindAll(TreeScope.Children, Condition.TrueCondition).Cast<AutomationElement>()
          .Where(e => processIds.Contains(e.Current.ProcessId)).ToArray();
        Console.WriteLine(Json.Serialize(dialogs.Select(e => new { title = e.Current.Name, controls = e.FindAll(TreeScope.Descendants,
          new OrCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit), new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button)))
          .Cast<AutomationElement>().Select(c => new { name = c.Current.Name, id = c.Current.AutomationId }).ToArray() }).ToArray())); return 0;
      }
      var windows = new List<IntPtr>();
      var nativeWindows = new List<IntPtr>();
      EnumWindows((handle, data) => {
        uint processId; GetWindowThreadProcessId(handle, out processId);
        var title = new StringBuilder(512); GetWindowText(handle, title, title.Capacity);
        if (title.ToString() == "ChatGPT") {
          var owner = Process.GetProcessById((int)processId).ProcessName;
          if (processIds.Contains((int)processId)) nativeWindows.Add(handle);
          if (processIds.Contains((int)processId) || owner.Equals("Codex", StringComparison.OrdinalIgnoreCase)) windows.Add(handle);
        }
        return true;
      }, IntPtr.Zero);
      var mainWindows = Process.GetProcessesByName("ChatGPT").Where(p => p.MainWindowHandle != IntPtr.Zero && p.MainWindowTitle == "ChatGPT").Select(p => p.MainWindowHandle).Distinct().ToList();
      var conversationWindows = nativeWindows.Where(handle => {
        try {
          return AutomationElement.FromHandle(handle).FindFirst(TreeScope.Descendants, new AndCondition(
            new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit),
            new OrCondition(new PropertyCondition(AutomationElement.NameProperty, "Ask ChatGPT"), new PropertyCondition(AutomationElement.NameProperty, "Work with ChatGPT")))) != null;
        } catch (ElementNotAvailableException) { return false; }
      }).ToList();
      // Voice's small companion has the same title and can become MainWindowHandle.
      // It has no conversation document or attachment menu. Never select it in
      // preference to the one full conversation composer.
      if (conversationWindows.Count > 0) windows = conversationWindows;
      else if (nativeWindows.Count == 1) windows = nativeWindows;
      else if (mainWindows.Count == 1) windows = mainWindows;
      if (windows.Count != 1) throw new Exception("Expected one ChatGPT conversation window; found " + windows.Count + ".");
      var window = windows[0];
      // Passive text/status probes must not reopen ChatGPT's controls over the overlay.
      bool passive = args.Length == 1 && args[0].StartsWith("--", StringComparison.Ordinal);
      if (IsIconic(window) && !passive) { ShowWindow(window, 9); Thread.Sleep(250); }
      root = AutomationElement.FromHandle(window);
      if (args.Length == 1 && args[0] == "--submit-staged-image") {
        if (!VoiceActive() || NamedAction("Remove image.png") == null) throw new Exception("No staged Voice image is available. Nothing was submitted.");
        var stagedEditor = root.FindFirst(TreeScope.Descendants, new AndCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit), new PropertyCondition(AutomationElement.NameProperty, "Work with ChatGPT")));
        string stagedText = stagedEditor == null ? "" : Text(stagedEditor).Trim();
        if (stagedText.Length > 0 && stagedText != "Work with ChatGPT") throw new Exception("A text draft is present. Nothing was submitted.");
        Invoke(NamedAction("Send")); var stagedDeadline = DateTime.UtcNow.AddSeconds(15);
        while (AttachmentPresent(null) && DateTime.UtcNow < stagedDeadline) Thread.Sleep(150);
        if (AttachmentPresent(null)) throw new Exception("Staged image send is uncertain. No resend was attempted.");
        Console.WriteLine(Json.Serialize(new { attachmentSubmitted = true, voiceActive = VoiceActive() })); return 0;
      }
      if (args.Length == 1 && args[0] == "--probe-attachment-menu") {
        Invoke(NamedAction("Add files and more")); Thread.Sleep(750);
        Console.WriteLine(Json.Serialize(Nodes().Where(e => Regex.IsMatch(e.Cached.Name ?? "", "photo|image|upload|file|computer|clipboard", RegexOptions.IgnoreCase))
          .Select(e => new { name = e.Cached.Name, type = e.Cached.ControlType.ProgrammaticName, patterns = e.GetSupportedPatterns().Select(p => p.ProgrammaticName).ToArray() }).ToArray())); return 0;
      }
      if (args.Length == 1 && args[0] == "--voice-snapshot") {
        string current = ConversationText(); int lastUser = current.LastIndexOf("You said:", StringComparison.Ordinal);
        var userTurns = current.Split(new[] { "You said:" }, StringSplitOptions.None).Skip(1).Select(turn => turn.Split(new[] { "ChatGPT said:" }, StringSplitOptions.None)[0].Trim()).ToArray();
        Console.WriteLine(Json.Serialize(new { active = VoiceActive(), latestTurn = lastUser >= 0 ? current.Substring(lastUser) : "", userTurns = userTurns })); return 0;
      }
      if (args.Length == 1 && (args[0] == "--start-fresh-voice" || args[0] == "--start-voice" || args[0] == "--stop-voice" || args[0] == "--mute-speakers" || args[0] == "--enable-microphone")) {
        string command = args[0];
        if (command == "--start-fresh-voice") {
          if (VoiceActive() || AttachmentPresent(null)) throw new Exception("Stop Voice and resolve the current attachment before starting a fresh test chat.");
          var drafts = root.FindAll(TreeScope.Descendants, new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit)).Cast<AutomationElement>()
            .Where(e => e.Current.Name == "Ask ChatGPT" || e.Current.Name == "Work with ChatGPT").ToArray();
          if (drafts.Any(e => { string candidateDraft = Text(e).Trim(); return candidateDraft.Length > 0 && candidateDraft != "Ask ChatGPT" && candidateDraft != "Work with ChatGPT"; })) throw new Exception("A draft is present. No chat navigation was performed.");
          Invoke(NamedAction("New chat")); Thread.Sleep(750); command = "--start-voice";
        }
        if (command == "--start-voice" && !VoiceActive()) {
          var start = NamedAction("Start voice chat", "Start new voice chat");
          if (start == null) {
            var composer = root.FindFirst(TreeScope.Descendants, new AndCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit), new PropertyCondition(AutomationElement.NameProperty, "Ask ChatGPT")));
            string existing = composer == null ? "" : Text(composer).Trim();
            if (existing.Length > 0 && existing != "Ask ChatGPT") throw new Exception("A draft is present. Voice startup did not navigate away.");
            Invoke(NamedAction("New chat"));
            var startDeadline = DateTime.UtcNow.AddSeconds(10);
            while (start == null && DateTime.UtcNow < startDeadline) { Thread.Sleep(200); start = NamedAction("Start voice chat", "Start new voice chat"); }
          }
          if (start == null) throw new Exception("Voice start is not exposed through accessibility. No coordinate fallback was used.");
          Invoke(start);
        }
        if (command == "--stop-voice" && VoiceActive()) Invoke(NamedAction("Stop voice chat"));
        if (command == "--mute-speakers" && NamedAction("Mute speakers") != null) Invoke(NamedAction("Mute speakers"));
        if (command == "--enable-microphone" && NamedAction("Unmute microphone") != null) Invoke(NamedAction("Unmute microphone"));
        var controlDeadline = DateTime.UtcNow.AddSeconds(20);
        while (DateTime.UtcNow < controlDeadline) {
          bool verified = command == "--start-voice" ? VoiceActive() : command == "--stop-voice" ? !VoiceActive() : command == "--enable-microphone" ? NamedAction("Mute microphone") != null : NamedAction("Unmute speakers") != null;
          if (verified) { Console.WriteLine(Json.Serialize(new { active = VoiceActive(), verified = true })); return 0; }
          Thread.Sleep(150);
        }
        throw new Exception("Voice control outcome could not be verified. No retry was attempted.");
      }
      if (args.Length == 1 && args[0] == "--background-voice-window") {
        // Keep accessibility live while removing the companion from the foreground.
        ShowWindow(window, 4);
        if (!SetWindowPos(window, new IntPtr(1), 0, 0, 0, 0, 0x13)) throw new Exception("ChatGPT could not be moved behind other windows.");
        Console.WriteLine(Json.Serialize(new { background = true })); return 0;
      }
      if (args.Length == 1 && args[0] == "--voice-status") {
        // Query only controls we need; caching the entire live tree races streaming updates.
        Func<string, bool> hasButton = name => root.FindFirst(TreeScope.Descendants,
          new AndCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button),
            new PropertyCondition(AutomationElement.NameProperty, name))) != null;
        Console.WriteLine(Json.Serialize(new { active = VoiceActive(), microphoneEnabled = hasButton("Mute microphone"), speakersMuted = hasButton("Unmute speakers"), minimized = IsIconic(window), visible = IsWindowVisible(window) })); return 0;
      }
      if (args.Length == 1 && args[0] == "--probe-controls") {
        Console.WriteLine(Json.Serialize(Nodes().Where(e => e.Cached.ControlType == ControlType.Edit || e.Cached.ControlType == ControlType.Button || e.Cached.ControlType == ControlType.MenuItem).Select(e => new { name = e.Cached.Name, type = e.Cached.ControlType.ProgrammaticName, patterns = e.GetSupportedPatterns().Select(p => p.ProgrammaticName).ToArray() }).ToArray())); return 0;
      }
      if (args.Length == 1 && args[0] == "--watch-voice") return WatchVoice();
      var request = args.Length == 2 ? Json.Deserialize<Dictionary<string, string>>(File.ReadAllText(args[0])) : null;
      bool voiceContext = request != null && request.ContainsKey("mode") && request["mode"] == "voice-context";
      if (voiceContext && (!VoiceActive() || !request.ContainsKey("imagePath"))) throw new Exception("An active Voice chat and screenshot are required. Nothing was submitted.");
      if (voiceContext) {
        // Voice collapses its composer while another app is in front. Capture has
        // already finished: restore the same window before finding its editor.
        attachmentWindow = window;
        ShowWindow(window, 9); SetForegroundWindow(window);
        Thread.Sleep(500); root = AutomationElement.FromHandle(window);
        try { root.SetFocus(); } catch (InvalidOperationException) { }
      }
      var nodes = new AutomationElement[0];
      var workComposer = root.FindFirst(TreeScope.Descendants, new AndCondition(
        new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit),
        new PropertyCondition(AutomationElement.NameProperty, "Work with ChatGPT")));
      if (workComposer != null && !voiceContext) throw new Exception("The selected window is a Work/Codex conversation. Open the regular ChatGPT conversation before submitting a question or screenshot. Nothing was changed or sent.");
      var editors = root.FindAll(TreeScope.Descendants, new AndCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit),
        voiceContext ? new OrCondition(new PropertyCondition(AutomationElement.NameProperty, "Ask ChatGPT"), new PropertyCondition(AutomationElement.NameProperty, "Work with ChatGPT")) : (Condition)new PropertyCondition(AutomationElement.NameProperty, "Ask ChatGPT"))).Cast<AutomationElement>().ToArray();
      if (voiceContext && editors.Length != 1) {
        var editorDeadline = DateTime.UtcNow.AddSeconds(10);
        while (editors.Length != 1 && DateTime.UtcNow < editorDeadline) {
          Thread.Sleep(200); root = AutomationElement.FromHandle(window);
          editors = root.FindAll(TreeScope.Descendants, new AndCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit),
            new OrCondition(new PropertyCondition(AutomationElement.NameProperty, "Ask ChatGPT"), new PropertyCondition(AutomationElement.NameProperty, "Work with ChatGPT")))).Cast<AutomationElement>().ToArray();
        }
      }
      if (voiceContext && editors.Length != 1) throw new Exception("The active Voice composer is unavailable or ambiguous (" + editors.Length + "). Nothing was submitted.");
      if (editors.Length != 1) throw new Exception("Open the regular ChatGPT chat with an empty composer and Instant selected.");
      if (args.Length == 1 && args[0] == "--inspect") {
        nodes = Nodes();
        object editorValue;
        bool available = editors[0].TryGetCurrentPattern(ValuePattern.Pattern, out editorValue);
        Console.WriteLine(Json.Serialize(new { editorValueAvailable = available, editorText = Text(editors[0]), editorValue = available ? ((ValuePattern)editorValue).Current.Value : "" }));
        foreach (var document in nodes.Where(e => e.Cached.ControlType == ControlType.Document)) {
          string text = Text(document);
          Console.WriteLine(Json.Serialize(new { name = document.Current.Name, length = text.Length, tail = text.Substring(Math.Max(0, text.Length - 1800)) }));
        }
        return 0;
      }
      if (args.Length != 2) throw new Exception("Request and response paths required.");
      string prompt = request["prompt"];
      if (String.IsNullOrWhiteSpace(prompt) || prompt.Length > 24000) throw new Exception("Invalid prompt.");
      var editor = editors[0];
      string draft = null; var draftReadDeadline = DateTime.UtcNow.AddSeconds(5);
      while (draft == null && DateTime.UtcNow < draftReadDeadline) {
        try { draft = Text(editor).Trim(); }
        catch (ElementNotAvailableException) { }
        catch (COMException) { }
        if (draft == null) {
          Thread.Sleep(150);
          var freshEditor = root.FindFirst(TreeScope.Descendants, new AndCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Edit),
            voiceContext ? new OrCondition(new PropertyCondition(AutomationElement.NameProperty, "Ask ChatGPT"), new PropertyCondition(AutomationElement.NameProperty, "Work with ChatGPT")) : (Condition)new PropertyCondition(AutomationElement.NameProperty, "Ask ChatGPT")));
          if (freshEditor != null) editor = freshEditor;
        }
      }
      if (draft == null) throw new Exception("The composer changed while reading its draft. Nothing was submitted.");
      // A verified screen-request draft left by our failed upload may be replaced.
      // Never replace user-written drafts or requests from another workflow.
      string referencePattern = @"\s+Capture reference: [0-9a-fA-F-]{36}$";
      bool ownScreenDraft = request.ContainsKey("imagePath") && Regex.IsMatch(draft, referencePattern) && Regex.IsMatch(prompt, referencePattern) &&
        Canonical(Regex.Replace(draft, referencePattern, "")) == Canonical(Regex.Replace(prompt, referencePattern, ""));
      if (draft.Length > 0 && draft != "Ask ChatGPT" && draft != "Work with ChatGPT" && draft != prompt && !ownScreenDraft) throw new Exception("ChatGPT contains a different unsent draft. It was not replaced.");
      object valuePattern;
      if (!voiceContext) {
        if (!editor.TryGetCurrentPattern(ValuePattern.Pattern, out valuePattern)) throw new Exception("ChatGPT does not expose a writable editor. Nothing was sent.");
        if (draft != prompt) ((ValuePattern)valuePattern).SetValue(prompt);
        var verifyUntil = DateTime.UtcNow.AddSeconds(3);
        while (Canonical(((ValuePattern)valuePattern).Current.Value) != Canonical(prompt) && DateTime.UtcNow < verifyUntil) Thread.Sleep(100);
        if (Canonical(((ValuePattern)valuePattern).Current.Value) != Canonical(prompt)) throw new Exception("Prompt not verified in ChatGPT; it was not submitted.");
      } else if (ownScreenDraft || Canonical(draft) == Canonical(prompt)) {
        // Only our verified capture draft may be cleared. Voice receives the image
        // itself; the actual question must arrive through spoken input.
        if (!editor.TryGetCurrentPattern(ValuePattern.Pattern, out valuePattern)) throw new Exception("The previous capture draft cannot be cleared safely. Nothing was sent.");
        ((ValuePattern)valuePattern).SetValue("");
      }
      int previousImages = root.FindAll(TreeScope.Descendants, new PropertyCondition(AutomationElement.NameProperty, "User attachment")).Count;
      string imagePath;
      if (request.TryGetValue("imagePath", out imagePath) && !String.IsNullOrEmpty(imagePath)) {
        attachmentWindow = window;
        AttachImage(imagePath, window);
      }
      AutomationElement send = null;
      var sendDeadline = DateTime.UtcNow.AddSeconds(3);
      while (send == null && DateTime.UtcNow < sendDeadline) {
        send = root.FindFirst(TreeScope.Descendants, new AndCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button), new PropertyCondition(AutomationElement.NameProperty, "Send"), new PropertyCondition(AutomationElement.IsEnabledProperty, true)));
        if (send == null) Thread.Sleep(100);
      }
      object invokePattern;
      if (send == null || !send.TryGetCurrentPattern(InvokePattern.Pattern, out invokePattern)) throw new Exception("ChatGPT Send control is unavailable. The draft was not submitted.");
      ((InvokePattern)invokePattern).Invoke();
      restoreAttachmentFocus();
      File.WriteAllText(args[1] + ".timing", Json.Serialize(new { submittedMs = elapsed.ElapsedMilliseconds }), new UTF8Encoding(false));
      if (voiceContext) {
        var imageDeadline = DateTime.UtcNow.AddSeconds(20);
        while (DateTime.UtcNow < imageDeadline) {
          int images = root.FindAll(TreeScope.Descendants, new PropertyCondition(AutomationElement.NameProperty, "User attachment")).Count;
          if (images > previousImages && !AttachmentPresent(null) && VoiceActive()) {
            File.WriteAllText(args[1], Json.Serialize(new { id = request["id"], attachmentSubmitted = true, voiceActive = true }), new UTF8Encoding(false)); return 0;
          }
          Thread.Sleep(150);
        }
        throw new Exception("Screenshot submission or continued Voice connection could not be verified. Inspect ChatGPT; no resend was attempted.");
      }
      var documents = root.FindAll(TreeScope.Descendants, new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Document)).Cast<AutomationElement>().ToArray();
      var stopCondition = new AndCondition(new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Button), new OrCondition(new PropertyCondition(AutomationElement.NameProperty, "Stop generating"), new PropertyCondition(AutomationElement.NameProperty, "Stop streaming"), new PropertyCondition(AutomationElement.NameProperty, "Stop response")));
      var deadline = DateTime.UtcNow.AddSeconds(90);
      string last = "", lastPartial = ""; long lastChange = elapsed.ElapsedMilliseconds;
      while (DateTime.UtcNow < deadline) {
        Thread.Sleep(100);
        try {
        string text = String.Join("\n", documents.Select(Text)).Replace("\uFFFC", "");
        long observedAtMs = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds;
        int marker = text.LastIndexOf("ChatGPT said:", StringComparison.Ordinal);
        int userPosition = text.LastIndexOf(prompt, StringComparison.Ordinal);
        if (userPosition >= 0 && text.LastIndexOf("You said:", StringComparison.Ordinal) > userPosition)
          throw new Exception("The ChatGPT conversation changed during this request. No unrelated reply was imported.");
        string answer = marker >= 0 ? text.Substring(marker + "ChatGPT said:".Length).Split(new[] { "Ask ChatGPT" }, StringSplitOptions.None)[0].Trim() : "";
        foreach (string end in new[] { "\nShare\nRead aloud", "\nChatGPT can make mistakes", "\nLatest response" }) {
          int boundary = answer.IndexOf(end, StringComparison.Ordinal); if (boundary >= 0) answer = answer.Substring(0, boundary).Trim();
        }
        answer = Regex.Replace(answer.Replace("\uFFFC", ""), @"(?m)^Enable word wrap\r?\nCopy code\r?\n", "").Trim();
        if (userPosition >= 0 && marker > userPosition && answer.Length > 0 && answer != lastPartial) {
          lastPartial = answer;
          Console.WriteLine(Json.Serialize(new { id = request["id"], answer = answer, observedMs = elapsed.ElapsedMilliseconds, observedAtMs = observedAtMs }));
          Console.Out.Flush();
        }
        bool busy = root.FindFirst(TreeScope.Descendants, stopCondition) != null;
        if (answer != last || busy) { lastChange = elapsed.ElapsedMilliseconds; last = answer; }
        if (userPosition >= 0 && marker > userPosition && answer.Length > 0 && !busy) {
          if (elapsed.ElapsedMilliseconds - lastChange >= 2000) { File.WriteAllText(args[1], Json.Serialize(new { id = request["id"], answer = answer }), new UTF8Encoding(false)); return 0; }
        }
        } catch (ElementNotAvailableException) { documents = root.FindAll(TreeScope.Descendants, new PropertyCondition(AutomationElement.ControlTypeProperty, ControlType.Document)).Cast<AutomationElement>().ToArray(); }
          catch (InvalidOperationException) { /* Retry fresh tree while a document is replaced. */ }
          catch (COMException) { /* UI Automation may briefly disconnect during navigation. */ }
      }
      throw new Exception("ChatGPT reply was not readable in time. Check the chat; no automatic resubmission was attempted.");
    } catch (Exception error) { Console.Error.WriteLine(error.ToString()); return 1; }
      finally { restoreAttachmentFocus(); }
  }
}

