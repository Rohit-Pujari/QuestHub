import mongoose from "mongoose";
import { IPost } from "../../types";
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
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
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);
export { Post };
