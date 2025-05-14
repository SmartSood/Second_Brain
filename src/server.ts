import  express  from "express";
import mongoose from "mongoose";
import {UserModel,ContentModel,LinkModel} from "./db";
import dotenv from 'dotenv';
import  jwt  from "jsonwebtoken";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

import cors from "cors";


//declaring env vars
dotenv.config()
const JWT_PASSWORD=process.env.JWT_PASSWORD||"default"


//starting the app and initializing json
const app=express();
app.use(express.json());

app.use(cors())

app.post("/api/v1/signup",(req,res)=>{
const username=req.body.username;
const email=req.body.email;
const password=req.body.password;
console.log(req.body);


UserModel.create({
    username:username,
    email:email,
    password:password
}).then(()=>res.json({
    message:"UserSignedup"
})).catch((e)=>{
    res.status(411).json({message:"User already exist"})
})


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
    const title=req.body.title;
  await ContentModel.create({
        link:link,
        type:type,
        title:title,
        //@ts-ignore
        userId:req.userId,
        tags:[]
    })
     res.json({
        message:"content added",

    })
})

app.get("/api/v1/content",userMiddleware,async (req,res)=>{
    //@ts-ignore
    const userId=req.userId;
    console.log(userId)
    const content=await ContentModel.find({userId}).populate("userId","username")
    
    res.json(content)

    
})
app.post("/api/v1/content/delete",userMiddleware,async (req,res)=>{
    const _id=req.body.id;
    console.log(_id);
    const content=await ContentModel.findById(_id);
    if(!content){
        res.status(411).json({
            message:"No content found"
        })
        return;
    }
    await content.deleteOne(
        {
            _id:_id
        }
    );
    res.json({
        message:"Content deleted"
    })

})

app.post("/api/v1/brain/share",userMiddleware,async (req,res)=>{
    const {share}=req.body;
    if(share){
      const exiting_link=  await LinkModel.findOne({
            //@ts-ignore
            userId:req.userId
        })
        if(exiting_link){
            res.json({
                hash: exiting_link.hash
            })
            return;
        }
        
        const hash=random(10);
        console.log(hash);
    await    LinkModel.create({
            hash:hash,
            //@ts-ignore
            userId:req.userId
        })

        res.json({
            hash:hash   
        })
    }
    else{
       await LinkModel.deleteOne({
            //@ts-ignore
            userId:req.userId
        })
        
    }
    res.json({
        mssg:"link deleted"
    })

})


app.get("/api/v1/brain/:shareLink",async (req,res)=>{
    const hash=req.params.shareLink;
    console.log(hash)
    const link=await LinkModel.findOne({
        hash:hash
    })
    if(!link){
        res.status(411).json({
            message:"Invalid Link"
        })
        return;
    }
//populate syntax
    const content=await ContentModel.find({
        userId:link.userId
    }).populate("userId","username")


    if(!content){
        res.status(411).json({
            message:"No content found"
        })
        return;
    }
    res.json(
        content
    )
})

app.listen(3000, () => {
    console.log(`✅ Server started on port ${3000}`);
  });


//connecting to the database
