// lipSync.js

const phonemes = ['aa', 'ih', 'ou', 'ee', 'oh'];

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
    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 256;

    if (vrm && vrm.expressionManager) {
      // ランダムな音素を1つ選択して動かす
      const randomPhoneme = phonemes[Math.floor(Math.random() * phonemes.length)];
      phonemes.forEach(p => {
        const value = (p === randomPhoneme) ? volume : 0;
        vrm.expressionManager.setValue(p, value);
      });
      
      console.log("Setting phoneme:", randomPhoneme, "value:", volume.toFixed(2));

    }

    if (audioContext.currentTime < source.buffer.duration) {
      requestAnimationFrame(animateLipSync);
    } else {
      // 終了時はすべてリセット
      phonemes.forEach(p => {
        vrm.expressionManager.setValue(p, 0);
      });
    }

  }

  animateLipSync();
}
