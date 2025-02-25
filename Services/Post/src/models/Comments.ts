import mongoose from "mongoose";

export interface IComment {
  content: string;
  parentId?: string;
  createdBy: string;
  associatedTo: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentschema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    createdBy: {
      type: String,
      required: true,
    },
    associatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>("Comment", commentschema);

export default Comment;
