import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function ApplicationTypesModule() {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const [form, setForm] = useState({ name: "", required: false });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllApplicationTypes();
            setTypes(data.data || data);
        } catch (err) {
            console.error("Error cargando tipos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este tipo de solicitud?")) return;
        try {
            await ApiService.deleteApplicationType(id);
            setTypes(types.filter((t) => t.id !== id));
        } catch (err) {
            console.error("Error eliminando tipo:", err);
        }
    };

    const handleExport = () => {
        exportCSV("tipos_solicitudes.csv", types);
    };

    const handleOpenModal = (type = null) => {
        setEditingType(type);
        setForm(type || { name: "", required: false });
        setErrors({});
        setModalOpen(true);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.name || form.name.trim().length < 3) {
            newErrors.name = "El nombre es obligatorio y debe tener al menos 3 caracteres.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        try {
            if (editingType) {
                await ApiService.updateApplicationType(editingType.id, form);
                setTypes(types.map((t) => (t.id === editingType.id ? { ...t, ...form } : t)));
            } else {
                const newType = await ApiService.createApplicationType(form);
                setTypes([...types, newType.data || newType]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error guardando tipo:", err);
        }
    };

    if (loading) return <p>Cargando tipos...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Tipos de Solicitud</h2>
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
                        <th style={styles.th}>Requiere Documento</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {types.map((t) => (
                        <tr key={t.id} style={styles.tr}>
                            <td style={styles.td}>{t.name}</td>
                            <td style={styles.td}>{t.required ? "Sí" : "No"}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => handleOpenModal(t)}>Editar</button>{" "}
                                <button style={styles.btnAlt} onClick={() => handleDelete(t.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {modalOpen && (
                <Modal
                    open={modalOpen}
                    title={editingType ? "Editar Tipo de Solicitud" : "Nuevo Tipo de Solicitud"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: 6,
                                    border: errors.name ? "1px solid red" : "1px solid #ddd",
                                    borderRadius: 4,
                                }}
                            />
                            {errors.name && <span style={{ color: "red", fontSize: "12px" }}>{errors.name}</span>}
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={form.required}
                                onChange={(e) => setForm({ ...form, required: e.target.checked })}
                            />
                            Requiere documento adjunto
                        </label>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                            <button style={styles.btnAlt} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button style={styles.btn} onClick={handleSave}>Guardar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
