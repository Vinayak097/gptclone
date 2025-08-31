type Model = "openai/gpt-4o" | "openai/gpt-5";
import dotenv from "dotenv";
dotenv.config();
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
console.log(OPENROUTER_KEY, "open key ");
type Role = "agent" | "user";
const MAX_TOKEN = 8000;
import type { Message } from "./types.ts";
export const crateCompletion = async (
  model: Model,
  message: Message[],
  cb: (chunk: string) => void
) => {
  return new Promise<void>(async (resolve, reject) => {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: message,
          stream: true,
        }),
      }
    );
    console.log(response);
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      let tokenIterations = 0;

      while (true) {
        tokenIterations++;

        if (tokenIterations > MAX_TOKEN) {
          resolve();
          return;
        }
        const { done, value } = await reader.read();
        if (done) break;

        // Append new chunk to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines from buffer
        while (true) {
          const lineEnd = buffer.indexOf("\n");
          if (lineEnd === -1) {
            resolve();
            break;
          }

          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);

          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0].delta.content;
              if (content) {
                console.log(content, "contenbt ");
                cb(content);
              }
            } catch (e) {
              console.log(e);
              // Ignore invalid JSON
              reject();
            }
          }
        }
      }
    } finally {
      resolve();
      reader.cancel();
    }
  });
};
