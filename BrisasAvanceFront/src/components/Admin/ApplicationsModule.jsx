import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function ApplicationsModule() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingApplication, setEditingApplication] = useState(null);
    const [form, setForm] = useState({ status: "Pendiente" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllApplications();
            setApplications(data.data || data);
        } catch (err) {
            console.error("Error cargando solicitudes:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta solicitud?")) return;
        try {
            await ApiService.deleteApplication(id);
            setApplications(applications.filter((a) => a.id !== id));
        } catch (err) {
            console.error("Error eliminando solicitud:", err);
        }
    };

    const handleExport = () => {
        exportCSV("solicitudes.csv", applications);
    };

    const handleOpenModal = (application = null) => {
        setEditingApplication(application);
        setForm({ status: application?.status || "Pendiente" });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingApplication) {
                await ApiService.updateApplication(editingApplication.id, { ...editingApplication, status: form.status });
                setApplications(applications.map((a) => (a.id === editingApplication.id ? { ...a, status: form.status } : a)));
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error guardando solicitud:", err);
        }
    };

    if (loading) return <p>Cargando solicitudes...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Solicitudes</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={styles.btnSmall} onClick={handleExport}>
                        Exportar
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Empleado</th>
                        <th style={styles.th}>Tipo</th>
                        <th style={styles.th}>Razón</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((a) => (
                        <tr key={a.id} style={styles.tr}>
                            <td style={styles.td}>{a.employee?.firstName} {a.employee?.lastName}</td>
                            <td style={styles.td}>{a.application_type?.name}</td>
                            <td style={styles.td}>{a.reason}</td>
                            <td style={styles.td}>{a.status}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => handleOpenModal(a)}>
                                    Editar Estado
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
                    title="Editar Estado de Solicitud"
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Estado:
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Aprobado">Aprobado</option>
                                <option value="Rechazado">Rechazado</option>
                            </select>
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
