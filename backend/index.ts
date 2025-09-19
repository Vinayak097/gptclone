import express, { type Request, type Response } from "express";

import cors from "cors";
import Ai from "./routes/ai.js";
import authRoutes from "./routes/authRoute.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
type Model = "openai/gpt-4o" | "openai/gpt-5";

const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/user", userRoutes);
app.use("/chat", Ai);
app.use("/auth", authRoutes);
app.use("/conversations", conversationRoutes);
app.get("/health", (req, res) => {
  res.send("hello");
});
app.listen(3001, () => {
  console.log("port 3001");
});
