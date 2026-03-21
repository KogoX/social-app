"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/').post(authMiddleware_1.protect, postController_1.createPost);
router.route('/feed').get(authMiddleware_1.protect, postController_1.getFeedPosts);
router.route('/user/:userId').get(authMiddleware_1.protect, postController_1.getUserPosts);
router.route('/:id/like').put(authMiddleware_1.protect, postController_1.likePost);
router.route('/:id/comments').post(authMiddleware_1.protect, postController_1.commentOnPost);
exports.default = router;
