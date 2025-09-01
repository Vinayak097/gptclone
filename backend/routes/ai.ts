import { randomUUID } from "crypto";
import e from "express";
import { inMemoryStore } from "../inMemoryStrore.js";
import { createChatType, type Message } from "../types.js";
import type { Request, Response } from "express";
import { createCompletion } from "../openrouter.js";
const router = e.Router();

router.post("/chat", async (req: Request, res: Response) => {
  const result = createChatType.safeParse(req.body);
  const { success, data } = result;
  console.log(result.error, req.body);
  if (!success) {
    res.status(411).json({ message: "incorrect inputs" });
    return;
  }
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Connection", "keep-alive");

  let responses = ""; // Initialize as an empty string
  const conversatoinId = randomUUID();
  let existingMessages: Message[] = inMemoryStore
    .getInstance()
    .get(conversatoinId);

  await createCompletion(
    "openai/gpt-4o",
    [...existingMessages, { role: "user", content: data.message }],
    (chunk) => {
      console.log(chunk, "chunk");
      responses += chunk;
      res.write(`data: ${chunk}\n\n`); // Send chunk as part of the stream
    }
  );

  inMemoryStore
    .getInstance()
    .add(conversatoinId, { role: "user", content: data.message });
  inMemoryStore
    .getInstance()
    .add(conversatoinId, { role: "assistant", content: responses });

  res.write("data: [DONE]\n\n"); // Signal the end of the stream
  res.end();
});

export default router;
