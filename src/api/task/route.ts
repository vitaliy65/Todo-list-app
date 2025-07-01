import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { Task } from "@/types/types";

export async function getTasks(): Promise<Task[]> {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
}

export async function createTask({
  listId,
  title,
  description,
  isCompleted,
  authorId,
}: {
  listId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  authorId: string; // Optional field for the task creator
}): Promise<string> {
  const docRef = await addDoc(collection(db, "tasks"), {
    listId,
    title,
    description,
    isCompleted,
    authorId,
  });
  return docRef.id;
}

export async function updateTask({
  taskId,
  title,
  description,
  isCompleted,
}: {
  taskId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
}) {
  const listRef = doc(db, "tasks", taskId);
  console.log("Updating task:", taskId, title, description, isCompleted);
  await updateDoc(listRef, { title, description, isCompleted });
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, "tasks", taskId));
}
