const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
  apiKey: "AIzaSyB8AwWHZ1a2ILz3e9Jd5QS8oyF7yICVxoQ",
  authDomain: "sret-attendance-system.firebaseapp.com",
  projectId: "sret-attendance-system",
  storageBucket: "sret-attendance-system.firebasestorage.app",
  messagingSenderId: "113964882762",
  appId: "1:113964882762:web:b62c3c87a05fa7ef1d7fb3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db, admin };
