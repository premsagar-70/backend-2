// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const { db } = require("../config/firebaseConfig");
const { getDoc, doc, query, collection, where, getDocs, setDoc } = require("firebase/firestore");

exports.loginWithEmailPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usersRef = collection(db, "users"); // Users stored in "users" collection
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    const user = snapshot.docs[0].data();

    if (user.password !== password) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    if (user.role === "student" && user.approved === false) {
      return res.status(403).json({ message: "Please contact Admin for account approval" });
    }

    const token = jwt.sign({ id: snapshot.docs[0].id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.json({ token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ message: "Email doesn't exist" });
    }

    res.json({ exists: true });
  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginWithGoogle = async (req, res) => {
  const { gmail } = req.body;

  try {
    const studentsRef = collection(db, "users");
    const q = query(studentsRef, where("gmail", "==", gmail));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const student = snapshot.docs[0].data();
      const token = jwt.sign({ id: snapshot.docs[0].id, role: student.role }, process.env.JWT_SECRET, { expiresIn: "3h" });
      return res.json({ token });
    } else {
      res.status(401).json({ message: "Link your college email first" });
    }
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
