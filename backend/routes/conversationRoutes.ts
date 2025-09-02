import e from "express";
import { authMiddleware } from "../auth-middleware.js";
const router = e.Router();

router.get(
  "/conversation/:conversationId",
  authMiddleware,
  async (req, res) => {
    const userId = req.userId;
    const { conversationId } = req.params;
  }
);

export default router;
