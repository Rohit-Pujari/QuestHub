import mongoose from "mongoose";
import { IFollow } from "../../types";

const followSchema = new mongoose.Schema(
  {
    follower: {
      id: {
        type: String,
        required: true,
      },
    },
    following: {
      id: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);
const Follow = mongoose.model<IFollow>("Follow", followSchema);
export { Follow };
