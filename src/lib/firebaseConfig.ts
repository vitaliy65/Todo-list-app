import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5wVCtNM9jJYEimYHe3IEw7lKtX9tib_c",
  authDomain: "my-todo-app-fafd7.firebaseapp.com",
  projectId: "my-todo-app-fafd7",
  storageBucket: "my-todo-app-fafd7.firebasestorage.app",
  messagingSenderId: "566887527066",
  appId: "1:566887527066:web:b47cddaa778eb3787e2523",
  measurementId: "G-JM8ZTWK6Q2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
