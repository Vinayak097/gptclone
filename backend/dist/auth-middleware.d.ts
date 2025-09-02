import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth-middleware.d.ts.map