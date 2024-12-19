import Post, { IPost } from "../models/Post"

const resolvers = {
    Query:{
        getPosts: async()=>{
            return await Post.find();
        },
        getPost: async(_:any, {id}:{id:string})=>{
            return await Post.findById(id);
        },
        getPostsByUser: async(_:any, {username}:{username:string})=>{
            return await Post.find({createdBy: username});
        }
    },
    Mutation:{
        createPost: async(_:any,{title, content, mediaUrl, createdBy}:IPost)=>{
            const newPost = new Post({title, content, mediaUrl, createdBy});
            return await newPost.save();            
        },
        updatePost: async(_:any,{id, title, content, mediaUrl}:{id:string, title:string, content:string, mediaUrl?:string})=>{
            const post = await Post.findById(id);
            if(!post){
                throw new Error("Post not found");
            }
            const updatedPost = await Post.findByIdAndUpdate(id, {title, content, mediaUrl}, {new: true});
            return updatedPost;
        },
        deletePost: async(_:any,{id}:{id:string})=>{
            const post = await Post.findByIdAndDelete(id);
            if(!post){
                throw new Error("Post not found");
            }
            return "Post deleted successfully";
        },
    }
}

export default resolvers;