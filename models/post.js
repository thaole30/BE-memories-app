import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    message: {type: String, required: true},
    name: {type: String, required: true},
    creator: {type: String, required: true},
    tags: { type: [String], required: true},
    selectedFile: {type: String, required: true},
    likes: {
        type: [String],
        default: [],
    },
}, 
    { timestamps: true }
)

const Post = mongoose.model('Post',postSchema);
export default Post;