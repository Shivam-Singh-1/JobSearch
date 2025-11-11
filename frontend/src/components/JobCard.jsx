import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import moment from 'moment';

const JobCard = ({ job, onSaveToggle, isSaved = false }) => {
  const { user, isAuthenticated } = useAuth();

  const handleSaveJob = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || user?.role !== 'jobseeker') {
      toast.error('Please login as job seeker to save jobs');
      return;
    }

    try {
      if (isSaved) {
        await api.delete(`/saved-jobs/${job._id}`);
        toast.success('Job removed from saved list');
      } else {
        await api.post('/saved-jobs', { jobId: job._id });
        toast.success('Job saved successfully');
      }
      onSaveToggle?.(job._id, !isSaved);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {job.company?.companyLogo && (
            <img 
              src={`http://localhost:5001/${job.company.companyLogo}`} 
              alt={job.company.companyName || job.company.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <p className="text-gray-600">{job.company?.companyName || job.company?.name}</p>
          </div>
        </div>
        
        {isAuthenticated && user?.role === 'jobseeker' && (
          <button
            onClick={handleSaveJob}
            className={`p-2 rounded-full ${isSaved ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-100`}
          >
            <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock size={16} />
          <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
        </div>
        {job.salary?.min && (
          <div className="flex items-center space-x-1">
            <DollarSign size={16} />
            <span>${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {job.category}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full capitalize">
            {job.experienceLevel}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500">
            {moment(job.createdAt).fromNow()}
          </span>
          <Link
            to={`/jobs/${job._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;