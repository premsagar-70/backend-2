const { db } = require("../config/firebaseConfig");
const { collection, query, where, getDocs, setDoc, doc } = require("firebase/firestore");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

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
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("gmail", "==", gmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // If user does not exist → Create new user
      await setDoc(doc(db, "users", gmail), {
        gmail,
        name,
        role: "student",
        approved: false,
        createdAt: new Date(),
      });

      return res.status(200).json({ needLink: true });
    } else {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.officialEmail) {
        // Official email already linked
        const role = userData.role || "student";
        const payloadId = userData.rollNumber || userData.employeeNumber || userData.gmail;
        const token = jwt.sign({ id: payloadId, role }, process.env.JWT_SECRET, { expiresIn: "3h" });

        return res.status(200).json({ needLink: false, token });
      } else {
        // Official email not linked yet
        return res.status(200).json({ needLink: true });
      }
    }
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get current user from Firebase token
exports.getCurrentUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(userDoc.data());
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
