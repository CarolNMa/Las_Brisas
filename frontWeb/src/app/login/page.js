"use client";

import "./style.css";
import { useState } from "react";

export default function Log() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <div className="login-container">
            <div className="logo">
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="titulos">
                    <label>Email</label>
                </div>

                <div className="input-container">
                    <span className="icon-email"></span>
                    <input className="inputs"
                        type="email"
                        placeholder="Ingresa tu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="titulos">
                    <label>Contraseña</label>
                </div>
                <div className="input-container">
                    <span className="icon-password"></span>
                    <input className="inputs"
                        type="password"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-login">
                    Iniciar Sesión
                </button>

                <div className="links">
                    <a href="../forgotpass/">¿Olvidaste tu contraseña?</a>
                    <br></br>
                    <a href="../logup/">Crear cuenta</a>
                </div>
            </form>
        </div>
    );
}