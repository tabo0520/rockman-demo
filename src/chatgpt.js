import { speak } from './speak.js';

// ChatGPTへのメッセージ送信＆応答取得
export async function getChatGPTReply(userMessage, apiKey, vrm) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userMessage }]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  console.log('ChatGPT:', reply);

  speak(reply, vrm); // ← VRMをちゃんと渡す！

  return reply;
}
