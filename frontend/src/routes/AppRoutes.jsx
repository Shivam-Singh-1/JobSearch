import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import JobSeekerDashboard from '../pages/JobSeekerDashboard';
import EmployerDashboard from '../pages/EmployerDashboard';
import JobDetails from '../pages/JobDetails';
import SavedJobs from '../pages/SavedJobs';
import Profile from '../pages/Profile';
import CreateJob from '../pages/CreateJob';
import ManageJobs from '../pages/ManageJobs';
import ViewApplications from '../pages/ViewApplications';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'employer' ? '/employer/dashboard' : '/dashboard'} />} />
      <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to={user?.role === 'employer' ? '/employer/dashboard' : '/dashboard'} />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute role="jobseeker">
          <JobSeekerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/jobs/:id" element={<JobDetails />} />
      
      <Route path="/saved-jobs" element={
        <ProtectedRoute role="jobseeker">
          <SavedJobs />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/employer/dashboard" element={
        <ProtectedRoute role="employer">
          <EmployerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/employer/create-job" element={
        <ProtectedRoute role="employer">
          <CreateJob />
        </ProtectedRoute>
      } />
      
      <Route path="/employer/manage-jobs" element={
        <ProtectedRoute role="employer">
          <ManageJobs />
        </ProtectedRoute>
      } />
      
      <Route path="/employer/applications/:jobId" element={
        <ProtectedRoute role="employer">
          <ViewApplications />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;