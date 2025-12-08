import { createContext, useContext, useState } from "react";
import { loginApi } from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!token;

  const login = async ({ identifier, password }) => {
    const data = await loginApi(identifier, password);

    setToken(data.token);
    setUser(data.user);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user; // مهم
  };

  const logout = () => {
    setToken("");
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
