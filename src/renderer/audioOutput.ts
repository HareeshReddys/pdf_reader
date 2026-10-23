/** Request speaker output without ever requesting a microphone. */
export async function openWindowsOutput(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
  stream.getVideoTracks().forEach(track => track.stop());
  if (!stream.getAudioTracks().some(track => track.readyState === 'live')) {
    stream.getTracks().forEach(track => track.stop());
    throw new Error('Windows did not provide speaker audio. Microphone fallback is disabled.');
  }
  return stream;
}
