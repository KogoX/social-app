import { Request, Response } from 'express';
import Message from '../models/Message';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Send a message
// @route   POST /api/messages/:userId
// @access  Private
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const receiverId = req.params.userId;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      res.status(400).json({ message: 'Cannot send message to yourself' });
      return;
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    const createdMessage = await message.save();
    
    // Populate sender and receiver before returning
    await createdMessage.populate('sender', 'name avatar');
    await createdMessage.populate('receiver', 'name avatar');

    // In a real app with Socket.io, you would emit an event here to the receiver

    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Get all messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ createdAt: 1 }) // oldest first to display top to bottom
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Get all conversations (latest message per user)
// @route   GET /api/messages/conversations/all
// @access  Private
export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    // Use aggregation to find the latest message for every conversation the user is part of
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          latestMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'participant'
        }
      },
      {
        $unwind: '$participant'
      },
      {
        $project: {
          _id: '$latestMessage._id',
          content: '$latestMessage.content',
          createdAt: '$latestMessage.createdAt',
          status: '$latestMessage.status',
          sender: '$latestMessage.sender',
          receiver: '$latestMessage.receiver',
          participant: {
            _id: '$participant._id',
            name: '$participant.name',
            avatar: '$participant.avatar',
            isOnline: '$participant.isOnline'
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};
