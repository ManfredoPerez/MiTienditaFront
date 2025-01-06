import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (token && userRole) {
      setRole(userRole);
      setIsAuthenticated(true);
    } else {
      setRole(null);
      setIsAuthenticated(false);
    }
  }, []);

  const login = (role) => {
    setRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear(); // Limpia todo el localStorage
    setRole(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("storage")); // Dispara un evento para sincronizar componentes
  };

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};