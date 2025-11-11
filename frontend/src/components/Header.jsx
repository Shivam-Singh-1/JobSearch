import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Briefcase, Heart, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../Assets/logo.png.png';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    setTimeout(() => navigate('/'), 100);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            <img src={logo} alt="Job Match Logo" className="w-12 h-12 object-contain" />
            <span>Job Match</span>
          </Link>

          <nav className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'jobseeker' ? (
                  <>
                    <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                      <Briefcase size={18} />
                      <span>Jobs</span>
                    </Link>
                    <Link to="/saved-jobs" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                      <Heart size={18} />
                      <span>Saved</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/employer/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                      <Briefcase size={18} />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/employer/create-job" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                      <Plus size={18} />
                      <span>Post Job</span>
                    </Link>
                    <Link to="/employer/manage-jobs" className="text-gray-700 hover:text-blue-600">
                      Manage Jobs
                    </Link>
                  </>
                )}
                
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;