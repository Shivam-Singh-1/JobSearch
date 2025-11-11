import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, Users, Eye, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import api from '../api/axios';
import toast from 'react-hot-toast';

const EmployerDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, jobsResponse] = await Promise.all([
        api.get('/applications/dashboard-stats'),
        api.get('/jobs/my-jobs')
      ]);
      
      setStats(statsResponse.data);
      setRecentJobs(jobsResponse.data.slice(0, 5));
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
            <p className="text-gray-600">Manage your job postings and applications</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="text-indigo-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Eye className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="text-orange-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shortlistedApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/employer/create-job"
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center">
              <Plus size={24} className="mr-3" />
              <div>
                <h3 className="font-semibold">Post New Job</h3>
                <p className="text-blue-100 text-sm">Create a new job posting</p>
              </div>
            </div>
          </Link>

          <Link
            to="/employer/manage-jobs"
            className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            <div className="flex items-center">
              <Briefcase size={24} className="mr-3" />
              <div>
                <h3 className="font-semibold">Manage Jobs</h3>
                <p className="text-green-100 text-sm">Edit or close job postings</p>
              </div>
            </div>
          </Link>

          <Link
            to="/profile"
            className="bg-indigo-600 text-white p-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <div className="flex items-center">
              <Users size={24} className="mr-3" />
              <div>
                <h3 className="font-semibold">Company Profile</h3>
                <p className="text-indigo-100 text-sm">Update company information</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Job Postings</h2>
              <Link to="/employer/manage-jobs" className="text-blue-600 hover:underline">
                View All
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No job postings yet</p>
                <Link
                  to="/employer/create-job"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job._id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.location} • {job.jobType}</p>
                      <p className="text-xs text-gray-500">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        job.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                      <Link
                        to={`/employer/applications/${job._id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Applications
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;