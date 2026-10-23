import { randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { BrowserWindow, desktopCapturer, nativeImage, screen, type DesktopCapturerSource } from 'electron';
import { createWorker, type Worker } from 'tesseract.js';
import { getDataDirectory } from './paths';

export type ScreenCaptureSource = {
  id: string;
  name: string;
  kind: 'screen' | 'window';
  thumbnailDataUrl: string;
};

export type ScreenOcrResult = {
  sourceId: string;
  sourceName: string;
  imageDataUrl: string;
  extractedText: string;
};

const PREVIEW_SIZE = { width: 320, height: 180 };
const CAPTURE_SIZE = { width: 2560, height: 1440 };

let lastCapture: ScreenOcrResult | undefined;
let workerPromise: Promise<Worker> | undefined;
let recognitionQueue: Promise<void> = Promise.resolve();
let capturePending = false;
let questionOcrPending: Promise<string> | undefined;
const execute = promisify(execFile);

function getWorker(): Promise<Worker> {
  const cachePath = path.join(getDataDirectory(), 'cache', 'ocr');
  workerPromise ??= mkdir(cachePath, { recursive: true }).then(() => createWorker('eng', undefined, { cachePath })).catch((error: unknown) => {
    workerPromise = undefined;
    throw error;
  });
  return workerPromise;
}

function sourceKind(source: DesktopCapturerSource): 'screen' | 'window' {
  return source.id.startsWith('screen:') ? 'screen' : 'window';
}

function readableCaptureError(error: unknown): Error {
  const detail = error instanceof Error ? error.message : String(error);
  if (/denied|permission|not allowed|not authorized/i.test(detail)) {
    return new Error('Screen capture permission was denied. Allow screen recording for this app and try again.');
  }
  return new Error(`Screen capture failed: ${detail}`);
}

async function getSources(thumbnailSize: { width: number; height: number }, types: Array<'screen' | 'window'> = ['screen', 'window']): Promise<DesktopCapturerSource[]> {
  try {
    return await desktopCapturer.getSources({
      types,
      thumbnailSize,
      fetchWindowIcons: false,
    });
  } catch (error) {
    throw readableCaptureError(error);
  }
}

export async function listScreenCaptureSources(includePreviews = true): Promise<ScreenCaptureSource[]> {
  const sources = await getSources(includePreviews ? PREVIEW_SIZE : { width: 0, height: 0 });
  const ownWindows = new Set(BrowserWindow.getAllWindows().map((window) => window.getMediaSourceId()));
  return sources.filter((source) => !ownWindows.has(source.id)).map((source) => ({
    id: source.id,
    name: source.name,
    kind: sourceKind(source),
    thumbnailDataUrl: source.thumbnail.isEmpty() ? '' : source.thumbnail.toDataURL(),
  }));
}

export async function primaryScreenSource(): Promise<ScreenCaptureSource> {
  if (process.platform === 'darwin') {
    return { id: 'screen:primary', name: 'Entire primary display', kind: 'screen', thumbnailDataUrl: '' };
  }
  let sources: DesktopCapturerSource[];
  try {
    sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: PREVIEW_SIZE });
  } catch {
    throw new Error('Whole-screen capture failed. On macOS, allow Screen & System Audio Recording for this app in Privacy & Security and restart. On Windows, check that a desktop display is available.');
  }
  const primaryId = String(screen.getPrimaryDisplay().id);
  const source = sources.find(source => source.display_id === primaryId) ?? sources[0];
  if (!source || source.thumbnail.isEmpty()) {
    throw new Error('Whole-screen access is unavailable. Check screen-recording permission and restart the app.');
  }
  return { id: source.id, name: source.name, kind: 'screen', thumbnailDataUrl: source.thumbnail.toDataURL() };
}

async function recognizeScreenshot(filePath: string): Promise<string> {
  let extractedText = '';
  let ocrError: unknown;

  const runRecognition = async () => {
    try {
      const worker = await getWorker();
      const result = await worker.recognize(filePath);
      extractedText = result.data.text.replace(/\r\n/g, '\n').trim();
    } catch (error) {
      ocrError = error;
    }
  };

  recognitionQueue = recognitionQueue.then(runRecognition, runRecognition);
  await recognitionQueue;

  if (ocrError) {
    const detail = ocrError instanceof Error ? ocrError.message : String(ocrError);
    throw new Error(`OCR failed: ${detail}`);
  }
  // Vision can interpret coding tasks even when OCR returns no text.
  return extractedText;
}

