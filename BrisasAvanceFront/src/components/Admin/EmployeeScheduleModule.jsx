import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";

export default function EmployeeScheduleModule() {
    const [relations, setRelations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ employeeId: "", scheduleId: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const relData = await ApiService.getAllEmployeeSchedules();
            const empData = await ApiService.getAllEmployees();
            const schData = await ApiService.getAllSchedules();

            setRelations(relData.data || relData);
            setEmployees(empData.data || empData);
            setSchedules(schData.data || schData);
        } catch (err) {
            console.error("❌ Error cargando relaciones:", err);
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar esta relación?")) return;
        try {
            await ApiService.deleteEmployeeSchedule(id);
            setRelations(relations.filter((r) => r.id !== id));
        } catch (err) {
            console.error("❌ Error eliminando relación:", err);
        }
    };

    const handleSave = async () => {
        if (!form.employeeId || !form.scheduleId) {
            setErrors({
                employeeId: !form.employeeId ? "Seleccione empleado" : "",
                scheduleId: !form.scheduleId ? "Seleccione horario" : ""
            });
            return;
        }

        try {
            const newRel = await ApiService.createEmployeeSchedule(form);
            setRelations([...relations, newRel.data || newRel]);
            setModalOpen(false);
        } catch (err) {
            console.error("❌ Error guardando relación:", err);
        }
    };

    if (loading) return <p>Cargando relaciones...</p>;

    return (
        <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Relaciones Empleado ↔ Horario</h2>
                <button style={styles.btn} onClick={() => setModalOpen(true)}>Nuevo</button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Empleado</th>
                        <th style={styles.th}>Horario</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {relations.map((rel) => (
                        <tr key={rel.id}>
                            <td style={styles.td}>{rel.employeeName || rel.employeeId}</td>
                            <td style={styles.td}>{rel.scheduleName || rel.scheduleId}</td>
                            <td style={styles.td}>
                                <button style={styles.btnAlt} onClick={() => handleDelete(rel.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <Modal open={modalOpen} title="Nueva relación Empleado ↔ Horario" onClose={() => setModalOpen(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                            <option value="">-- Seleccionar empleado --</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                            ))}
                        </select>
                        {errors.employeeId && <span style={{ color: "red" }}>{errors.employeeId}</span>}

                        <select value={form.scheduleId} onChange={(e) => setForm({ ...form, scheduleId: e.target.value })}>
                            <option value="">-- Seleccionar horario --</option>
                            {schedules.map((sch) => (
                                <option key={sch.id} value={sch.id}>{sch.nameSchedule}</option>
                            ))}
                        </select>
                        {errors.scheduleId && <span style={{ color: "red" }}>{errors.scheduleId}</span>}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <button style={styles.btnAlt} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button style={styles.btn} onClick={handleSave}>Guardar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
