const API_KEY = import.meta.env.VITE_AI_KEY;

export async function summarizeText(text) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes text clearly."
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 150
    })
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.choices[0].message.content;
}
