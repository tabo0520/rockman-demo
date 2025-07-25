// avatar.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { applyIdleMotion } from './idleMotion.js';
import { applyPose } from './poseController.js'; // ← 全身姿勢適用用（毎フレーム呼び出し）

let currentVrm = null;

export function initThreeScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / 500, 0.1, 1000);
  camera.position.set(0, 1.4, 2.0);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, 500);
  document.getElementById('vrm-container').appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  return { scene, camera, renderer };
}

export function loadVRMModel(path, scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      path,
      (gltf) => {
        VRMUtils.removeUnnecessaryJoints(gltf.scene);
        VRMUtils.removeUnnecessaryVertices(gltf.scene);

        const vrm = gltf.userData.vrm;
        vrm.scene.rotation.y = Math.PI;

        scene.add(vrm.scene);
        currentVrm = vrm;

        resolve(vrm);
      },
      undefined,
      (err) => reject(err)
    );
  });
}

export function startRenderLoop(scene, camera, renderer) {
  let oldTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now();
    const deltaTime = (currentTime - oldTime) / 1000;

    if (currentVrm) {
      currentVrm.update(deltaTime);
      applyPose(currentVrm); // ← 姿勢を毎フレーム維持してT字回避
      applyIdleMotion(currentVrm, currentTime); // ← 揺れなど自然動作も維持
    }

    renderer.render(scene, camera);
    oldTime = currentTime;
  }

  animate();
}
