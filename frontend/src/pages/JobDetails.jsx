import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Calendar, Building, Heart, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import api from '../api/axios';
import toast from 'react-hot-toast';
import moment from 'moment';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && user?.role === 'jobseeker') {
      checkApplicationStatus();
      checkSavedStatus();
    }
  }, [id, isAuthenticated, user]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      const hasAppliedToJob = response.data.some(app => app.job._id === id);
      setHasApplied(hasAppliedToJob);
    } catch (error) {
      console.error('Failed to check application status');
    }
  };

  const checkSavedStatus = async () => {
    try {
      const response = await api.get(`/saved-jobs/check/${id}`);
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error('Failed to check saved status');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || user?.role !== 'jobseeker') {
      toast.error('Please login as job seeker to apply');
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', coverLetter);

      await api.post('/applications', formData);
      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setShowApplicationForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated || user?.role !== 'jobseeker') {
      toast.error('Please login as job seeker to save jobs');
      return;
    }

    try {
      if (isSaved) {
        await api.delete(`/saved-jobs/${id}`);
        toast.success('Job removed from saved list');
        setIsSaved(false);
      } else {
        await api.post('/saved-jobs', { jobId: id });
        toast.success('Job saved successfully');
        setIsSaved(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
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

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              Back to job listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Job Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {job.company?.companyLogo && (
                  <img 
                    src={`http://localhost:5001/${job.company.companyLogo}`} 
                    alt={job.company.companyName || job.company.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-lg text-gray-600">{job.company?.companyName || job.company?.name}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>Posted {moment(job.createdAt).fromNow()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {isAuthenticated && user?.role === 'jobseeker' && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveJob}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                      isSaved 
                        ? 'border-red-300 text-red-600 bg-red-50' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                    <span>{isSaved ? 'Saved' : 'Save Job'}</span>
                  </button>

                  {hasApplied ? (
                    <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                      <span>✓ Applied</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Send size={18} />
                      <span>Apply Now</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Job Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Job Information</h3>
                  <div className="space-y-3 text-sm">
                    {job.salary?.min && (
                      <div className="flex items-center space-x-2">
                        <DollarSign size={16} className="text-gray-400" />
                        <span>${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Building size={16} className="text-gray-400" />
                      <span className="capitalize">{job.experienceLevel} Level</span>
                    </div>
                    <div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {job.category}
                      </span>
                    </div>
                    {job.applicationDeadline && (
                      <div className="text-red-600">
                        <strong>Deadline:</strong> {moment(job.applicationDeadline).format('MMM DD, YYYY')}
                      </div>
                    )}
                  </div>
                </div>

                {job.company?.companyDescription && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">About Company</h3>
                    <p className="text-sm text-gray-700">{job.company.companyDescription}</p>
                    {job.company.website && (
                      <a 
                        href={job.company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm mt-2 block"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Application Form Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Apply for {job.title}</h3>
              <form onSubmit={handleApply}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell the employer why you're interested in this position..."
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;