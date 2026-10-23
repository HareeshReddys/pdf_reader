const assert = require('node:assert/strict');
const path = require('node:path');
const base = path.resolve(__dirname, '../dist/main/services');
function stub(name, exports) { require.cache[require.resolve(path.join(base, name))] = { exports }; }
let image = '', sent = 0, partial = '', result, errors = [], paused = false, release, voiceActive = false, voiceUploads = 0;
stub('screenCaptureService', { primaryScreenSource: async () => ({ id: 'screen:1' }), captureScreenAndExtractText: async (_source, ocr) => { assert.equal(ocr, false); return { imageDataUrl: image }; } });
stub('chatgptDesktopService', { isChatGptDesktopEnabled: () => true, getChatGptVoiceStatus: async () => ({active:voiceActive}), attachScreenshotToVoiceChat: async screenshot => { assert.equal(screenshot,image); voiceUploads++; return 'Screenshot sent'; }, askChatGptDesktop: async (prompt, valid, update, screenshot) => {
  sent++; assert.equal(screenshot, image); assert.match(prompt, /attached screenshot/); assert.ok(paused); update('First text');
  await new Promise(resolve => { release = resolve; }); return 'Complete answer';
} });
stub('voiceMirrorService', { suspendVoiceMirrorUpdates: value => { paused = value; }, startVoiceMirror: async () => {} });
stub('overlayService', { getOverlayState: () => ({voiceMirrorActive:true}), beginOverlayWork: () => 1, updateOverlayActivity: (state, message) => { if (state === 'error') errors.push(message); }, updateOverlayPartial: value => { partial = value; }, updateOverlaySuggestion: value => { result = value; } });
const { askChatGptAboutScreen } = require(path.join(base, 'screenChatService'));
(async () => {
  await askChatGptAboutScreen(); assert.equal(sent, 0); assert.match(errors[0], /no image/); assert.equal(paused, false);
  image = 'data:image/png;base64,iVBORw0KGgo=';
  const request = askChatGptAboutScreen();
  while (!release) await new Promise(resolve => setImmediate(resolve));
  await askChatGptAboutScreen(); assert.equal(sent, 1); assert.equal(partial, 'First text');
  release(); await request; assert.equal(result.answer, 'Complete answer'); assert.equal(paused, false);
  voiceActive = true;
  await askChatGptAboutScreen();
  assert.equal(voiceUploads, 1, 'Active Voice receives image context');
  assert.equal(sent, 1, 'Voice context must not invoke the regular text-answer path');
  assert.equal(paused, false, 'Spoken turns resume after attachment');
  console.log('PASS: empty captures are not sent; screenshots bypass OCR and reach the attachment argument; duplicate shortcut presses are ignored; replies stream; Voice updates resume.');
})().catch(error => { console.error(error); process.exitCode = 1; });

