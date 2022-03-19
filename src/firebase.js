// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBa6xOOKAt58W_Ygee3XGzW2whYw9NwxYo",
  authDomain: "mern-admin-f9483.firebaseapp.com",
  projectId: "mern-admin-f9483",
  storageBucket: "mern-admin-f9483.appspot.com",
  messagingSenderId: "815206529996",
  appId: "1:815206529996:web:7ec9f37d135f66c04a7b69",
  measurementId: "G-6M67S62V2D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app ;