import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGOOSE_URI;
if (!uri) {
  console.error("❌ MONGOOSE_URI is not defined in the environment variables.");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define a TypeScript interface
interface IUser extends Document {
  username: string;
  password?: string;
  email: string;
}

// Create the schema
const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: String,
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

// Correct way to create a model
const UserModel = mongoose.model<IUser>('User', UserSchema);



const ContentSchema=new Schema({
  title:String,
  link:String,
  type:String,
  tags:[{type:mongoose.Types.ObjectId,ref:'Tag'}],
  userId:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true,
  }
})


const LinkSchema=new Schema({
  hash:String,
  userId:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true
  }
})

const LinkModel=mongoose.model("Links",LinkSchema);
const ContentModel=mongoose.model('Content',ContentSchema);
export {UserModel,ContentModel,LinkModel};

