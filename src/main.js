import { initThreeScene, loadVRMModel, startRenderLoop } from './avatar.js';
import { getChatGPTReply } from './chatgpt.js';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
let currentVrm = null;

// === Three.jsシーン初期化・レンダリング開始 ===
const { scene, camera, renderer } = initThreeScene();
startRenderLoop(scene, camera, renderer);

// === ボタン一時無効化（VRM読み込み完了まで） ===
const sendButton = document.getElementById('send-button');
sendButton.disabled = true;

// === VRMアバター読み込み ===
loadVRMModel('/avatar.vrm', scene)
  .then((vrm) => {
    currentVrm = vrm;
    console.log("VRM expressionManager:", currentVrm?.expressionManager);

    sendButton.disabled = false; // 読み込み完了後にボタン有効化
  })
  .catch((error) => {
    console.error('VRM load error:', error);
  });

// === ユーザー入力送信イベント ===
sendButton.addEventListener('click', async () => {
  const input = document.getElementById('user-input').value;
  if (!input || !currentVrm) return;

  const reply = await getChatGPTReply(input, apiKey, currentVrm);
  document.getElementById('reply-output').textContent = reply;
});
