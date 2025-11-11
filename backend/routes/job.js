import express from 'express';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('employer'), async (req, res) => {
  try {
    const job = new Job({ ...req.body, company: req.user._id });
    await job.save();
    await job.populate('company', 'name companyName companyLogo');
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, location, category, jobType, page = 1, limit = 100 } = req.query;
    const query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (category) query.category = category;
    if (jobType) query.jobType = jobType;

    const jobs = await Job.find(query)
      .populate('company', 'name companyName companyLogo')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);
    
    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-jobs', authenticate, authorize('employer'), async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id })
      .populate('company', 'name companyName companyLogo')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'name companyName companyLogo companyDescription website');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authenticate, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, company: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    Object.assign(job, req.body);
    await job.save();
    await job.populate('company', 'name companyName companyLogo');
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, company: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/analytics', authenticate, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, company: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const applications = await Application.countDocuments({ job: req.params.id });
    const pending = await Application.countDocuments({ job: req.params.id, status: 'pending' });
    const reviewed = await Application.countDocuments({ job: req.params.id, status: 'reviewed' });
    const shortlisted = await Application.countDocuments({ job: req.params.id, status: 'shortlisted' });

    res.json({ applications, pending, reviewed, shortlisted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;