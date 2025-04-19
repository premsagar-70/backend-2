const express = require("express");
const { loginWithEmailPassword, verifyEmail, loginWithGoogle } = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginWithEmailPassword);
router.post("/verify-email", verifyEmail);
router.post("/google-login", loginWithGoogle);

module.exports = router;
