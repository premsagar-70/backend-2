// Firebase Admin SDK for server-side operations
const admin = require("firebase-admin");

// Firebase Web SDK for client-side operations
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

// Initialize Firebase Admin SDK with service account
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fix the newlines
  }),
});

// Firebase Web SDK Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8AwWHZ1a2ILz3e9Jd5QS8oyF7yICVxoQ",
  authDomain: "sret-attendance-system.firebaseapp.com",
  projectId: "sret-attendance-system",
  storageBucket: "sret-attendance-system.appspot.com",
  messagingSenderId: "113964882762",
  appId: "1:113964882762:web:b62c3c87a05fa7ef1d7fb3",
};

// Initialize the Web SDK
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Admin SDK and Web SDK instances for use in other files
module.exports = { auth, db, admin };
