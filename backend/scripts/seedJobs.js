import mongoose from 'mongoose';
import Job from '../models/Job.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    let systemUser = await User.findOne({ email: 'system@jobportal.com' });
    if (!systemUser) {
      systemUser = new User({
        name: 'Job Portal System',
        email: 'system@jobportal.com',
        password: 'system123',
        role: 'employer',
        companyName: 'Job Portal'
      });
      await systemUser.save();
    }

    const jobs = [
      { title: 'Frontend Developer - Google', description: 'Build modern web apps', location: 'San Francisco, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 120000, max: 160000, currency: 'USD' } },
      { title: 'Marketing Manager - Apple', description: 'Lead marketing campaigns', location: 'Cupertino, CA', jobType: 'full-time', category: 'Marketing', experienceLevel: 'senior', salary: { min: 110000, max: 150000, currency: 'USD' } },
      { title: 'UX Designer - Microsoft', description: 'Design user experiences', location: 'Seattle, WA', jobType: 'full-time', category: 'Design', experienceLevel: 'mid', salary: { min: 95000, max: 130000, currency: 'USD' } },
      { title: 'Data Scientist - Amazon', description: 'Analyze big data', location: 'Remote', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 140000, max: 180000, currency: 'USD' } },
      { title: 'Sales Manager - Tesla', description: 'Drive sales growth', location: 'Austin, TX', jobType: 'full-time', category: 'Sales', experienceLevel: 'mid', salary: { min: 85000, max: 120000, currency: 'USD' } },
      { title: 'Backend Developer - Netflix', description: 'Build scalable systems', location: 'Los Gatos, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 130000, max: 170000, currency: 'USD' } },
      { title: 'Product Manager - Spotify', description: 'Lead product development', location: 'New York, NY', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 125000, max: 165000, currency: 'USD' } },
      { title: 'DevOps Engineer - Uber', description: 'Manage cloud infrastructure', location: 'San Francisco, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 115000, max: 155000, currency: 'USD' } },
      { title: 'Content Writer - Airbnb', description: 'Create engaging content', location: 'Remote', jobType: 'part-time', category: 'Marketing', experienceLevel: 'entry', salary: { min: 45000, max: 65000, currency: 'USD' } },
      { title: 'Financial Analyst - Meta', description: 'Analyze financial data', location: 'Menlo Park, CA', jobType: 'full-time', category: 'Finance', experienceLevel: 'mid', salary: { min: 90000, max: 125000, currency: 'USD' } }
    ];

    for (const jobData of jobs) {
      const existingJob = await Job.findOne({ title: jobData.title, company: systemUser._id });
      if (!existingJob) {
        const job = new Job({ ...jobData, company: systemUser._id, requirements: ['Experience required', 'Team player'] });
        await job.save();
        console.log(`Added: ${jobData.title}`);
      }
    }

    console.log('Job seeding completed!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error);
    mongoose.connection.close();
  }
};

seedJobs();