export interface Participant {
  userId: string; // UID користувача
  role: "admin" | "viewer"; // права доступу
}

export interface User {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  password: string;
}

export interface List {
  id: string; // Firestore auto‑ID
  title: string;
  ownerId: string; // той самий userId, який має роль admin
  participants: Participant[]; // масив учасників (включно з owner)
}

export interface Task {
  id: string;
  listId: string; // зв'язок з List.id
  title: string;
  description?: string;
  isCompleted: boolean;
  authorId: string; // хто створив
}
