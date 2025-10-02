import { useState, useEffect } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";

export default function AssignInductionModule() {
    const [inductions, setInductions] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        inductionId: "",
        employeeId: "",
        deadline: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [inds, emps, asigs] = await Promise.all([
                ApiService.getAllInductions(),
                ApiService.getAllEmployees(),
                ApiService.getAllInductionAssignments(), // 👈 Nuevo endpoint
            ]);
            setInductions(inds.data || inds);
            setEmployees(emps.data || emps);
            setAssignments(asigs.data || asigs);
        } catch (err) {
            console.error("❌ Error cargando asignaciones:", err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setForm({ inductionId: "", employeeId: "", deadline: "" });
        setModalOpen(true);
    };

    const handleAssign = async () => {
        try {
            await ApiService.assignInduction({
                inductionId: form.inductionId,
                employeeId: form.employeeId,
                deadline: form.deadline,
            });
            loadData();
            setModalOpen(false);
        } catch (err) {
            console.error("❌ Error asignando inducción:", err);
        }
    };

    if (loading) return <p>Cargando asignaciones...</p>;

    return (
        <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Asignar Inducciones a Empleados</h2>
                <button style={styles.btn} onClick={openModal}>Nueva Asignación</button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Empleado</th>
                        <th style={styles.th}>Inducción</th>
                        <th style={styles.th}>Fecha asignación</th>
                        <th style={styles.th}>Fecha límite</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Puntos</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((a) => (
                        <tr key={a.id} style={styles.tr}>
                            <td style={styles.td}>{a.employeeName}</td>
                            <td style={styles.td}>{a.inductionName}</td>
                            <td style={styles.td}>{a.dateAssignment ? new Date(a.dateAssignment).toLocaleDateString() : "-"}</td>
                            <td style={styles.td}>{a.deadline ? new Date(a.deadline).toLocaleDateString() : "-"}</td>
                            <td style={styles.td}>{a.status}</td>
                            <td style={styles.td}>{a.points ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <Modal open={modalOpen} title="Asignar Inducción" onClose={() => setModalOpen(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Seleccionar Inducción:
                            <select
                                value={form.inductionId}
                                onChange={(e) => setForm({ ...form, inductionId: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            >
                                <option value="">-- Selecciona --</option>
                                {inductions.map((i) => (
                                    <option key={i.id} value={i.id}>{i.name}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Seleccionar Empleado:
                            <select
                                value={form.employeeId}
                                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            >
                                <option value="">-- Selecciona --</option>
                                {employees.map((e) => (
                                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Fecha límite:
                            <input
                                type="date"
                                value={form.deadline}
                                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </label>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                            <button style={styles.btnAlt} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button style={styles.btn} onClick={handleAssign}>Asignar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
