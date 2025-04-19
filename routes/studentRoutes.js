// backend/routes/studentRoutes.js
const express = require("express");
const { addStudent, getPendingStudents, approveStudent, rejectStudent } = require("../controllers/studentController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addStudent);
router.get("/pending", authMiddleware, getPendingStudents);
router.put("/approve/:studentId", authMiddleware, approveStudent);
router.delete("/reject/:studentId", authMiddleware, rejectStudent);

module.exports = router;
