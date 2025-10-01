import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function AreasModule() {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllAreas();
            setAreas(data.data || data);
        } catch (err) {
            console.error("Error cargando áreas:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta área?")) return;
        try {
            await ApiService.deleteArea(id);
            setAreas(areas.filter((a) => a.id !== id));
        } catch (err) {
            console.error("Error eliminando área:", err);
        }
    };

    const handleExport = () => {
        exportCSV("areas.csv", areas);
    };

    const handleOpenModal = (area = null) => {
        setEditingArea(area);
        setForm(area || { name: "", description: "" });
        setErrors({});
        setModalOpen(true);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.name || form.name.trim().length < 2) {
            newErrors.name = "El nombre del área es obligatorio y debe tener al menos 2 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            if (editingArea) {
                await ApiService.updateArea(editingArea.id, form);
                setAreas(areas.map((a) => (a.id === editingArea.id ? { ...a, ...form } : a)));
            } else {
                const newArea = await ApiService.createArea(form);
                setAreas([...areas, newArea.data || newArea]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error guardando área:", err);
        }
    };

    if (loading) return <p>Cargando áreas...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Áreas</h2>
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
                        <th style={styles.th}>Nombre del Área</th>
                        <th style={styles.th}>Descripción</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {areas.map((a) => (
                        <tr key={a.id} style={styles.tr}>
                            <td style={styles.td}>{a.nameArea}</td>
                            <td style={styles.td}>{a.description}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => handleOpenModal(a)}>
                                    Editar
                                </button>{" "}
                                <button style={styles.btnAlt} onClick={() => handleDelete(a.id)}>
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
                    title={editingArea ? "Editar Área" : "Nueva Área"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Nombre del Área:
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.name ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.name && <span style={{ color: "red", fontSize: "12px" }}>{errors.name}</span>}
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
