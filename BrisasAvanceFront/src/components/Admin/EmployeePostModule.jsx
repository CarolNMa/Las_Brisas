import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";

export default function EmployeePostModule() {
    const [relations, setRelations] = useState([]); // relaciones empleado-cargo
    const [employees, setEmployees] = useState([]); // lista de empleados
    const [positions, setPositions] = useState([]); // lista de cargos
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ employeeId: "", postId: "" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const relData = await ApiService.getAllEmployeePosts();
            const empData = await ApiService.getAllEmployees();
            const posData = await ApiService.getAllPositions();

            setRelations(relData.data || relData);
            setEmployees(empData.data || empData);
            setPositions(posData.data || posData);
        } catch (err) {
            console.error("Error cargando relaciones:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta relación?")) return;
        try {
            await ApiService.deleteEmployeePost(id);
            setRelations(relations.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Error eliminando relación:", err);
        }
    };

    const handleOpenModal = () => {
        setForm({ employeeId: "", postId: "" });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const newRel = await ApiService.createEmployeePost(form);
            setRelations([...relations, newRel.data || newRel]);
            setModalOpen(false);
        } catch (err) {
            console.error("Error guardando relación:", err);
        }
    };

    if (loading) return <p>Cargando relaciones...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Relaciones Empleado ↔ Cargo</h2>
                <button style={styles.btn} onClick={handleOpenModal}>
                    Nuevo
                </button>
            </div>

            {/* Tabla */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Empleado</th>
                        <th style={styles.th}>Cargo</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {relations.map((rel) => (
                        <tr key={rel.id} style={styles.tr}>
                            <td style={styles.td}>{rel.employeeName || rel.employeeId}</td>
                            <td style={styles.td}>{rel.postName || rel.postId}</td>
                            <td style={styles.td}>
                                <button style={styles.btnAlt} onClick={() => handleDelete(rel.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {modalOpen && (
                <Modal
                    open={modalOpen}
                    title="Nueva relación Empleado ↔ Cargo"
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Empleado:
                            <select
                                value={form.employeeId}
                                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                                style={{ width: "100%", padding: 6 }}
                            >
                                <option value="">-- Seleccionar empleado --</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Cargo:
                            <select
                                value={form.postId}
                                onChange={(e) => setForm({ ...form, postId: e.target.value })}
                                style={{ width: "100%", padding: 6 }}
                            >
                                <option value="">-- Seleccionar cargo --</option>
                                {positions.map((pos) => (
                                    <option key={pos.id} value={pos.id}>
                                        {pos.namePost}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
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
