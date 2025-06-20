import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  loginUser,
  registerUser,
  logoutUser,
  authUser,
} from "@/store/slices/authSlice";
import { useCallback } from "react";

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const login = useCallback(
    (email: string, password: string) => {
      return dispatch(loginUser({ email, password }));
    },
    [dispatch]
  );

  const register = useCallback(
    (name: string, email: string, password: string) => {
      return dispatch(registerUser({ name, email, password }));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const checkAuth = useCallback(() => {
    return dispatch(authUser());
  }, [dispatch]);

  return {
    auth,
    login,
    register,
    logout,
    checkAuth,
  };
};
