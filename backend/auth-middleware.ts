import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
const authMiddleware = async (
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
    const userId=1
    if(data.userId==userId){
        
    }
    next();
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
