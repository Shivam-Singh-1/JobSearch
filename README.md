# Job Match Application

A full-stack job matching application built with React, Node.js, Express, and MongoDB.

## ✅ Implemented Features

### 🔐 User Authentication
- ✅ Secure JWT-based login and signup
- ✅ Role-based access control (Employer/Job Seeker)
- ✅ Protected routes and middleware
- ✅ User profile management with file uploads

### 👤 Job Seeker Features
- ✅ Browse and search jobs with advanced filters (title, location, category, job type)
- ✅ Apply to jobs with resume upload and cover letter
- ✅ View application status and history
- ✅ Save/unsave jobs for later viewing
- ✅ Personal dashboard with job listings
- ✅ Profile management (resume, skills, experience, education)
- ✅ Responsive design for all devices
- ✅ Pagination for job listings

### 🏢 Employer Features
- ✅ Post new job listings with detailed information
- ✅ Manage job postings (create, edit, delete)
- ✅ View and manage job applications
- ✅ Update application status (pending, reviewed, shortlisted)
- ✅ Company profile management with logo upload
- ✅ Dashboard with analytics and statistics
- ✅ Job analytics (application counts by status)
- ✅ Bulk job import from external sources

### 🔧 Additional Features
- ✅ Job scraping/import system for bulk job data
- ✅ File upload system for resumes, profile images, and company logos
- ✅ Advanced search and filtering capabilities
- ✅ Real-time notifications with React Hot Toast
- ✅ Loading states and error handling
- ✅ Clean, modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React (icons)
- Moment.js

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)
- CORS

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd job-match
```

2. Install all dependencies
```bash
npm run install-deps
```

3. Set up environment variables
Create a `.env` file in the backend directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start MongoDB service (if running locally)

5. Start both servers concurrently
```bash
npm run dev
```

The application will be available at:
- Frontend:https://job-match-2wlz.vercel.app/
- Backend API:(https://job-match-1.onrender.com)

## API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile (with file uploads)

### Jobs
- GET `/api/jobs` - Get all jobs (with search, filters, pagination)
- POST `/api/jobs` - Create new job (employer only)
- GET `/api/jobs/:id` - Get job details
- PUT `/api/jobs/:id` - Update job (employer only)
- DELETE `/api/jobs/:id` - Delete job (employer only)
- GET `/api/jobs/my-jobs` - Get employer's jobs
- GET `/api/jobs/:id/analytics` - Get job analytics (employer only)

### Applications
- POST `/api/applications` - Apply to job with resume upload (job seeker only)
- GET `/api/applications/my-applications` - Get user's applications
- GET `/api/applications/job/:jobId` - Get job applications (employer only)
- PUT `/api/applications/:id/status` - Update application status
- GET `/api/applications/dashboard-stats` - Get employer dashboard statistics

### Saved Jobs
- POST `/api/saved-jobs` - Save job (job seeker only)
- GET `/api/saved-jobs` - Get saved jobs
- DELETE `/api/saved-jobs/:jobId` - Remove saved job
- GET `/api/saved-jobs/check/:jobId` - Check if job is saved

### Job Scraper
- POST `/api/scraper/run` - Import jobs from external sources (employer only)

## Project Structure

```
job-match/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── uploads/         # File uploads directory
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── routes/      # Route configuration
│   │   └── api/         # API configuration
│   └── public/          # Static files
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
