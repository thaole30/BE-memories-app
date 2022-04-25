import express from 'express';
import { signIn, signUp } from '../controllers/user.js';
import { verifyTokenAndAuthorization } from '../middleware/verify.js';
const router = express.Router();

router.post('/signin', signIn);
router.post('/signup', signUp);

export default router;
