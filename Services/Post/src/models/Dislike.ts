import mongoose from "mongoose";

export interface IDislike{
    on: string,
    dislikedBy: string,
}

const dislikeschema = new mongoose.Schema({
    onModel:{
        type: String,
        required: true,
        enum: ["Post", "Comment"]
    },
    on: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'onModel',
        required: true
    },
    dislikedBy: {
        type: String,
        required: true
    }
},{timestamps: true})

const Dislike = mongoose.model<IDislike>("Dislike", dislikeschema);

export default Dislike;