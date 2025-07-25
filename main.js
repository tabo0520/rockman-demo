import { initThreeScene, loadVRMModel, startRenderLoop } from './avatar.js';
import { getChatGPTReply } from './chatgpt.js';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
let currentVrm = null;

// === Three.jsシーン初期化・レンダリング開始 ===
const { scene, camera, renderer } = initThreeScene();
startRenderLoop(scene, camera, renderer);

// === VRMアバター読み込み ===
loadVRMModel('./models/rockman.vrm', scene)
  .then((vrm) => {
    currentVrm = vrm;
  })
  .catch((error) => {
    console.error('VRM load error:', error);
  });

// === ユーザー入力送信イベント ===
document.getElementById('send-button').addEventListener('click', async () => {
  const input = document.getElementById('user-input').value;
  if (!input || !currentVrm) return;

  const reply = await getChatGPTReply(input, apiKey, currentVrm);
  document.getElementById('reply-output').textContent = reply;
});
