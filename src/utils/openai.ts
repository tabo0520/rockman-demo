export const chatWithGPT = async (message: string) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("OpenAI API error:", text);
    throw new Error("Failed to get response from OpenAI");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
