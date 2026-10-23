const assert = require('node:assert/strict');
const Module = require('node:module');
const events = [];
let held = false, resumed = 0, advanced = 0, polled = 0, failRead = false;
const sessions = ['Newest', 'Middle', 'Oldest'].map((question, index) => ({
  id: String(index), question, answer: `${question} answer`, snippets: [],
  createdAt: new Date(3000 - index * 1000).toISOString(),
}));
let state = { answerQuestion: 'Newest', answer: 'Newest answer' };
const mocks = {
  electron: { BrowserWindow: { getAllWindows: () => [{ webContents: {
    isDestroyed: () => false, send: (channel, session) => events.push({ channel, session }),
  } }] } },
  './assistTurnService': {
    setAssistAnswerHold: value => { held = value; },
    listenForNextQuestion: () => { held = false; resumed++; },
  },
  './overlayService': {
    getOverlayState: () => state,
    updateOverlaySuggestion: answer => { state = { answerQuestion: answer.question, answer: answer.answer }; },
  },
  './sessionService': { listSessions: async () => { if (failRead) throw new Error('Read failed'); return sessions; } },
  './screenMonitorService': {
    advanceScreenQuestion: () => advanced++, getScreenMonitorState: () => ({ active: true }),
    pollScreenMonitor: async () => { polled++; },
  },
};
const originalLoad = Module._load;
Module._load = function(request, ...args) { return mocks[request] ?? originalLoad.call(this, request, ...args); };
const navigation = require('../dist/main/services/questionNavigationService');
Module._load = originalLoad;
(async () => {
  await Promise.all([navigation.previousQuestion(), navigation.previousQuestion()]);
  assert.equal(state.answerQuestion, 'Oldest', 'Rapid backward presses must run in order');
  assert.equal(held, true, 'Review must hold the saved answer');
  assert.equal(events.at(-1).session.id, '2', 'Renderer must receive the saved session and sources');
  await navigation.previousQuestion();
  assert.equal(state.answerQuestion, 'Oldest', 'Oldest boundary must keep its answer');
  await navigation.nextQuestion();
  assert.equal(state.answerQuestion, 'Middle');
  await navigation.nextQuestion();
  assert.equal(state.answerQuestion, 'Newest');
  assert.equal(resumed, 0, 'Moving through saved questions must not resume listening');
  await navigation.nextQuestion();
  assert.equal(state.answer, 'Newest answer');
  assert.equal(held, false);
  assert.equal(resumed, 1); assert.equal(advanced, 1); assert.equal(polled, 1);
  failRead = true;
  await assert.rejects(navigation.previousQuestion(), /Read failed/);
  failRead = false;
  await navigation.previousQuestion();
  assert.equal(state.answerQuestion, 'Middle', 'Navigation must recover after a read failure');
  sessions.length = 0;
  await navigation.previousQuestion();
  assert.equal(state.answerQuestion, 'Middle', 'Empty history must keep the current answer');
  await navigation.nextQuestion();
  assert.equal(resumed, 2, 'Empty history must still allow resuming');
  console.log('PASS: previous/next order, rapid presses, boundaries, source event, held review, resume, empty history and read recovery.');
})().catch(error => { console.error(error); process.exitCode = 1; });
