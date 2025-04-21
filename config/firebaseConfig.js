const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const dotenv = require("dotenv");

dotenv.config();

// Build serviceAccount manually from environment variables
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  token_uri: "https://oauth2.googleapis.com/token",
};

// Initialize firebase-admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Your frontend app Firebase config (hardcoded is fine)
const firebaseConfig = {
  apiKey: "AIzaSyB8AwWHZ1a2ILz3e9Jd5QS8oyF7yICVxoQ",
  authDomain: "sret-attendance-system.firebaseapp.com",
  projectId: "sret-attendance-system",
  storageBucket: "sret-attendance-system.appspot.com",  // Small mistake fixed here: should be `.appspot.com`
  messagingSenderId: "113964882762",
  appId: "1:113964882762:web:b62c3c87a05fa7ef1d7fb3",
};

// Initialize app and services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db, admin };
