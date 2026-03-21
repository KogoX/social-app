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
exports.commentOnPost = exports.likePost = exports.getUserPosts = exports.getFeedPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const User_1 = __importDefault(require("../models/User"));
// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content, image, visibility } = req.body;
        const post = new Post_1.default({
            author: req.user._id,
            content,
            image,
            visibility: visibility || 'public',
        });
        const createdPost = yield post.save();
        // Populate author before returning
        yield createdPost.populate('author', 'name avatar title');
        res.status(201).json(createdPost);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.createPost = createPost;
// @desc    Get feed posts
// @route   GET /api/posts/feed
// @access  Private
const getFeedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield User_1.default.findById(req.user._id);
        if (!currentUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const posts = yield Post_1.default.find({
            $or: [
                { visibility: 'public' },
                { visibility: 'friends', author: { $in: currentUser.friends } },
                { author: req.user._id }
            ]
        })
            .populate('author', 'name avatar title')
            .populate('comments.author', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.getFeedPosts = getFeedPosts;
// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Private
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isCurrentUser = req.user._id.toString() === req.params.userId;
        const targetUser = yield User_1.default.findById(req.params.userId);
        const currentUser = yield User_1.default.findById(req.user._id);
        if (!targetUser || !currentUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isFriend = currentUser.friends.includes(targetUser._id);
        let visibilityQuery = {};
        if (!isCurrentUser) {
            if (isFriend) {
                visibilityQuery = { visibility: { $in: ['public', 'friends'] } };
            }
            else {
                visibilityQuery = { visibility: 'public' };
            }
        }
        const posts = yield Post_1.default.find(Object.assign({ author: req.params.userId }, visibilityQuery))
            .populate('author', 'name avatar title')
            .populate('comments.author', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.getUserPosts = getUserPosts;
// @desc    Like or unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.findById(req.params.id);
        if (post) {
            const isLiked = post.likes.includes(req.user._id);
            if (isLiked) {
                post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
            }
            else {
                post.likes.push(req.user._id);
            }
            yield post.save();
            res.json(post.likes); // Return updated likes array
        }
        else {
            res.status(404).json({ message: 'Post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.likePost = likePost;
// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const commentOnPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const post = yield Post_1.default.findById(req.params.id);
        if (post) {
            const comment = {
                author: req.user._id,
                content,
                timestamp: new Date()
            };
            post.comments.push(comment);
            yield post.save();
            const updatedPost = yield Post_1.default.findById(req.params.id)
                .populate('comments.author', 'name avatar');
            res.status(201).json(updatedPost === null || updatedPost === void 0 ? void 0 : updatedPost.comments);
        }
        else {
            res.status(404).json({ message: 'Post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.commentOnPost = commentOnPost;
