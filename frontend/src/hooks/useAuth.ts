// src/hooks/useAuth.ts
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { login, register, logout } from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>(); // Add proper typing here
  const auth = useSelector((state: RootState) => state.auth);

  return {
    ...auth,
    login: (credentials: { email: string; password: string }) =>
      dispatch(login(credentials)),
    register: (userData: { name: string; email: string; password: string }) =>
      dispatch(register(userData)),
    logout: () => dispatch(logout()),
  };
};
