// backend/routes/studentRoutes.js
const express = require("express");
const { addStudent, getPendingStudents, approveStudent, rejectStudent, linkOfficialMail } = require("../controllers/studentController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Student adds themselves (needs to be logged in)
router.post("/add", authMiddleware, addStudent);

// Link Gmail to official mail
router.post("/link-official-mail", linkOfficialMail);

// Get students pending approval
router.get("/pending", authMiddleware, getPendingStudents);

// Approve a student
router.put("/approve/:studentId", authMiddleware, approveStudent);

// Reject and delete a student
router.delete("/reject/:studentId", authMiddleware, rejectStudent);

module.exports = router;
