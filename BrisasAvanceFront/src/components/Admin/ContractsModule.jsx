import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";
import { saveAs } from "file-saver";


export default function ContractsModule() {
    const handleDownload = async (filename) => {
        try {
            const blob = await ApiService.downloadContract(filename);
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error al descargar contrato:", err);
        }
    };

    const [contracts, setContracts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [form, setForm] = useState({
        employee: "",
        dateStart: "",
        dateEnd: "",
        type: "practicas",
        status: "activo"
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [contractsData, employeesData] = await Promise.all([
                ApiService.getAllContracts(),
                ApiService.getAllEmployees()
            ]);
            setContracts(contractsData.data || contractsData);
            setEmployees(employeesData.data || employeesData);
        } catch (err) {
            console.error("Error cargando datos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este contrato?")) return;
        try {
            await ApiService.deleteContract(id);
            setContracts(contracts.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Error eliminando contrato:", err);
        }
    };

    const handleExport = () => {
        exportCSV("contratos.csv", contracts);
    };

    const handleOpenModal = (contract = null) => {
        setEditingContract(contract);
        setForm(
            contract
                ? {
                    employee: contract.employee?.id || "",
                    dateStart: contract.startDate,
                    dateEnd: contract.endDate,
                    type: contract.type,
                    status: contract.status
                }
                : { employee: "", dateStart: "", dateEnd: "", type: "practicas", status: "activo" }
        );
        setErrors({});
        setModalOpen(true);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.employee || isNaN(parseInt(form.employee, 10))) {
            newErrors.employee = "Debe seleccionar un empleado válido.";
        }

        if (!form.dateStart) {
            newErrors.dateStart = "La fecha de inicio es obligatoria.";
        }

        if (!form.dateEnd) {
            newErrors.dateEnd = "La fecha de fin es obligatoria.";
        }

        if (form.dateStart && form.dateEnd && new Date(form.dateStart) >= new Date(form.dateEnd)) {
            newErrors.dateEnd = "La fecha de fin debe ser posterior a la fecha de inicio.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const contractData = {
                employee: parseInt(form.employee, 10),
                dateStart: form.dateStart,
                dateEnd: form.dateEnd,
                type: form.type,
                status: form.status,
                document: form.document || undefined
            };
            if (editingContract) {
                await ApiService.updateContract(editingContract.id, contractData);
            } else {
                await ApiService.createContract(contractData);
            }
            await loadData();
            setModalOpen(false);
        } catch (err) {
            let msg = err?.message || "Error guardando contrato";
            alert(msg);
            console.error("Error guardando contrato:", err);
        }
    };


    if (loading) return <p>Cargando contratos...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Contratos</h2>
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
                        <th style={styles.th}>Empleado</th>
                        <th style={styles.th}>Fecha Inicio</th>
                        <th style={styles.th}>Fecha Fin</th>
                        <th style={styles.th}>Tipo</th>
                        <th style={styles.th}>Documento</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {contracts.map((c, idx) => {
                        const emp = employees.find((emp) => emp.id === c.employee);
                        return (
                            <tr key={c.id || `contract-${idx}`} style={styles.tr}>
                                <td style={styles.td}>
                                    {emp ? `${emp.firstName} ${emp.lastName}` : `ID: ${c.employee}`}
                                </td>
                                <td style={styles.td}>{c.dateStart}</td>
                                <td style={styles.td}>{c.dateEnd}</td>
                                <td style={styles.td}>{c.type}</td>
                                <td style={styles.td}>
                                    {c.documentUrl ? (
                                        <button
                                            style={{
                                                color: "blue",
                                                textDecoration: "underline",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => {
                                                const filename = c.documentUrl.split("/").pop();
                                                handleDownload(filename);
                                            }}
                                        >
                                            Descargar
                                        </button>
                                    ) : (
                                        "No disponible"
                                    )}
                                </td>

                                <td style={styles.td}>{c.status}</td>
                                <td style={styles.td}>
                                    <button style={styles.btnSmall} onClick={() => handleOpenModal(c)}>
                                        Editar
                                    </button>{" "}
                                    <button style={styles.btnAlt} onClick={() => handleDelete(c.id)}>
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
                    title={editingContract ? "Editar Contrato" : "Nuevo Contrato"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Empleado:
                            <select
                                value={form.employee}
                                onChange={(e) => setForm({ ...form, employee: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.employee ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            >
                                <option value="">-- Selecciona un empleado --</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName}
                                    </option>
                                ))}
                            </select>
                            {errors.employee && <span style={{ color: "red", fontSize: "12px" }}>{errors.employee}</span>}
                        </label>
                        <label>
                            Fecha Inicio:
                            <input
                                type="date"
                                value={form.dateStart}
                                onChange={(e) => setForm({ ...form, dateStart: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.dateStart ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.dateStart && <span style={{ color: "red", fontSize: "12px" }}>{errors.dateStart}</span>}
                        </label>
                        <label>
                            Fecha Fin:
                            <input
                                type="date"
                                value={form.dateEnd}
                                onChange={(e) => setForm({ ...form, dateEnd: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.dateEnd ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.dateEnd && <span style={{ color: "red", fontSize: "12px" }}>{errors.dateEnd}</span>}
                        </label>
                        <label>
                            Tipo:
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            >
                                <option value="practicas">Prácticas</option>
                                <option value="temporal">Temporal</option>
                                <option value="permanente">Permanente</option>
                            </select>
                        </label>
                        <label>
                            Estado:
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            >
                                <option value="activo">Activo</option>
                                <option value="expirado">Expirado</option>
                                <option value="terminado">Terminado</option>
                            </select>
                        </label>

                        <label>
                            Documento:
                            <input
                                type="file"
                                onChange={(e) => setForm({ ...form, document: e.target.files[0] })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            />
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
