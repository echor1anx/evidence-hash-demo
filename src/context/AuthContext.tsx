"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define the valid roles in our system
export type UserRole = "Investigator" | "Custodian" | "Analyst" | "Auditor" | "Admin" | null;

// Define the structure of our mock User
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
}

// Define the shape of our Auth Context
interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // For the presentation/prototype, we'll persist the mock login in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("evidence-locker-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const login = (email: string, role: UserRole, name: string = "Jane Doe") => {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      role,
      organization: "State Internal",
    };
    setUser(newUser);
    localStorage.setItem("evidence-locker-user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("evidence-locker-user");
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily grab auth data
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
