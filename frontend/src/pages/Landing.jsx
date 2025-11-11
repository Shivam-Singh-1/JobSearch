import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, Briefcase, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const testimonials = [
  { name: 'Sarah Johnson', role: 'Software Engineer', company: 'Tech Corp', review: 'Found my dream job in just 2 weeks! The platform is incredibly easy to use and the job matches were spot on.', image: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Michael Chen', role: 'Product Manager', company: 'StartupXYZ', review: 'The application process was seamless. I got multiple interview calls within days of signing up!', image: 'https://i.pravatar.cc/150?img=13' },
  { name: 'Emily Rodriguez', role: 'UX Designer', company: 'Design Studio', review: 'Best job portal I\'ve used. The interface is clean and the job recommendations are highly relevant.', image: 'https://i.pravatar.cc/150?img=5' },
  { name: 'David Kim', role: 'Data Scientist', company: 'Analytics Inc', review: 'Landed a senior position with 40% salary increase. Thank you Job Match for changing my career!', image: 'https://i.pravatar.cc/150?img=14' },
  { name: 'Jessica Williams', role: 'Marketing Manager', company: 'Brand Co', review: 'The employer responses were quick and professional. Got hired within a month of applying!', image: 'https://i.pravatar.cc/150?img=9' },
  { name: 'Ryan Patel', role: 'Full Stack Developer', company: 'WebTech', review: 'Amazing platform! The job alerts kept me updated with opportunities that matched my skills perfectly.', image: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Amanda Foster', role: 'HR Director', company: 'Global Solutions', review: 'As an employer, finding quality candidates has never been easier. Highly recommend!', image: 'https://i.pravatar.cc/150?img=10' },
  { name: 'James Anderson', role: 'DevOps Engineer', company: 'Cloud Systems', review: 'The detailed job descriptions and company profiles helped me make informed decisions. Love it!', image: 'https://i.pravatar.cc/150?img=15' },
  { name: 'Lisa Thompson', role: 'Business Analyst', company: 'Finance Group', review: 'Got my first remote job through this platform. The search filters are incredibly helpful!', image: 'https://i.pravatar.cc/150?img=20' },
  { name: 'Chris Martinez', role: 'Sales Executive', company: 'Enterprise Ltd', review: 'Within 3 weeks, I had 5 job offers to choose from. This platform truly delivers results!', image: 'https://i.pravatar.cc/150?img=33' }
];

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-6"
          >
            Find Your Dream Job Today
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 hover:scale-105 transition-all"
            >
              Browse Jobs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Job Match?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make job searching and hiring simple, efficient, and effective for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -10 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => handleCardClick('/dashboard')}
              className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Search className="text-blue-600" size={32} />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Smart Job Search</h3>
              <p className="text-gray-600">
                Advanced filters and AI-powered recommendations to find the perfect job match.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -10 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => handleCardClick('/dashboard')}
              className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Users className="text-green-600" size={32} />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Top Companies</h3>
              <p className="text-gray-600">
                Connect with leading companies and startups looking for talented professionals.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -10 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={() => handleCardClick('/dashboard')}
              className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Briefcase className="text-indigo-600" size={32} />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Easy Application</h3>
              <p className="text-gray-600">
                Apply to multiple jobs with one click and track your application status.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.2 }}
                className="text-4xl font-bold text-blue-600 mb-2"
              >10K+</motion.div>
              <div className="text-gray-600">Active Jobs</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.2 }}
                className="text-4xl font-bold text-green-600 mb-2"
              >5K+</motion.div>
              <div className="text-gray-600">Companies</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.2 }}
                className="text-4xl font-bold text-indigo-600 mb-2"
              >50K+</motion.div>
              <div className="text-gray-600">Job Seekers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="cursor-pointer"
            >
              <motion.div 
                whileHover={{ scale: 1.2 }}
                className="text-4xl font-bold text-orange-600 mb-2"
              >95%</motion.div>
              <div className="text-gray-600">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from professionals who found their dream jobs through our platform
            </p>
          </div>
        </div>
        
        <div className="relative">
          <div className="flex animate-scroll">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-96 mx-4 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">{testimonial.review}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;