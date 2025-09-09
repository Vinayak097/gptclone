import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import client from "./dbclient.js";

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
    console.log("token ", token);
    if (!token) {
      res.status(401).json({ message: "token not found" });
      return;
    }
    const data = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    //find out what is the data is consoles
    const user = await client.user.findUnique({ where: { id: data.userId } });
    console.log("user middlwaere ", user);
    if (!user) {
      res.status(403).json({ message: "user not registered" });
      return;
    }
    req.userId = data.userId;
    console.log("data ", data);
    next();
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
