import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { detectEmotion, setExpression } from './emotion.js';

let currentVrm = null;

// Three.js 初期化
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, 500);
document.getElementById('vrm-container').appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / 500, 0.1, 1000);
camera.position.set(0, 1.4, 2.0); // 必要に応じて近づけて

const light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1).normalize();
scene.add(light);

const clock = new THREE.Clock();

// VRMロード
const loader = new GLTFLoader();
loader.register((parser) => new VRMLoaderPlugin(parser));

loader.load(
  '/avatar.vrm', // ✅ Viteではpublic/を除いて指定
  (gltf) => {
    VRMUtils.removeUnnecessaryJoints(gltf.scene);
    const vrm = gltf.userData.vrm;
    vrm.scene.rotation.y = Math.PI;
    scene.add(vrm.scene);
    currentVrm = vrm;
    console.log("✅ VRM読み込み成功");
  },
  undefined,
  (error) => {
    console.error('❌ VRM読み込み失敗:', error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (currentVrm) currentVrm.update(delta);
  renderer.render(scene, camera);
}
animate();

// ==============================
// ChatGPTフォーム処理
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('input-form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  const OPENAI_API_KEY = 'ここにAPIキーです！';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = input.value.trim();
    if (!userText) return;

    const userMsg = document.createElement('div');
    userMsg.textContent = `>> ${userText}`;
    userMsg.className = 'message user';
    messages.appendChild(userMsg);
    input.value = '';

    const botMsg = document.createElement('div');
    botMsg.textContent = '（応答生成中…）';
    botMsg.className = 'message bot';
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'あなたはネットナビ ロックマンとしてふるまってください。' },
            { role: 'user', content: userText }
          ],
          temperature: 0.8
        })
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || '（応答エラー）';
      botMsg.textContent = reply;

      // 感情を判定してVRMに反映
      const emotion = detectEmotion(reply);
      setExpression(currentVrm, emotion);

    } catch (err) {
      botMsg.textContent = '（通信エラーが発生しました）';
      console.error(err);
    }

    messages.scrollTop = messages.scrollHeight;
  });
});

