const express = require("express");
const { loginWithEmailPassword, verifyEmail, loginWithGoogle, getCurrentUser,} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginWithEmailPassword);
router.post("/verify-email", verifyEmail);
router.post("/google-login", loginWithGoogle);
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
