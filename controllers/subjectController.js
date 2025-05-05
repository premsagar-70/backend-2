const { db } = require("../config/firebaseConfig");
const { collection, query, where, getDocs, addDoc } = require("firebase/firestore");

const addSubject = async (req, res) => {
  const { name, department, year, semester } = req.body;
  try {
    await addDoc(collection(db, "subjects"), { name, department, year, semester });
    res.status(201).json({ message: "Subject added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding subject" });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjectRef = collection(db, "subjects");
    const snapshot = await getDocs(subjectRef);
    const subjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subjects" });
  }
};

// ✅ New function to fetch subjects by department, year, and semester
const getSubjectsByYearAndSem = async (req, res) => {
  const { department, year, semester } = req.query;

  if (!department || !year || !semester) {
    return res.status(400).json({ message: "Department, year, and semester are required" });
  }

  try {
    const subjectRef = collection(db, "subjects");
    const q = query(
      subjectRef,
      where("department", "==", department),
      where("year", "==", parseInt(year)),
      where("semester", "==", parseInt(semester))
    );
    const snapshot = await getDocs(q);
    const subjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching filtered subjects:", error);
    res.status(500).json({ error: "Error fetching filtered subjects" });
  }
};

module.exports = { addSubject, getSubjects, getSubjectsByYearAndSem };
