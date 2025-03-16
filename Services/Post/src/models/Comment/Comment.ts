import mongoose from "mongoose";
import { IComment } from "../../types";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: false,
    },
    associatedTo: {
      type: String,
      required: true,
    },
    createdBy: {
      id: {
        type: String,
        required: true,
      },
    },
    likeCount: {
      type: Number,
      required: true,
    },
    dislikeCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export { Comment };
