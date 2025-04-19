const { db } = require("../config/firebaseConfig");
const { collection, addDoc } = require("firebase/firestore");

exports.markAttendance = async (req, res) => {
  try {
    const { records } = req.body; // { studentId: "present/absent" }

    for (const [studentId, status] of Object.entries(records)) {
      await addDoc(collection(db, "attendance"), {
        studentId,
        status,
        date: new Date().toISOString().split('T')[0]
      });
    }

    res.json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Attendance error", error);
    res.status(500).json({ message: "Server error" });
  }
};
