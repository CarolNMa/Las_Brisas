import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../services/passwordService";
import "../styles/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async () => {
    if (!email) {
      setMessage("Por favor ingresa tu email");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await forgotPassword(email);
      setMessage(res);
      // Navigate to verify code after success
      setTimeout(() => navigate("/verify-code", { state: { email } }), 2000);
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
            <label>Correo electrónico</label>
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
            />
          </div>

          <button type="button" className="btn-login" onClick={handleForgot} disabled={loading}>
            {loading ? "Enviando..." : "Enviar código de verificación"}
          </button>

          {message && <p style={{ marginTop: "10px", color: message.includes("Error") ? "red" : "green" }}>{message}</p>}

          <div className="links">
            <Link to="/login" className="btn-login" style={{ backgroundColor: '#666', marginTop: '10px' }}>
              Volver al Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}