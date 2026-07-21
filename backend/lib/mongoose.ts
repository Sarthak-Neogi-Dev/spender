import mongoose, { mongo } from 'mongoose';
import 'dotenv/config';

export default async function connectDB(){
    try{
        const uri = process.env.MONGO_URI;
        if(uri){
            await mongoose.connect(uri);
            console.log("Connected to MongoDB");
        }
        else{
            console.log("MongoDB URI not found!");
        }
    }
    catch{
        console.log("Error Occured");
    }
}