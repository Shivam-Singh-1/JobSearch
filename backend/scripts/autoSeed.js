import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { exec } from 'child_process';

dotenv.config();

const autoSeedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Auto-seeding 200 jobs...');
    
    exec('node scripts/jobScraper.js', (error, stdout, stderr) => {
      if (error) {
        console.error('Auto-seed failed:', error);
      } else {
        console.log('Auto-seed completed:', stdout);
      }
      mongoose.connection.close();
    });
  } catch (error) {
    console.error('Auto-seed error:', error);
  }
};

autoSeedJobs();