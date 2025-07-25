// idleMotion.js

/**
 * 時間ベースでアイドルモーションをVRMに適用する
 * @param {VRM} vrm - 対象のVRMアバター
 * @param {number} time - performance.now()
 */
export function applyIdleMotion(vrm, time) {
  const head = vrm.humanoid.getRawBoneNode('head');
  const spine = vrm.humanoid.getRawBoneNode('spine');

  if (head && spine) {
    head.rotation.y = 0.15 * Math.sin(time / 1000);
    head.rotation.x = 0.09 * Math.cos(time / 1200);
    spine.rotation.x = 0.06 * Math.sin(time / 1500);
  }
}
