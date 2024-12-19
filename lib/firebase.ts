// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyBg6dMLZvreD-6yzZa_QUqtwm-gy_SzMNs",
  authDomain: "gandecha-erp.firebaseapp.com",
  projectId: "gandecha-erp",
  storageBucket: "gandecha-erp.firebasestorage.app",
  messagingSenderId: "991443237799",
  appId: "1:991443237799:web:26fc24e8fc19b194dc9482",
  measurementId: "G-2H87C8CQ3P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export{auth};