export async function extractScreenText(imageDataUrl: string): Promise<string> {
  if (!imageDataUrl.startsWith('data:image/png;base64,') || imageDataUrl.length > 40 * 1024 * 1024) throw new Error('Invalid screenshot for local question detection.');
  if (questionOcrPending) throw new Error('Local question detection is still running.');
  const operation = recognizeScreenshot(imageDataUrl);
  questionOcrPending = operation;
  void operation.finally(() => { if (questionOcrPending === operation) questionOcrPending = undefined; }).catch(() => undefined);
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([operation, new Promise<never>((_resolve, reject) => {
      timeout = setTimeout(() => reject(new Error('Local question detection timed out; keeping the current answer.')), 20000);
    })]);
  } finally { clearTimeout(timeout); }
}

async function capture(sourceId: string, useOcr: boolean): Promise<ScreenOcrResult> {
  const normalizedSourceId = sourceId.trim();
  if (!normalizedSourceId) throw new Error('Choose a screen or window before capturing.');

  if (process.platform === 'darwin' && normalizedSourceId === 'screen:primary') {
    // Keep repeated native capture outside Electron's browser process. -D 1
    // follows the main display across Spaces without enumerating every window.
    const directory = path.join(getDataDirectory(), 'temp', 'screenshots');
    await mkdir(directory, { recursive: true });
    const filePath = path.join(directory, `${randomUUID()}.png`);
    try {
      await execute('/usr/sbin/screencapture', ['-x', '-D', '1', '-t', 'png', filePath], { timeout: 8000, maxBuffer: 4096 });
      let image = nativeImage.createFromPath(filePath);
      if (image.isEmpty()) throw new Error('Screen capture returned an empty image. Check screen-recording permission.');
      const size = image.getSize();
      const scale = Math.min(1, CAPTURE_SIZE.width / size.width, CAPTURE_SIZE.height / size.height);
      if (scale < 1) image = image.resize({ width: Math.round(size.width * scale), height: Math.round(size.height * scale) });
      const imageDataUrl = image.toDataURL();
      if (lastCapture?.sourceId === sourceId && lastCapture.imageDataUrl === imageDataUrl && (!useOcr || lastCapture.extractedText)) return lastCapture;
      const extractedText = useOcr ? await recognizeScreenshot(filePath) : '';
      lastCapture = { sourceId, sourceName: 'Entire primary display', imageDataUrl, extractedText };
      return lastCapture;
    } catch (error) { throw readableCaptureError(error); }
    finally { await rm(filePath, { force: true }).catch(() => undefined); }
  }
  const sources = await getSources(CAPTURE_SIZE, normalizedSourceId.startsWith('screen:') ? ['screen'] : ['window']);
  const selectedSource = sources.find((source) => source.id === normalizedSourceId);
  if (!selectedSource) {
    throw new Error('The selected screen or window is no longer available. Refresh the source list and try again.');
  }
  if (selectedSource.thumbnail.isEmpty()) {
    throw new Error('The selected screen or window did not provide an image. Check screen capture permission and try again.');
  }

  const imageDataUrl = selectedSource.thumbnail.toDataURL();
  if (lastCapture?.sourceId === sourceId && lastCapture.imageDataUrl === imageDataUrl && (!useOcr || lastCapture.extractedText)) return lastCapture;
  // CLI vision consumes the image directly; no duplicate PNG or OCR file needed.
  if (!useOcr) {
    lastCapture = { sourceId: selectedSource.id, sourceName: selectedSource.name, imageDataUrl, extractedText: '' };
    return lastCapture;
  }
  const png = selectedSource.thumbnail.toPNG();
  if (png.length === 0) throw new Error('Screen capture failed: the captured image was empty.');

  const temporaryDirectory = path.join(getDataDirectory(), 'temp', 'screenshots');
  const temporaryPath = path.join(temporaryDirectory, `${randomUUID()}.png`);
  await mkdir(temporaryDirectory, { recursive: true });

  try {
    await writeFile(temporaryPath, png, { flag: 'wx' });
    const extractedText = useOcr ? await recognizeScreenshot(temporaryPath) : '';
    lastCapture = {
      sourceId: selectedSource.id,
      sourceName: selectedSource.name,
      imageDataUrl,
      extractedText,
    };
    return lastCapture;
  } finally {
    await rm(temporaryPath, { force: true }).catch(() => undefined);
  }
}

export async function captureScreenAndExtractText(sourceId: string, useOcr = true): Promise<ScreenOcrResult> {
  if (capturePending) throw new Error('Screen capture is already in progress. Retrying on the next check.');
  capturePending = true;
  try { return await capture(sourceId, useOcr); }
  finally { capturePending = false; }
}

export async function disposeScreenOcrWorker(): Promise<void> {
  const currentWorker = workerPromise;
  workerPromise = undefined;
  if (!currentWorker) return;
  try {
    const worker = await currentWorker;
    await worker.terminate();
  } catch {
    // A worker that failed during startup has nothing left to terminate.
  }
}
