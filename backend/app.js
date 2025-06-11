const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const User = require("./models/User");
const path = require('path');
const { loginRouter } = require("./routes/login");
const signUpRouter = require("./routes/signup");
const jobRoute = require("./routes/jobRoute");
const applicationRoute = require("./routes/applicationRoute");
const employerprofileRoute = require("./routes/employerprofileRoute");
const recommendationRoute = require("./routes/recommendationRoute");
const JobSeekerRoute = require("./routes/jobSeekerRoute")
const emailNotification = require("./routes/emailNotification");

dotenv.config();

// Initialize app
const app = express();

// Remove the cors() middleware and replace with this:

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://hirenest-app-frontend.vercel.app',
    'http://localhost:3000'
  ];

  console.log('Request Origin:', origin);
  console.log('Request Method:', req.method);
  console.log('Request Path:', req.path);

  // Set CORS headers for all requests
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    res.status(200).end();
    return;
  }

  next();
});



// Request logging middleware - early in the chain
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Body parsing middleware - use only one JSON parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use(express.static('static'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Database connected successfully');

    // Routes - Define after DB connection but before error handlers
    app.use('/api/jobs', jobRoute);
    app.use('/api/applications', applicationRoute);
    app.use('/api/employerprofile', employerprofileRoute);
    app.use('/api/recommendation', recommendationRoute);
    app.use('/api/jobseekers', JobSeekerRoute);
    app.use('/api/send-email', emailNotification);
    app.use('/api/email', emailNotification);
    app.use('/api', signUpRouter);
    app.use('/api', loginRouter);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // 404 handler - must be after all routes
    app.use((req, res) => {
      console.log('404 - Not Found:', req.method, req.url);
      res.status(404).json({ error: 'Endpoint not found' });
    });

    // Error handling middleware - must be last
    app.use((err, req, res, next) => {
      console.error('Server Error:', err.stack);
      res.status(500).json({ error: 'Internal server error' });
    });

    // Start server
    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Base URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
module.exports = app;