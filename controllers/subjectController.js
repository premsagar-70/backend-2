const { db } = require("../config/firebaseConfig");
const { collection, addDoc, getDocs } = require("firebase/firestore");

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

module.exports = { addSubject, getSubjects };
