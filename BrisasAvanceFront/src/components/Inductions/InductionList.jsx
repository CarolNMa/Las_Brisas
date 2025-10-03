import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import InductionForm from "./InductionForm";

export default function InductionList({ onSelect }) {
    const [inductions, setInductions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);

    const loadInductions = async () => {
        try {
            const data = await ApiService.getAllInductions();
            setInductions(data);
        } catch (err) {
            console.error("❌ Error cargando inducciones:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInductions();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar esta inducción?")) return;
        try {
            await ApiService.deleteInduction(id);
            loadInductions();
        } catch (err) {
            console.error("❌ Error eliminando inducción:", err);
        }
    };

    return (
        <div>
            <button onClick={() => setEditing({})}>➕ Nueva Inducción</button>
            {editing && (
                <InductionForm
                    induction={editing}
                    onClose={() => {
                        setEditing(null);
                        loadInductions();
                    }}
                />
            )}

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inductions.map((i) => (
                            <tr key={i.id}>
                                <td>{i.name}</td>
                                <td>{i.type}</td>
                                <td>{i.status}</td>
                                <td>
                                    <button onClick={() => onSelect(i)}>📂 Módulos</button>
                                    <button onClick={() => setEditing(i)}>✏️ Editar</button>
                                    <button onClick={() => handleDelete(i.id)}>🗑️ Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
