// middleware/authMiddleware.ts

import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { CustomJwtSessionClaims } from "../types";

// Extend Fastify types
declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
        claims?: CustomJwtSessionClaims;
    }
}

/**
 * Middleware to ensure the user is authenticated
 * Extracts userId from Clerk JWT and attaches it to request
 */
export const shouldBeUser = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const auth = getAuth(request);
        const userId = auth.userId;

        if (!userId) {
            return reply.status(401).send({
                error: "Unauthorized",
                message: "You are not logged in!"
            });
        }

        // Attach userId and claims to request
        request.userId = userId;
        request.claims = auth.sessionClaims as CustomJwtSessionClaims;
    } catch (error) {
        return reply.status(401).send({
            error: "Unauthorized",
            message: "Invalid authentication token"
        });
    }
};

/**
 * Middleware to ensure the user is an admin
 * Checks for admin role in JWT claims
 */
export const shouldBeAdmin = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const auth = getAuth(request);
        const userId = auth.userId;

        if (!userId) {
            return reply.status(401).send({
                error: "Unauthorized",
                message: "You are not logged in!"
            });
        }

        const claims = auth.sessionClaims as CustomJwtSessionClaims;

        if (claims?.metadata?.role !== "admin") {
            return reply.status(403).send({
                error: "Forbidden",
                message: "Admin access required"
            });
        }

        // Attach userId and claims to request
        request.userId = userId;
        request.claims = claims;
    } catch (error) {
        return reply.status(401).send({
            error: "Unauthorized",
            message: "Invalid authentication token"
        });
    }
};

/**
 * Optional: Middleware to check if user is authenticated but doesn't block
 * Useful for routes that work differently for authenticated vs anonymous users
 */
