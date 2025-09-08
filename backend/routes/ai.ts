import { randomUUID } from "crypto";
import e from "express";
import { inMemoryStore } from "../inMemoryStrore.js";
import { createChatType, type Message } from "../types.js";
import type { Request, Response } from "express";
import { createCompletion } from "../openrouter.js";
import client from "../dbclient.js";
import { authMiddleware } from "../auth-middleware.js";
const router = e.Router();
enum Role {
  user = "user",
  assistant = "assistant",
}
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const result = createChatType.safeParse(req.body);
  const userId = req.userId;
  const { success, data } = result;
  console.log(result.error, req.body);
  if (!success) {
    res.status(411).json({ message: "incorrect inputs" });
    return;
  }
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Connection", "keep-alive");

  let responses = ""; // Initialize as an empty string

  let existingMessages: Message[] = inMemoryStore
    .getInstance()
    .get(data.conversationId);

  await createCompletion(
    "gpt-4",
    [...existingMessages, { role: "user", content: data.message }],
    (chunk) => {
      console.log(chunk, "chunk");
      responses += chunk;
      res.write(`data: ${chunk}\n\n`); // Send chunk as part of the stream
    }
  );

  inMemoryStore
    .getInstance()
    .add(data.conversationId, { role: "user", content: data.message });
  inMemoryStore
    .getInstance()
    .add(data.conversationId, { role: "assistant", content: responses });

  if (!data.conversationId) {
    console.log("creating ", userId);
    const title = data.message;
    await client.conversation.create({
      data: {
        userId,
        title,
        messages: {
          create: [
            {
              content: data.message,
              role: Role.user,
            },
            {
              content: responses,
              role: Role.assistant,
            },
          ],
        },
      },
    });
  } else {
    console.log("creating message ");
    await client.message.createMany({
      data: [
        {
          conversationId: data.conversationId || randomUUID(),
          role: Role.user,
          content: data.message,
        },
        {
          conversationId: data.conversationId || randomUUID(),
          role: Role.assistant,
          content: responses,
        },
      ],
    });
  }

  res.write("data: [DONE]\n\n"); // Signal the end of the stream

  res.end();
});

export default router;
