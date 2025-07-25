// speak.js
export async function speak(text) {
  const apiKey = 'YOUR_API_KEY'; // ← ここに取得済みAPIキーを貼る
  const voiceId = '21m00Tcm4TlvDq8ikWAM'; // ElevenLabsのデフォルト音声（例：Rachel）
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2', // 日本語対応モデル
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8
      }
    })
  });

  if (!response.ok) {
    console.error('TTS API error:', response.statusText);
    return;
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
}
