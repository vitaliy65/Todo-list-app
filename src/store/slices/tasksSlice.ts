import { Task } from "@/types/types";
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

const fetchTasks = createAsyncThunk<
  Task[],
  { authorId: string },
  { rejectValue: string[] }
>("task/fetchTasks", async ({ authorId }, { rejectWithValue }) => {
  try {
    const q = query(collection(db, "tasks"), where("authorId", "==", authorId));
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() } as Task);
    });
    return tasks;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Невідома помилка";
    return rejectWithValue([message]);
  }
});

const createTask = createAsyncThunk<
  Task,
  { title: string; description: string; listId: string; authorId: string },
  { rejectValue: string[] }
>(
  "task/createTask",
  async ({ title, description, listId, authorId }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        title,
        description,
        listId,
        authorId,
        isCompleted: false,
      });
      return {
        id: docRef.id,
        title,
        description,
        listId,
        authorId,
        isCompleted: false,
      };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Невідома помилка";
      return rejectWithValue([message]);
    }
  }
);

const deleteTask = createAsyncThunk<
  string,
  { id: string },
  { rejectValue: string[] }
>("task/deleteTask", async ({ id }, { rejectWithValue }) => {
  try {
    await deleteDoc(doc(db, "tasks", id));
    return id;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Невідома помилка";
    return rejectWithValue([message]);
  }
});

const editTask = createAsyncThunk<
  Task,
  { id: string; title?: string; description?: string; isCompleted?: boolean },
  { rejectValue: string[] }
>(
  "task/editTask",
  async ({ id, title, description, isCompleted }, { rejectWithValue }) => {
    try {
      const taskRef = doc(db, "tasks", id);
      const updateData: {
        title?: string;
        description?: string;
        isCompleted?: boolean;
      } = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

      await updateDoc(taskRef, updateData);

      const docSnap = await getDoc(taskRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Task;
      } else {
        return rejectWithValue(["Завдання не знайдено"]);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Невідома помилка";
      return rejectWithValue([message]);
    }
  }
);

const initialState: { isPending: boolean; errors: string[]; tasks: Task[] } = {
  isPending: false,
  errors: [],
  tasks: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isPending = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Невідома помилка"];
      })
      .addCase(createTask.pending, (state) => {
        state.isPending = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isPending = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Невідома помилка"];
      })
      .addCase(deleteTask.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isPending = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Невідома помилка"];
      })
      .addCase(editTask.pending, (state) => {
        state.isPending = true;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.isPending = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Невідома помилка"];
      });
  },
});

export { fetchTasks, createTask, deleteTask, editTask };
export default taskSlice.reducer;
