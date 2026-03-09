import { Router, Request, Response } from "express";
import { Webhook } from "svix";
import { prisma as authPrisma, Role } from "@repo/auth-db";

import { prisma as appointmentPrisma } from "@repo/appointment-db"; 

const router:Router = Router();

router.post("/clerk", async (req: Request, res: Response) => {
    console.log("=== Webhook received ===");

    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
            throw new Error("CLERK_WEBHOOK_SECRET not set in .env");
            
        }
        console.log("Webhook secret loaded:", !!WEBHOOK_SECRET);

        const svix_id = req.headers["svix-id"] as string;
        const svix_ts = req.headers["svix-timestamp"] as string;
        const svix_sig = req.headers["svix-signature"] as string;

        console.log("Svix headers:", { svix_id, svix_ts, svix_sig });

        if (!svix_id || !svix_ts || !svix_sig) {
            return res.status(400).json({ error: "Missing Svix headers" });
        }

        // payload is the data comes up from the webhook
        const rawPayload = req.body;
        console.log("Raw payload type:", typeof rawPayload, Buffer.isBuffer(rawPayload));

        // here we are creating a webhook 
        const wh = new Webhook(WEBHOOK_SECRET);
        // here we are creating an event
        let evt: any;
        try {
            evt = wh.verify(rawPayload, {
                "svix-id": svix_id,
                "svix-timestamp": svix_ts,
                "svix-signature": svix_sig,
            });
            console.log("✅ Webhook verification succeeded");
        } catch (err) {
            console.error("❌ Webhook verification failed:", err);
            return res.status(400).json({ error: "Verification failed" });
        }

        const { type, data } = evt;
        console.log("Event type:", type);

        switch (type) {
            case "user.created":
                try {
                    const roleFromMetadata = data.public_metadata?.role as string;
                    const role = (roleFromMetadata && roleFromMetadata in Role)
                        ? roleFromMetadata as Role
                        : Role.PATIENT;
     
                    await authPrisma.user.upsert({
                        where: { clerkId: data.id },
                        update: {}, // do nothing if exists
                        create: {
                            clerkId: data.id,
                            email: data.email_addresses?.[0]?.email_address || "",
                            name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "User",
                            role: role,
                        },
                    });
                    console.log("✅ User created in DB:", data.id);
                } catch (dbErr) {
                    console.error("Prisma user creation error:", dbErr);
                }
                break;

            case "user.updated":
                try {
                    const roleFromMetadata = data.public_metadata?.role as string;
                    const role = (roleFromMetadata && roleFromMetadata in Role)
                        ? roleFromMetadata as Role
                        : Role.PATIENT;

                    console.log("Creating user with role:", role);
                    
                    await authPrisma.user.updateMany({
                        where: { clerkId: data.id },
                        data: {
                            email: data.email_addresses?.[0]?.email_address || "",
                            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                            role: role,
                        },
                    });
                    console.log("✅ User updated in DB:", data.id);
                } catch (dbErr) {
                    console.error("Prisma user update error:", dbErr);
                }
                break;

            case "user.deleted":
                try {
                    const clerkUserId = data.id;
                    console.log("🗑️ Starting user deletion process for:", clerkUserId);

                    // Use transaction to ensure all deletions are atomic
                    await authPrisma.$transaction(async (tx) => {
                        // First, check if this user is a doctor
                        const doctor = await appointmentPrisma.doctor.findUnique({
                            where: { clerkId: clerkUserId }
                        });

                        if (doctor) {
                            console.log("👨‍⚕️ User is a doctor, deleting related data...");

                            // Delete appointments first (foreign key constraint)
                            const deletedAppointments = await appointmentPrisma.appointment.deleteMany({
                                where: { doctorId: doctor.id }
                            });
                            console.log(`✅ Deleted ${deletedAppointments.count} appointment(s)`);

                            // Then delete the doctor record
                            const deletedDoctor = await appointmentPrisma.doctor.delete({
                                where: { clerkId: clerkUserId }
                            });
                            console.log("✅ Deleted doctor:", deletedDoctor.id);
                        } else {
                            console.log("ℹ️ User is not a doctor, skipping appointment-db cleanup");
                        }

                        // Delete from auth-db (using transaction context)
                        const deletedUser = await tx.user.deleteMany({
                            where: { clerkId: clerkUserId }
                        });
                        console.log(`✅ Deleted ${deletedUser.count} user(s) from auth-db`);

                        // Verify deletion
                        if (deletedUser.count === 0) {
                            console.warn("⚠️ No user found in auth-db with clerkId:", clerkUserId);
                        }
                    });

                    console.log("🎉 User deletion transaction completed successfully for:", clerkUserId);
                } catch (dbErr) {
                    console.error("❌ Prisma user deletion error:", dbErr);
                    throw dbErr; // Re-throw to send error response
                }
                break;

            default:
                console.log(`⚠️ Unhandled event type: ${type}`);
        }

        return res.status(200).json({ success: true });

        
    } catch (error: any) {
        console.error("WEBHOOK ERROR:", error);
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
});

export default router;
