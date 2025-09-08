import express, { type Request, type Response } from "express";
import { createChatType, type Message } from "./types.js";
import { createCompletion, testCompletion } from "./openrouter.js";
import { randomUUID } from "crypto";
import { inMemoryStore } from "./inMemoryStrore.js";
import cors from "cors";
import Ai from "./routes/ai.js";
import authRoutes from "./routes/authRoute.js";
import conversationRoutes from "./routes/conversationRoutes.js";
const app = express();

app.use(cors());
type Model = "openai/gpt-4o" | "openai/gpt-5";
app.use(express.json());
app.use("/chat", Ai);
app.use("/auth", authRoutes);
app.use("/conversations", conversationRoutes);
app.listen(3001, () => {
  console.log("port 3000");
});
