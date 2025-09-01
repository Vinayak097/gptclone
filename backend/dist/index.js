import express, {} from "express";
import { createChatType } from "./types.js";
import { createCompletion, testCompletion } from "./openrouter.js";
import { randomUUID } from "crypto";
import { inMemoryStore } from "./inMemoryStrore.js";
import cors from "cors";
import Ai from "./routes/ai.js";
import authRoutes from "./routes/authRoute.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/chat", Ai);
app.use("/auth", authRoutes);
app.listen(3000, () => {
    console.log("port 3000");
});
//# sourceMappingURL=index.js.map