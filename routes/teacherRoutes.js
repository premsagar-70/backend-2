const express = require("express");
const { addteacher, getteacher } = require("../controllers/teacherController");

const router = express.Router();
router.post("/add", addteacher);
router.get("/", getteacher);

module.exports = router;
