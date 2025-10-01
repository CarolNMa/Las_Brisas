import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8085/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      const data = await response.json();
      if (data.token) {
        const user = {
          email: data.email,
          username: data.username,
          roles: data.roles
        };

        localStorage.setItem("brisas:token", data.token);
        localStorage.setItem("brisas:user", JSON.stringify(user));

        onLogin(user);

        if (user.roles?.includes("ADMIN") || user.roles?.includes("ROLE_ADMIN")) {
          navigate("/dashboard");
        } else if (user.roles?.includes("EMPLEADO") || user.roles?.includes("ROLE_EMPLOYEE")) {
          navigate("/employee-dashboard");
        } else {
          Swal.fire({
            icon: "warning",
            title: "Acceso restringido",
            text: "No tienes un rol válido asignado",
          });
        }
    } else {
      throw new Error("Respuesta de login inválida");
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error al iniciar sesión",
      text: "Verifica tus credenciales",
    });
  }
};

return (
  <div className="login-page">
    <div className="login-container">
      <div className="logo"></div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="titulos">
          <label>Email</label>
        </div>

        <div className="input-container">
          <span className="icon-email"></span>
          <input
            className="inputs"
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
        </div>

        <div className="titulos">
          <label>Contraseña</label>
        </div>
        <div className="input-container">
          <span className="icon-password"></span>
          <input
            className="inputs"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            maxLength={20}
            title="Debe contener caracteres."
          />
        </div>

        <button type="submit" className="btn-login">
          Iniciar Sesión
        </button>

        <div className="links">
          <a href="/forgotpass">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  </div>
);
}
