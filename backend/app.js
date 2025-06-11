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
const JobSeekerRoute = require("./routes/jobSeekerRoute");
const emailNotification = require("./routes/emailNotification");

dotenv.config();

// Initialize app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'https://hirenest-app-frontend.vercel.app',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS globally
app.use(cors(corsOptions));

// Respond to preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Database connected successfully');

    // API Routes
    app.use('/api/jobs', jobRoute);
    app.use('/api/applications', applicationRoute);
    app.use('/api/employerprofile', employerprofileRoute);
    app.use('/api/recommendation', recommendationRoute);
    app.use('/api/jobseekers', JobSeekerRoute);
    app.use('/api/send-email', emailNotification);
    app.use('/api/email', emailNotification);
    app.use('/api', signUpRouter);
    app.use('/api', loginRouter);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err.stack);
      res.status(500).send('Something broke!');
    });

    // Handle 404
    app.use((req, res) => {
      console.log('404 - Not Found:', req.url);
      res.status(404).send('Page not found');
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
        console.error(`Port ${PORT} is already in use. Trying another port...`);
        // Try using a different port
        const newPort = PORT + 1;
        app.listen(newPort, () => {
          console.log(`Server running on port ${newPort} (fallback)`);
          console.log(`Base URL: ${process.env.BASE_URL || `http://localhost:${newPort}`}`);
        });
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