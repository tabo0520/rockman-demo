import { startLipSync, stopLipSync } from './lipSync.js';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

const audioContext = new AudioContext();

export async function speak(text, vrm) {
  console.log('[speak] 開始');

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.3,
        similarity_boost: 0.75,
      },
    }),
  });

  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = 0.85;

  const gainNode = audioContext.createGain();
  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;

  source.connect(gainNode);
  gainNode.connect(analyserNode);
  analyserNode.connect(audioContext.destination);

  // 🔁 終了時にリップシンク停止
  source.onended = () => {
    stopLipSync(); // ← これが口閉じなどを行う
    console.log('[speak] 再生終了');
  };

  source.start();
  startLipSync(analyserNode, vrm);

  console.log('[speak] 再生開始 & リップシンク開始');
}
