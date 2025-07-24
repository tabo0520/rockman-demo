import React, { useEffect } from "react";
import AvatarCanvas from "./components/AvatarCanvas";
import { chatWithGPT } from "./utils/openai";

function App() {
  useEffect(() => {
    const process = async () => {
      try {
        const response = await chatWithGPT("こんにちは");
        console.log("OpenAIの応答:", response);
      } catch (error) {
        console.error("OpenAIエラー:", error);
      }
    };

    process();
  }, []);

  return (
    <div>
      <h1>Rockman Avatar Demo</h1>
      <AvatarCanvas />
    </div>
  );
}

export default App;
