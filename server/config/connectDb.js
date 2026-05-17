import mongoose from "mongoose";

const connectDb = async () =>{
    try{
       await mongoose.connect(process.env.MONGODB_URL, {
           serverSelectionTimeoutMS: 5000,
           socketTimeoutMS: 45000,
           retryWrites: true,
       })
       console.log("✓ Database Connected Successfully")
    }catch (error) {
        console.log(`✗ Database Connection Error:`)
        console.log(`  Error: ${error.message}`)
        console.log(`  Code: ${error.code}`)
        if(error.reason) console.log(`  Reason: ${error.reason.message}`)
        console.log(`  MongoDB URL configured: ${process.env.MONGODB_URL ? "Yes" : "No"}`)
    }
}

export default connectDb
