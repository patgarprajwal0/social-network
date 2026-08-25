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

dotenv.config();

// Connect to MongoDB when its production setting is configured. Keeping the
// HTTP server available makes Azure health checks and deployment diagnostics
// work even if the database setting has not been added yet.
if (process.env.MONGO_URL) {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Successfully connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
} else {
  console.error("MONGO_URL is not configured; database features are unavailable.");
}

const imagesDirectory = path.join(__dirname, "public", "images");
const clientBuildDirectory = path.join(__dirname, "..", "client", "build");

// Serve uploaded and bundled images from the same origin as the app.
app.use("/images", express.static(imagesDirectory));

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json("File upload failed");
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

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// In Azure App Service the API serves the production React build.  Keeping the
// client and API on one origin avoids CORS and localhost configuration issues.
app.use(express.static(clientBuildDirectory));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildDirectory, "index.html"));
});

// Start the server
const port = Number(process.env.PORT) || 8800;
app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});
