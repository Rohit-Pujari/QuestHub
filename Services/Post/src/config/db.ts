import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongourl = process.env.POST_DATABASE_URL;
        await mongoose.connect(mongourl || "mongodb://localhost:27017/post",{
        connectTimeoutMS:30000
        });
    } catch (error) {
        console.log(error);
    }
};