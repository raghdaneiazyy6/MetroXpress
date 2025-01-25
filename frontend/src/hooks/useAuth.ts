// src/hooks/useAuth.ts
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  login,
  register,
  logout,
  updateProfile,
} from "../store/slices/authSlice";
import { User } from "../types/auth";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    ...auth,
    login: (credentials: { email: string; password: string }) =>
      dispatch(login(credentials)),
    register: (userData: { name: string; email: string; password: string }) =>
      dispatch(register(userData)),
    logout: () => dispatch(logout()),
    updateProfile: (userData: Partial<User>) =>
      dispatch(updateProfile(userData)),
  };
};
