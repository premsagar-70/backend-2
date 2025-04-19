const express = require("express");
const { addSubject, getSubjects } = require("../controllers/subjectController");

const router = express.Router();
router.post("/add", addSubject);
router.get("/", getSubjects);

module.exports = router;
