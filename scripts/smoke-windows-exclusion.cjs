const assert = require('node:assert/strict');
const { app, BrowserWindow, desktopCapturer, screen } = require('electron');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
app.whenReady().then(async () => {
  let background, marker;
  try {
    assert.equal(process.platform, 'win32');
    const display = screen.getPrimaryDisplay();
    const area = display.workArea;
    const common = { show: false, frame: false, resizable: false, webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false } };
    background = new BrowserWindow({ ...common, x: area.x + 40, y: area.y + 40, width: 600, height: 400 });
    await background.loadURL('data:text/html,<body style="margin:0;background:rgb(15,180,70)">Capture exclusion test background</body>');
    background.show();
    const actualOverlay = process.argv.includes('--overlay');
    if (actualOverlay) {
      require('../dist/main/ipc').registerIpcHandlers();
      marker = require('../dist/main/services/overlayService').createOverlayWindow();
      await new Promise(resolve => marker.webContents.once('did-finish-load', resolve));
      marker.setBounds({ x: area.x + 140, y: area.y + 140, width: 420, height: 360 });
      marker.setContentProtection(false); // Positive control: same real overlay without exclusion.
    } else {
      marker = new BrowserWindow({ ...common, frame: true, x: area.x + 140, y: area.y + 140, width: 300, height: 200, alwaysOnTop: true });
    }
    await marker.loadURL('data:text/html,<body style="margin:0;background:rgb(230,20,170)">CAPTURE TEST MARKER</body>');
    marker.show();
    async function measure(label) {
      await wait(700);
      const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: display.size.width, height: display.size.height } });
      const source = sources.find(value => value.display_id === String(display.id));
      assert.ok(source, 'Primary display capture must exist');
      const image = source.thumbnail;
      const size = image.getSize();
      const bounds = marker.getBounds();
      const x = Math.round((bounds.x - display.bounds.x + bounds.width / 2) / display.bounds.width * size.width);
      const y = Math.round((bounds.y - display.bounds.y + bounds.height / 2) / display.bounds.height * size.height);
      const pixel = [...image.crop({ x, y, width: 1, height: 1 }).toBitmap()];
      const result = { label, nativeFlag: marker.isContentProtected(), pixelBGRA: pixel };
      console.log(JSON.stringify(result));
      return pixel;
    }
    marker.hide(); background.show(); background.focus();
    const baseline = await measure('background-control');
    assert.ok(baseline[1] > 140 && baseline[2] < 70 && baseline[0] < 110, 'Background must be visible before measuring exclusion');
    marker.show();
    const before = await measure('unprotected-control');
    assert.ok(before[2] > 200 && before[1] < 60 && before[0] > 130, 'Positive control must capture marker');
    marker.hide();
    await require('../dist/platform/captureProtection').enableCaptureProtection(marker);
    marker.show();
    const after = await measure('protected');
    assert.ok(after[1] > 140 && after[2] < 70 && after[0] < 110, 'Protected marker must reveal the green background, not appear or become a black rectangle');
    marker.hide(); marker.show();
    const restored = await measure('protected-after-restore');
    assert.ok(restored[1] > 140 && restored[2] < 70 && restored[0] < 110, 'Exclusion must survive restoring');
    console.log(`PASS: full-display Chromium capture excludes protected ${actualOverlay ? 'actual app overlay' : 'test window'} while its unprotected control is visible. Meeting-app receiver verification remains separate.`);
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { marker?.destroy(); background?.destroy(); app.exit(process.exitCode || 0); }
});
