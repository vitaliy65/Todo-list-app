import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// Register a new user
export async function Register({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Добавляем пользователя в коллекцию users
    await setDoc(doc(db, "users", userCredential.user.uid), {
      id: userCredential.user.uid,
      name,
      email,
      createdAt: new Date().toISOString(),
    });
    return { user: userCredential.user };
  } catch (error) {
    throw new Error(
      `Registration failed: ${error.message.replace("Firebase: Error", "")}`
    );
  }
}

// Login an existing user
export async function Login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const loggedInUser = {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName || "",
    };
    return loggedInUser;
  } catch {
    throw new Error(`Login failed: неверный email или пароль`);
  }
}

export async function AuthUser() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const loggedInUser = {
          id: user.uid,
          email: user.email,
          name: user.displayName || "",
        };
        resolve(loggedInUser);
      } else {
        reject(new Error("User is not authenticated"));
      }
    });
  });
}
