const express = require("express");
const { addDepartment, getDepartments } = require("../controllers/departmentController");

const router = express.Router();
router.post("/add", addDepartment);
router.get("/", getDepartments);

module.exports = router;
