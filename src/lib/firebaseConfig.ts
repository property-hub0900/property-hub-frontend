// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGzI0s4_oTxM5TovWxc_6PdcpNCEYu9rI",
  authDomain: "property-explorer-3f0f3.firebaseapp.com",
  projectId: "property-explorer-3f0f3",
  storageBucket: "property-explorer-3f0f3.firebasestorage.app",
  messagingSenderId: "871087657065",
  appId: "1:871087657065:web:ee432c579a97e60453d2f8",
  measurementId: "G-7Q7G2XX77L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
