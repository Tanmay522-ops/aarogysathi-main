import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import registerRouter from "./routes/register.route";
import webhookRoutes from "./routes/webhooks.routes";
import patientRouter from "./routes/patient.route";

const app = express();

// CORS
app.use(cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
}));

// Clerk middleware
app.use(clerkMiddleware());

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: Date.now(),
    });
});

// Webhooks — **must use raw body** for signature verification
app.use("/webhooks", express.raw({ type: "application/json" }), webhookRoutes);

// JSON parser for all other routes
app.use(express.json());
app.use("/register", registerRouter);
app.use("/patients",patientRouter);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global Error Handler:", err);
    return res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});

app.listen(8000, () => {
    console.log("Auth Service is running on port 8000");
});
