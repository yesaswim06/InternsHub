const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Company = require('../models/Company');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

dotenv.config();

// Seed data
const users = [
  {
    name: 'System Admin',
    email: 'myselfadmin123@gmail.com',
    password: 'admin123', // Will be hashed via User pre-save hook
    role: 'admin',
  },
  {
    name: 'Alex Johnson',
    email: 'student@internshub.com',
    password: 'student123',
    role: 'student',
    profile: {
      bio: 'Final year computer science student interested in full-stack web applications and cloud deployments.',
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Tailwind CSS'],
      education: [
        {
          institute: 'State Technical University',
          degree: 'B.S. Computer Science',
          year: '2026',
        },
      ],
      savedInternships: [],
      github: 'https://github.com/alex-johnson',
      linkedin: 'https://linkedin.com/in/alex-johnson',
    },
  },
  {
    name: 'Emma Watson',
    email: 'company@internshub.com',
    password: 'company123',
    role: 'company',
  },
];

const seedData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/internship_db');
    console.log('Database Connected for seeding...');

    // Clear existing collection records
    await User.deleteMany();
    await Company.deleteMany();
    await Internship.deleteMany();
    await Application.deleteMany();
    console.log('Database collections cleared...');

    // Insert Users
    const createdUsers = await User.create(users);
    console.log('Sample users created...');

    // Find Company Owner ID
    const companyOwner = createdUsers.find(u => u.role === 'company');

    // Create Company Profile
    const companyProfile = await Company.create({
      user: companyOwner._id,
      companyName: 'Acme Software Corp',
      description: 'A global leader in SaaS automation, cloud engineering, and data analysis software tools.',
      website: 'https://acme-software.example.com',
      location: 'San Francisco, CA',
      status: 'approved', // Pre-approved for easy testing
    });
    console.log('Company profile created...');

    // Create Internship listings
    const internships = [
      {
        title: 'Full-Stack Developer Intern',
        company: companyProfile._id,
        description: 'Join our SaaS engineering team to work on React interfaces and Node.js REST endpoints. You will be paired with a mentor and participate in agile sprints.',
        location: 'Remote',
        workMode: 'Remote',
        duration: '6 Months',
        stipend: 1500,
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
        eligibility: 'Third/Final year CS or equivalent engineering students.',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      {
        title: 'Frontend Engineer Intern',
        company: companyProfile._id,
        description: 'Build rich interfaces using Tailwind CSS, React, and Framer Motion. Work closely with product designers to design glassmorphic dashboards and web applications.',
        location: 'San Francisco, CA',
        workMode: 'Hybrid',
        duration: '3 Months',
        stipend: 1200,
        skills: ['React', 'CSS', 'Tailwind CSS', 'Framer Motion'],
        eligibility: 'Students pursuing design or development degree program.',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      },
    ];

    await Internship.create(internships);
    console.log('Sample internship postings created...');

    console.log('Database Seeding Successful! Exiting...');
    process.exit();
  } catch (err) {
    console.error(`Seeding Failed: ${err.message}`);
    process.exit(1);
  }
};

// Execute seeding
seedData();
