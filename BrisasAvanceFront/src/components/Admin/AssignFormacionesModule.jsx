import { useEffect, useState } from "react";
import { Trash2, PenTool, RefreshCw, Eye, X, Plus, Save } from "lucide-react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";

export default function AssignFormacionesModule() {
    const [assignments, setAssignments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formaciones, setFormaciones] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const [form, setForm] = useState({
        employeeId: "",
        inductionId: "",
        deadline: "",
    });

    const loadData = async () => {
        try {
            const [emps, inds, assigns] = await Promise.all([
                ApiService.getAllEmployees(),
                ApiService.getAllInductions(),
                ApiService.getAllAssignments(),
            ]);

            setEmployees(emps.data || emps);
            setFormaciones(inds.data || inds);
            setAssignments(assigns.data || assigns);
        } catch (err) {
            console.error("Error cargando datos:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAssign = async () => {
        if (!form.employeeId || !form.inductionId || !form.deadline) {
            alert("Debe completar todos los campos");
            return;
        }

        const data = {
            ...form,
            deadline: form.deadline.includes("T")
                ? form.deadline
                : `${form.deadline}T23:59:00`,
            points: 0,
            status: "pendiente",
            visto: "no",
        };

        try {
            await ApiService.assignInduction(data);
            alert("Asignación creada correctamente");
            setModalOpen(false);
            setForm({ employeeId: "", inductionId: "", deadline: "" });
            loadData();
        } catch (err) {
            console.error("Error asignando formación:", err);
            alert("Error al asignar formación");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta asignación?")) return;
        try {
            await ApiService.deleteAssignment(id);
            alert("Asignación eliminada");
            loadData();
        } catch (err) {
            console.error("Error eliminando asignación:", err);
        }
    };

    return (
        <div style={styles.card}>
            <h2>Asignar Formaciones (Inducciones y Capacitaciones)</h2>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <button className={styles.btn} onClick={() => setModalOpen(true)}>
                    Nueva Asignación
                </button>
                <button className={styles.btnAlt} onClick={loadData}>
                    <RefreshCw size={16} style={{ marginRight: 8 }} /> Actualizar
                </button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Empleado</th>
                        <th style={styles.th}>Formación</th>
                        <th style={styles.th}>Tipo</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Visto</th>
                        <th style={styles.th}>Puntos</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.length > 0 ? (
                        assignments.map((a) => (
                            <tr key={a.id} style={styles.tr}>
                                <td style={styles.td}>{a.employeeName}</td>
                                <td style={styles.td}>{a.inductionName}</td>
                                <td style={styles.td}>
                                    {a.inductionType === "capacitacion" ? "Capacitación" : "Inducción"}
                                </td>
                                <td style={styles.td}>
                                    <span
                                        style={{
                                            color:
                                                a.status === "aprobado"
                                                    ? "green"
                                                    : a.status === "rechazado"
                                                        ? "red"
                                                        : "orange",
                                        }}
                                    >
                                        {a.status}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    {a.visto === "si" ? <><Eye size={16} style={{ marginRight: 4 }} /> Sí</> : <><X size={16} style={{ marginRight: 4 }} /> No</>}
                                </td>
                                <td style={styles.td}>{a.points}</td>
                                <td style={styles.td}>
                                    <button
                                        className={styles.btnAlt}
                                        onClick={() => handleDelete(a.id)}
                                    >
                                        <Trash2 size={16} style={{ marginRight: 4 }} /> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={styles.td} colSpan="7">
                                No hay asignaciones registradas
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* MODAL NUEVA ASIGNACIÓN */}
            {modalOpen && (
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <div>
                        <h3><Plus size={16} style={{ marginRight: 8 }} /> Nueva Asignación</h3>

                        {/* Selección de empleado */}
                        <div style={{ marginBottom: "10px" }}>
                            <label>Empleado:</label>
                            <select
                                className={styles.input}
                                name="employeeId"
                                value={form.employeeId}
                                onChange={handleChange}
                            >
                                <option value="">-- Seleccione --</option>
                                {employees.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.firstName} {e.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selección de formación */}
                        <div style={{ marginBottom: "10px" }}>
                            <label>Formación:</label>
                            <select
                                className={styles.input}
                                name="inductionId"
                                value={form.inductionId}
                                onChange={handleChange}
                            >
                                <option value="">-- Seleccione --</option>
                                {formaciones.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.name} ({f.type === "capacitacion" ? "Capacitación" : "Inducción"})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha límite */}
                        <div style={{ marginBottom: "10px" }}>
                            <label>Fecha Límite:</label>
                            <input
                                type="datetime-local"
                                name="deadline"
                                className={styles.input}
                                value={form.deadline}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Botones */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button className={styles.button} onClick={handleAssign}>
                                <Save size={16} style={{ marginRight: 4 }} /> Guardar
                            </button>
                            <button
                                className={styles.buttonCancel}
                                onClick={() => setModalOpen(false)}
                            >
                                <X size={16} style={{ marginRight: 4 }} /> Cancelar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
