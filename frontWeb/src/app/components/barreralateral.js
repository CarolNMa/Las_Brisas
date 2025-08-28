"use client";

import Link from "next/link";
import "../../styles/barra.css";
import { useState } from "react";

export default function Sidebar() {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };
    return (
        <div className="sidebar-content">
            <div className="userBox">
                <div className="avatars"></div>
                <div className="user-inf">
                    <span>Carol Marentes</span>
                </div>

            </div>

            <nav className="nav">
                <Link href="../homes" className="nav-item">Inicio</Link>
                <Link href="/induccion" className="nav-item">Inducción</Link>
                <Link href="/usuarios" className="nav-item">Organización</Link>
                <div className="menu-item">
                    <button className="btn nav-item" onClick={() => toggleMenu("empleados")}>
                        Empleados {openMenu === "empleados" ? "▲" : "▼"}
                    </button>
                    {openMenu === "empleados" && (
                        <div className="submenu">
                            <Link href="/users/create-employee" className="nav-item">Crear Empleado</Link>
                            <Link href="/users/linked" className="nav-item">Vigentes</Link>
                            <Link href="/users/unlinked" className="nav-item">Desvinculados</Link>
                        </div>
                    )}
                </div>
               

                <div className="menu-item">
                    <button className="btn nav-item" onClick={() => toggleMenu("procesos")}>
                        Procesos {openMenu === "procesos" ? "▲" : "▼"}
                    </button>
                    {openMenu === "procesos" && (
                        <div className="submenu">
                            <Link href="/procesos/activos" className="nav-item">Permisos</Link>
                            <Link href="/procesos/historico" className="nav-item">Horarios-Asistencias</Link>
                            <Link href="/procesos/configuracion" className="nav-item">Certificados</Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}
