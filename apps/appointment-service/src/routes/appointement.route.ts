import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { shouldBeUser, shouldBeAdmin } from "../middleware/authMiddleware";
import { getAuth } from "@clerk/fastify";
import { CustomJwtSessionClaims } from "../types";
import { AppointmentStatus, prisma } from "@repo/appointment-db";

interface CreateAppointmentBody {
    userId: string;
    patientId: string;
    doctorId: string;
    schedule: string;
    reason?: string;
    note?: string;
    status?: AppointmentStatus;
}

interface UpdateAppointmentBody {
    schedule?: string;
    reason?: string;
    note?: string;
    status?: AppointmentStatus;
}

interface CancelAppointmentBody {
    cancellationReason: string;
}

interface ScheduleAppointmentBody {
    schedule?: string;
    note?: string;
}

interface AppointmentParams {
    id: string;
}

// Authorization helpers
const isAdmin = (request: FastifyRequest): boolean => {
    const auth = getAuth(request);
    const claims = auth.sessionClaims as CustomJwtSessionClaims;
    return claims?.metadata?.role === "admin";
};

const canAccessAppointment = async (
    request: FastifyRequest,
    appointmentId: string
): Promise<boolean> => {
    const userId = request.userId;

    if (!userId) return false;

    // Admins can access any appointment
    if (isAdmin(request)) return true;

    // Check if appointment belongs to user
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
    });

    return appointment?.userId === userId;
};

