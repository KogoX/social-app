import express from 'express';
import {
  sendMessage,
  getMessages,
  getConversations,
} from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/conversations/all').get(protect, getConversations);
router.route('/:userId').get(protect, getMessages).post(protect, sendMessage);

export default router;
