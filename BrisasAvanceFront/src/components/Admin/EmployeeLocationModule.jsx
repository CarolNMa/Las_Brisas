import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";

export default function EmployeeLocationModule() {
    const [relations, setRelations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ employeeId: "", locationId: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const relData = await ApiService.getAllEmployeeLocations();
            const empData = await ApiService.getAllEmployees();
            const locData = await ApiService.getAllLocations();

            setRelations(relData.data || relData);
            setEmployees(empData.data || empData);
            setLocations(locData.data || locData);
        } catch (err) {
            console.error("❌ Error cargando relaciones:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar esta relación?")) return;
        try {
            await ApiService.deleteEmployeeLocation(id);
            setRelations(relations.filter((r) => r.id !== id));
        } catch (err) {
            console.error("❌ Error eliminando relación:", err);
        }
    };

    const handleSave = async () => {
        if (!form.employeeId || !form.locationId) {
            setErrors({
                employeeId: !form.employeeId ? "Seleccione empleado" : "",
                locationId: !form.locationId ? "Seleccione ubicación" : ""
            });
            return;
        }

        try {
            const newRel = await ApiService.createEmployeeLocation(form);
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
                <h2>Relaciones Empleado ↔ Ubicación</h2>
                <button style={styles.btn} onClick={() => setModalOpen(true)}>Nuevo</button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Empleado</th>
                        <th style={styles.th}>Ubicación</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {relations.map((rel) => (
                        <tr key={rel.id}>
                            <td style={styles.td}>{rel.employeeName || rel.employeeId}</td>
                            <td style={styles.td}>{rel.locationName || rel.locationId}</td>
                            <td style={styles.td}>
                                <button style={styles.btnAlt} onClick={() => handleDelete(rel.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <Modal open={modalOpen} title="Nueva relación Empleado ↔ Ubicación" onClose={() => setModalOpen(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                            <option value="">-- Seleccionar empleado --</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                            ))}
                        </select>
                        {errors.employeeId && <span style={{ color: "red" }}>{errors.employeeId}</span>}

                        <select value={form.locationId} onChange={(e) => setForm({ ...form, locationId: e.target.value })}>
                            <option value="">-- Seleccionar ubicación --</option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>{loc.nameLocation}</option>
                            ))}
                        </select>
                        {errors.locationId && <span style={{ color: "red" }}>{errors.locationId}</span>}

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
