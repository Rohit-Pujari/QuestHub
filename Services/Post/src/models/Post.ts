import mongoose from "mongoose";

export interface IPost {
  title: string;
  content: string;
  mediaUrl: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const postschema = new mongoose.Schema(
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
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model<IPost>("Post", postschema);

export default Post;
