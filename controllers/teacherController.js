const { db } = require("../config/firebaseConfig");
const { collection, addDoc, getDocs } = require("firebase/firestore");

const addteacher = async (req, res) => {
  const { name, email, empId, password, role, subject, department } = req.body;  // Make sure to destructure subject and department
  
  // Generate official email based on empId if it's provided
  const officialEmail = empId ? `${empId}@sreerama.ac.in` : email;
  
  try {
    // Store the teacher in the 'users' collection
    await addDoc(collection(db, "users"), {
      name,
      email: officialEmail,  // Use the official email generated from empId or provided email
      role: "teacher",  // Assign the role as teacher
      password,
      empId,
      subject,  // Add the subject field
      department,  // Add the department field
      createdAt: new Date(),
    });
    res.status(201).json({ message: "Teacher added successfully!" });
  } catch (error) {
    console.error("Error adding teacher:", error);
    res.status(500).json({ error: "Error adding teacher" });
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
