const express = require("express");
const { addSubject, getSubjects, getSubjectsByYearAndSem  } = require("../controllers/subjectController");

const router = express.Router();
router.post("/add", addSubject);
router.get("/", getSubjects);
router.get("/filtered", getSubjectsByYearAndSem);

module.exports = router;
