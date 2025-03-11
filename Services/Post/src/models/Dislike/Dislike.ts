import mongoose from "mongoose";
import { IDislike } from "../../types";

const DislikeSchema = new mongoose.Schema(
  {
    on: {
      type: String,
      required: true,
    },
    dislikedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Dislike = mongoose.model<IDislike>("Dislike", DislikeSchema);
export { Dislike };
