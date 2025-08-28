"use client";

import "./style.css";
import "../forgotpass/style.css";
import { useState } from "react";

export default function ResetPassword() {
    const [code, setCode] = useState(Array(6).fill(""));
    const [password, setPassword] = useState("");

    const handleCodeChange = (value, index) => {
        if (/^[0-9]?$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value !== "" && index < 5) {
                document.getElementById(`code-${index + 1}`).focus();
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Código:", code.join(""));
        console.log("Nueva contraseña:", password);
    };

    return (
        <div className="login-container">
            <div className="logo">
            </div>
            <div className="card">
                <h2 className="title">Crea una nueva contraseña</h2>
                <div className="subtitle">
                    <p>
                        Ingrese el código que le enviamos a su correo y cree su nueva contraseña
                    </p>
                </div>

                <div className="code-inputs">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            maxLength="1"
                            className="code-box"
                            value={digit}
                            onChange={(e) => handleCodeChange(e.target.value, index)}
                        />
                    ))}
                </div>

                <div className="titulos">
                    <label>Contraseña</label>
                </div>
                <div className="input-container">
                    <span className="icon-password"></span>
                    <input
                        className="inputs"
                        type="password"
                        placeholder="Ingresa tu nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button className="boton" onClick={handleSubmit}>
                    Cambiar contraseña
                </button>
            </div>
        </div>
    );
}
