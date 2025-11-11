import express from 'express';
import SavedJob from '../models/SavedJob.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('jobseeker'), async (req, res) => {
  try {
    const { jobId } = req.body;
    
    const existingSave = await SavedJob.findOne({ user: req.user._id, job: jobId });
    if (existingSave) return res.status(400).json({ message: 'Job already saved' });

    const savedJob = new SavedJob({ user: req.user._id, job: jobId });
    await savedJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', authenticate, authorize('jobseeker'), async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name companyName companyLogo' }
      })
      .sort({ createdAt: -1 });
    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:jobId', authenticate, authorize('jobseeker'), async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({ user: req.user._id, job: req.params.jobId });
    if (!savedJob) return res.status(404).json({ message: 'Saved job not found' });
    res.json({ message: 'Job removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/check/:jobId', authenticate, authorize('jobseeker'), async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({ user: req.user._id, job: req.params.jobId });
    res.json({ isSaved: !!savedJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;