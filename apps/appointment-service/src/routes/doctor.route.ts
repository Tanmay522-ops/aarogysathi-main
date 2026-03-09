import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { shouldBeUser, shouldBeAdmin } from "../middleware/authMiddleware";
import { prisma } from "@repo/appointment-db";
import { MultipartFile } from "@fastify/multipart";
import { uploadToCloudinary } from "../lib/cloudinary";

interface CreateDoctorBody {
    clerkId: string;
    name: string;
    email: string;
    phone: string;
    image?: string;
    specialization: string;
    qualification: string;
    licenseNumber: string;
    experience: string;
    consultationFee: string;
    address: string;
    availability: string;
    about?: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    licenseDocumentUrl?: string;
}

interface DoctorRegisterBody {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    qualification: string;
    licenseNumber: string;
    experience: string;
    consultationFee: string;
    address: string;
    availability: string;
    about?: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
}

interface UpdateDoctorBody {
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
    specialization?: string;
    qualification?: string;
    licenseNumber?: string;
    experience?: string;
    consultationFee?: string;
    address?: string;
    availability?: string;
    about?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    isActive?: boolean;
    isVerified?: boolean;
}

interface DoctorParams {
    id: string;
}

export default async function doctorRoutes(fastify: FastifyInstance) {

    // ==================== SPECIFIC ROUTES FIRST ====================

    fastify.post<{ Body: DoctorRegisterBody }>(
        "/register",
        {
            preHandler: shouldBeUser,
        },
        async (request:FastifyRequest, reply:FastifyReply) => {
            try {
                fastify.log.info("=== REGISTRATION START ===");

                const { userId: clerkUserId } = request;
                fastify.log.info(`ClerkUserId: ${clerkUserId}`);

                if (!clerkUserId) {
                    return reply.code(401).send({ error: "Unauthorized" });
                }

                fastify.log.info("Starting to parse multipart data...");
                const parts = request.parts();

                let body: any = {};
                let licenseBuffer: Buffer | null = null;
                let profileImageBuffer: Buffer | null = null;

                for await (const part of parts) {
                    fastify.log.info(`Processing part: ${part.type} - ${part.fieldname}`);

                    if (part.type === "file") {
                        if (part.fieldname === "licenseDocument") {
                            fastify.log.info(`License document mime: ${part.mimetype}`);

                            if (
                                !["image/jpeg", "image/png", "application/pdf"].includes(
                                    part.mimetype
                                )
                            ) {
                                return reply.code(400).send({
                                    error: "Only JPG, PNG or PDF allowed",
                                });
                            }

                            if (part.file.truncated) {
                                return reply
                                    .code(400)
                                    .send({ error: "License file too large" });
                            }

                            // ✅ Convert to buffer IMMEDIATELY
                            fastify.log.info("Converting license to buffer...");
                            licenseBuffer = await part.toBuffer();
                            fastify.log.info(`License buffer created: ${licenseBuffer.length} bytes`);

                        } else if (part.fieldname === "profileImage") {
                            fastify.log.info(`Profile image mime: ${part.mimetype}`);

                            if (
                                !["image/jpeg", "image/png"].includes(part.mimetype)
                            ) {
                                return reply.code(400).send({
                                    error: "Only JPG or PNG allowed for profile image",
                                });
                            }

                            if (part.file.truncated) {
                                return reply
                                    .code(400)
                                    .send({ error: "Profile image too large" });
                            }

                            // ✅ Convert to buffer IMMEDIATELY
                            fastify.log.info("Converting profile image to buffer...");
                            profileImageBuffer = await part.toBuffer();
                            fastify.log.info(`Profile image buffer created: ${profileImageBuffer.length} bytes`);

                        } else {
                            // ✅ CRITICAL: Consume any unknown files
                            fastify.log.info(`Consuming unknown file: ${part.fieldname}`);
                            await part.toBuffer();
                        }
                    } else {
                        body[part.fieldname] = part.value;
                    }
                }

                fastify.log.info("✅ Multipart parsing COMPLETE");
                fastify.log.info(`Body fields: ${JSON.stringify(Object.keys(body))}`);
                fastify.log.info(`Has license buffer: ${!!licenseBuffer}`);
                fastify.log.info(`Has profile image buffer: ${!!profileImageBuffer}`);

                const {
                    name,
                    email,
                    phone,
                    specialization,
                    qualification,
                    licenseNumber,
                    experience,
                    consultationFee,
                    address,
                    availability,
                    about,
                    emergencyContactName,
                    emergencyContactNumber,
                } = body as DoctorRegisterBody;

                // Validate required fields
                if (!name || !email || !phone || !specialization || !qualification || !licenseNumber) {
                    fastify.log.error("Missing required fields");
                    return reply.code(400).send({
                        error: "Missing required Fields",
                    });
                }

                if (!licenseBuffer) {
                    fastify.log.error("No license file uploaded");
                    return reply.code(400).send({
                        error: "License document is required",
                    });
                }

                fastify.log.info("Validating availability date...");
                const availabilityDate = new Date(availability);

                if (isNaN(availabilityDate.getTime())) {
                    return reply
                        .code(400)
                        .send({ error: "Invalid availability date" });
                }

                // Upload buffers to Cloudinary
                fastify.log.info("Uploading license to Cloudinary...");
                const licenseUrl = await uploadToCloudinary(licenseBuffer);
                fastify.log.info(`License uploaded: ${licenseUrl}`);

                let profileImageUrl = "/doctors/default.png";
                if (profileImageBuffer) {
                    fastify.log.info("Uploading profile image to Cloudinary...");
                    profileImageUrl = await uploadToCloudinary(profileImageBuffer);
                    fastify.log.info(`Profile image uploaded: ${profileImageUrl}`);
                }

                fastify.log.info("Checking for existing records...");
                const [existingDoctor, existingEmail, existingLicense] =
                    await Promise.all([
                        prisma.doctor.findUnique({ where: { clerkId: clerkUserId } }),
                        prisma.doctor.findUnique({ where: { email } }),
                        prisma.doctor.findUnique({ where: { licenseNumber } }),
                    ]);

                if (existingDoctor) {
                    return reply.code(409).send({
                        error: "Doctor profile already exists for this account",
                    });
                }

                if (existingEmail) {
                    return reply
                        .code(409)
                        .send({ error: "Email already registered" });
                }

                if (existingLicense) {
                    return reply
                        .code(409)
                        .send({ error: "License already registered" });
                }

                fastify.log.info("Creating doctor record...");
                const doctor = await prisma.doctor.create({
                    data: {
                        clerkId: clerkUserId,
                        name,
                        email,
                        phone,
                        specialization,
                        qualification,
                        licenseNumber,
                        experience: parseInt(experience) || 0,
                        consultationFee: parseFloat(consultationFee) || 0,
                        address,
                        availability: new Date(availability),
                        about: about || null,
                        emergencyContactName,
                        emergencyContactNumber,
                        licenseDocumentUrl: licenseUrl,
                        image: profileImageUrl,
                        isActive: false,
                        isVerified: false,
                    },
                });
                fastify.log.info(`✅ Doctor created successfully: ${doctor.id}`);
                return reply.code(201).send({
                    doctor,
                    message: "Registration successful! Your profile is pending admin approval."
                });
            } catch (error) {
                fastify.log.error("=== REGISTRATION ERROR ===");
                fastify.log.error(error);
                return reply.code(500).send({ error: "Failed to register doctor" });
            }
        }
    );

    // ==================== GET CURRENT DOCTOR (Me) ====================
    fastify.get(
        "/me",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const { userId: clerkUserId } = request;

                if (!clerkUserId) {
                    return reply.code(401).send({ error: "Unauthorized" });
                }

                const doctor = await prisma.doctor.findUnique({
                    where: { clerkId: clerkUserId },
                    include: {
                        appointments: {
                            orderBy: { schedule: "desc" },
                            take: 10,
                        },
                    },
                });

                if (!doctor) {
                    return reply.code(404).send({
                        error: "Doctor profile not found. Please complete registration."
                    });
                }

                return reply.send({ doctor });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== GET ACTIVE DOCTORS (Public) ====================
    fastify.get(
        "/active",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const doctors = await prisma.doctor.findMany({
                    where: {
                        isActive: true,
                        isVerified: true,
                    },
                    orderBy: { name: "asc" },
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        specialization: true,
                        qualification: true,
                        experience: true,
                        consultationFee: true,
                        availability: true,
                        about: true,
                    },
                });

                return reply.send({ doctors });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== SEARCH DOCTORS ====================
    fastify.get(
        "/search",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const { q, specialization } = request.query as {
                    q?: string;
                    specialization?: string;
                };

                const where: any = {
                    isActive: true,
                    isVerified: true,
                };

                if (q) {
                    where.OR = [
                        { name: { contains: q, mode: "insensitive" } },
                        { specialization: { contains: q, mode: "insensitive" } },
                        { qualification: { contains: q, mode: "insensitive" } },
                    ];
                }

                if (specialization) {
                    where.specialization = {
                        contains: specialization,
                        mode: "insensitive",
                    };
                }

                const doctors = await prisma.doctor.findMany({
                    where,
                    orderBy: { name: "asc" },
                });

                return reply.send({ doctors });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== GET DOCTOR STATS (Admin Only) ====================
    fastify.get(
        "/stats",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const [total, active, inactive, verified, pending] = await Promise.all([
                    prisma.doctor.count(),
                    prisma.doctor.count({ where: { isActive: true } }),
                    prisma.doctor.count({ where: { isActive: false } }),
                    prisma.doctor.count({ where: { isVerified: true } }),
                    prisma.doctor.count({ where: { isVerified: false } }),
                ]);

                const doctorsWithAppointments = await prisma.doctor.findMany({
                    include: {
                        _count: {
                            select: { appointments: true },
                        },
                    },
                    orderBy: {
                        appointments: {
                            _count: "desc",
                        },
                    },
                    take: 5,
                });

                return reply.send({
                    stats: {
                        total,
                        active,
                        inactive,
                        verified,
                        pendingVerification: pending,
                        topDoctors: doctorsWithAppointments.map((d) => ({
                            id: d.id,
                            name: d.name,
                            specialization: d.specialization,
                            appointmentCount: d._count.appointments,
                        })),
                    },
                });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== GENERIC / ROOT ROUTES ====================

    // ==================== CREATE DOCTOR (Admin Only) ====================
    fastify.post<{ Body: CreateDoctorBody }>(
        "/",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const {
                    clerkId,
                    name,
                    email,
                    phone,
                    image,
                    specialization,
                    qualification,
                    licenseNumber,
                    experience,
                    consultationFee,
                    address,
                    availability,
                    about,
                    emergencyContactName,
                    emergencyContactNumber,
                    licenseDocumentUrl,
                } = request.body;

                if (!clerkId || !name || !email || !phone || !specialization || !qualification || !licenseNumber) {
                    return reply.code(400).send({
                        error: "All required fields must be provided",
                    });
                }

                const existingDoctor = await prisma.doctor.findUnique({
                    where: { clerkId },
                });

                if (existingDoctor) {
                    return reply.code(409).send({
                        error: "Doctor with this Clerk ID already exists",
                    });
                }

                const doctor = await prisma.doctor.create({
                    data: {
                        clerkId,
                        name,
                        email,
                        phone,
                        image: image || "/doctors/default.png",
                        specialization,
                        qualification,
                        licenseNumber,
                        experience: parseInt(experience) || 0,
                        consultationFee: parseFloat(consultationFee) || 0,
                        address,
                        availability: new Date(availability),
                        about: about || null,
                        emergencyContactName,
                        emergencyContactNumber,
                        licenseDocumentUrl: licenseDocumentUrl || null,
                        isActive: true,
                        isVerified: true,
                    },
                });

                return reply.code(201).send({ doctor });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== GET ALL DOCTORS ====================
    fastify.get(
        "/",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const { active, verified } = request.query as {
                    active?: string;
                    verified?: string;
                };

                const where: any = {};

                if (active !== undefined) {
                    where.isActive = active === "true";
                }

                if (verified !== undefined) {
                    where.isVerified = verified === "true";
                }

                const doctors = await prisma.doctor.findMany({
                    where,
                    orderBy: { name: "asc" },
                    include: {
                        appointments: {
                            select: {
                                id: true,
                                schedule: true,
                                status: true,
                            },
                        },
                    },
                });

                return reply.send({ doctors });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== PARAMETERIZED ROUTES (MUST BE LAST) ====================

    // ==================== GET DOCTOR BY CLERK ID ====================
    fastify.get<{ Params: { clerkId: string } }>(
        "/clerk/:clerkId",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const { clerkId } = request.params;

                const doctor = await prisma.doctor.findUnique({
                    where: { clerkId },
                    include: {
                        appointments: {
                            orderBy: { schedule: "desc" },
                        },
                    },
                });

                if (!doctor) {
                    return reply.code(404).send({ error: "Doctor not found" });
                }

                return reply.send({ doctor });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== VERIFY DOCTOR (Admin Only) ====================
    fastify.patch<{ Params: DoctorParams }>(
        "/:id/verify",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

                const doctor = await prisma.doctor.findUnique({
                    where: { id },
                });

                if (!doctor) {
                    return reply.code(404).send({ error: "Doctor not found" });
                }

                const updatedDoctor = await prisma.doctor.update({
                    where: { id },
                    data: {
                        isVerified: true,
                        isActive: true,
                    },
                });

                return reply.send({
                    doctor: updatedDoctor,
                    message: "Doctor verified and activated successfully"
                });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== TOGGLE DOCTOR ACTIVE STATUS ====================
    fastify.patch<{ Params: DoctorParams }>(
        "/:id/toggle-active",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

                const doctor = await prisma.doctor.findUnique({
                    where: { id },
                });

                if (!doctor) {
                    return reply.code(404).send({ error: "Doctor not found" });
                }

                const updatedDoctor = await prisma.doctor.update({
                    where: { id },
                    data: {
                        isActive: !doctor.isActive,
                    },
                });

                return reply.send({ doctor: updatedDoctor });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== GET DOCTOR BY ID ====================
    fastify.get<{ Params: DoctorParams }>(
        "/:id",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

                const doctor = await prisma.doctor.findUnique({
                    where: { id },
                    include: {
                        appointments: {
                            orderBy: { schedule: "desc" },
                            take: 10,
                        },
                    },
                });

                if (!doctor) {
                    return reply.code(404).send({ error: "Doctor not found" });
                }

                return reply.send({ doctor });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== UPDATE DOCTOR ====================
    fastify.patch<{ Params: DoctorParams; Body: UpdateDoctorBody }>(
        "/:id",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;
                const updateData = request.body;

                const existingDoctor = await prisma.doctor.findUnique({
                    where: { id },
                });

                if (!existingDoctor) {
                    return reply.code(404).send({ error: "Doctor not found" });
                }

                const transformedData: any = { ...updateData };

                if (updateData.experience) {
                    transformedData.experience = parseInt(updateData.experience);
                }

                if (updateData.consultationFee) {
                    transformedData.consultationFee = parseFloat(updateData.consultationFee);
                }

                if (updateData.availability) {
                    transformedData.availability = new Date(updateData.availability);
                }

                const doctor = await prisma.doctor.update({
                    where: { id },
                    data: transformedData,
                });

                return reply.send({ doctor });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== DELETE DOCTOR (Soft Delete) ====================
    fastify.delete<{ Params: DoctorParams }>(
        "/:id",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

                const appointmentCount = await prisma.appointment.count({
                    where: { doctorId: id },
                });

                if (appointmentCount > 0) {
                    await prisma.doctor.update({
                        where: { id },
                        data: { isActive: false },
                    });

                    return reply.send({
                        message:
                            "Doctor deactivated (has existing appointments). Use toggle-active to reactivate.",
                    });
                } else {
                    await prisma.doctor.delete({
                        where: { id },
                    });

                    return reply.send({ message: "Doctor deleted successfully" });
                }
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );
}