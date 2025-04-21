// Import Core Packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { db } = require("./config/firebaseConfig");  // Firebase DB
const { collection, query, where, getDocs, addDoc } = require("firebase/firestore");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

// Initialize Environment
dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Allow CORS (Cross-Origin)
app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/subjects", subjectRoutes);

// Auto-create Default Admin if not exist
async function createDefaultAdmin() {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", "admin@sreerama.ac.in"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Admin doesn't exist → Create it
      await addDoc(usersRef, {
        email: "admin@sreerama.ac.in",
        password:"admin#1234",
        name: "Administrator",
        role: "admin",
        approved: true,
        createdAt: new Date()
      });
      console.log("✅ Default Admin created successfully!");
    } else {
      console.log("✅ Admin already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
}

// Call createDefaultAdmin after server setup
createDefaultAdmin();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
