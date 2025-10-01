import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function AttendanceModule() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);
    const [form, setForm] = useState({ status: "Presente" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllAttendance();
            setAttendance(data.data || data);
        } catch (err) {
            console.error("Error cargando asistencias:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este registro de asistencia?")) return;
        try {
            await ApiService.deleteAttendance(id);
            setAttendance(attendance.filter((a) => a.id !== id));
        } catch (err) {
            console.error("Error eliminando asistencia:", err);
        }
    };

    const handleExport = () => {
        exportCSV("asistencias.csv", attendance);
    };

    const handleOpenModal = (att = null) => {
        setEditingAttendance(att);
        setForm({ status: att?.status || "Presente" });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingAttendance) {
                await ApiService.updateAttendance(editingAttendance.id, { ...editingAttendance, status: form.status });
                setAttendance(attendance.map((a) => (a.id === editingAttendance.id ? { ...a, status: form.status } : a)));
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error guardando asistencia:", err);
        }
    };

    if (loading) return <p>Cargando asistencias...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Asistencias</h2>
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
                        <th style={styles.th}>Fecha</th>
                        <th style={styles.th}>Hora Entrada</th>
                        <th style={styles.th}>Hora Salida</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map((a) => (
                        <tr key={a.id} style={styles.tr}>
                            <td style={styles.td}>{a.employee?.firstName} {a.employee?.lastName}</td>
                            <td style={styles.td}>{a.date}</td>
                            <td style={styles.td}>{a.time_start}</td>
                            <td style={styles.td}>{a.time_end}</td>
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
                    title="Editar Estado de Asistencia"
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
                                <option value="presente">Presente</option>
                                <option value="ausente">Ausente</option>
                                <option value="tarde">Tarde</option>
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
