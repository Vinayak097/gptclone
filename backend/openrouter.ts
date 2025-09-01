type Model =
  | "gpt-4o" // Latest, most capable
  | "gpt-4o-mini" // Fast and cheap
  | "gpt-4-turbo" // Previous generation
  | "gpt-4" // Original GPT-4
  | "gpt-3.5-turbo"
  | "openai/gpt-4o";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_KEY = process.env.OPENAI_API_KEY;
console.log(OPENROUTER_KEY, "open key ");

type Role = "agent" | "user";
const MAX_TOKEN = 4000;
import type { Message } from "./types.ts";

export const createCompletion = async (
  model: Model,
  message: Message[],
  cb: (chunk: string) => void
) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
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

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        reject(new Error(`API Error ${response.status}: ${errorText}`));
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        reject(new Error("Response body is not readable"));
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      try {
        let tokenIterations = 0;

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            resolve();
            break;
          }

          tokenIterations++;
          if (tokenIterations > MAX_TOKEN) {
            console.log("Max token limit reached");
            resolve();
            break;
          }

          // Append new chunk to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete lines from buffer
          while (true) {
            const lineEnd = buffer.indexOf("\n");
            if (lineEnd === -1) {
              break; // No complete line yet, wait for more data
            }

            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);

            if (line.startsWith("data: ")) {
              const data = line.slice(6);

              if (data === "[DONE]") {
                console.log("Received [DONE] signal");
                resolve();
                return;
              }

              if (data === "") {
                continue; // Skip empty data lines
              }

              try {
                const parsed = JSON.parse(data);

                // More defensive checking
                const content = parsed?.choices?.[0]?.delta?.content;
                if (content) {
                  cb(content);
                  // } else {
                  //   console.log("No content in this chunk:", {
                  //     hasChoices: !!parsed?.choices,
                  //     choicesLength: parsed?.choices?.length,
                  //     hasDelta: !!parsed?.choices?.[0]?.delta,
                  //     deltaKeys: parsed?.choices?.[0]?.delta
                  //       ? Object.keys(parsed.choices[0].delta)
                  //       : [],
                  //   });
                }
              } catch (e) {
                console.log("JSON Parse Error:", e);
                console.log("Problematic data:", data);
                // Don't reject on parse errors, just continue
              }
            }
          }
        }
      } catch (streamError) {
        console.error("Stream processing error:", streamError);
        reject(streamError);
      } finally {
        reader.cancel();
      }
    } catch (error) {
      console.error("General error:", error);
      reject(error);
    }
  });
};

// Test function to help debug
export const testCompletion = async () => {
  const messages: Message[] = [{ role: "user", content: "Say hello world" }];

  try {
    await createCompletion("gpt-4", messages, (chunk) => {
      console.log("CALLBACK RECEIVED:", chunk);
      process.stdout.write(chunk);
    });
    console.log("\n✅ Test completed");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};
