import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function PositionsModule() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);
    const [form, setForm] = useState({ namePost: "", description: "", jon_function: "", requirements: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllPositions();
            setPositions(data.data || data);
        } catch (err) {
            console.error("Error cargando posiciones:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta posición?")) return;
        try {
            await ApiService.deletePosition(id);
            setPositions(positions.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Error eliminando posición:", err);
        }
    };

    const handleExport = () => {
        exportCSV("posiciones.csv", positions);
    };

    const handleOpenModal = (position = null) => {
        setEditingPosition(position);
        setForm(position || { namePost: "", description: "", jon_function: "", requirements: "" });
        setErrors({});
        setModalOpen(true);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.namePost || form.namePost.trim().length < 2) {
            newErrors.namePost = "El nombre de la posición es obligatorio y debe tener al menos 2 caracteres.";
        }

        if (!form.description || form.description.trim().length < 5) {
            newErrors.description = "La descripción es obligatoria y debe tener al menos 5 caracteres.";
        }

        if (!form.jon_function || form.jon_function.trim().length < 5) {
            newErrors.jon_function = "La función del trabajo es obligatoria y debe tener al menos 5 caracteres.";
        }

        if (!form.requirements || form.requirements.trim().length < 10) {
            newErrors.requirements = "Los requisitos son obligatorios y deben tener al menos 10 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            if (editingPosition) {
                await ApiService.updatePosition(editingPosition.id, form);
                setPositions(positions.map((p) => (p.id === editingPosition.id ? { ...p, ...form } : p)));
            } else {
                const newPosition = await ApiService.createPosition(form);
                setPositions([...positions, newPosition.data || newPosition]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error guardando posición:", err);
        }
    };

    if (loading) return <p>Cargando Cargos...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Cargo</h2>
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
                        <th style={styles.th}>Función del Trabajo</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {positions.map((p) => (
                        <tr key={p.id} style={styles.tr}>
                            <td style={styles.td}>{p.namePost}</td>
                            <td style={styles.td}>{p.description}</td>
                            <td style={styles.td}>{p.jon_function}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => handleOpenModal(p)}>
                                    Editar
                                </button>{" "}
                                <button style={styles.btnAlt} onClick={() => handleDelete(p.id)}>
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
                    title={editingPosition ? "Editar Posición" : "Nueva Posición"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                value={form.namePost}
                                onChange={(e) => {
                                    setForm({ ...form, namePost: e.target.value });
                                    if (errors.namePost) setErrors({ ...errors, namePost: null });
                                }}
                                style={{ width: "100%", padding: 6, border: errors.namePost ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.namePost && <span style={{ color: "red", fontSize: "12px" }}>{errors.namePost}</span>}
                        </label>
                        <label>
                            Descripción:
                            <input
                                type="text"
                                value={form.description}
                                onChange={(e) => {
                                    setForm({ ...form, description: e.target.value });
                                    if (errors.description) setErrors({ ...errors, description: null });
                                }}
                                style={{ width: "100%", padding: 6, border: errors.description ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.description && <span style={{ color: "red", fontSize: "12px" }}>{errors.description}</span>}
                        </label>
                        <label>
                            Función del Trabajo:
                            <input
                                type="text"
                                value={form.jon_function}
                                onChange={(e) => {
                                    setForm({ ...form, jon_function: e.target.value });
                                    if (errors.jon_function) setErrors({ ...errors, jon_function: null });
                                }}
                                style={{ width: "100%", padding: 6, border: errors.jon_function ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.jon_function && <span style={{ color: "red", fontSize: "12px" }}>{errors.jon_function}</span>}
                        </label>
                        <label>
                            Requisitos:
                            <textarea
                                value={form.requirements}
                                onChange={(e) => {
                                    setForm({ ...form, requirements: e.target.value });
                                    if (errors.requirements) setErrors({ ...errors, requirements: null });
                                }}
                                style={{
                                    width: "100%",
                                    padding: 6,
                                    border: errors.requirements ? "1px solid red" : "1px solid #ddd",
                                    borderRadius: 4,
                                    minHeight: "80px",
                                    resize: "vertical"
                                }}
                            />
                            {errors.requirements && <span style={{ color: "red", fontSize: "12px" }}>{errors.requirements}</span>}
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
