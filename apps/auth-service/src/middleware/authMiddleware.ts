// middleware/authMiddleware.ts
import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { CustomJwtSessionClaims } from "../types";
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

export const shouldBeAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) {
        return res.status(401).json({ message: "You are not logged in!" });
    }

    const claims = auth.sessionClaims as CustomJwtSessionClaims

    if (claims.metadata?.role !== "admin") {
        return res.status(403).send({ message: "unauthorized!" })
    }

    req.userId = auth.userId;

    return next();
};