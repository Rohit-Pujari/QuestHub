import mongoose from "mongoose";

export interface ILike{
    on: string,
    likedBy: string,
}

const likeschema = new mongoose.Schema({
    on: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    likedBy:{
        type: String,
        required: true
    }
},{timestamps: true})

const Like = mongoose.model<ILike>("Like", likeschema);

export default Like;