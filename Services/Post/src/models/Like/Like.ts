import mongoose from "mongoose";
import { ILike } from "../../types";

const likeSchema = new mongoose.Schema(
  {
    on: {
      type: String,
      required: true,
    },
    likedBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model<ILike>("Like", likeSchema);
export { Like };
