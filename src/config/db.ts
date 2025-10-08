import mongoose from "mongoose"

const connectToMongoDb=async (url:string)=>{
    try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Re-throw to be handled by the calling function
  }
}

export default connectToMongoDb;