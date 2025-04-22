const { db } = require("../config/firebaseConfig");
const { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, setDoc } = require("firebase/firestore");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.addStudent = async (req, res) => {
  try {
    const { name, rollNumber, email, year, semester, department, subjects, officialEmail } = req.body;

    console.log("Received student data:", { name, rollNumber, email, year, semester, department, subjects, officialEmail });

    if (!name || !rollNumber || !email || !year || !semester || !department || !officialEmail) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const usersRef = collection(db, "users");

    await addDoc(usersRef, {
      name,
      rollNumber,
      email,
      year,
      semester,
      department,
      subjects,
      officialEmail,
      role: "student",
      isApproved: false,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Student added. Waiting for approval." });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Failed to add student" });
  }
};

// ✅ Get Students pending for approval
exports.getPendingStudents = async (req, res) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("isApproved", "==", false));
    const snapshot = await getDocs(q);

    const students = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(students);
  } catch (error) {
    console.error("Error fetching pending students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// ✅ Approve Student
exports.approveStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentDoc = doc(db, "users", studentId);

    await updateDoc(studentDoc, {
      isApproved: true
    });

    res.json({ message: "Student approved successfully" });
  } catch (error) {
    console.error("Error approving student:", error);
    res.status(500).json({ error: "Failed to approve student" });
  }
};

// ✅ Reject Student
exports.rejectStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentDoc = doc(db, "users", studentId);

    await deleteDoc(studentDoc);

    res.json({ message: "Student rejected and deleted successfully" });
  } catch (error) {
    console.error("Error rejecting student:", error);
    res.status(500).json({ error: "Failed to reject student" });
  }
};

// ✅ Link Official Mail (for Google Sign-in users linking official email)
exports.linkOfficialMail = async (req, res) => {
  const { gmail, officialEmail, rollNumber, dob, password, name } = req.body;

  if (!gmail || !officialEmail || !rollNumber || !dob || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const studentRef = doc(db, "users", gmail); // Document id is Gmail
    await setDoc(studentRef, {
      gmail,
      officialEmail,
      rollNumber,
      dob,
      password, // (Later hash this if needed)
      name,
      approved: false,
      role: "student", // ✅ Linked users are students
      createdAt: new Date()
    });

    res.status(200).json({ message: "Student linked successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to link student!" });
  }
};

exports.addStudentAdmin = async (req, res) => {
  try {
    let { name, rollNumber, email, password, year, semester, department, subjects, officialEmail } = req.body;

    console.log("Received student data (admin):", { name, rollNumber, email, password, year, semester, department, subjects, officialEmail });

    // 👑 Admin manually adding — if email is missing, use officialEmail
    if (!email && officialEmail) {
      email = officialEmail;
    }

    if (!name || !rollNumber || !email || !password || !year || !semester || !department || !officialEmail) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const usersRef = collection(db, "users");

    await addDoc(usersRef, {
      name,
      rollNumber,
      email,
      year,
      password,
      semester,
      department,
      subjects,
      officialEmail,
      role: "student",
      isApproved: false,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Student added by admin. Waiting for approval." });
  } catch (error) {
    console.error("Error adding student by admin:", error);
    res.status(500).json({ error: "Failed to add student by admin" });
  }
};
