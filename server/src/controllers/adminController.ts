import { Request, Response } from 'express';
import User from '../models/User';
import Post from '../models/Post';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get real dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // ── Core counts ──
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });

    // ── Time-windowed queries ──
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const postsToday = await Post.countDocuments({ createdAt: { $gte: startOfToday } });
    const postsYesterday = await Post.countDocuments({
      createdAt: { $gte: startOfYesterday, $lt: startOfToday },
    });

    const newUsersToday = await User.countDocuments({ createdAt: { $gte: startOfToday } });
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // ── Growth percentage (users this week vs previous week) ──
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const newUsersPrevWeek = await User.countDocuments({
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
    });
    const userGrowthPercent =
      newUsersPrevWeek > 0
        ? Math.round(((newUsersThisWeek - newUsersPrevWeek) / newUsersPrevWeek) * 100)
        : newUsersThisWeek > 0
        ? 100
        : 0;

    // ── Daily signups for the last 7 days (for a mini chart) ──
    const dailySignups: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const count = await User.countDocuments({
        createdAt: { $gte: dayStart, $lt: dayEnd },
      });
      dailySignups.push({
        date: dayStart.toISOString().split('T')[0],
        count,
      });
    }

    // ── Recent 5 users (for activity feed) ──
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email avatar createdAt isBanned isAdmin');

    res.json({
      totalUsers,
      totalPosts,
      bannedUsers,
      adminUsers,
      postsToday,
      postsYesterday,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      userGrowthPercent,
      dailySignups,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Get all users for management table
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Toggle user ban status
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
export const toggleBanStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user._id.toString() === req.user._id.toString()) {
      res.status(400).json({ message: 'You cannot ban yourself' });
      return;
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      message: `User has been ${user.isBanned ? 'banned' : 'unbanned'}`,
      isBanned: user.isBanned,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Delete a user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user._id.toString() === req.user._id.toString()) {
      res.status(400).json({ message: 'You cannot delete yourself' });
      return;
    }

    // Remove user's posts
    await Post.deleteMany({ author: user._id });
    // Remove user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and their posts have been deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};
