import React from "react";


export const useSpeechRecognition = (onResult: (text: string) => void) => {
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("このブラウザは音声認識に対応していません");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.onerror = (event) => {
      console.error("認識エラー:", event);
    };

    recognitionRef.current = recognition;
  }, [onResult]);

  const start = () => {
    recognitionRef.current?.start();
  };

  return { start };
};

export default useSpeechRecognition;

