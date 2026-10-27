const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const announcementRoute = require("./routes/announcement"); // Import the announcement routes
const departmentRoute = require("./routes/department"); // Import the department routes
const studentOrganizationRoutes = require("./routes/studentOrganizationRoutes");
const eventRoutes = require("./routes/eventRoutes");
const internshipRoutes = require("./routes/internships");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { randomUUID } = require("crypto");
const { put } = require("@vercel/blob");

dotenv.config();

app.use(cors());

// Vercel serves these from its CDN; this keeps local development working.
if (!process.env.VERCEL) {
  app.use("/images", express.static(path.join(__dirname, "public/images")));
}

// Reuse the connection when Vercel keeps this function instance warm.
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  if (!process.env.MONGO_URL) {
    return res.status(500).json({ error: "MONGO_URL is not configured" });
  }
  try {
    await mongoose.connect(process.env.MONGO_URL);
    next();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    res.status(503).json({ error: "Database connection failed" });
  }
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype));
  },
});

// File upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Choose a supported image (max 4 MB)" });
    const extension = path.extname(req.file.originalname).toLowerCase();
    const image = await put(`uploads/${randomUUID()}${extension}`, req.file.buffer, {
      access: "public",
      contentType: req.file.mimetype,
    });
    return res.status(200).json({ url: image.url });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "File upload failed" });
  }
});

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/announcements", announcementRoute); // Add announcement route
app.use("/api/departments", departmentRoute); // Add department route
app.use("/api/clubs", studentOrganizationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/internships",internshipRoutes);

// Test routes
app.get("/", (req, res) => {
  res.send("Welcome to home");
});

app.get("/users", (req, res) => {
  res.send("Welcome to home user");
});

// Vercel imports the Express app; local development starts it as a regular server.
if (require.main === module) {
  app.listen(process.env.PORT || 8800, () => {
    console.log(`Backend server is running on port ${process.env.PORT || 8800}`);
  });
}

module.exports = app;
