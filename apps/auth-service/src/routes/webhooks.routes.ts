// src/routes/webhook.ts (or similar path)
import { Router, Request, Response } from "express";
import { Webhook } from "svix";
import { prisma } from "@repo/auth-db";

const router: Router = Router();

router.post("/clerk", async (req: Request, res: Response) => {
    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

        if (!WEBHOOK_SECRET) {
            throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
        }
        const svix_id = req.headers["svix-id"] as string;
        const svix_timestamp = req.headers["svix-timestamp"] as string;
        const svix_signature = req.headers["svix-signature"] as string;

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).json({ error: "Missing svix headers" });
        }

        const payload = req.body;
        const body = JSON.stringify(payload);

        const wh = new Webhook(WEBHOOK_SECRET);

        let evt: any;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
        } catch (err) {
            console.error("Error verifying webhook:", err);
            return res.status(400).json({ error: "Verification failed" });
        }

        const { type, data } = evt;

        switch (type) {
            case "user.created":
                await prisma.user.create({
                    data: {
                        clerkId: data.id,
                        email: data.email_addresses[0].email_address,
                        name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "User",
                        abhaId: data.unsafe_metadata?.abhaId as string || null,
                    },
                });
                console.log("✅ User created:", data.id);
                break;

            case "user.updated":
                await prisma.user.update({
                    where: { clerkId: data.id },
                    data: {
                        email: data.email_addresses[0].email_address,
                        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                        abhaId: data.unsafe_metadata?.abhaId as string || null,
                    },
                });
                console.log("✅ User updated:", data.id);
                break;

            case "user.deleted":
                await prisma.user.delete({
                    where: { clerkId: data.id },
                });
                console.log("✅ User deleted:", data.id);
                break;

            default:
                console.log(`Unhandled event type: ${type}`);
        }

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error("WEBHOOK ERROR:", error);
        return res.status(500).json({ error: error.message });
    }
});

export default router;