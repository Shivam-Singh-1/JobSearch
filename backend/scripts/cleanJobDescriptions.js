import mongoose from 'mongoose';
import * as cheerio from 'cheerio';
import Job from '../models/Job.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanDescription = (html) => {
  if (!html) return '';
  const $ = cheerio.load(html);
  return $.text().trim().replace(/\s+/g, ' ');
};

const cleanExistingJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const jobs = await Job.find({});
    console.log(`Found ${jobs.length} jobs to clean`);

    let cleanedCount = 0;
    for (const job of jobs) {
      const cleanedDescription = cleanDescription(job.description);
      if (cleanedDescription !== job.description) {
        await Job.findByIdAndUpdate(job._id, { description: cleanedDescription });
        cleanedCount++;
      }
    }

    console.log(`Cleaned ${cleanedCount} job descriptions`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

cleanExistingJobs();