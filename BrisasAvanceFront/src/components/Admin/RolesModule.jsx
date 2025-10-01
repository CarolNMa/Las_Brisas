import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function RolesModule() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [form, setForm] = useState({ name: "", description: "" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllRoles();
            setRoles(data.data || data);
        } catch (err) {
            console.error("Error cargando roles:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este rol?")) return;
        try {
            await ApiService.deleteRole(id);
            setRoles(roles.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Error eliminando rol:", err);
        }
    };

    const handleExport = () => {
        exportCSV("roles.csv", roles);
    };

    const handleOpenModal = (role = null) => {
        setEditingRole(role);
        setForm(role || { name: "", description: "" });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingRole) {
                await ApiService.updateRole(editingRole.id, form);
                setRoles(roles.map((r) => (r.id === editingRole.id ? { ...r, ...form } : r)));
            } else {
                const newRole = await ApiService.createRole(form);
                setRoles([...roles, newRole.data || newRole]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error guardando rol:", err);
        }
    };

    if (loading) return <p>Cargando roles...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Roles</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={styles.btnSmall} onClick={handleExport}>
                        Exportar
                    </button>
                    <button style={styles.btn} onClick={() => handleOpenModal()}>
                        Nuevo
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Descripción</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((r) => (
                        <tr key={r.id} style={styles.tr}>
                            <td style={styles.td}>{r.name}</td>
                            <td style={styles.td}>{r.description}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => handleOpenModal(r)}>
                                    Editar
                                </button>{" "}
                                <button style={styles.btnAlt} onClick={() => handleDelete(r.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <Modal
                    open={modalOpen}
                    title={editingRole ? "Editar Rol" : "Nuevo Rol"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </label>
                        <label>
                            Descripción:
                            <input
                                type="text"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </label>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                            <button style={styles.btnAlt} onClick={() => setModalOpen(false)}>
                                Cancelar
                            </button>
                            <button style={styles.btn} onClick={handleSave}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
