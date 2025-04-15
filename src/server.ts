import  express  from "express";
import mongoose from "mongoose";
import {UserModel,ContentModel} from "./db";
import dotenv from 'dotenv';
import  jwt  from "jsonwebtoken";
import { userMiddleware } from "./middleware";



//declaring env vars
dotenv.config()
const JWT_PASSWORD=process.env.JWT_PASSWORD||"default"


//starting the app and initializing json
const app=express();
app.use(express.json());



app.post("/api/v1/signup",(req,res)=>{
const username=req.body.username;
const email=req.body.email;
const password=req.body.password;

try{
UserModel.create({
    username:username,
    email:email,
    password:password
})

res.json({
    message:"USerSignedup"
})
}
catch(e){
    res.status(411).json({message:"User already exist"})
}
})

app.post("/api/v1/signin",async (req,res)=>{
    const email=req.body.email;
const password=req.body.password;
const existinguser= await UserModel.findOne({
    email:email,
   password: password
}
)
if(existinguser){
    const token=jwt.sign({
        id:existinguser._id
    },JWT_PASSWORD)
    res.json({token})
}
else{
    res.status(401).json({message:"Invalid email or password"})
}
})

app.post("/api/v1/content",userMiddleware,async (req,res)=>{
    const link=req.body.link;
    const type=req.body.type;
   await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId:req.userId,
        tags:[]
    })
     res.json({
        message:"content added"
    })
})

app.get("/api/v1/content",async (req,res)=>{
    //@ts-ignore
    const userId=req.userId;
    const content=await ContentModel.findOne(userId).populate("userId","username")
    
    res.json(content)

    
})
app.delete("/api/v1/content",(req,res)=>{
    
})

app.post("/api/v1/brain/share",(req,res)=>{
    
})


app.post("/api/v1/brain/:shareLink",(req,res)=>{
    
})

app.listen(3000, () => {
    console.log(`✅ Server started on port ${3000}`);
  });


//connecting to the database
