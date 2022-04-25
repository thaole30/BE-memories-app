import mongoose from 'mongoose';
import Post from '../models/post.js';

export const getPosts = async (req, res) => {
    console.log("req.query", req.query);
    const {page} = req.query;

    try {

        const LIMIT = 4;
        const startIndex = (Number(page) -1) * LIMIT;
        const total = await Post.countDocuments({});
        console.log("total", total)

        const postsPerPage = await Post.find({}).sort({_id: -1}).limit(LIMIT).skip(startIndex);
        // console.log("postsPerPage", postsPerPage);

        res.status(200).json({
            posts: postsPerPage,
            currentPage: Number(page),
            totalPost: total,
            totalPage: Math.ceil(total / LIMIT),
        });
    } catch (error) {
        res.status(404).json({
            error: error.message,
        });
        
    }
}


export const getPostByTitle = async (req, res) => {
    const {title} = req.params;
    // console.log("title in BE", title);

    try {
        const post = await Post.findOne({title: title});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ 
            message: error.message,
        })
    }
}


export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query;
    console.log("THING TO SEARCH", {searchQuery, tags});
    try {
        const title = new RegExp(searchQuery, 'i');
        console.log("title", title);

        const posts = await Post.find({
            $or: [
                {title: title},
                {
                    tags: {$in: tags.split(',')}
                }
            ]
        });
        


        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ err: error.message});
    }
}

export const createPost = async (req, res) => {
    console.log(">>>>>>>>>>CREATE<<<<<<<<<<<");
    // console.log("post data", req.body);

    const post = req.body; //data from front end ented by user
    const newPost = new Post({...post, creator: req.decodedData.userId || req.decodedData.sub});
    // console.log("newPost in BE", newPost);
    
    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ err: error.message})      //409 means create fail
    }
}


export const deletePost = async (req, res) => {
    const id = req.params.id;
    console.log("deleted post id in BE", id);

    try {
        await Post.findByIdAndDelete(id);
        res.json({message: 'Delete post successfully'});

    } catch (error) {
        res.status(404).json({ err: error.message});
    }
}


export const updatePost = async (req, res) => {
    const {id} = req.params;

    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    try {
        const updatedPost = await Post.findByIdAndUpdate(id, {...post}, {new: true});
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ err: error.message})      //409 means create fail
    }

}


export const likePost = async (req, res) => {
    const {id: postId} = req.params;    //postId
    // console.log("postId",postId);
    // console.log("GG ID", req.decodedData.sub);

    if(!req.decodedData.userId && !req.decodedData.sub) {
        console.log("CAN NOT LIKE")
        return res.json({message: 'Unauthenticated'});
    }


    if(!mongoose.Types.ObjectId.isValid(postId)) return res.status(404).send('No post with that id');

    const post = await Post.findById(postId);

    const index = post.likes.findIndex((id) => id === req.decodedData.userId || id === req.decodedData.sub);
    console.log("INDEX", index)

    if(index === -1) {
        //wanna like
        post.likes.push(req.decodedData.userId || req.decodedData.sub);
    } else {
        //wanna dislike
        post.likes = post.likes.filter((id) => id !== (req.decodedData.userId || req.decodedData.sub));
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, post, {new: true});
    console.log("LIKED UPDATED post", updatedPost.likes);
    res.status(200).json(updatedPost);
}