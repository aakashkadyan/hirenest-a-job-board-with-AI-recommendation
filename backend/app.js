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

const corsOptions = {
  origin: 'https://hirenest-frontend.vercel.app',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS globally
app.use(cors(corsOptions));

//Respond to preflight requests
app.options('*', cors(corsOptions));


// Middleware

app.use(bodyParser.json());
app.use(express.static('static'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database and start server only after successful connection
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();


    app.use((req, res, next) => {

      console.log(`[${req.method}] ${req.url}`);
        next();
      });
    app.use('/api/jobs', jobRoute);
    app.use('/api/applications', applicationRoute);
    app.use('/api/employerprofile', employerprofileRoute);
    app.use('/api/recommendation', recommendationRoute);
    app.use('/api/jobseekers', JobSeekerRoute);
    app.use('/api/send-email', emailNotification);
    app.use('/api/email', emailNotification);
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use(signUpRouter);
    app.use(loginRouter);

    
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
      console.log(`Server running on port - ${process.env.BASE_URL}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Attempting to kill the process...`);
        server.listen(PORT);
      } else {
        console.error('Error starting server:', err);
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
