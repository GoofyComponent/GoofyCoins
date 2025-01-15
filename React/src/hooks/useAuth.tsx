import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { API } from "@/services/api";

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  getUser: () => User | null; // Nouvelle méthode
}

interface User {
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/user")
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  const login = () => {
    API.get("/user")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const getUser = () => user; // Nouvelle fonction pour obtenir l'utilisateur

  return (
    <AuthContext.Provider value={{ user, login, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
