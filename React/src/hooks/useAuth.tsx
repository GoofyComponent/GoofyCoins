import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { API } from "@/services/api";

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  getUser: () => User | null; // Nouvelle méthode
}

interface User {
  email: string;
  name: string;
  address_wallet: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    // Trouver le cookie `auth_token`
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );

    // Extraire la valeur du cookie si trouvé
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    if (token) {
      API.get("/user", { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setUser(response.data))
        .catch(() => {});
    }
  }, []);

  const login = (token: string) => {
    API.get("/user")
      .then((response) => {
        setUser(response.data);
        // on mets dans le cookie le token
        document.cookie = `auth_token=${token}; path=/;`;
      })
      .catch(() => {});
  };

  const logout = () => {
    setUser(null);
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
