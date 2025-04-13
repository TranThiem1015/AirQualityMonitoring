// config.js - Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyDkWE7pGUvKxLUdyaHYBN500bhzYCvgb8A",
    authDomain: "airqualityesp.firebaseapp.com",
    databaseURL: "https://airqualityesp-default-rtdb.firebaseio.com/",
    projectId: "airqualityesp",
    storageBucket: "airqualityesp.appspot.com",
    messagingSenderId: "628119323249",
    appId: "1:628119323249:web:f9a9cf91c5e854007a11d0"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  // Gateway color definitions
  const gatewayColors = {
    sensor_1: "#0000ff",
    sensor_2: "#ff0000"
  };