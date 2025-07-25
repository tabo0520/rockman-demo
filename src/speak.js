import { startLipSync, stopLipSync } from './lipSync.js';

export async function speak(text, vrm) {
  console.log('[speak] VOICEVOX開始');

  const audioContext = new AudioContext();

  // 話者ID（1: 四国めたん、3: ずんだもん）
  const speakerId = 1;

  // ① audio_query 作成
  const queryRes = await fetch(`http://127.0.0.1:50021/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`, {
    method: 'POST',
  });

  if (!queryRes.ok) {
    console.error('[VOICEVOX] audio_query失敗');
    return;
  }

  const query = await queryRes.json();

  // ② 音声合成
  const synthRes = await fetch(`http://127.0.0.1:50021/synthesis?speaker=${speakerId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });

  if (!synthRes.ok) {
    console.error('[VOICEVOX] synthesis失敗');
    return;
  }

  const arrayBuffer = await synthRes.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = 1.0;

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;

  source.connect(analyser);
  analyser.connect(audioContext.destination);

  // 音声再生・リップシンク開始
  source.start();
  startLipSync(analyser, vrm, audioBuffer.duration);

  source.onended = () => {
    stopLipSync();
    console.log('[speak] VOICEVOX再生終了');
  };
}
