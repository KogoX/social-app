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
exports.searchUsers = exports.unfollowUser = exports.followUser = exports.updateUserProfile = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id)
            .select('-password')
            .populate('friends', 'name avatar title');
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.getUserProfile = getUserProfile;
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.title = req.body.title !== undefined ? req.body.title : user.title;
            user.location = req.body.location !== undefined ? req.body.location : user.location;
            user.work = req.body.work !== undefined ? req.body.work : user.work;
            user.school = req.body.school !== undefined ? req.body.school : user.school;
            user.avatar = req.body.avatar || user.avatar;
            const updatedUser = yield user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                title: updatedUser.title,
                bio: updatedUser.bio,
                location: updatedUser.location,
                work: updatedUser.work,
                school: updatedUser.school
            });
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.updateUserProfile = updateUserProfile;
// @desc    Follow a user (add to friends)
// @route   PUT /api/users/:id/follow
// @access  Private
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToFollow = yield User_1.default.findById(req.params.id);
        const currentUser = yield User_1.default.findById(req.user._id);
        if (req.params.id === req.user._id.toString()) {
            res.status(400).json({ message: 'You cannot follow yourself' });
            return;
        }
        if (userToFollow && currentUser) {
            if (!currentUser.friends.includes(userToFollow._id)) {
                currentUser.friends.push(userToFollow._id);
                yield currentUser.save();
                // Also update followers count on target user
                userToFollow.followers += 1;
                yield userToFollow.save();
                res.json({ message: 'User followed successfully' });
            }
            else {
                res.status(400).json({ message: 'You are already following this user' });
            }
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.followUser = followUser;
// @desc    Unfollow a user
// @route   PUT /api/users/:id/unfollow
// @access  Private
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToUnfollow = yield User_1.default.findById(req.params.id);
        const currentUser = yield User_1.default.findById(req.user._id);
        if (userToUnfollow && currentUser) {
            if (currentUser.friends.includes(userToUnfollow._id)) {
                currentUser.friends = currentUser.friends.filter((id) => id.toString() !== userToUnfollow._id.toString());
                yield currentUser.save();
                userToUnfollow.followers = Math.max(0, userToUnfollow.followers - 1);
                yield userToUnfollow.save();
                res.json({ message: 'User unfollowed successfully' });
            }
            else {
                res.status(400).json({ message: 'You are not following this user' });
            }
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.unfollowUser = unfollowUser;
// @desc    Search/get users
// @route   GET /api/users
// @access  Private
// Allows query by keyword `?search=someone`
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const keyword = req.query.search
            ? {
                name: {
                    $regex: req.query.search,
                    $options: 'i',
                },
            }
            : {};
        const users = yield User_1.default.find(Object.assign(Object.assign({}, keyword), { _id: { $ne: req.user._id } }))
            .select('-password')
            .limit(10); // Limit results for performance
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.searchUsers = searchUsers;
