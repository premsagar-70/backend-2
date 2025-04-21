const { db } = require("../config/firebaseConfig");
const { collection, addDoc, getDocs } = require("firebase/firestore");

const addteacher = async (req, res) => {
  const { name, email, empID, department, subjects, password } = req.body; // <-- notice empID

  try {
    await addDoc(collection(db, "users"), {
      name,
      email,
      role: "teacher",
      empID, // <-- save empID directly
      department,
      subjects,
      password,
      createdAt: new Date(),
    });
    res.status(201).json({ message: "Teacher added successfully!" });
  } catch (error) {
    console.error("Error adding teacher:", error);
    res.status(500).json({ message: "Failed to add teacher", error: error.message });
  }
};


const getteacher = async (req, res) => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const teachers = snapshot.docs
      .filter(doc => doc.data().role === "teacher") // Filter only teachers
      .map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching teachers" });
  }
};

module.exports = { addteacher, getteacher };
