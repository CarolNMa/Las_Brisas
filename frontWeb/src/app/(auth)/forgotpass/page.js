"use client";

import "./style.css";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


export default function ForgotPass() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);

        Swal.fire("Código Enviado","Se ha enviado un código de verificación a tu correo.");
        router.push("/newpass");
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

                <form className="input-container" onSubmit={handleSubmit}>
                    <span className="icon-email"></span>
                    <div>
                        <input className="inputs"
                            type="email"
                            placeholder="Ingresa tu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                            maxLength={150}
                        />
                    </div>

                    <button type="submit" className="button">
                        Enviar Código
                    </button>
                </form>

            </div>


        </div>
    );
}
