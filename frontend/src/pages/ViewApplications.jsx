import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Mail, Phone, MapPin } from 'lucide-react';
import Header from '../components/Header';
import api from '../api/axios';
import toast from 'react-hot-toast';
import moment from 'moment';

const ViewApplications = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const [jobResponse, applicationsResponse] = await Promise.all([
        api.get(`/jobs/${jobId}`),
        api.get(`/applications/job/${jobId}`)
      ]);
      
      setJob(jobResponse.data);
      setApplications(applicationsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      toast.success('Application status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Link to="/employer/manage-jobs" className="hover:text-blue-600">Manage Jobs</Link>
            <span>/</span>
            <span>Applications</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
          <p className="text-gray-600 mt-1">{applications.length} applications received</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Applications', count: applications.length },
                { key: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
                { key: 'reviewed', label: 'Reviewed', count: applications.filter(a => a.status === 'reviewed').length },
                { key: 'shortlisted', label: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
                { key: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">
              {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <div key={application._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {application.applicant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.applicant.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail size={14} />
                          <span>{application.applicant.email}</span>
                        </div>
                        {application.applicant.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone size={14} />
                            <span>{application.applicant.phone}</span>
                          </div>
                        )}
                        {application.applicant.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{application.applicant.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {moment(application.createdAt).fromNow()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Experience & Skills</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {application.applicant.experience && (
                        <p><strong>Experience:</strong> {application.applicant.experience}</p>
                      )}
                      {application.applicant.education && (
                        <p><strong>Education:</strong> {application.applicant.education}</p>
                      )}
                      {application.applicant.skills && application.applicant.skills.length > 0 && (
                        <div>
                          <strong>Skills:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {application.applicant.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
                    <div className="text-sm text-gray-600">
                      {application.coverLetter && (
                        <div className="mb-3">
                          <strong>Cover Letter:</strong>
                          <p className="mt-1 p-3 bg-gray-50 rounded text-sm">
                            {application.coverLetter}
                          </p>
                        </div>
                      )}
                      {(application.resume || application.applicant.resume) && (
                        <div className="flex items-center space-x-2">
                          <Download size={16} />
                          <a
                            href={`http://localhost:5001/${application.resume || application.applicant.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Download Resume
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application._id, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplications;