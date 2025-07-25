// speak.js

import { startLipSync } from './lipSync.js';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID; // .envで設定

/**
 * テキストを読み上げ、VRMとリップシンクを連動させる
 * @param {string} text - 読み上げるテキスト
 * @param {VRM} vrm - リップシンク対象のVRMアバター
 */
export async function speak(text, vrm) {
  const audioContext = new AudioContext();

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2', // ← ここ
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
  source.connect(audioContext.destination);
  source.start();

  // VRMの口パク開始
  startLipSync(audioBuffer, vrm);
}
