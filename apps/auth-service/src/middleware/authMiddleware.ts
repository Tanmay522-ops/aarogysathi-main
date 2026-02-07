// middleware/authMiddleware.ts
import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { prisma } from "@repo/auth-db";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            user?: any; 
        }
    }
}
export const shouldBeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const auth = getAuth(req);
        console.log("AUTH:", auth);
        const userId = auth.userId;

        if (!userId) {
            return res.status(401).json({ message: "You are not logged in!" });
        }

        req.userId = userId;

        return next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ message: "Authentication error" });
    }
};