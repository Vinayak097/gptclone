import type { Request, Response, NextFunction } from "express";
import type { User } from "./generated/prisma/index.js";
declare global {
    namespace Express {
        interface Request {
            userId: string;
            user: User;
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth-middleware.d.ts.map