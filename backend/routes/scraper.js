import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { scrapeAllJobs } from '../scripts/jobScraper.js';

const router = express.Router();

router.post('/run', authenticate, authorize('employer'), async (req, res) => {
  try {
    const result = await scrapeAllJobs();
    
    if (result.success) {
      res.json({ 
        message: `Successfully imported ${result.count} jobs from multiple sources!`
      });
    } else {
      res.status(500).json({ 
        message: 'Import failed', 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Scraper error:', error);
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
});

export default router;