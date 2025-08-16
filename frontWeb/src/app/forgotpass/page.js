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

            <div className="card">

                <h2 className="title">Recupera tu contraseña</h2>
                <div className="subtitle">
                    <p>
                        Ingrese el correo registrado para enviarle un código de verificación
                    </p>

                </div>

                <div className="titulos">
                    <label>Correo Electrónico</label>
                </div>

                <div className="input-container">
                    <span className="icon-email"></span>
                    <div>
                        <input className="inputs"
                            type="email"
                            placeholder="Ingresa tu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button className="button">Enviar Código</button>
            </div>


        </div>
    );
}
