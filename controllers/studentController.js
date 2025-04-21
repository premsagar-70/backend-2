// backend/controllers/studentController.js
const { db, admin } = require("../config/firebaseConfig");
const { doc, setDoc, getDoc, collection, query, where, getDocs } = require("firebase/firestore");
const bcrypt = require("bcryptjs");

exports.addStudent = async (req, res) => {
  try {
    const { name, rollNumber, email, year, semester, department, subjects } = req.body;

    const usersRef = collection(db, "users");

    await addDoc(usersRef, {
      name,
      rollNumber,
      email,
      year,
      semester,
      department,
      subjects,
      isApproved: false, // ❗ Added isApproved = false initially
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Student added. Waiting for approval." });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Failed to add student" });
  }
};

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

exports.approveStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentDoc = doc(db, "students", studentId);

    await updateDoc(studentDoc, {
      isApproved: true
    });

    res.json({ message: "Student approved successfully" });
  } catch (error) {
    console.error("Error approving student:", error);
    res.status(500).json({ error: "Failed to approve student" });
  }
};

exports.rejectStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentDoc = doc(db, "students", studentId);

    await deleteDoc(studentDoc);

    res.json({ message: "Student rejected and deleted successfully" });
  } catch (error) {
    console.error("Error rejecting student:", error);
    res.status(500).json({ error: "Failed to reject student" });
  }
};

exports.linkOfficialMail = async (req, res) => {
  const { gmail, officialEmail, rollNumber, dob, password, name } = req.body;

  if (!gmail || !officialEmail || !rollNumber || !dob || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const studentRef = doc(db, "students", gmail); // Document id is Gmail
    await setDoc(usersRef, {
      gmail,
      officialEmail,
      rollNumber,
      dob,
      password,   // ⚠️ (Later we can hash password)
      name,
      approved: false,
      createdAt: new Date()
    });

    res.status(200).json({ message: "Student linked successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to link student!" });
  }
};