import Fastify from "fastify";
import { clerkPlugin } from '@clerk/fastify'
import {  shouldBeUser } from "./middleware/authMiddleware";
import appointmentRoutes from "./routes/appointement.route";
import cors from "@fastify/cors";  
import doctorRoutes from "./routes/doctor.route";
import multipart from "@fastify/multipart";


const fastify = Fastify({logger: true})

fastify.register(cors, {
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,

});

fastify.register(multipart, {
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
fastify.register(clerkPlugin);

fastify.get("/health", (request, reply) => {
    return reply.status(200).send({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    })
})

fastify.get("/test", { preHandler: shouldBeUser }, (request, reply) => {
    return reply.status(200).send({
        message: "Appointment service is authenticated successfully!",
        userId: request.userId,
    })
})

fastify.register(appointmentRoutes, { prefix: "/appointments" })
fastify.register(doctorRoutes, { prefix: "/doctors" }) 

const start = async () => {
    try {
        await fastify.listen({ port: 8001 })
        console.log("Appointment service is running on port 8001")
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
