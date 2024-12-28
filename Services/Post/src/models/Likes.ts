import mongoose from "mongoose";
import { on } from 'events';

export interface ILike{
    on: string,
    likedBy: string,
    onModel: string
}

const likeschema = new mongoose.Schema({
    onModel:{
        type: String,
        enum: ["Post", "Comment"],
        required: true
    },
    on: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'onModel',
        required: true
    },
    likedBy:{
        type: String,
        required: true
    }
},{timestamps: true})

const Like = mongoose.model<ILike>("Like", likeschema);

export default Like;