
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDesactive() {
    const [usuarios, setUsuarios] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/usuarios")
            .then((res) => res.json())
            .then((data) => {
                setUsuarios(data);
            });
    }, []);

    const handleEdit = (id) => {
        router.push(`/usuarios/${id}`);
    };

    return (
        <div className="usuarios-container">
            <h2 className="titulo-seccion">Desvinculados</h2>

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
                                <input type="checkbox" checked={u.estado === "Desvinculado"} readOnly /> {u.estado}
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