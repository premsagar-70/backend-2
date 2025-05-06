const express = require("express");
const { loginWithEmailPassword, verifyEmail, loginWithGoogle, getCurrentUser,} = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginWithEmailPassword);
router.post("/verify-email", verifyEmail);
router.post("/google-login", loginWithGoogle);
router.get("/me", getCurrentUser); // ⬅️ New route

module.exports = router;
