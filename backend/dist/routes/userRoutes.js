import express from "express";
import { authMiddleware } from "../auth-middleware.js";
const router = express.Router();
router.get("/", authMiddleware, async (req, res) => {
    const user = req.user;
    return res.status(200).json({ user });
});
export default router;
//# sourceMappingURL=userRoutes.js.map