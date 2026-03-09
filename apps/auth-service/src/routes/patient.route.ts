// packages/api/src/routes/patients.route.ts
import { Router, Request, Response } from "express";
import { prisma } from "@repo/auth-db";
import { shouldBeUser } from "../middleware/authMiddleware"; // Import your middleware

const router: Router = Router();

/**
 * GET /patients
 * Get all patients
 */
router.get("/", async (_req: Request, res: Response) => {
    try {
        const patients = await prisma.patient.findMany({
            include: { user: true },
        });
        res.json({ patients });
    } catch (err) {
        console.error("❌ Error fetching patients:", err);
        res.status(500).json({ error: "Failed to fetch patients" });
    }
});

/**
 * GET /patients/me
 * Get the current patient for the authenticated user
 * ⚠️ MUST come BEFORE /:id route
 */
router.get("/me", shouldBeUser, async (req: Request, res: Response) => {
    try {
        const clerkUserId = req.userId; // This is set by shouldBeUser middleware

        if (!clerkUserId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // First, find the User by clerkId
        const user = await prisma.user.findUnique({
            where: { clerkId: clerkUserId },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found in database" });
        }

        // Then find the Patient using the database user.id
        const patient = await prisma.patient.findUnique({
            where: { userId: user.id }, // ✅ Use database user.id, not clerkId
            include: { user: true },
        });

        if (!patient) {
            return res.status(404).json({
                error: "Patient profile not found. Please complete your registration."
            });
        }

        res.json({ patient });
    } catch (err) {
        console.error("❌ Error fetching current patient:", err);
        res.status(500).json({ error: "Failed to fetch current patient" });
    }
});

/**
 * GET /patients/:id
 * Get patient by patient ID
 * ⚠️ MUST come AFTER /me route
 */
router.get("/:id", shouldBeUser, async (req: Request, res: Response) => {
    const patientId = req.params.id;

    if (!patientId || Array.isArray(patientId)) {
        return res.status(400).json({ error: "Invalid patient ID" });
    }

    try {
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            include: { user: true },
        });

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json({ patient });
    } catch (err) {
        console.error("❌ Error fetching patient by ID:", err);
        res.status(500).json({ error: "Failed to fetch patient" });
    }
});

export default router;