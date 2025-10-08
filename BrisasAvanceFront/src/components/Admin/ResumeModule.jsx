import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function ResumesModule() {
    const [resumes, setResumes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingResume, setEditingResume] = useState(null);
    const [form, setForm] = useState({
        employee: "",
        observations: "",
        file: null
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [resumesData, employeesData] = await Promise.all([
                ApiService.getAllResumes(),
                ApiService.getAllEmployees()
            ]);
            setResumes(resumesData.data || resumesData);
            setEmployees(employeesData.data || employeesData);
        } catch (err) {
            console.error("❌ Error cargando datos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta hoja de vida?")) return;
        try {
            await ApiService.deleteResume(id);
            setResumes(resumes.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Error eliminando hoja de vida:", err);
        }
    };

    const handleExport = () => {
        const cleanData = resumes.map((r) => {
            const emp = employees.find((e) => e.id === r.employeeId);
            return {
                Empleado: emp ? `${emp.firstName} ${emp.lastName}` : `ID: ${r.employeeId}`,
                Observaciones: r.observations || "—",
                Documento: r.fileName || "Archivo PDF",
            };
        });

        exportCSV("hojas_de_vida.csv", cleanData);
    };


    const handleOpenModal = (resume = null) => {
        setEditingResume(resume);
        setForm(
            resume
                ? {
                    employee: resume.employeeId || "",
                    observations: resume.observations || "",
                    file: null
                }
                : { employee: "", observations: "", file: null }
        );
        setErrors({});
        setModalOpen(true);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.employee || isNaN(parseInt(form.employee, 10))) {
            newErrors.employee = "Debe seleccionar un empleado válido.";
        }
        if (!editingResume && !form.file) {
            newErrors.file = "Debe adjuntar un archivo PDF.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const formData = new FormData();
            formData.append("employeeId", form.employee);
            formData.append("observations", form.observations);
            if (form.file) formData.append("file", form.file);

            if (editingResume) {
                await ApiService.updateResume(editingResume.id, formData);
            } else {
                await ApiService.uploadResume(formData);
            }

            await loadData();
            setModalOpen(false);
        } catch (err) {
            let msg = err?.message || "Error guardando hoja de vida";
            alert(msg);
            console.error("Error guardando hoja de vida:", err);
        }
    };


    if (loading) return <p>Cargando hojas de vida...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Hojas de Vida</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={styles.btnSmall} onClick={handleExport}>
                        Exportar
                    </button>
                    <button style={styles.btn} onClick={() => handleOpenModal()}>
                        Nueva
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Empleado</th>
                        <th style={styles.th}>Observaciones</th>
                        <th style={styles.th}>Documento</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {resumes.map((r, idx) => {
                        const emp = employees.find((emp) => emp.id === r.employeeId);
                        return (
                            <tr key={r.id || `resume-${idx}`} style={styles.tr}>
                                <td style={styles.td}>{r.id}</td>
                                <td style={styles.td}>
                                    {emp ? `${emp.firstName} ${emp.lastName}` : `ID: ${r.employeeId}`}
                                </td>
                                <td style={styles.td}>{r.observations || "—"}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.btnSmall}
                                        onClick={() => ApiService.downloadResume(r.id)}
                                    >
                                        Descargar
                                    </button>
                                </td>
                                <td style={styles.td}>
                                    <button style={styles.btnSmall} onClick={() => handleOpenModal(r)}>
                                        Editar
                                    </button>{" "}
                                    <button style={styles.btnAlt} onClick={() => handleDelete(r.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Modal */}
            {modalOpen && (
                <Modal
                    open={modalOpen}
                    title={editingResume ? "Editar Hoja de Vida" : "Nueva Hoja de Vida"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Empleado:
                            <select
                                value={form.employee}
                                onChange={(e) => setForm({ ...form, employee: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: 6,
                                    border: errors.employee ? "1px solid red" : "1px solid #ddd",
                                    borderRadius: 4
                                }}
                            >
                                <option value="">-- Selecciona un empleado --</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName}
                                    </option>
                                ))}
                            </select>
                            {errors.employee && (
                                <span style={{ color: "red", fontSize: "12px" }}>{errors.employee}</span>
                            )}
                        </label>

                        <label>
                            Observaciones:
                            <textarea
                                value={form.observations}
                                onChange={(e) => setForm({ ...form, observations: e.target.value })}
                                style={{
                                    ...styles.textarea,
                                    border: "1px solid #ddd",
                                    minHeight: "100px",
                                }}
                                placeholder="Escribe aquí comentarios, notas o detalles relevantes sobre la hoja de vida..."
                            />
                        </label>


                        <label>
                            Archivo PDF:
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                                style={{
                                    width: "100%",
                                    padding: 6,
                                    border: errors.file ? "1px solid red" : "1px solid #ddd",
                                    borderRadius: 4
                                }}
                            />
                            {errors.file && (
                                <span style={{ color: "red", fontSize: "12px" }}>{errors.file}</span>
                            )}
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
