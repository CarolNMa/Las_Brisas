"use client";

import Header from "@/app/components/header";
import { useState } from "react";
import Swal from "sweetalert2";

export default function CrearEmpleado() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Nombre:", nombre);
        console.log("Apellido:", apellido);
        console.log("Email:", email);
        console.log("Telefono:", telefono);
        console.log("Contraseña:", password);

        Swal.fire("Información","Tu solicitud ha sido enviada. Un administrador debe aprobarla antes de que puedas acceder.");

        router.push("../linked");
    };

    return (
        <div className="container">
            <main className="main">
                <Header />

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="titulos">
                        <label>Nombre</label>
                    </div>

                    <div className="input-container">
                        <span className="icon-name"></span>
                        <input className="inputs"
                            type="text"
                            placeholder="Ingresa tu nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            pattern="[A-Za-z ]+"
                        />
                    </div>

                    <div className="titulos">
                        <label>Apellido</label>
                    </div>

                    <div className="input-container">
                        <span className="icon-name"></span>
                        <input className="inputs"
                            type="text"
                            placeholder="Ingresa tu apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                            pattern="[A-Za-z ]+"
                        />
                    </div>

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
                        <label>Telefono</label>
                    </div>

                    <div className="input-container">
                        <span className="icon-phone"></span>
                        <input className="inputs"
                            type="text"
                            placeholder="Ingresa tu telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                            pattern="[0-9]{8}"
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
                        Crear empleado
                    </button>
                </form>
            </main>
        </div>
    );
}