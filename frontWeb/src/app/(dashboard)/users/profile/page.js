"use client";

import Header from "../../../components/header";
import "../../../../styles/dashboard.css";
import "./styles.css";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Perfil() {
    const [isEditing, setIsEditing] = useState(false);
    const [role, setRole] = useState("empleado");

    const [correo, setCorreo] = useState("carolmarentes@gmail.com");
    const [direccion, setdirreccion] = useState("Cl 10 #25-2");
    const [identificación, setIdentificación] = useState("1234567890");
    const [telefono, setTelefono] = useState("3001234567");
    const [fechaNacimiento, setFechaNacimiento] = useState("31/08/2000");
    const [genreo, setGenreo] = useState("Femenino");
    const [grupoSanguineo, setGrupoSanguíno] = useState("O+");
    const [cargo, setCargo] = useState("Vendedora");
    const [area, setArea] = useState("Ventas");
    const [ubicacion, setUbicacion] = useState("Sede Principal");
    const [fechaIngreso, setFechaIngreso] = useState("05/11/2024");
    const [tiempoContrato, setTiempoContrato] = useState("Indefinido");
    const [superior, setSuperior] = useState("María Lopez");

    const handleSave = () => {
        setIsEditing(false);
        Swal.fire("Cambios guardados", "", "success");
    };

    const canEdit = (field) => {
        if (role === "admin") return true;
        if (role === "empleado") {
            const personalFields = ["correo", "direccion", "telefono", "identificacion" , "fechaNacimiento", "genero", "Sanguineo"];
            return personalFields.includes(field);
        }
        return false;
    };
    return (

        <div>
            <Header />
            <div className="perfil-container">

                <aside className="perfil-left">
                    <div className="perfil-avatar"></div>
                    <div className="perfil-header">
                        <h2 className="perfil-name">Carol Nicole Marentes Torres</h2>
                        {isEditing ? (
                            <button className="btn-save" onClick={handleSave}></button>
                        ) : (
                            <button className="btn-edit" onClick={() => setIsEditing(true)}></button>
                        )}
                    </div>

                    <div className="perfil-info">
                        <div className="icons">
                            <div className="icon-mail"></div>
                            <p>
                                <span>
                                    <strong>Correo Electrónico</strong><br />
                                    {isEditing && canEdit("correo") ? (
                                        <input
                                            type="email"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                        />
                                    ) : (
                                        correo
                                    )}
                                </span>
                            </p>
                        </div>
                        <div className="icons">
                            <div className="icon-location"></div>
                            <p>
                                <span>
                                    <strong>Dirección</strong><br />
                                    {isEditing && canEdit("direccion") ? (
                                        <input
                                            type="text"
                                            value={direccion}
                                            onChange={(e) => setdirreccion(e.target.value)}
                                        />
                                    ) : (
                                        direccion
                                    )}
                                </span>
                            </p>
                        </div>
                        <div className="icons">
                            <div className="icon-id"></div>
                            <p> <span>
                                <strong>Número de identificación</strong><br />
                                {isEditing && canEdit("identificacion") ? (
                                    <input
                                        type="number"
                                        value={identificación}
                                        onChange={(e) => setIdentificación(e.target.value)}
                                    />
                                ) : (
                                    identificación
                                )}
                            </span></p>
                        </div>
                        <div className="icons">
                            <div className="icon-phone"></div>
                            <p> <span>
                                <strong>Número de teléfono</strong><br />
                                {isEditing && canEdit("telefono") ? (
                                    <input
                                        type="text"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                    />
                                ) : (
                                    telefono
                                )}
                            </span></p>
                        </div>

                    </div>
                </aside>

                <main className="perfil-right">
                    <section>
                        <h3>Información Personal</h3>
                        <div className="perfil-grid">
                            <div className="perfil-card">
                                <div className="icones">
                                    <div className="icon-calendar"></div>
                                    <p> <span>
                                        <strong>Fecha de Nacimiento</strong><br />
                                        {isEditing && canEdit("fechaNacimiento") ? (
                                            <input
                                                type="date"
                                                value={fechaNacimiento}
                                                onChange={(e) => setFechaNacimiento(e.target.value)}
                                            />
                                        ) : (
                                            fechaNacimiento
                                        )}
                                    </span></p>
                                </div>
                            </div>

                            <div className="perfil-card">
                                <div className="icones">
                                    <div className="icon-profile"></div>
                                    <p> <span>

                                        <strong>Género</strong><br />
                                        {isEditing && canEdit("genero") ? (
                                            <input
                                                type="text"
                                                value={genreo}
                                                onChange={(e) => setGenreo(e.target.value)}
                                            />
                                        ) : (
                                            genreo
                                        )}
                                    </span></p>
                                </div>
                            </div>

                            <div className="perfil-card">
                                <div className="icones">
                                    <div className="icon-calendar"></div>
                                    <p> <span>
                                        <strong>Grupo Sanguíneo</strong><br />
                                        {isEditing && canEdit("Sanguineo") ? (
                                            <input
                                                type="text"
                                                value={grupoSanguineo}
                                                onChange={(e) => setGrupoSanguíno(e.target.value)}
                                            />
                                        ) : (
                                            grupoSanguineo
                                        )}
                                    </span></p>
                                </div>
                            </div>


                        </div>
                    </section>

                    <section>
                        <h3>Información Laboral</h3>
                        <div className="perfil-grid">
                            <div className="perfil-card">
                                <div className="icones">
                                    <div className="icon-profile"></div>
                                    <p> <span>
                                        <strong>Cargo</strong><br />
                                        {isEditing && canEdit("cargo") ? (
                                            <input
                                                type="text"
                                                value={cargo}
                                                onChange={(e) => setCargo(e.target.value)}
                                            />
                                        ) : (
                                            cargo
                                        )}
                                    </span></p>
                                </div>
                            </div>
                            <div className="perfil-card">
                                <div className="icones">
                                    <div className="icon-location"></div>
                                    <p> <span>
                                        <strong>Área</strong><br />
                                        {isEditing && canEdit("area") ? (
                                            <input
                                                type="text"
                                                value={area}
                                                onChange={(e) => setArea(e.target.value)}
                                            />
                                        ) : (
                                            area
                                        )}

                                    </span></p>
                                </div>
                            </div>
                            <div className="perfil-card">
                                <div className="icones">
                                    <div className="icon-location"></div>
                                    <p> <span>
                                        <strong>Ubicación</strong><br />
                                        {isEditing && canEdit("ubicacion") ? (
                                            <input
                                                type="text"
                                                value={ubicacion}
                                                onChange={(e) => setUbicacion(e.target.value)}
                                            />
                                        ) : (
                                            ubicacion
                                        )}
                                    </span></p>
                                </div>
                            </div>
                            <div className="perfil-card">
                                <div className="icones">
                                    <div className="icon-calendar"></div>
                                    <p> <span>
                                        <strong>Fecha de Ingreso</strong><br />
                                        {isEditing && canEdit("fechaIngreso") ? (
                                            <input
                                                type="date"
                                                value={fechaIngreso}
                                                onChange={(e) => setFechaIngreso(e.target.value)}
                                            />
                                        ) : (
                                            fechaIngreso
                                        )}
                                    </span></p>
                                </div>
                            </div>
                            <div className="perfil-card">
                                <div className="icones">
                                    <div className="icon-time"></div>
                                    <p> <span>
                                        <strong>Tiempo de Contrato</strong><br />
                                        {isEditing && canEdit("tiempoContrato") ? (
                                            <input
                                                type="text"
                                                value={tiempoContrato}
                                                onChange={(e) => setTiempoContrato(e.target.value)}
                                            />
                                        ) : (
                                            tiempoContrato
                                        )}
                                    </span></p>
                                </div>
                            </div>
                            <div className="perfil-card">
                                <div className="icones">
                                    <div className="icon-profile"></div>
                                    <p> <span>
                                        <strong>Supervisor</strong><br />
                                        {isEditing && canEdit("superior") ? (
                                            <input
                                                type="text"
                                                value={superior}
                                                onChange={(e) => setSuperior(e.target.value)}
                                            />
                                        ) : (
                                            superior
                                        )}
                                    </span></p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3>Documentos Adjuntos</h3>
                        <div className="perfil-grid">

                            <a className="perfil-card" href="/docs/hoja_de_vida.pdf" download>
                                <div className="icon-document">
                                </div>
                                Hoja de vida
                            </a>
                            <a className="perfil-card" href="/docs/contrato.pdf" download>
                                <div className="icon-document">
                                </div>
                                Contrato laboral
                            </a>
                            <a className="perfil-card" href="/docs/certificados.pdf" download>
                                <div className="icon-document">
                                </div>
                                Certificados de estudio
                            </a>
                            <a className="perfil-card" href="/docs/cedula.pdf" download>
                                <div className="icon-document">
                                </div>
                                Copia de la cédula
                            </a>


                        </div>
                    </section>
                </main>
            </div>
        </div>

    );
}
