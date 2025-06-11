const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const User = require("./models/User");
const path = require("path");

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

// ✅ CORS Configuration
// CORS Config
const corsOptions = {
  origin: 'https://hirenest-app-frontend.vercel.app',
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Handle preflight
app.options('*', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://hirenest-app-frontend.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// ✅ Apply CORS globally
app.use(cors(corsOptions));

// ✅ Handle preflight requests with CORS headers
app.options("*", cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    // Routes
    app.use("/api/jobs", jobRoute);
    app.use("/api/applications", applicationRoute);
    app.use("/api/employerprofile", employerprofileRoute);
    app.use("/api/recommendation", recommendationRoute);
    app.use("/api/jobseekers", JobSeekerRoute);
    app.use("/api/send-email", emailNotification);
    app.use("/api/email", emailNotification);
    app.use("/api", signUpRouter);
    app.use("/api", loginRouter);

    // Error handler with CORS headers
    app.use((err, req, res, next) => {
      console.error("Error:", err.stack);
      res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.status(500).send("Something broke!");
    });

    // 404 handler with CORS headers
    app.use((req, res) => {
      console.log("404 - Not Found:", req.url);
      res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.status(404).send("Page not found");
    });

    // Start server
    const PORT = process.env.PORT || 5002;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Base URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
    });

    // Handle server errors
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Trying another port...`);
        const newPort = PORT + 1;
        app.listen(newPort, () => {
          console.log(`Server running on port ${newPort} (fallback)`);
        });
      } else {
        console.error("Server error:", err);
      }
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// ✅ Start the server
startServer();
