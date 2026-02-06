import { Router } from "express";

const router:Router = Router();

router.get("/test",(req,res)=>{
    res.json({message:"it works!"})
})

export default router;