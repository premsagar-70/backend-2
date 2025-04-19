// backend/controllers/studentController.js
const { db, admin } = require("../config/firebaseConfig");
const { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where } = require("firebase/firestore");

exports.addStudent = async (req, res) => {
  try {
    const { name, rollNumber, email, year, semester, department, subjects } = req.body;

    const studentsRef = collection(db, "students");

    await addDoc(studentsRef, {
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
    const studentsRef = collection(db, "students");
    const q = query(studentsRef, where("isApproved", "==", false));
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
