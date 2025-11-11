import { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchHeader from '../components/SearchHeader';
import JobCard from '../components/JobCard';
import JobScraper from '../components/JobScraper';
import api from '../api/axios';
import toast from 'react-hot-toast';

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, [filters]);

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const params = { ...filters, page, limit: 100 };
      const response = await api.get('/jobs', { params });
      
      setJobs(response.data.jobs);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get('/saved-jobs');
      const savedJobIds = new Set(response.data.map(item => item.job._id));
      setSavedJobs(savedJobIds);
    } catch (error) {
      console.error('Failed to fetch saved jobs');
    }
  };

  const handleSearch = (searchData) => {
    setFilters({ ...filters, ...searchData });
  };

  const handleFilter = (filterData) => {
    setFilters(filterData);
  };

  const handleSaveToggle = (jobId, isSaved) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (isSaved) {
        newSet.add(jobId);
      } else {
        newSet.delete(jobId);
      }
      return newSet;
    });
  };

  const handlePageChange = (page) => {
    fetchJobs(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SearchHeader onSearch={handleSearch} onFilter={handleFilter} filters={filters} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {filters.search ? `Search results for "${filters.search}"` : 'All Jobs'}
              </h1>
              <p className="text-gray-600 mt-1">
                {pagination.total} jobs found
              </p>
            </div>
            <JobScraper />
          </div>
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
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  isSaved={savedJobs.has(job._id)}
                  onSaveToggle={handleSaveToggle}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;