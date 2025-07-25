// poseController.js
import * as THREE from 'three';

/**
 * VRMに対して姿勢を適用する（毎フレーム呼び出し前提）
 * @param {VRM} vrm - 対象のVRM
 */
export function applyPose(vrm) {
  const h = vrm.humanoid;

  // 姿勢定義（ラジアン単位）
  // 推奨範囲：だいたい ±0.5 ～ ±1.5（ラジアン）までに収めると自然
  const pose = {
    // === 上半身 ===
    head: [0, 0, 0],            // 頭（上下: ±0.3, 左右傾き: ±0.2, 回転: ±0.3）
    neck: [0, 0, 0],            // 首（動かすと滑らかになる、±0.2〜0.4）
    spine: [0.05, 0, 0],        // 背骨（前屈み：+0.3、反らす：-0.3）
    hips: [0, 0, 0],            // 骨盤（回転・傾き調整用）

    // === 左腕 ===
    // 上腕（下げ：-0.5〜-1.0、持ち上げ：+方向）
    leftUpperArm: 
  //回転,前後,上下
    [0, 0, 1], 
    // 肘（-1.5〜0、-方向で曲げる）
  //回転,前後,上下
    leftLowerArm: 
    [0, -1.2, 1], 
    // 手（回転）
  //回転,前後,上下
    leftHand: 
    [0, 0, 0],        

    // === 右腕 ===
    rightUpperArm: 
    [0, 0, -1], 
    rightLowerArm: 
    [0, 1.2, -1], 
    rightHand: 
    [0, 0, 0],       
    // 上腕（下げ：+0.5〜+1.0）
    // 肘（+方向で曲げる）
    // 手（回転）

    // === 左足 ===
    leftUpperLeg: [0.2, 0, 0],  // 太もも（前へ：+、後ろへ：-、±0.5）
    leftLowerLeg: [-0.4, 0, 0], // 膝（曲げ：-0.2〜-1.2）
    leftFoot: [0, 0, 0],        // 足首

    // === 右足 ===
    rightUpperLeg: [0.2, 0, 0], // 太もも（同上）
    rightLowerLeg: [-0.4, 0, 0],// 膝（同上）
    rightFoot: [0, 0, 0],       // 足首
  };

  // 適用処理
  for (const [boneName, [x, y, z]] of Object.entries(pose)) {
    const bone = h.getRawBoneNode(boneName);
    if (bone) {
      bone.quaternion.setFromEuler(new THREE.Euler(x, y, z));
    }
  }
}
