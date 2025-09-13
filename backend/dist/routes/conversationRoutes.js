import e from "express";
import { authMiddleware } from "../auth-middleware.js";
import client from "../dbclient.js";
const router = e.Router();
router.get("/", authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const conversations = await client.conversation.findMany({
            where: {
                userId,
            },
            select: {
                conversationId: true,
                title: true,
            },
        });
        res.status(200).json({ conversations });
    }
    catch (error) {
        console.error("Error fetching conversation:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
});
router.get("/:conversationId", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // assuming you set this in auth middleware
        const { conversationId } = req.params;
        if (!userId || !conversationId) {
            return res
                .status(400)
                .json({ message: "Conversation ID or user ID missing" });
        }
        const conversation = await client.conversation.findFirst({
            where: {
                conversationId: conversationId,
                userId,
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        return res.status(200).json(conversation);
    }
    catch (error) {
        console.error("Error fetching conversation:", error);
        return res
            .status(500)
            .json({ message: "Internal Server Error", error: error.message });
    }
});
export default router;
//# sourceMappingURL=conversationRoutes.js.map