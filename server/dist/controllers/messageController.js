"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversations = exports.getMessages = exports.sendMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
// @desc    Send a message
// @route   POST /api/messages/:userId
// @access  Private
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const receiverId = req.params.userId;
        const senderId = req.user._id;
        if (senderId.toString() === receiverId) {
            res.status(400).json({ message: 'Cannot send message to yourself' });
            return;
        }
        const message = new Message_1.default({
            sender: senderId,
            receiver: receiverId,
            content,
        });
        const createdMessage = yield message.save();
        // Populate sender and receiver before returning
        yield createdMessage.populate('sender', 'name avatar');
        yield createdMessage.populate('receiver', 'name avatar');
        // In a real app with Socket.io, you would emit an event here to the receiver
        res.status(201).json(createdMessage);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.sendMessage = sendMessage;
// @desc    Get all messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receiverId = req.params.userId;
        const senderId = req.user._id;
        const messages = yield Message_1.default.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        })
            .sort({ createdAt: 1 }) // oldest first to display top to bottom
            .populate('sender', 'name avatar')
            .populate('receiver', 'name avatar');
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.getMessages = getMessages;
// @desc    Get all conversations (latest message per user)
// @route   GET /api/messages/conversations/all
// @access  Private
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        // Use aggregation to find the latest message for every conversation the user is part of
        const conversations = yield Message_1.default.aggregate([
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.getConversations = getConversations;
