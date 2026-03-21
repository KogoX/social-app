import { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content, image, visibility } = req.body;

    const post = new Post({
      author: req.user._id,
      content,
      image,
      visibility: visibility || 'public',
    });

    const createdPost = await post.save();
    
    // Populate author before returning
    await createdPost.populate('author', 'name avatar title');

    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Get feed posts
// @route   GET /api/posts/feed
// @access  Private
export const getFeedPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    if (!currentUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const posts = await Post.find({
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
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Private
export const getUserPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isCurrentUser = req.user._id.toString() === req.params.userId;
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser || !currentUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isFriend = currentUser.friends.includes(targetUser._id as any);

    let visibilityQuery = {};
    if (!isCurrentUser) {
      if (isFriend) {
        visibilityQuery = { visibility: { $in: ['public', 'friends'] } };
      } else {
        visibilityQuery = { visibility: 'public' };
      }
    }

    const posts = await Post.find({
      author: req.params.userId,
      ...visibilityQuery
    })
      .populate('author', 'name avatar title')
      .populate('comments.author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Like or unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      const isLiked = post.likes.includes(req.user._id);

      if (isLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
      } else {
        post.likes.push(req.user._id);
      }

      await post.save();
      
      res.json(post.likes); // Return updated likes array
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
export const commentOnPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (post) {
      const comment = {
        author: req.user._id,
        content,
        timestamp: new Date()
      };

      post.comments.push(comment as any);
      await post.save();
      
      const updatedPost = await Post.findById(req.params.id)
        .populate('comments.author', 'name avatar');
        
      res.status(201).json(updatedPost?.comments);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: String(error) });
  }
};
