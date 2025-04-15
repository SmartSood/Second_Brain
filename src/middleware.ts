import dotenv from 'dotenv'
import { NextFunction,Request,Response } from "express";

dotenv.config();
const JWT_PASSWORD=process.env.JWT_PASSWORD||"default";

import jwt from "jsonwebtoken";
export const userMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const header=req.headers["token"];
    const decoded=jwt.verify(header as string,JWT_PASSWORD)
    if(decoded){
        //@ts-ignore
        req.userId=decoded.id;
        next();


    }else{
        res.status(403).json({message:"You are not Logged in"});
    }
}