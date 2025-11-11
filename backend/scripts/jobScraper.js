import axios from 'axios';
import * as cheerio from 'cheerio';
import xml2js from 'xml2js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const cleanDescription = (html) => {
  if (!html) return '';
  const $ = cheerio.load(html);
  return $.text().trim().replace(/\s+/g, ' ');
};

dotenv.config();

const getSystemUser = async () => {
  let systemUser = await User.findOne({ email: 'system@jobportal.com' });
  if (!systemUser) {
    systemUser = new User({
      name: 'Job Portal System',
      email: 'system@jobportal.com',
      password: 'system123',
      role: 'employer',
      companyName: 'Job Portal',
      companyDescription: 'Aggregated job listings'
    });
    await systemUser.save();
  }
  return systemUser;
};

const scrapeRemoteOK = async () => {
  try {
    const response = await axios.get('https://remoteok.io/api');
    const jobs = [];
    for (let entry of response.data) {
      if (!entry.position) continue;
      jobs.push({
        title: entry.position,
        description: cleanDescription(entry.description) || `${entry.position} at ${entry.company}`,
        location: entry.location || 'Remote',
        jobType: 'full-time',
        category: 'Technology',
        experienceLevel: 'mid',
        salary: entry.salary_min ? {
          min: entry.salary_min,
          max: entry.salary_max,
          currency: 'USD'
        } : undefined,
        requirements: ['Remote work', 'Communication skills'],
        source: 'RemoteOK'
      });
    }
    return jobs.slice(0, 20);
  } catch (error) {
    console.error('RemoteOK failed:', error.message);
    return [];
  }
};

const scrapeWWR = async () => {
  try {
    const rssUrl = 'https://weworkremotely.com/categories/remote-programming-jobs.rss';
    const rssRes = await axios.get(rssUrl);
    const rssObj = await xml2js.parseStringPromise(rssRes.data);
    const items = rssObj.rss.channel[0].item || [];
    const jobs = [];
    
    for (let item of items.slice(0, 10)) {
      try {
        const title = item.title[0];
        const link = item.link[0];
        const page = await axios.get(link);
        const $ = cheerio.load(page.data);
        const desc = $('.listing-body').text().trim() || item.description[0];
        const logoUrl = $('.listing-logo img').attr('src') || null;
        
        jobs.push({
          title,
          description: cleanDescription(desc),
          location: 'Remote',
          jobType: 'full-time',
          category: 'Technology',
          experienceLevel: 'mid',
          requirements: ['Remote work'],
          source: 'WeWorkRemotely'
        });
      } catch (err) {
        console.error('WWR item failed:', err.message);
      }
    }
    return jobs;
  } catch (error) {
    console.error('WWR failed:', error.message);
    return [];
  }
};

const scrapeCraigslist = async () => {
  try {
    const cityUrl = 'https://newyork.craigslist.org/search/sof';
    const response = await axios.get(cityUrl);
    const $ = cheerio.load(response.data);
    const jobs = [];
    
    $('.result-row').each((i, el) => {
      if (i >= 10) return false;
      const title = $(el).find('.result-title').text().trim();
      const link = $(el).find('.result-title').attr('href');
      const price = $(el).find('.result-price').text().trim() || null;
      
      if (title && link) {
        jobs.push({
          title,
          description: `Software job opportunity in New York - ${title}`,
          location: 'New York, NY',
          jobType: 'full-time',
          category: 'Technology',
          experienceLevel: 'mid',
          salary: price ? { min: 50000, max: 100000, currency: 'USD' } : undefined,
          requirements: ['Software development'],
          source: 'Craigslist'
        });
      }
    });
    return jobs;
  } catch (error) {
    console.error('Craigslist failed:', error.message);
    return [];
  }
};

const scrapeAllJobs = async () => {
  console.log('Starting job scraping...');
  
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  
  const systemUser = await getSystemUser();
  
  try {
    const [remoteJobs, wwrJobs, craigslistJobs] = await Promise.all([
      scrapeRemoteOK(),
      scrapeWWR(),
      scrapeCraigslist()
    ]);
    
    const allJobs = [...remoteJobs, ...wwrJobs, ...craigslistJobs];
    console.log(`Processing ${allJobs.length} jobs`);

    for (const jobData of allJobs) {
      try {
        const existingJob = await Job.findOne({
          title: jobData.title,
          company: systemUser._id
        });

        if (!existingJob) {
          const job = new Job({
            ...jobData,
            company: systemUser._id
          });
          await job.save();
          console.log(`Saved: ${jobData.title}`);
        }
      } catch (error) {
        console.error(`Failed to save ${jobData.title}:`, error.message);
      }
    }

    console.log('Job scraping completed!');
    return { success: true, count: allJobs.length };
  } catch (error) {
    console.error('Scraping failed:', error);
    return { success: false, error: error.message };
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAllJobs().then(() => mongoose.connection.close());
}

export { scrapeAllJobs };