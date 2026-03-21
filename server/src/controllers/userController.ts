import { Request, Response } from 'express';
import User from '../models/User';

// Extending Request to include user
interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'name avatar title');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.title = req.body.title !== undefined ? req.body.title : user.title;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.work = req.body.work !== undefined ? req.body.work : user.work;
      user.school = req.body.school !== undefined ? req.body.school : user.school;
      user.avatar = req.body.avatar || user.avatar;
      
      const updatedUser = await user.save();

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
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Follow a user (add to friends)
// @route   PUT /api/users/:id/follow
// @access  Private
export const followUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (req.params.id === req.user._id.toString()) {
      res.status(400).json({ message: 'You cannot follow yourself' });
      return;
    }

    if (userToFollow && currentUser) {
      if (!currentUser.friends.includes(userToFollow._id as any)) {
        currentUser.friends.push(userToFollow._id as any);
        await currentUser.save();
        
        // Also update followers count on target user
        userToFollow.followers += 1;
        await userToFollow.save();

        res.json({ message: 'User followed successfully' });
      } else {
        res.status(400).json({ message: 'You are already following this user' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Unfollow a user
// @route   PUT /api/users/:id/unfollow
// @access  Private
export const unfollowUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (userToUnfollow && currentUser) {
      if (currentUser.friends.includes(userToUnfollow._id as any)) {
        currentUser.friends = currentUser.friends.filter(
          (id) => id.toString() !== userToUnfollow._id.toString()
        ) as any;
        await currentUser.save();
        
        userToUnfollow.followers = Math.max(0, userToUnfollow.followers - 1);
        await userToUnfollow.save();

        res.json({ message: 'User unfollowed successfully' });
      } else {
        res.status(400).json({ message: 'You are not following this user' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Search/get users
// @route   GET /api/users
// @access  Private
// Allows query by keyword `?search=someone`
export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search as string,
            $options: 'i',
          },
        }
      : {};

    const users = await User.find({ ...keyword, _id: { $ne: req.user._id } })
      .select('-password')
      .limit(10); // Limit results for performance

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};
