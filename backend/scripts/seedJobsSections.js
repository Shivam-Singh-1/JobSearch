import mongoose from 'mongoose';
import Job from '../models/Job.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedJobsSections = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    let systemUser = await User.findOne({ email: 'system@jobportal.com' });
    if (!systemUser) {
      systemUser = new User({
        name: 'Job Portal System',
        email: 'system@jobportal.com',
        password: 'system123',
        role: 'employer',
        companyName: 'Job Portal'
      });
      await systemUser.save();
    }

    // Section 1: Frontend & UI/UX (15 jobs)
    const section1 = [
      { title: 'Senior React Developer', description: 'Build modern web apps with React', location: 'San Francisco, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 130000, max: 160000 } },
      { title: 'Vue.js Developer', description: 'Create dynamic UIs with Vue.js', location: 'Austin, TX', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 95000, max: 125000 } },
      { title: 'Angular Developer', description: 'Build enterprise apps with Angular', location: 'New York, NY', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 100000, max: 130000 } },
      { title: 'UI/UX Designer', description: 'Design intuitive user experiences', location: 'Los Angeles, CA', jobType: 'full-time', category: 'Design', experienceLevel: 'mid', salary: { min: 85000, max: 115000 } },
      { title: 'Frontend Engineer', description: 'Develop responsive web interfaces', location: 'Seattle, WA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 105000, max: 135000 } },
      { title: 'Web Designer', description: 'Create visually appealing websites', location: 'Denver, CO', jobType: 'full-time', category: 'Design', experienceLevel: 'mid', salary: { min: 70000, max: 95000 } },
      { title: 'JavaScript Developer', description: 'Build interactive web applications', location: 'Chicago, IL', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 90000, max: 120000 } },
      { title: 'CSS Specialist', description: 'Expert in modern CSS and animations', location: 'Portland, OR', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 80000, max: 105000 } },
      { title: 'React Native Developer', description: 'Build cross-platform mobile apps', location: 'Miami, FL', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 100000, max: 130000 } },
      { title: 'Frontend Intern', description: 'Learn frontend development', location: 'Remote', jobType: 'internship', category: 'Technology', experienceLevel: 'entry', salary: { min: 20, max: 25 } },
      { title: 'UX Researcher', description: 'Conduct user research and testing', location: 'San Diego, CA', jobType: 'full-time', category: 'Design', experienceLevel: 'mid', salary: { min: 90000, max: 115000 } },
      { title: 'Product Designer', description: 'Design end-to-end product experiences', location: 'Boston, MA', jobType: 'full-time', category: 'Design', experienceLevel: 'senior', salary: { min: 110000, max: 140000 } },
      { title: 'Interaction Designer', description: 'Design user interactions and flows', location: 'Atlanta, GA', jobType: 'full-time', category: 'Design', experienceLevel: 'mid', salary: { min: 85000, max: 110000 } },
      { title: 'Visual Designer', description: 'Create stunning visual designs', location: 'Nashville, TN', jobType: 'full-time', category: 'Design', experienceLevel: 'mid', salary: { min: 75000, max: 100000 } },
      { title: 'Motion Graphics Designer', description: 'Create animated graphics and videos', location: 'Las Vegas, NV', jobType: 'full-time', category: 'Design', experienceLevel: 'mid', salary: { min: 70000, max: 95000 } }
    ];

    // Section 2: Backend & Database (15 jobs)
    const section2 = [
      { title: 'Senior Backend Developer', description: 'Build scalable server-side applications', location: 'San Francisco, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 140000, max: 180000 } },
      { title: 'Node.js Developer', description: 'Develop APIs with Node.js and Express', location: 'New York, NY', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 110000, max: 140000 } },
      { title: 'Python Developer', description: 'Build applications with Python/Django', location: 'Austin, TX', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 105000, max: 135000 } },
      { title: 'Java Developer', description: 'Enterprise Java development', location: 'Chicago, IL', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 100000, max: 130000 } },
      { title: 'Database Administrator', description: 'Manage and optimize databases', location: 'Dallas, TX', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 95000, max: 125000 } },
      { title: 'API Developer', description: 'Design and build RESTful APIs', location: 'Seattle, WA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 100000, max: 130000 } },
      { title: 'Microservices Engineer', description: 'Build distributed microservices', location: 'Denver, CO', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 125000, max: 155000 } },
      { title: 'Database Developer', description: 'Design database schemas and queries', location: 'Phoenix, AZ', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 85000, max: 115000 } },
      { title: 'Backend Engineer', description: 'Server-side development and architecture', location: 'Atlanta, GA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 95000, max: 125000 } },
      { title: 'Go Developer', description: 'Build high-performance apps with Go', location: 'San Diego, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 110000, max: 140000 } },
      { title: 'PHP Developer', description: 'Web development with PHP/Laravel', location: 'Miami, FL', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 80000, max: 105000 } },
      { title: 'Ruby Developer', description: 'Build web apps with Ruby on Rails', location: 'Portland, OR', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 95000, max: 120000 } },
      { title: 'C# Developer', description: '.NET application development', location: 'Minneapolis, MN', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 90000, max: 115000 } },
      { title: 'SQL Developer', description: 'Database development and optimization', location: 'Tampa, FL', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 75000, max: 100000 } },
      { title: 'Backend Intern', description: 'Learn backend development', location: 'Remote', jobType: 'internship', category: 'Technology', experienceLevel: 'entry', salary: { min: 20, max: 25 } }
    ];

    // Section 3: DevOps & Cloud (15 jobs)
    const section3 = [
      { title: 'Senior DevOps Engineer', description: 'Lead DevOps practices and automation', location: 'San Francisco, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 140000, max: 180000 } },
      { title: 'Cloud Architect', description: 'Design cloud infrastructure solutions', location: 'Seattle, WA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 150000, max: 190000 } },
      { title: 'AWS Engineer', description: 'Manage AWS cloud infrastructure', location: 'New York, NY', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 115000, max: 145000 } },
      { title: 'Kubernetes Engineer', description: 'Container orchestration with K8s', location: 'Austin, TX', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 120000, max: 150000 } },
      { title: 'Site Reliability Engineer', description: 'Ensure system reliability and performance', location: 'Chicago, IL', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 130000, max: 165000 } },
      { title: 'Infrastructure Engineer', description: 'Build and maintain infrastructure', location: 'Denver, CO', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 105000, max: 135000 } },
      { title: 'CI/CD Engineer', description: 'Implement continuous integration pipelines', location: 'Boston, MA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 110000, max: 140000 } },
      { title: 'Cloud Security Engineer', description: 'Secure cloud environments', location: 'Washington, DC', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 125000, max: 160000 } },
      { title: 'Docker Specialist', description: 'Containerization and deployment', location: 'Los Angeles, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 100000, max: 130000 } },
      { title: 'Terraform Engineer', description: 'Infrastructure as Code with Terraform', location: 'San Diego, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 110000, max: 140000 } },
      { title: 'Azure Engineer', description: 'Microsoft Azure cloud solutions', location: 'Dallas, TX', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 105000, max: 135000 } },
      { title: 'Platform Engineer', description: 'Build developer platforms and tools', location: 'Atlanta, GA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 125000, max: 155000 } },
      { title: 'Monitoring Engineer', description: 'Implement system monitoring solutions', location: 'Phoenix, AZ', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 95000, max: 125000 } },
      { title: 'Release Engineer', description: 'Manage software releases and deployments', location: 'Miami, FL', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 100000, max: 130000 } },
      { title: 'DevOps Intern', description: 'Learn DevOps practices', location: 'Remote', jobType: 'internship', category: 'Technology', experienceLevel: 'entry', salary: { min: 22, max: 28 } }
    ];

    // Section 4: Data & AI (15 jobs)
    const section4 = [
      { title: 'Senior Data Scientist', description: 'Lead data science initiatives', location: 'San Francisco, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 150000, max: 190000 } },
      { title: 'Machine Learning Engineer', description: 'Deploy ML models to production', location: 'New York, NY', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 140000, max: 180000 } },
      { title: 'Data Engineer', description: 'Build data pipelines and infrastructure', location: 'Seattle, WA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 120000, max: 150000 } },
      { title: 'AI Research Scientist', description: 'Research artificial intelligence', location: 'Palo Alto, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 160000, max: 220000 } },
      { title: 'Data Analyst', description: 'Analyze data and create insights', location: 'Chicago, IL', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 75000, max: 100000 } },
      { title: 'Business Intelligence Analyst', description: 'Create BI reports and dashboards', location: 'Austin, TX', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 80000, max: 105000 } },
      { title: 'Deep Learning Engineer', description: 'Build neural networks and AI models', location: 'Boston, MA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 135000, max: 175000 } },
      { title: 'Data Warehouse Developer', description: 'Design and build data warehouses', location: 'Denver, CO', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 95000, max: 125000 } },
      { title: 'Analytics Engineer', description: 'Build analytics infrastructure', location: 'Los Angeles, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 100000, max: 130000 } },
      { title: 'Computer Vision Engineer', description: 'Develop computer vision applications', location: 'San Diego, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 130000, max: 165000 } },
      { title: 'NLP Engineer', description: 'Natural language processing specialist', location: 'Atlanta, GA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 125000, max: 160000 } },
      { title: 'Big Data Engineer', description: 'Work with large-scale data systems', location: 'Dallas, TX', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 110000, max: 140000 } },
      { title: 'ETL Developer', description: 'Extract, transform, and load data', location: 'Phoenix, AZ', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 85000, max: 115000 } },
      { title: 'Statistician', description: 'Statistical analysis and modeling', location: 'Minneapolis, MN', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 80000, max: 105000 } },
      { title: 'Data Science Intern', description: 'Learn data science fundamentals', location: 'Remote', jobType: 'internship', category: 'Technology', experienceLevel: 'entry', salary: { min: 25, max: 30 } }
    ];

    // Section 5: Mobile & Gaming (15 jobs)
    const section5 = [
      { title: 'Senior iOS Developer', description: 'Lead iOS app development', location: 'San Francisco, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 130000, max: 165000 } },
      { title: 'Android Developer', description: 'Build native Android applications', location: 'New York, NY', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 110000, max: 140000 } },
      { title: 'Flutter Developer', description: 'Cross-platform mobile development', location: 'Austin, TX', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 100000, max: 130000 } },
      { title: 'Mobile App Designer', description: 'Design mobile user interfaces', location: 'Los Angeles, CA', jobType: 'full-time', category: 'Design', experienceLevel: 'mid', salary: { min: 85000, max: 115000 } },
      { title: 'Game Developer', description: 'Create engaging video games', location: 'Seattle, WA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 95000, max: 125000 } },
      { title: 'Unity Developer', description: 'Game development with Unity engine', location: 'Chicago, IL', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 90000, max: 120000 } },
      { title: 'Mobile QA Tester', description: 'Test mobile applications', location: 'Denver, CO', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 65000, max: 85000 } },
      { title: 'AR/VR Developer', description: 'Augmented and virtual reality apps', location: 'San Diego, CA', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 120000, max: 155000 } },
      { title: 'Game Designer', description: 'Design game mechanics and experiences', location: 'Atlanta, GA', jobType: 'full-time', category: 'Design', experienceLevel: 'mid', salary: { min: 75000, max: 100000 } },
      { title: 'Mobile Backend Developer', description: 'Backend services for mobile apps', location: 'Boston, MA', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 105000, max: 135000 } },
      { title: 'Xamarin Developer', description: 'Cross-platform apps with Xamarin', location: 'Dallas, TX', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 95000, max: 125000 } },
      { title: 'Mobile DevOps Engineer', description: 'CI/CD for mobile applications', location: 'Phoenix, AZ', jobType: 'full-time', category: 'Technology', experienceLevel: 'mid', salary: { min: 100000, max: 130000 } },
      { title: 'Game Artist', description: 'Create game graphics and animations', location: 'Miami, FL', jobType: 'full-time', category: 'Design', experienceLevel: 'mid', salary: { min: 70000, max: 95000 } },
      { title: 'Mobile Security Engineer', description: 'Secure mobile applications', location: 'Portland, OR', jobType: 'full-time', category: 'Technology', experienceLevel: 'senior', salary: { min: 115000, max: 145000 } },
      { title: 'Mobile Development Intern', description: 'Learn mobile app development', location: 'Remote', jobType: 'internship', category: 'Technology', experienceLevel: 'entry', salary: { min: 20, max: 25 } }
    ];

    // Section 6: Marketing & Sales (15 jobs)
    const section6 = [
      { title: 'Digital Marketing Manager', description: 'Lead digital marketing strategies', location: 'New York, NY', jobType: 'full-time', category: 'Marketing', experienceLevel: 'senior', salary: { min: 85000, max: 115000 } },
      { title: 'Sales Manager', description: 'Lead sales team and drive revenue', location: 'San Francisco, CA', jobType: 'full-time', category: 'Sales', experienceLevel: 'senior', salary: { min: 95000, max: 130000 } },
      { title: 'Content Marketing Specialist', description: 'Create engaging marketing content', location: 'Austin, TX', jobType: 'full-time', category: 'Marketing', experienceLevel: 'mid', salary: { min: 60000, max: 80000 } },
      { title: 'Account Executive', description: 'Manage client relationships', location: 'Chicago, IL', jobType: 'full-time', category: 'Sales', experienceLevel: 'mid', salary: { min: 70000, max: 100000 } },
      { title: 'SEO Specialist', description: 'Optimize for search engines', location: 'Los Angeles, CA', jobType: 'full-time', category: 'Marketing', experienceLevel: 'mid', salary: { min: 65000, max: 85000 } },
      { title: 'Business Development Manager', description: 'Identify new business opportunities', location: 'Seattle, WA', jobType: 'full-time', category: 'Sales', experienceLevel: 'senior', salary: { min: 90000, max: 125000 } },
      { title: 'Social Media Manager', description: 'Manage social media presence', location: 'Miami, FL', jobType: 'full-time', category: 'Marketing', experienceLevel: 'mid', salary: { min: 55000, max: 75000 } },
      { title: 'Inside Sales Representative', description: 'Remote sales and lead generation', location: 'Remote', jobType: 'full-time', category: 'Sales', experienceLevel: 'entry', salary: { min: 45000, max: 65000 } },
      { title: 'Brand Manager', description: 'Develop brand strategy', location: 'Boston, MA', jobType: 'full-time', category: 'Marketing', experienceLevel: 'senior', salary: { min: 90000, max: 120000 } },
      { title: 'Customer Success Manager', description: 'Ensure customer satisfaction', location: 'Denver, CO', jobType: 'full-time', category: 'Sales', experienceLevel: 'mid', salary: { min: 75000, max: 95000 } },
      { title: 'PPC Specialist', description: 'Manage paid advertising campaigns', location: 'Atlanta, GA', jobType: 'full-time', category: 'Marketing', experienceLevel: 'mid', salary: { min: 60000, max: 80000 } },
      { title: 'Enterprise Sales Executive', description: 'Sell to large enterprise clients', location: 'Dallas, TX', jobType: 'full-time', category: 'Sales', experienceLevel: 'senior', salary: { min: 110000, max: 150000 } },
      { title: 'Growth Marketing Manager', description: 'Drive user acquisition and growth', location: 'San Diego, CA', jobType: 'full-time', category: 'Marketing', experienceLevel: 'senior', salary: { min: 95000, max: 125000 } },
      { title: 'Sales Development Representative', description: 'Qualify leads and set appointments', location: 'Phoenix, AZ', jobType: 'full-time', category: 'Sales', experienceLevel: 'entry', salary: { min: 50000, max: 70000 } },
      { title: 'Marketing Analytics Manager', description: 'Analyze marketing performance', location: 'Minneapolis, MN', jobType: 'full-time', category: 'Marketing', experienceLevel: 'senior', salary: { min: 85000, max: 115000 } }
    ];

    // Section 7: Finance & Operations (10 jobs)
    const section7 = [
      { title: 'Financial Analyst', description: 'Analyze financial data and trends', location: 'New York, NY', jobType: 'full-time', category: 'Finance', experienceLevel: 'mid', salary: { min: 75000, max: 95000 } },
      { title: 'Operations Manager', description: 'Oversee daily business operations', location: 'Chicago, IL', jobType: 'full-time', category: 'Operations', experienceLevel: 'senior', salary: { min: 85000, max: 115000 } },
      { title: 'Senior Accountant', description: 'Manage accounting and financial reporting', location: 'San Francisco, CA', jobType: 'full-time', category: 'Finance', experienceLevel: 'senior', salary: { min: 70000, max: 90000 } },
      { title: 'Project Manager', description: 'Lead cross-functional projects', location: 'Austin, TX', jobType: 'full-time', category: 'Operations', experienceLevel: 'senior', salary: { min: 80000, max: 110000 } },
      { title: 'Investment Banking Analyst', description: 'Support M&A and financial transactions', location: 'New York, NY', jobType: 'full-time', category: 'Finance', experienceLevel: 'entry', salary: { min: 85000, max: 110000 } },
      { title: 'Supply Chain Manager', description: 'Optimize supply chain operations', location: 'Dallas, TX', jobType: 'full-time', category: 'Operations', experienceLevel: 'senior', salary: { min: 90000, max: 120000 } },
      { title: 'Risk Management Analyst', description: 'Assess and mitigate business risks', location: 'Boston, MA', jobType: 'full-time', category: 'Finance', experienceLevel: 'mid', salary: { min: 80000, max: 100000 } },
      { title: 'Business Analyst', description: 'Analyze business processes and requirements', location: 'Seattle, WA', jobType: 'full-time', category: 'Operations', experienceLevel: 'mid', salary: { min: 70000, max: 90000 } },
      { title: 'Corporate Finance Manager', description: 'Lead corporate finance initiatives', location: 'Los Angeles, CA', jobType: 'full-time', category: 'Finance', experienceLevel: 'senior', salary: { min: 110000, max: 140000 } },
      { title: 'Quality Assurance Manager', description: 'Ensure product and service quality', location: 'Denver, CO', jobType: 'full-time', category: 'Operations', experienceLevel: 'senior', salary: { min: 75000, max: 100000 } }
    ];

    const allSections = [section1, section2, section3, section4, section5, section6, section7];
    
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    let totalJobs = 0;
    for (let i = 0; i < allSections.length; i++) {
      console.log(`\n--- Section ${i + 1} ---`);
      for (const jobData of allSections[i]) {
        const job = new Job({
          ...jobData,
          company: systemUser._id,
          requirements: ['Experience required', 'Team player', 'Problem solving'],
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        await job.save();
        console.log(`Added: ${jobData.title}`);
        totalJobs++;
      }
    }

    console.log(`\nSuccessfully seeded ${totalJobs} jobs in 7 sections!`);
    console.log('Section 1: Frontend & UI/UX (15 jobs)');
    console.log('Section 2: Backend & Database (15 jobs)');
    console.log('Section 3: DevOps & Cloud (15 jobs)');
    console.log('Section 4: Data & AI (15 jobs)');
    console.log('Section 5: Mobile & Gaming (15 jobs)');
    console.log('Section 6: Marketing & Sales (15 jobs)');
    console.log('Section 7: Finance & Operations (10 jobs)');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error);
    mongoose.connection.close();
  }
};

seedJobsSections();