import { User } from "@/context/AuthContext";
import api from "@/lib/axios"; // The axios instance we made earlier



type LoginResponse = {
  token: string;
  id:string;
  username:string;
  email:string;
  role :"ADMIN" | "USER";
};

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/login", { email, password });
    return res.data;
  },

  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/register", {
      username,
      email,
      password,
      role: "USER",
    });
    return res.data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};