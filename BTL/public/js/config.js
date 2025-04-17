// config.js - Firebase configuration

// Firebase project configuration credentials
const firebaseConfig = {
  apiKey: "AIzaSyDkWE7pGUvKxLUdyaHYBN500bhzYCvgb8A", // Unique key for accessing Firebase APIs
  authDomain: "airqualityesp.firebaseapp.com", // Firebase Auth domain
  databaseURL: "https://airqualityesp-default-rtdb.firebaseio.com/", // Realtime Database URL
  projectId: "airqualityesp", // Firebase project ID
  storageBucket: "airqualityesp.appspot.com", // Cloud storage bucket
  messagingSenderId: "628119323249", // Firebase Cloud Messaging sender ID
  appId: "1:628119323249:web:f9a9cf91c5e854007a11d0" // Firebase App ID
};

// Initialize Firebase app using the config above
firebase.initializeApp(firebaseConfig);

// Reference to Firebase Realtime Database
const db = firebase.database();

// Color definitions for each sensor gateway (used for markers on the map)
const gatewayColors = {
  sensor_1: "#0000ff", // Blue for sensor_1
  sensor_2: "#ff0000"  // Red for sensor_2
};
