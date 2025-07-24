export function detectEmotion(text) {
  if (text.includes('嬉') || text.includes('楽') || text.includes('よかった')) return 'happy';
  if (text.includes('怒') || text.includes('ムカ') || text.includes('許せ')) return 'angry';
  if (text.includes('悲') || text.includes('寂') || text.includes('辛')) return 'sad';
  return 'neutral';
}

export function setExpression(vrm, emotion) {
  if (!vrm) return;
  const blendShapeProxy = vrm.blendShapeProxy;
  if (!blendShapeProxy) return;

  blendShapeProxy.setValues({}); // リセット

  switch (emotion) {
    case 'happy':
      blendShapeProxy.setValue('Joy', 1.0);
      break;
    case 'angry':
      blendShapeProxy.setValue('Angry', 1.0);
      break;
    case 'sad':
      blendShapeProxy.setValue('Sorrow', 1.0);
      break;
    case 'neutral':
    default:
      break;
  }
}
