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
exports.authUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, gender } = req.body;
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const user = yield User_1.default.create({
            name,
            email,
            password,
            // Default avatars based on simple logic or keeping the universal default
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw_8YzpQdaC7LK3Pb9BK16eg2zaYnF5UcUe72PIs2eViXaWKdo2bUPO8Uz_B5pVMdr7X0bq-oaQjR-Lrq2jv5CPk9hxj0zTkeE3PpcRm3YfGcE5qBlNJYjQsNDZoSP6bHoVjAsDxmVDTvaN2x3t9fTX5-zv6X8NaE7hSP2xBUDugS0PwJpycFfnzyMTjXg9npsvi48qTbuAuZDOndaWZ8KlMKpTR0WOz_cwXQhCnhmIm_vqIwmpGZeqVb2oEbj66qnE837WM9JhiM',
        });
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                token: (0, generateToken_1.default)(user._id),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.registerUser = registerUser;
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (user && (yield user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                title: user.title,
                token: (0, generateToken_1.default)(user._id),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: String(error) });
    }
});
exports.authUser = authUser;
