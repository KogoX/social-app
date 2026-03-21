import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, gender } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await User.create({
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
        isAdmin: user.isAdmin,
        isBanned: user.isBanned,
        token: generateToken(user._id as any),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.isBanned) {
        res.status(403).json({ message: 'This account has been banned.' });
        return;
      }
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        title: user.title,
        isAdmin: user.isAdmin,
        isBanned: user.isBanned,
        token: generateToken(user._id as any),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};
