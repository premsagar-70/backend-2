const { db } = require("../config/firebaseConfig");
const { collection, addDoc, getDocs } = require("firebase/firestore");

const addDepartment = async (req, res) => {
  const { name } = req.body;
  try {
    await addDoc(collection(db, "departments"), { name });
    res.status(201).json({ message: "Department added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding department" });
  }
};

const getDepartments = async (req, res) => {
  try {
    const deptRef = collection(db, "departments");
    const snapshot = await getDocs(deptRef);
    const departments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching departments" });
  }
};

module.exports = { addDepartment, getDepartments };
