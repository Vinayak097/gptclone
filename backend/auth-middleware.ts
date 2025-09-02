import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    console.log(req.headers["authorization"]);
    if (!token) {
      res.status(401).json({ message: "token not found" });
      return;
    }
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    //find out what is the data is consoles

    const userId = "1";
    req.userId = userId;
    console.log(data);

    next();
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
