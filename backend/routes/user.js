import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs';

const router = express.Router();

router.put('/profile', authenticate, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'companyLogo', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (req.files?.profileImage) {
      updates.profileImage = req.files.profileImage[0].path;
    }
    if (req.files?.companyLogo) {
      updates.companyLogo = req.files.companyLogo[0].path;
    }
    if (req.files?.resume) {
      updates.resume = req.files.resume[0].path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/resume', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.resume) {
      fs.unlinkSync(user.resume);
      user.resume = undefined;
      await user.save();
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/public/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;