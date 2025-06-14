const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");

const { loginRouter } = require("./routes/login");
const signUpRouter = require("./routes/signup");
const jobRoute = require("./routes/jobRoute");
const applicationRoute = require("./routes/applicationRoute");
const employerprofileRoute = require("./routes/employerprofileRoute");
const recommendationRoute = require("./routes/recommendationRoute");
const JobSeekerRoute = require("./routes/jobSeekerRoute");
const emailNotification = require("./routes/emailNotification");

const app = express();

// ✅ CORS config
const corsOptions = {
  origin: "https://hirenest-app-frontend.vercel.app",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.get("/", (req, res) => {
  res.send(`
    <html>
    <head><title>HireNest API</title></head>
    <body><h1>API is running on Vercel!</h1></body>
    </html>
  `);
});

app.use("/api/jobs", jobRoute);
app.use("/api/applications", applicationRoute);
app.use("/api/employerprofile", employerprofileRoute);
app.use("/api/recommendation", recommendationRoute);
app.use("/api/jobseekers", JobSeekerRoute);
app.use("/api/send-email", emailNotification);
app.use("/api/email", emailNotification);
app.use("/api", signUpRouter);
app.use("/api", loginRouter);

// ✅ Error handlers
app.use((err, req, res, next) => {
  res.status(500).send("Something went wrong");
});
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// ✅ Export for Vercel serverless
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res); // ← THIS IS HOW VERCEL HANDLES REQUESTS
};
