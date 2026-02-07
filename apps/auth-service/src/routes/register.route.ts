import { Request, Response, Router } from "express";
import multer from "multer";
import { shouldBeUser } from "../middleware/authMiddleware";
import { prisma } from "@repo/auth-db";
import cloudinary from "../lib/cloudinary";
import { clerkClient } from "@clerk/express";

const router: Router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(_, file, cb) {
        const allowed = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowed.includes(file.mimetype)) {
            cb(new Error("Only JPG, PNG or PDF allowed"));
            return;
        }
        cb(null, true);
    },
});

router.post("/", shouldBeUser, upload.single("identificationDocument"), async (req: Request, res: Response) => {
    try {
        const clerkId = req.userId!;

        console.log("Registering patient for clerkId:", clerkId);

        // ✅ EXTRACT abhaId FIRST - before using it
        const {
            abhaId,
            phone,
            birthDate,
            gender,
            address,
            occupation,
            emergencyContactName,
            emergencyContactNumber,
            primaryPhysician,
            insuranceProvider,
            insurancePolicyNumber,
            allergies,
            currentMedication,
            familyMedicalHistory,
            pastMedicalHistory,
            identificationType,
            identificationNumber,
            treatmentConsent,
            disclosureConsent,
            privacyConsent,
        } = req.body;

        const clerkUser = await clerkClient.users.getUser(clerkId);
        const userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";

        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        let user;

        if (existingUserByEmail && existingUserByEmail.clerkId !== clerkId) {
            return res.status(409).json({
                error: "This email is already registered with a different account. Please contact support."
            });
        }

        // ✅ NOW you can use abhaId here
        user = await prisma.user.upsert({
            where: { clerkId },
            update: {
                name: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}` || "User",
                email: userEmail,
                abhaId: abhaId || null,
            },
            create: {
                clerkId,
                name: clerkUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}` || "User",
                email: userEmail,
                abhaId: abhaId || null,
            },
        });

        console.log("✅ User ensured:", user.id);

        // Check if patient already exists
        const existingPatient = await prisma.patient.findUnique({
            where: { userId: user.id },
        });

        if (existingPatient) {
            return res.status(409).json({ error: "Patient profile already exists" });
        }

        // Upload ID document to Cloudinary if exists
        let documentUrl: string | null = null;
        if (req.file) {
            const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { folder: "aarogya/patient-documents", resource_type: "auto" },
                        (error, result) => (error ? reject(error) : resolve(result))
                    )
                    .end(req.file!.buffer);
            });
            documentUrl = uploadResult.secure_url;
        }

        // Create Patient record in Prisma
        const patient = await prisma.patient.create({
            data: {
                userId: user.id,
                phone,
                birthDate: new Date(birthDate),
                gender,
                address,
                occupation,
                emergencyContactName,
                emergencyContactNumber,
                primaryPhysician,
                insuranceProvider,
                insurancePolicyNumber,
                allergies,
                currentMedication,
                familyMedicalHistory,
                pastMedicalHistory,
                identificationType,
                identificationNumber,
                identificationDocumentUrl: documentUrl,
                treatmentConsent: treatmentConsent === "true",
                disclosureConsent: disclosureConsent === "true",
                privacyConsent: privacyConsent === "true",
            },
        });

        res.status(201).json({ success: true, patientId: patient.id });
    } catch (error: any) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
});

export default router;