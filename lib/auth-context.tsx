"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  username: string;
  role: "administrator" | "supervisor";
  assignedProject?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: User[] = [
  { username: "admin", role: "administrator" },
  {
    username: "supervisor1",
    role: "supervisor",
    assignedProject: "dy9nWi6S6NiTVJwR8cif",
  },
  {
    username: "supervisor2",
    role: "supervisor",
    assignedProject: "fr04IrYvjOYs9gCQQeJA",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string) => {
    const foundUser = MOCK_USERS.find((u) => u.username === username);
    if (foundUser && password === "password") {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
