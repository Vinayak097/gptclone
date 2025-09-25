
import { configDotenv } from "dotenv";
configDotenv()
async function runStream() {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      input: "Write a short bedtime story about a unicorn., and generate one images raleated to it",
      stream: true
    }),
  });

  if (!res.ok) {
    console.error("Request failed:", res.status, await res.text());
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    for (const line of chunk.split("\n")) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") {
          console.log("\n--- Stream complete ---");
          return;
        }
        try {
          const json = JSON.parse(data);
          if (json.type === "response.output_text.delta") {
            process.stdout.write(json.delta);
          }
          if (json.type === "response.completed") {
            console.log("\n\nModel used:", json.response.model);
          }
        } catch { }
      }
    }
  }
}

runStream().catch(console.error);
