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
exports.markAsRead = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield Notification_1.default.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('relatedUser', 'name avatar');
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.getNotifications = getNotifications;
// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield Notification_1.default.findById(req.params.id);
        if (notification) {
            if (notification.user.toString() !== req.user._id.toString()) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }
            notification.isRead = true;
            const updatedNotification = yield notification.save();
            res.json(updatedNotification);
        }
        else {
            res.status(404).json({ message: 'Notification not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.markAsRead = markAsRead;