export default async function appointmentRoutes(fastify: FastifyInstance) {
    // ==================== CREATE APPOINTMENT ====================
    fastify.post<{ Body: CreateAppointmentBody }>(
        "/",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const userId = request.userId!;

                const {
                    patientId,
                    doctorId,
                    schedule,
                    reason,
                    note,
                    status = "PENDING" as AppointmentStatus,
                } = request.body;

                // Validate required fields
                if (!patientId || !doctorId || !schedule) {
                    return reply.code(400).send({
                        error: "Patient ID, doctor ID, and schedule are required",
                    });
                }

                // Verify doctor exists and is active
                const doctor = await prisma.doctor.findUnique({
                    where: { id: doctorId },
                });

                if (!doctor) {
                    return reply.code(404).send({ error: "Doctor not found" });
                }

                if (!doctor.isActive || !doctor.isVerified) {
                    return reply.code(400).send({
                        error: "Doctor is not available for appointments",
                    });
                }

                const appointment = await prisma.appointment.create({
                    data: {
                        userId,
                        patientId,
                        doctorId,
                        schedule: new Date(schedule),
                        reason: reason || null,
                        note: note || null,
                        status,
                    },
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                specialization: true,
                            },
                        },
                    },
                });

                return reply.code(201).send({ appointment });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== GET ALL APPOINTMENTS ====================
    fastify.get(
        "/",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const userId = request.userId!;
                const { status, patientId } = request.query as {
                    status?: AppointmentStatus;
                    patientId?: string;
                };

                let whereClause: any = {};

                if (isAdmin(request)) {
                    // Admins can filter by status and patientId
                    if (status) whereClause.status = status;
                    if (patientId) whereClause.patientId = patientId;
                } else {
                    // Regular users see only their appointments
                    whereClause.userId = userId;
                    if (status) whereClause.status = status;
                }

                const appointments = await prisma.appointment.findMany({
                    where: whereClause,
                    orderBy: { schedule: "desc" },
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                specialization: true,
                            },
                        },
                    },
                });

                return reply.send({ appointments });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== GET APPOINTMENT BY ID ====================
    fastify.get<{ Params: AppointmentParams }>(
        "/:id",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

                const hasAccess = await canAccessAppointment(request, id);
                if (!hasAccess) {
                    return reply.code(403).send({ error: "Unauthorized access" });
                }

                const appointment = await prisma.appointment.findUnique({
                    where: { id },
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                specialization: true,
                                consultationFee: true,
                            },
                        },
                    },
                });

                if (!appointment) {
                    return reply.code(404).send({ error: "Appointment not found" });
                }

                return reply.send({ appointment });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== GET APPOINTMENTS BY PATIENT ====================
    fastify.get<{ Params: { patientId: string } }>(
        "/patient/:patientId",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const userId = request.userId!;
                const { patientId } = request.params;

                const whereClause: any = { patientId };

                // If not admin, ensure they can only see their own appointments
                if (!isAdmin(request)) {
                    whereClause.userId = userId;
                }

                const appointments = await prisma.appointment.findMany({
                    where: whereClause,
                    orderBy: { schedule: "desc" },
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                specialization: true,
                            },
                        },
                    },
                });

                return reply.send({ appointments });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== UPDATE APPOINTMENT ====================
    fastify.patch<{ Params: AppointmentParams; Body: UpdateAppointmentBody }>(
        "/:id",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;
                const { schedule, reason, note, status } = request.body;

                const updateData: any = {};
                if (schedule) updateData.schedule = new Date(schedule);
                if (reason !== undefined) updateData.reason = reason;
                if (note !== undefined) updateData.note = note;
                if (status) updateData.status = status;

                const appointment = await prisma.appointment.update({
                    where: { id },
                    data: updateData,
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                specialization: true,
                            },
                        },
                    },
                });

                return reply.send({ appointment });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== CANCEL APPOINTMENT ====================
    fastify.patch<{ Params: AppointmentParams; Body: CancelAppointmentBody }>(
        "/:id/cancel",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;
                const { cancellationReason } = request.body;

                if (!cancellationReason) {
                    return reply.code(400).send({
                        error: "Cancellation reason is required",
                    });
                }

                const hasAccess = await canAccessAppointment(request, id);
                if (!hasAccess) {
                    return reply.code(403).send({ error: "Unauthorized access" });
                }

                const appointment = await prisma.appointment.update({
                    where: { id },
                    data: {
                        status: "CANCELLED" as AppointmentStatus,
                        cancellationReason,
                    },
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                });

                return reply.send({ appointment });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== SCHEDULE APPOINTMENT (Admin Only) ====================
    fastify.patch<{ Params: AppointmentParams; Body: ScheduleAppointmentBody }>(
        "/:id/schedule",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;
                const { schedule, note } = request.body;

                const updateData: any = {
                    status: "SCHEDULED" as AppointmentStatus,
                };

                if (schedule) updateData.schedule = new Date(schedule);
                if (note !== undefined) updateData.note = note;

                const appointment = await prisma.appointment.update({
                    where: { id },
                    data: updateData,
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                specialization: true,
                            },
                        },
                    },
                });

                return reply.send({ appointment });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== CONFIRM APPOINTMENT (Admin Only) ====================
    fastify.patch<{ Params: AppointmentParams }>(
        "/:id/confirm",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

                const appointment = await prisma.appointment.update({
                    where: { id },
                    data: {
                        status: "CONFIRMED" as AppointmentStatus,
                    },
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                });

                return reply.send({ appointment });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== COMPLETE APPOINTMENT (Admin Only) ====================
    fastify.patch<{ Params: AppointmentParams }>(
        "/:id/complete",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

                const appointment = await prisma.appointment.update({
                    where: { id },
                    data: {
                        status: "COMPLETED" as AppointmentStatus,
                    },
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                });

                return reply.send({ appointment });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== MARK AS NO SHOW (Admin Only) ====================
    fastify.patch<{ Params: AppointmentParams }>(
        "/:id/no-show",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

                const appointment = await prisma.appointment.update({
                    where: { id },
                    data: {
                        status: "NO_SHOW" as AppointmentStatus,
                    },
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                });

                return reply.send({ appointment });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== DELETE APPOINTMENT ====================
    fastify.delete<{ Params: AppointmentParams }>(
        "/:id",
        {
            preHandler: shouldBeUser,
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

                const hasAccess = await canAccessAppointment(request, id);
                if (!hasAccess) {
                    return reply.code(403).send({ error: "Unauthorized access" });
                }

                await prisma.appointment.delete({
                    where: { id },
                });

                return reply.send({ message: "Appointment deleted successfully" });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );

    // ==================== GET APPOINTMENT STATS (Admin Only) ====================
    fastify.get(
        "/stats",
        {
            preHandler: shouldBeAdmin,
        },
        async (request, reply) => {
            try {
                const [pending, scheduled, confirmed, cancelled, completed, noShow, total] =
                    await Promise.all([
                        prisma.appointment.count({
                            where: { status: "PENDING" as AppointmentStatus },
                        }),
                        prisma.appointment.count({
                            where: { status: "SCHEDULED" as AppointmentStatus },
                        }),
                        prisma.appointment.count({
                            where: { status: "CONFIRMED" as AppointmentStatus },
                        }),
                        prisma.appointment.count({
                            where: { status: "CANCELLED" as AppointmentStatus },
                        }),
                        prisma.appointment.count({
                            where: { status: "COMPLETED" as AppointmentStatus },
                        }),
                        prisma.appointment.count({
                            where: { status: "NO_SHOW" as AppointmentStatus },
                        }),
                        prisma.appointment.count(),
                    ]);

                return reply.send({
                    stats: {
                        pending,
                        scheduled,
                        confirmed,
                        cancelled,
                        completed,
                        noShow,
                        total,
                    },
                });
            } catch (error) {
                fastify.log.error(error);
                return reply.code(500).send({ error: "Internal server error" });
            }
        }
    );
}