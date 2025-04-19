const express = require("express");
const { markAttendance } = require("../controllers/attendanceController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/mark", authMiddleware, markAttendance);

module.exports = router;
