"use client";

import "../styles/usuarios.css";

export default function UsuariosTable() {
    const usuarios = [
        {
            estado: "Activo",
            nombre: "Carlos Torres",
            email: "Carlostorres8@gmail.com",
            tipo: "Admin",
            area: "Producción",
            cargo: "Supervisor",
        },
        {
            estado: "Activo",
            nombre: "Carlos Torres",
            email: "Carlostorres8@gmail.com",
            tipo: "Admin",
            area: "Producción",
            cargo: "Supervisor",
        },

    ];

    return (
        <div className="usuarios-container">
            <h2 className="titulo-seccion">Gestión de usuarios</h2>

            <table className="usuarios-table">
                <thead>
                    <tr>
                        <th>Estado</th>
                        <th>Usuario</th>
                        <th>E-mail</th>
                        <th>Tipo</th>
                        <th>Área</th>
                        <th>Cargo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((u, index) => (
                        <tr key={index}>
                            <td>
                                <input type="checkbox" checked={u.estado === "Activo"} readOnly /> {u.estado}
                            </td>
                            <td>
                                <div className="usuario-info">
                                    <span>{u.nombre}</span>
                                </div>
                            </td>
                            <td>{u.email}</td>
                            <td>{u.tipo}</td>
                            <td>{u.area}</td>
                            <td>{u.cargo}</td>
                            <td>
                                <div>
                                    <button className="btn-edit"></button>
                                </div>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
