import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyb-2oot9234R5YjLGdVAdCzGHBGVztn_54",
  authDomain: "mi-porfolio-82320.firebaseapp.com",
  projectId: "mi-porfolio-82320",
  storageBucket: "mi-porfolio-82320.appspot.com",
  messagingSenderId: "41594952743",
  appId: "1:41594952743:web:e87df8b1159d2f0b5e1c42"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };