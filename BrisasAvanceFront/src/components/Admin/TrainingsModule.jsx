import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function TrainingsModule() {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTraining, setEditingTraining] = useState(null);
    const [form, setForm] = useState({ title: "", date: "", type: "induction", status: "pendiente" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllTrainings();
            setTrainings(data.data || data);
        } catch (err) {
            console.error("Error cargando capacitaciones:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta capacitación?")) return;
        try {
            await ApiService.deleteTraining(id);
            setTrainings(trainings.filter((t) => t.id !== id));
        } catch (err) {
            console.error("Error eliminando capacitación:", err);
        }
    };

    const handleExport = () => {
        exportCSV("capacitaciones.csv", trainings);
    };

    const handleOpenModal = (training = null) => {
        setEditingTraining(training);
        setForm(training || { title: "", date: "", type: "induction", status: "pendiente" });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingTraining) {
                await ApiService.updateTraining(editingTraining.id, form);
                setTrainings(trainings.map((t) => (t.id === editingTraining.id ? { ...t, ...form } : t)));
            } else {
                const newTraining = await ApiService.createTraining(form);
                setTrainings([...trainings, newTraining.data || newTraining]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error guardando capacitación:", err);
        }
    };

    if (loading) return <p>Cargando capacitaciones...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Capacitaciones</h2>
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
                        <th style={styles.th}>Título</th>
                        <th style={styles.th}>Fecha</th>
                        <th style={styles.th}>Tipo</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {trainings.map((t) => (
                        <tr key={t.id} style={styles.tr}>
                            <td style={styles.td}>{t.title}</td>
                            <td style={styles.td}>{t.date}</td>
                            <td style={styles.td}>{t.type}</td>
                            <td style={styles.td}>{t.status}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => handleOpenModal(t)}>
                                    Editar
                                </button>{" "}
                                <button style={styles.btnAlt} onClick={() => handleDelete(t.id)}>
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
                    title={editingTraining ? "Editar Capacitación" : "Nueva Capacitación"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Título:
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </label>
                        <label>
                            Fecha:
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </label>
                        <label>
                            Tipo:
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            >
                                <option value="induction">Inducción</option>
                                <option value="capacitacion">Capacitación</option>
                            </select>
                        </label>
                        <label>
                            Estado:
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="aprobado">Aprobado</option>
                                <option value="rechazado">Rechazado</option>
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
