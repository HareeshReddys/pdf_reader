const assert = require('node:assert/strict');
const { app, BrowserWindow } = require('electron');
app.whenReady().then(async () => {
  let window;
  try {
    const { enableWindowsProtection } = require('../dist/platform/captureProtection/windows');
    const { enableMacosProtection } = require('../dist/platform/captureProtection/macos');
    for (const enable of [enableWindowsProtection, enableMacosProtection]) {
      let requested = false;
      const result = await enable({ setContentProtection(value) { requested = value; } });
      assert.equal(requested, true); assert.equal(result.supported, true); assert.equal(result.active, false);
    }
    if (process.platform === 'darwin' || process.platform === 'win32') {
      const { enableCaptureProtection } = require('../dist/platform/captureProtection');
      window = new BrowserWindow({ show: false });
      const result = await enableCaptureProtection(window);
      await window.loadURL('data:text/html,<body>Capture protection lifecycle test</body>');
      window.show();
      await new Promise(resolve => setTimeout(resolve, 200));
      assert.equal(window.isContentProtected(), true, 'The real native window must have content protection enabled');
      assert.equal(result.active, false, 'Native flag does not prove remote capture exclusion');
      window.show(); window.hide(); window.show();
      assert.equal(window.isContentProtected(), true, 'Protection must survive hide/restore');
    }
    if (process.platform === 'linux') {
      const { enableCaptureProtection, getCaptureProtectionStatus } = require('../dist/platform/captureProtection');
      const { detectCaptureCapabilities } = require('../dist/platform/captureProtection/linux/environment');
      window = new BrowserWindow({ show: false, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } });
      window.setContentProtection = () => { throw new Error('Linux must not call native protection'); };
      const result = await enableCaptureProtection(window);
      assert.equal(result.supported, false); assert.equal(result.active, false); assert.equal(result.strategy, 'unsupported');
      assert.deepEqual(getCaptureProtectionStatus(), result);
      const capabilities = await detectCaptureCapabilities();
      assert.equal(capabilities.nativeWindowExclusion, false); assert.equal(typeof capabilities.sourceTypes.monitor, 'boolean');
    }
    console.log('PASS: Linux never invokes native protection, capabilities are explicit, Windows/macOS request native support without claiming unverified protection.');
    window?.destroy(); app.quit();
  } catch (error) { console.error(error); window?.destroy(); app.exit(1); }
});
