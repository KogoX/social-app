import express from 'express';
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  commentOnPost,
} from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createPost);
router.route('/feed').get(protect, getFeedPosts);
router.route('/user/:userId').get(protect, getUserPosts);
router.route('/:id/like').put(protect, likePost);
router.route('/:id/comments').post(protect, commentOnPost);

export default router;
