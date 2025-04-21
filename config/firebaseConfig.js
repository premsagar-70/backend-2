const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const dotenv = require("dotenv");

dotenv.config();

// Build serviceAccount manually from environment variables
const serviceAccount = {
  type: "service_account",
  project_id: "sret-attendance-system",
  private_key_id: "d1a5161985fa416c870b4f21dee115563783d50d",
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: "firebase-adminsdk-fbsvc@sret-attendance-system.iam.gserviceaccount.com",
  client_id: "114318675435157281536",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sret-attendance-system.iam.gserviceaccount.com"
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
