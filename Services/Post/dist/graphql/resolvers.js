"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("../models/Post"));
const resolvers = {
    Query: {
        getPosts: async () => {
            return await Post_1.default.find();
        },
        getPost: async (_, { id }) => {
            return await Post_1.default.findById(id);
        },
        getPostsByUser: async (_, { username }) => {
            return await Post_1.default.find({ createdBy: username });
        }
    },
    Mutation: {
        createPost: async (_, { title, content, mediaUrl, createdBy }) => {
            const newPost = new Post_1.default({ title, content, mediaUrl, createdBy });
            return await newPost.save();
        },
        updatePost: async (_, { id, title, content, mediaUrl }) => {
            const post = await Post_1.default.findById(id);
            if (!post) {
                throw new Error("Post not found");
            }
            const updatedPost = await Post_1.default.findByIdAndUpdate(id, { title, content, mediaUrl }, { new: true });
            return updatedPost;
        },
        deletePost: async (_, { id }) => {
            const post = await Post_1.default.findByIdAndDelete(id);
            if (!post) {
                throw new Error("Post not found");
            }
            return "Post deleted successfully";
        },
    }
};
exports.default = resolvers;
