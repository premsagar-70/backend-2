const jwt = require("jsonwebtoken");
const { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } = require("firebase/auth");
const { db } = require("../config/firebaseConfig");
const { doc, getDoc, setDoc, collection, query, where, getDocs } = require("firebase/firestore");

const auth = getAuth();

// 🔥 Email & Password Login
exports.loginWithEmailPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const token = jwt.sign({ id: user.uid, role: "student" }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.json({ token });
  } catch (error) {
    console.error("Login error", error);
    res.status(400).json({ message: "Invalid email or password" });
  }
};

// 🔥 Verify if Email exists
exports.verifyEmail = async (req, res) => {
  const { email } = req.body;
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return res.status(404).json({ message: "Email doesn't exist" });
  }
  res.json({ exists: true });
};

// 🔥 Login with Google
exports.loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  const decodedToken = await auth.verifyIdToken(idToken);

  const { email } = decodedToken;

  // Check if Gmail already linked
  const q = query(collection(db, "students"), where("gmail", "==", email));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const user = snapshot.docs[0].data();
    const token = jwt.sign({ id: user.id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "3h" });

    return res.json({ token });
  } else {
    // Student needs to link official college email
    res.status(401).json({ message: "Link your college email first" });
  }
};
