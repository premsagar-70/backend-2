// backend/routes/studentRoutes.js
const express = require("express");
const { addStudent, getPendingStudents, approveStudent, rejectStudent, linkOfficialMail } = require("../controllers/studentController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addStudent);
router.post("/link-official-mail", linkOfficialMail);
router.get("/pending", authMiddleware, getPendingStudents);
router.put("/approve/:studentId", authMiddleware, approveStudent);
router.delete("/reject/:studentId", authMiddleware, rejectStudent);

module.exports = router;
