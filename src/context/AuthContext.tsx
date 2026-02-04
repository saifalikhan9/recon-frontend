"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. Check if user is already logged in (on refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // 2. Login Action
  const login = async (email: string, pass: string) => {
    const data = await authService.login(email, pass);
    console.log(data);
    const user :User= {
        id : data.id,
        username :data.username,
        email:data.email,
        role:data.role
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    router.push("/"); // Redirect to Dashboard
  };

  // 3. Register Action
  const register = async (name: string, email: string, pass: string) => {
    await authService.register(name, email, pass);
    // After register, automatically login or redirect to login
    await login(email, pass); 
  };

  // 4. Logout Action
  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to use it easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};