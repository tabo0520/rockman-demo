// speechInput.js
export function startSpeechRecognition(onResult) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('このブラウザは音声認識に対応していません。');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'ja-JP';
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('[speech]', transcript);
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error('[speech] エラー:', event.error);
  };

  recognition.start();
}
