const { db } = require("../config/firebaseConfig");
const { collection, query, where, getDocs } = require("firebase/firestore");
const jwt = require("jsonwebtoken");

// ✅ Email & Password Login
exports.loginWithEmailPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Look into USERS collection for email login
    const q = query(collection(db, "users"), where("officialEmail", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(400).json({ message: "Email not found" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Check password
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Check if user is approved by admin
    if (user.approved === false) {
      return res.status(403).json({ message: "Your account is pending Admin approval" });
    }

    // Determine the role (admin, teacher, or student)
    let role = "student";
    if (user.role === "admin") {
      role = "admin";
    } else if (user.role === "teacher") {
      role = "teacher";
    }

    // Create a JWT token with the user role
    const token = jwt.sign({ id: userDoc.id, role }, process.env.JWT_SECRET, { expiresIn: "3h" });

    // Return the token and user info
    res.json({ token, user, role }); // Including role in the response

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Verify Email (before password input)
exports.verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const q = query(collection(db, "users"), where("officialEmail", "==", email));
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

// ✅ Google Login
exports.loginWithGoogle = async (req, res) => {
  const { gmail, name } = req.body;

  try {
    // Search for user by Gmail
    const q = query(collection(db, "users"), where("gmail", "==", gmail));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // ❌ No user found → Create document
      await setDoc(doc(db, "users", gmail), {
        gmail,
        name,
        role: "student",
        approved: false,
        createdAt: new Date(),
      });

      return res.status(200).json({ needLink: true });
    }

    const user = snapshot.docs[0].data();

    // Check if user is approved by admin
    if (!user.approved) {
      return res.status(401).json({ message: "Your account is pending Admin approval." });
    }

    // Determine the role (admin, teacher, or student)
    const role = user.role || "student";

    const payloadId = user.rollNumber || user.employeeNumber || user.gmail;
    const token = jwt.sign({ id: payloadId, role }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.json({ token, role });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
