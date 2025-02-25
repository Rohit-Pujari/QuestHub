import mongoose from "mongoose";

export interface IDislike {
  on: string;
  dislikedBy: string;
}

const dislikeschema = new mongoose.Schema(
  {
    on: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "onModel",
      required: true,
    },
    dislikedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Dislike = mongoose.model<IDislike>("Dislike", dislikeschema);

export default Dislike;
