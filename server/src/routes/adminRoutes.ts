import express from 'express';
import { getAdminStats, getUsers, toggleBanStatus, deleteUser } from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/stats').get(protect, admin, getAdminStats);
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id/ban').put(protect, admin, toggleBanStatus);
router.route('/users/:id').delete(protect, admin, deleteUser);

export default router;
