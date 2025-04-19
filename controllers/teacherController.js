const { db } = require("../config/firebaseConfig");
const { collection, addDoc, getDocs } = require("firebase/firestore");

const addteacher = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    await addDoc(collection(db, "teacher"), { name, email, role });
    res.status(201).json({ message: "teacher added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding teacher" });
  }
};

const getteacher = async (req, res) => {
  try {
    const teacherRef = collection(db, "teacher");
    const snapshot = await getDocs(teacherRef);
    const teacher = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Error fetching teacher" });
  }
};

module.exports = { addteacher, getteacher };
