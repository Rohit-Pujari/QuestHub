import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongourl = process.env.POST_DATABASE_URL;
        await mongoose.connect(mongourl!,{
        connectTimeoutMS:30000
        });
    } catch (error) {
        console.log(error);
    }
};