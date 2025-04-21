const express = require("express");
const { addteacher, getteacher } = require("../controllers/teacherController");

const router = express.Router();
router.post("/users/add", addteacher);
router.get("/users", getteacher);

module.exports = router;
