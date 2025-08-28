"use client";

import { useRouter } from "next/navigation";
import "./style.css";
import { useState } from "react";

export default function Log() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);

        router.push("/homes");
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
                        <input className="inputs"
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
                        <input className="inputs"
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            maxLength={20}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                            title="Debe contener al menos una mayúscula, un número y 6 caracteres."
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
        </div>
    );
}