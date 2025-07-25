import { initThreeScene, loadVRMModel, startRenderLoop } from './avatar.js';
import { getChatGPTReply } from './chatgpt.js';
import { startSpeechRecognition } from './speechInput.js'; // ← 新規追加

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
let currentVrm = null;

// === Three.jsシーン初期化・レンダリング開始 ===
const { scene, camera, renderer } = initThreeScene();
startRenderLoop(scene, camera, renderer);

// === ボタン取得＆一時無効化 ===
const originalButton = document.getElementById('send-button');
originalButton.disabled = true;

// === VRMアバター読み込み ===
loadVRMModel('/avatar.vrm', scene)
  .then((vrm) => {
    currentVrm = vrm;
    console.log("VRM expressionManager:", currentVrm?.expressionManager);

    // ✅ send-button再設定
    const cleanButton = originalButton.cloneNode(true);
    originalButton.replaceWith(cleanButton);
    cleanButton.disabled = false;

    // ✅ テキスト送信イベント
    cleanButton.addEventListener('click', async () => {
      const input = document.getElementById('user-input').value;
      if (!input || !currentVrm) return;

      const reply = await getChatGPTReply(input, apiKey, currentVrm);
      document.getElementById('reply-output').textContent = reply;
    });

    // ✅ 音声入力ボタンイベント
    const micButton = document.getElementById('mic-button');
    micButton.addEventListener('click', () => {
      startSpeechRecognition(async (recognizedText) => {
        document.getElementById('user-input').value = recognizedText;
        if (!recognizedText || !currentVrm) return;

        const reply = await getChatGPTReply(recognizedText, apiKey, currentVrm);
        document.getElementById('reply-output').textContent = reply;
      });
    });
  })
  .catch((error) => {
    console.error('VRM load error:', error);
  });
