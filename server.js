import http from "http";
import dotenv from "dotenv";
import app from "./api.js";
import { initializeApp } from "firebase/app";
import configureSocket from "./socketConfig.js";

dotenv.config();

// Initialize Firebase Admin
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const server = http.createServer(app);

// Configure Socket.IO
const io = configureSocket(server, firebaseApp);

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default server;
