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
  getDoc,
  where,
  query,
} from "firebase/firestore";
import { List } from "@/types/types";

export async function getLists(userId: string) {
  // Fetch all lists from the "lists" collection
  // Find all by userId in ownerId and add to array and then
  // add some more where there is userId in participants

  const listsQuery = collection(db, "lists");
  const querySnapshot = await getDocs(listsQuery);
  const lists: List[] = [];
  querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
    const listData = doc.data() as List;
    const userRole = listData.participants.find(
      (participant) => participant.userId === userId
    )?.role;
    if (
      listData.ownerId === userId ||
      listData.participants.some((participant) => participant.userId === userId)
    ) {
      lists.push({ ...listData, id: doc.id, userRole: userRole });
    }
  });
  return lists;
}

export async function createList({
  title,
  ownerId,
  participants,
}: {
  title: string;
  ownerId: string;
  participants: List["participants"];
}): Promise<string> {
  const docRef = await addDoc(collection(db, "lists"), {
    title,
    ownerId,
    participants,
  });
  return docRef.id;
}

export async function updateList({
  listId,
  title,
}: {
  listId: string;
  title: string;
}) {
  const listRef = doc(db, "lists", listId);
  await updateDoc(listRef, { title });
}

export async function deleteList(listId: string): Promise<void> {
  await deleteDoc(doc(db, "lists", listId));
}

export async function shareList({
  listId,
  email,
  role,
}: {
  listId: string;
  email: string;
  role: "admin" | "viewer";
}) {
  const listRef = doc(db, "lists", listId);
  const listSnapshot = await getDoc(listRef);

  if (!listSnapshot.exists()) {
    throw new Error("List not found");
  }

  // Найти пользователя по email
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const userQuerySnapshot = await getDocs(q);

  if (userQuerySnapshot.empty) {
    throw new Error("User not found");
  }

  const userDoc = userQuerySnapshot.docs[0];
  const userId = userDoc.id;

  const listData = listSnapshot.data() as List;
  const participants = listData.participants || [];

  // Check if the user is already a participant
  const existingParticipant = participants.find((p) => p.userId === userId);

  if (existingParticipant) {
    throw new Error("User is already a participant in this list");
  }

  // Add the new participant
  participants.push({ userId, role });

  // Update the list with the new participants array
  await updateDoc(listRef, { participants });
}
