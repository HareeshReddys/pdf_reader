const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { app, desktopCapturer, nativeImage, screen, systemPreferences } = require('electron');
app.whenReady().then(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'copilot-real-capture-'));
  process.env.INTERVIEW_COPILOT_DATA_DIR = directory;
  try {
    if (process.platform === 'darwin') console.log('macOS screen-recording permission:', systemPreferences.getMediaAccessStatus('screen'));
    const { primaryScreenSource, captureScreenAndExtractText } = require('../dist/main/services/screenCaptureService');
    const source = await primaryScreenSource();
    assert.equal(source.kind, 'screen');
    assert.ok(source.id.startsWith('screen:'));
    if (process.platform === 'darwin') assert.equal(source.id, 'screen:primary');
    else {
      const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 320, height: 180 } });
      const primary = sources.find(item => item.display_id === String(screen.getPrimaryDisplay().id));
      if (primary) assert.equal(source.id, primary.id);
    }
    for (let index = 0; index < 20; index++) {
      const capture = await captureScreenAndExtractText(source.id, false);
      assert.ok(capture.imageDataUrl.startsWith('data:image/png;base64,'));
      const size = nativeImage.createFromDataURL(capture.imageDataUrl).getSize();
      assert.ok(size.width <= 2560 && size.height <= 1440, 'Capture size must be bounded');
    }
    assert.deepEqual(await fs.readdir(path.join(directory, 'temp', 'screenshots')).catch(() => []), []);
    console.log('PASS: 20 real sequential primary-display captures; temporary files cleaned up; no image sent to AI.');
  } catch (error) { console.error(error); process.exitCode = 1; }
  finally { await fs.rm(directory, { recursive: true, force: true }); app.exit(process.exitCode || 0); }
});
