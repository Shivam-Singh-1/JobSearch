import { useState } from 'react';
import { Download } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const JobScraper = () => {
  const [loading, setLoading] = useState(false);

  const handleScrapeJobs = async () => {
    setLoading(true);
    try {
      toast.loading('Importing jobs from multiple sources...');
      const response = await api.post('/scraper/run');
      toast.dismiss();
      toast.success('Jobs imported successfully!');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to import jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleScrapeJobs}
      disabled={loading}
      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
    >
      <Download size={18} />
      <span>{loading ? 'Importing...' : 'Import Jobs'}</span>
    </button>
  );
};

export default JobScraper;