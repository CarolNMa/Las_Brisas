import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword } from "../services/passwordService";
import "../styles/login.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.code) {
      setCode(location.state.code);
    }
  }, [location.state]);

  const handleReset = async () => {
    if (!email || !code || !newPassword) {
      setMessage("Por favor completa todos los campos");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await resetPassword(email, code, newPassword);
      setMessage(res);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo"></div>

        <form className="login-form">
          <div className="titulos">
            <label>Restablecer contraseña</label>
          </div>

          <div className="input-container">
            <span className="icon-email"></span>
            <input
              className="inputs"
              type="email"
              placeholder="Correo registrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <span className="icon-lock"></span>
            <input
              className="inputs"
              type="text"
              placeholder="Código recibido"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <span className="icon-lock"></span>
            <input
              className="inputs"
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="button" className="btn-login" onClick={handleReset} disabled={loading}>
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </button>

          {message && <p style={{ marginTop: "10px", color: message.includes("Error") ? "red" : "green" }}>{message}</p>}

        </form>
      </div>
    </div>
  );
}