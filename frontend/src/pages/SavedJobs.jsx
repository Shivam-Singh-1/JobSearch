import { useState, useEffect } from 'react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get('/saved-jobs');
      setSavedJobs(response.data);
    } catch (error) {
      toast.error('Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = (jobId, isSaved) => {
    if (!isSaved) {
      setSavedJobs(prev => prev.filter(item => item.job._id !== jobId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-1">
            {savedJobs.length} jobs saved
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No saved jobs yet.</p>
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Browse jobs to save them for later
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((item) => (
              <JobCard
                key={item._id}
                job={item.job}
                isSaved={true}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;