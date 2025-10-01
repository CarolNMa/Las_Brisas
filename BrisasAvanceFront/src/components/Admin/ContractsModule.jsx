import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function ContractsModule() {
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
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingContract) {
                await ApiService.updateContract(editingContract.id, form);
                setContracts(
                    contracts.map((c) => (c.id === editingContract.id ? { ...c, ...form } : c))
                );
            } else {
                const newContract = await ApiService.createContract(form);
                setContracts([...contracts, newContract]);
            }
            setModalOpen(false);
        } catch (err) {
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
                    {contracts.map((c) => {
                        const emp = employees.find((emp) => emp.id === c.employee);
                        return (
                            <tr key={c.id} style={styles.tr}>
                                <td style={styles.td}>
                                    {emp ? `${emp.firstName} ${emp.lastName}` : `ID: ${c.employee}`}
                                </td>
                                <td style={styles.td}>{c.dateStart}</td>
                                <td style={styles.td}>{c.dateEnd}</td>
                                <td style={styles.td}>{c.type}</td>
                                <td style={styles.td}>
                                    {c.documentUrl ? (
                                        <a
                                            href={`http://192.168.100.114:8085/${c.documentUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                            style={{ color: "blue", textDecoration: "underline" }}
                                        >
                                            Descargar
                                        </a>
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
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            >
                                <option value="">-- Selecciona un empleado --</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Fecha Inicio:
                            <input
                                type="date"
                                value={form.dateStart}
                                onChange={(e) => setForm({ ...form, dateStart: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </label>
                        <label>
                            Fecha Fin:
                            <input
                                type="date"
                                value={form.dateEnd}
                                onChange={(e) => setForm({ ...form, dateEnd: e.target.value })}
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
