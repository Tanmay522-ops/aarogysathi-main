import express, {Request,Response} from 'express';
import cors from 'cors';
import { clerkMiddleware, getAuth } from '@clerk/express'
import { shouldBeUser } from './middleware/authMiddleware.js';
import registerRouter from "./routes/register.route"

const app = express();
app.use(
    cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true
}));

app.use(clerkMiddleware())


app.get('/health', (req:Request, res:Response) => {  
    return res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timeStamp: Date.now(),
    })
}); 

app.get("/test",shouldBeUser, (req:Request, res:Response) => {   
    res.json({
        message:"Auth service is authenticated successfully!",
        userId: req.userId,
    });
})

app.use("/register",registerRouter)


app.listen(8000,()=>{
    console.log("Auth Service is running on port 8000");
})