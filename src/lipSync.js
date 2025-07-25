// lipSync.js

/**
 * VRMアバターに対して、音声に連動したリップシンクを実行する
 * @param {AudioBuffer} audioBuffer - 再生する音声バッファ
 * @param {VRM} vrm - 表情を制御する対象のVRMアバター
 */
export function startLipSync(audioBuffer, vrm) {
  const audioContext = new AudioContext();
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  const gainNode = audioContext.createGain();
  source.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(audioContext.destination);

  source.start();

  function animateLipSync() {
    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length / 256;

    if (vrm && vrm.expressionManager) {
      vrm.expressionManager.setValue('aa', volume); // 単純な開口のみ
    }

    if (audioContext.currentTime < source.buffer.duration) {
      requestAnimationFrame(animateLipSync);
    } else {
      if (vrm && vrm.expressionManager) {
        vrm.expressionManager.setValue('aa', 0); // 閉口
      }
    }
  }

  animateLipSync();
}
