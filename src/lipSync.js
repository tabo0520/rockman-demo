// lipSync.js

let isLipSyncActive = false;
let currentVrmRef = null;

const phonemes = ['aa', 'ih', 'ou', 'ee', 'oh'];

/**
 * @param {AnalyserNode} analyser - speak.jsで作ったanalyser
 * @param {VRM} vrm - VRMアバター
 */
export function startLipSync(analyser, vrm) {
  if (isLipSyncActive) return;
  isLipSyncActive = true;
  currentVrmRef = vrm;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function animateLipSync() {
    if (!isLipSyncActive) return;

    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 256;

    if (vrm?.expressionManager) {
      const randomPhoneme = phonemes[Math.floor(Math.random() * phonemes.length)];
      phonemes.forEach(p => {
        const value = (p === randomPhoneme) ? volume : 0;
        vrm.expressionManager.setValue(p, value);
      });

      console.log("Setting phoneme:", randomPhoneme, "value:", volume.toFixed(2));
    }

    requestAnimationFrame(animateLipSync);
  }

  animateLipSync();
}

/**
 * 音声再生終了時に呼び出して口を閉じ、リップシンクを停止
 */
export function stopLipSync() {
  isLipSyncActive = false;

  if (currentVrmRef?.expressionManager) {
    phonemes.forEach(p => {
      currentVrmRef.expressionManager.setValue(p, 0);
    });
  }

  console.log("[lipSync] 停止＆口を閉じた");
}
