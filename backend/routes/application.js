import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', authenticate, authorize('jobseeker'), upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existingApplication = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existingApplication) return res.status(400).json({ message: 'Already applied to this job' });

    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: req.file?.path || req.user.resume
    });

    await application.save();
    await application.populate(['job', 'applicant']);
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-applications', authenticate, authorize('jobseeker'), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job')
      .populate('job.company', 'name companyName companyLogo')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/job/:jobId', authenticate, authorize('employer'), async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, company: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone location skills experience education resume')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', authenticate, authorize('employer'), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');
    
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/dashboard-stats', authenticate, authorize('employer'), async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user._id });
    const jobIds = jobs.map(job => job._id);
    
    const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });
    const pendingApplications = await Application.countDocuments({ job: { $in: jobIds }, status: 'pending' });
    const shortlistedApplications = await Application.countDocuments({ job: { $in: jobIds }, status: 'shortlisted' });
    
    res.json({
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.status === 'active').length,
      totalApplications,
      pendingApplications,
      shortlistedApplications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;