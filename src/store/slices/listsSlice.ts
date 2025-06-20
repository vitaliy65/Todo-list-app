import { List, User } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from "@/lib/firebaseConfig";
import {
  doc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

const fetchLists = createAsyncThunk<
  List[],
  { ownerId: string },
  { rejectValue: string[] }
>("list/fetchLists", async ({ ownerId }, { rejectWithValue }) => {
  try {
    const q = query(collection(db, "lists"), where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    const lists: List[] = [];
    querySnapshot.forEach((doc) => {
      lists.push({ id: doc.id, ...doc.data() } as List);
    });
    return lists;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Невідома помилка";
    return rejectWithValue([message]);
  }
});

const createList = createAsyncThunk<
  List,
  { title: string; ownerId: string },
  { rejectValue: string[] }
>("list/createList", async ({ title, ownerId }, { rejectWithValue }) => {
  try {
    const docRef = await addDoc(collection(db, "lists"), {
      title,
      ownerId,
      participants: [{ userId: ownerId, role: "admin" }],
      createdAt: new Date().toISOString(),
    });
    return {
      id: docRef.id,
      title,
      ownerId,
      participants: [{ userId: ownerId, role: "admin" }],
      createdAt: new Date().toISOString(),
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Невідома помилка";
    return rejectWithValue([message]);
  }
});

const deleteList = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string[] }
>("list/deleteList", async ({ id }, { rejectWithValue }) => {
  try {
    await deleteDoc(doc(db, "lists", id));
    return id;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Невідома помилка";
    return rejectWithValue([message]);
  }
});

const editList = createAsyncThunk<
  List,
  { id: string; title: string },
  { rejectValue: string[] }
>("list/editList", async ({ id, title }, { rejectWithValue }) => {
  try {
    const listRef = doc(db, "lists", id);
    const listSnap = await getDoc(listRef);
    if (!listSnap.exists()) {
      return rejectWithValue(["Список не знайдено"]);
    }
    const existingList = listSnap.data() as List;

    await updateDoc(listRef, {
      title: title,
    });

    return { ...existingList, id, title: title };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Невідома помилка";
    return rejectWithValue([message]);
  }
});

const shareList = createAsyncThunk<
  List,
  { listId: string; email: string; role: "admin" | "viewer" },
  { rejectValue: string[] }
>("list/shareList", async ({ listId, email, role }, { rejectWithValue }) => {
  try {
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return rejectWithValue([
        "Користувача з такою електронною поштою не знайдено.",
      ]);
    }

    const foundUser = userSnapshot.docs[0].data() as User;

    const listRef = doc(db, "lists", listId);
    const listSnap = await getDoc(listRef);

    if (!listSnap.exists()) {
      return rejectWithValue(["Список не знайдено."]);
    }

    const existingList = listSnap.data() as List;
    const updatedParticipants = [...existingList.participants];
    const participantIndex = updatedParticipants.findIndex(
      (p) => p.userId === foundUser.id
    );

    if (participantIndex !== -1) {
      if (updatedParticipants[participantIndex].role !== role) {
        updatedParticipants[participantIndex] = { userId: foundUser.id, role };
      }
    } else {
      updatedParticipants.push({ userId: foundUser.id, role });
    }

    await updateDoc(listRef, {
      participants: updatedParticipants,
    });

    return { ...existingList, participants: updatedParticipants };
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : "Невідома помилка під час надання доступу.";
    return rejectWithValue([message]);
  }
});

const initialState: { isPending: boolean; errors: string[]; lists: List[] } = {
  isPending: false,
  errors: [],
  lists: [],
};

const listsSlice = createSlice({
  name: "list",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.isPending = true;
        state.errors = [];
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.isPending = false;
        state.errors = [];
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Помилка завантаження списків"];
      })

      .addCase(createList.pending, (state) => {
        state.isPending = true;
        state.errors = [];
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.isPending = false;
        state.errors = [];
        state.lists.push(action.payload);
      })
      .addCase(createList.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Помилка створення списку"];
      })

      .addCase(deleteList.pending, (state) => {
        state.isPending = true;
        state.errors = [];
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.isPending = false;
        state.errors = [];
        state.lists = state.lists.filter((list) => list.id !== action.payload);
      })
      .addCase(deleteList.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Помилка видалення списку"];
      })

      .addCase(editList.pending, (state) => {
        state.isPending = true;
        state.errors = [];
      })
      .addCase(editList.fulfilled, (state, action) => {
        state.isPending = false;
        state.errors = [];
        const index = state.lists.findIndex(
          (list) => list.id === action.payload.id
        );
        if (index !== -1) {
          state.lists = state.lists.map((list) =>
            list.id === action.payload.id ? action.payload : list
          );
        }
      })
      .addCase(editList.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Помилка редагування списку"];
      })

      .addCase(shareList.pending, (state) => {
        state.isPending = true;
        state.errors = [];
      })
      .addCase(shareList.fulfilled, (state, action) => {
        state.isPending = false;
        state.errors = [];
        const index = state.lists.findIndex(
          (list) => list.id === action.payload.id
        );
        if (index !== -1) {
          state.lists = state.lists.map((list) =>
            list.id === action.payload.id ? action.payload : list
          );
        }
      })
      .addCase(shareList.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Помилка надання доступу до списку"];
      });
  },
});

export { fetchLists, createList, deleteList, editList, shareList };
export default listsSlice.reducer;
