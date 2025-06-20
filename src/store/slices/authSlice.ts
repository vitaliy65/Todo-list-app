import { User } from "@/types/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, db } from "@/lib/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

type AuthUserPayload = Omit<User, "password"> & { token: string };

interface UserInfo {
  token: string;
  errors: string[];
  isPending: boolean;
}

type AuthState = Omit<User, "password"> & UserInfo;

const authUser = createAsyncThunk<
  AuthUserPayload,
  void,
  { rejectValue: string[] }
>("auth/authUser", async (_, { rejectWithValue }) => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        resolve({
          id: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          token,
        });
      } else {
        reject(rejectWithValue(["Користувач не авторизований"]));
      }
    });
  });
});

const loginUser = createAsyncThunk<
  AuthUserPayload,
  { email: string; password: string },
  { rejectValue: string[] }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    return {
      id: cred.user.uid,
      name: cred.user.displayName || "",
      email: cred.user.email || "",
      token,
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Невідома помилка";
    return rejectWithValue([message]);
  }
});

const registerUser = createAsyncThunk<
  AuthUserPayload,
  { name: string; email: string; password: string },
  { rejectValue: string[] }
>(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      const token = await cred.user.getIdToken();

      // Додаємо користувача у Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        id: cred.user.uid,
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      return {
        id: cred.user.uid,
        name,
        email: cred.user.email || "",
        token,
      };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Невідома помилка";
      return rejectWithValue([message]);
    }
  }
);

const logoutUser = createAsyncThunk<void, void, { rejectValue: string[] }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Невідома помилка";
      return rejectWithValue([message]);
    }
  }
);

const initialState: AuthState = {
  name: "",
  email: "",
  id: "",
  token: "",
  errors: [],
  isPending: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //   auth user by token
      .addCase(authUser.pending, (state) => {
        state.isPending = true;
        state.errors = [];
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.isPending = false;
        state.errors = [];
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.token = action.payload.token;
      })
      .addCase(authUser.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Помилка авторизації"];
        state.id = "";
        state.name = "";
        state.email = "";
        state.token = "";
      })

      //   login user
      .addCase(loginUser.pending, (state) => {
        state.isPending = true;
        state.errors = [];
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isPending = false;
        state.errors = [];
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Помилка входу"];
      })

      //   register user
      .addCase(registerUser.pending, (state) => {
        state.isPending = true;
        state.errors = [];
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isPending = false;
        state.errors = [];
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isPending = false;
        state.errors = action.payload || ["Помилка реєстрації"];
      })

      //   logout user
      .addCase(logoutUser.fulfilled, (state) => {
        state.id = "";
        state.name = "";
        state.email = "";
        state.token = "";
        state.errors = [];
        state.isPending = false;
      });
  },
});

export { authUser, loginUser, registerUser, logoutUser };
export default authSlice.reducer;
