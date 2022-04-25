import express from 'express';
import { getPosts, createPost, deletePost,updatePost, likePost, getPostByTitle, getPostsBySearch} from '../controllers/post.js';
import { verifyTokenAndAuthorization } from '../middleware/verify.js';
const router = express.Router();

router.get('/search', getPostsBySearch);
router.get("/", getPosts);
router.get("/:title", getPostByTitle);
router.post("/",verifyTokenAndAuthorization, createPost);
router.delete('/:id', verifyTokenAndAuthorization, deletePost);
router.patch('/:id', verifyTokenAndAuthorization, updatePost);
router.patch('/likePost/:id', verifyTokenAndAuthorization, likePost)
export default router;
