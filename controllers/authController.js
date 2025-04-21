const jwt = require("jsonwebtoken");
const { db } = require("../config/firebaseConfig");
const { collection, query, where, getDocs, doc, getDoc, setDoc } = require("firebase/firestore");

// 🔥 Email & Password Login
exports.loginWithEmailPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Look into STUDENTS collection for email login
    const q = query(collection(db, "students"), where("officialEmail", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(400).json({ message: "Email not found" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (user.approved === false) {
      return res.status(403).json({ message: "Your account is pending Admin approval" });
    }

    const token = jwt.sign({ id: userDoc.id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.json({ token, user });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const q = query(collection(db, "students"), where("officialEmail", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ message: "Email doesn't exist" });
    }

    res.json({ exists: true });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/google-login
exports.loginWithGoogle = async (req, res) => {
  const { gmail, name } = req.body;

  try {
    const q = query(collection(db, "students"), where("gmail", "==", gmail));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // ❌ Not linked yet
      return res.status(200).json({ needLink: true });
    }

    const student = snapshot.docs[0].data();

    if (!student.approved) {
      return res.status(401).json({ message: "Your account is pending Admin approval." });
    }

    const token = jwt.sign({ id: student.rollNumber, role: "student" }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
