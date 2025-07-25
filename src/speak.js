export async function speak(text) {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY; // ← ここを修正済み
  const voiceId = '21m00Tcm4TlvDq8ikWAM'; // 任意の音声（例: Rachel）

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
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
