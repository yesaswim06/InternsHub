const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');

// Load environment variables
dotenv.config();

// Validate required environment variables on startup
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length > 0) {
  console.error('\n❌ CRITICAL STARTUP ERROR: Missing required environment variables:');
  missingEnv.forEach((env) => {
    console.error(`   - ${env}`);
  });
  console.error('\nPlease check your deployment settings and configure these variables.\n');
  if (process.env.NODE_ENV === 'production') {
    console.error('Exiting startup to prevent running in an unstable state.');
    process.exit(1);
  }
}

// Connect to Database asynchronously
connectDB();

const app = express();

// Production-ready CORS Configuration
const allowedOrigins = [
  'https://internshub-06.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked request from unauthorized origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());

// Serve Static Upload Folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(dbStatus.connected ? 200 : 500).json({
    success: dbStatus.connected,
    status: dbStatus.connected ? 'healthy' : 'degraded',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'production',
    database: {
      connected: dbStatus.connected,
      error: dbStatus.error,
      tip: dbStatus.tip
    }
  });
});

// Base route with user-friendly HTML error page if database is offline
app.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  if (!dbStatus.connected) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>InternsHub API - Database Error</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; background-color: #fdfaf7; color: #8a1f11; }
            .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); max-width: 650px; margin: 40px auto; border-top: 6px solid #d9534f; }
            h1 { margin-top: 0; color: #c9302c; font-size: 24px; }
            pre { background: #fdf2f2; padding: 15px; border-radius: 6px; overflow-x: auto; color: #b94a48; border: 1px solid #eed3d7; font-family: monospace; font-size: 14px; }
            .tip { color: #31708f; background-color: #d9edf7; border: 1px solid #bce8f1; padding: 15px; border-radius: 6px; margin-top: 20px; line-height: 1.5; }
            .badge { display: inline-block; padding: 4px 8px; background: #eed3d7; color: #b94a48; border-radius: 4px; font-size: 12px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>⚠️ Database Connection Issue</h1>
            <p>The <strong>InternsHub Web API</strong> initialized successfully, but it is currently unable to communicate with the MongoDB database.</p>
            <span class="badge">Connection Status: OFFLINE</span>
            <h3>Error Logs:</h3>
            <pre>${dbStatus.error || 'Unknown Mongoose Connection Timeout'}</pre>
            <div class="tip">
              <strong>💡 Actionable Troubleshooting Tips:</strong>
              <ul>
                <li><strong>Whitelisting Check:</strong> Log into MongoDB Atlas, navigate to "Network Access", and add <code>0.0.0.0/0</code> (Access from Anywhere) to permit cloud servers like Railway to connect.</li>
                <li><strong>Variables Audit:</strong> Verify the <code>MONGO_URI</code> environment variable is set correctly in your Railway dashboard and contains the right password and database name.</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `);
  }
  res.send('Internship Management System API is running...');
});

// Custom 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server Error Stack:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
