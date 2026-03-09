import { Router, Request, Response } from "express";
import clerkClient from "../utils/clerk";


const router: Router = Router();

router.get("/", async (_req: Request, res: Response) => {
    try {
        const users = await clerkClient.users.getUserList();

        return res.status(200).json(users);
    } catch (error) {
        console.error("CLERK GET USERS ERROR:", error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const rawId = req.params.id;

        if (!rawId || Array.isArray(rawId)) {
            return res.status(400).json({ error: "Invalid user id" });
        }

        const user = await clerkClient.users.getUser(rawId);

        return res.status(200).json(user);
    } catch (error: any) {
        if (error?.status === 404) {
            return res.status(404).json({ error: "User not found" });
        }

        console.error("CLERK GET USER ERROR:", error);
        return res.status(500).json({ error: "Failed to fetch user" });
    }
});

export default router;