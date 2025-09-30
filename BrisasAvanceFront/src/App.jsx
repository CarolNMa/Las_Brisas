import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/inicio";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("brisas:user");
    const savedToken = localStorage.getItem("brisas:token");

    if (savedUser && savedToken && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        localStorage.removeItem("brisas:user");
        localStorage.removeItem("brisas:token");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setToken(localStorage.getItem("brisas:token"));
  };

  const handleLogout = () => {
    localStorage.removeItem("brisas:user");
    localStorage.removeItem("brisas:token");
    setUser(null);
    setToken(null);
    window.location.href = "/login"; 
  };

  return (
<<<<<<< HEAD
    <Router>
      <Routes>
        {/* Página de login */}
        <Route
          path="/login"
          element={
            user && token ? (
              user.roles && user.roles.includes("ADMIN") ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/employee-dashboard" replace />
              )
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Dashboard de administrador */}
        <Route
          path="/dashboard"
          element={
            user && token ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Dashboard de empleado */}
        <Route
          path="/employee-dashboard"
          element={
            user && token ? (
              <EmployeeDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
=======
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Página de login */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </ThemeProvider>
>>>>>>> 2b4aff0b3571d6526333dae71b2448b65cc9f06e
  );
}

export default App;
