import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function AttendanceModule() {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterEmployee, setFilterEmployee] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);
    const [form, setForm] = useState({ status: "presente" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [attendanceData, employeesData] = await Promise.all([
                ApiService.getAllAttendance(),
                ApiService.getAllEmployees()
            ]);
            setAttendance(attendanceData.data || attendanceData);
            setEmployees(employeesData.data || employeesData);
        } catch (err) {
            console.error("Error cargando datos:", err);
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

    // Filtering and search logic
    const filteredAttendance = attendance.filter((record) => {
        const employee = employees.find(e => e.id === record.employee?.id || e.id === record.id_employee);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}`.toLowerCase() : '';

        const matchesSearch = searchTerm === '' ||
            employeeName.includes(searchTerm.toLowerCase()) ||
            record.date?.toString().includes(searchTerm);

        const matchesEmployee = filterEmployee === '' || record.employee?.id === parseInt(filterEmployee) || record.id_employee === parseInt(filterEmployee);
        const matchesStatus = filterStatus === '' || record.status === filterStatus;
        const matchesDateFrom = filterDateFrom === '' || new Date(record.date) >= new Date(filterDateFrom);
        const matchesDateTo = filterDateTo === '' || new Date(record.date) <= new Date(filterDateTo);

        return matchesSearch && matchesEmployee && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    // Statistics
    const stats = {
        total: filteredAttendance.length,
        presente: filteredAttendance.filter(a => a.status === 'presente').length,
        ausente: filteredAttendance.filter(a => a.status === 'ausente').length,
        tarde: filteredAttendance.filter(a => a.status === 'tarde').length,
    };

    if (loading) return <p>Cargando asistencias...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2>📊 Historial de Asistencias</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={styles.btnSmall} onClick={() => exportCSV("asistencias_filtradas.csv", filteredAttendance)}>
                        📊 Exportar Filtrados
                    </button>
                </div>
            </div>

            {/* Estadísticas */}
            <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                <div style={{ ...extendedStyles.statCard, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                    <h3 style={extendedStyles.statNumber}>{stats.total}</h3>
                    <p style={extendedStyles.statLabel}>Total Registros</p>
                </div>
                <div style={{ ...extendedStyles.statCard, background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                    <h3 style={extendedStyles.statNumber}>{stats.presente}</h3>
                    <p style={extendedStyles.statLabel}>Presentes</p>
                </div>
                <div style={{ ...extendedStyles.statCard, background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
                    <h3 style={extendedStyles.statNumber}>{stats.ausente}</h3>
                    <p style={extendedStyles.statLabel}>Ausentes</p>
                </div>
                <div style={{ ...extendedStyles.statCard, background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" }}>
                    <h3 style={extendedStyles.statNumber}>{stats.tarde}</h3>
                    <p style={extendedStyles.statLabel}>Tarde</p>
                </div>
            </div>

            {/* Filtros */}
            <div style={{ ...extendedStyles.filters, marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="Buscar por empleado o fecha..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={extendedStyles.searchInput}
                />

                <select
                    value={filterEmployee}
                    onChange={(e) => setFilterEmployee(e.target.value)}
                    style={extendedStyles.select}
                >
                    <option value="">Todos los empleados</option>
                    {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                        </option>
                    ))}
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={extendedStyles.select}
                >
                    <option value="">Todos los estados</option>
                    <option value="presente">Presente</option>
                    <option value="ausente">Ausente</option>
                    <option value="tarde">Tarde</option>
                </select>

                <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    style={extendedStyles.select}
                    placeholder="Fecha desde"
                />

                <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    style={extendedStyles.select}
                    placeholder="Fecha hasta"
                />

                <button
                    onClick={() => {
                        setSearchTerm("");
                        setFilterEmployee("");
                        setFilterStatus("");
                        setFilterDateFrom("");
                        setFilterDateTo("");
                    }}
                    style={styles.btnAlt}
                >
                    🗑️ Limpiar Filtros
                </button>
            </div>

            {/* Tabla */}
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>👤 Empleado</th>
                            <th style={styles.th}>📅 Fecha</th>
                            <th style={styles.th}>⏰ Entrada</th>
                            <th style={styles.th}>⏰ Salida</th>
                            <th style={styles.th}>📊 Estado</th>
                            <th style={styles.th}>⚙️ Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAttendance.length > 0 ? (
                            filteredAttendance.map((a) => {
                                const employee = employees.find(e => e.id === a.employee?.id || e.id === a.id_employee);
                                return (
                                    <tr key={a.id} style={styles.tr}>
                                        <td style={styles.td}>
                                            {employee ? `${employee.firstName} ${employee.lastName}` : 'Empleado no encontrado'}
                                        </td>
                                        <td style={styles.td}>{a.date}</td>
                                        <td style={styles.td}>{a.time_start || '-'}</td>
                                        <td style={styles.td}>{a.time_end || '-'}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...extendedStyles.statusBadge,
                                                backgroundColor: a.status === 'presente' ? '#28a745' :
                                                               a.status === 'ausente' ? '#dc3545' : '#ffc107'
                                            }}>
                                                {a.status}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <button style={styles.btnSmall} onClick={() => handleOpenModal(a)}>
                                                ✏️ Editar
                                            </button>{" "}
                                            <button style={styles.btnAlt} onClick={() => handleDelete(a.id)}>
                                                🗑️ Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                                    No se encontraron registros de asistencia con los filtros aplicados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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

// Extended styles
const extendedStyles = {
    ...styles,
    statCard: {
        padding: '16px',
        borderRadius: '12px',
        color: 'white',
        textAlign: 'center',
        minWidth: '120px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    statNumber: {
        margin: '0 0 4px 0',
        fontSize: '28px',
        fontWeight: 'bold',
    },
    statLabel: {
        margin: 0,
        fontSize: '14px',
        opacity: 0.9,
    },
    filters: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
    },
    searchInput: {
        padding: '8px 12px',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        fontSize: '14px',
        minWidth: '200px',
        backgroundColor: '#fff',
    },
    select: {
        padding: '8px 12px',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        fontSize: '14px',
        backgroundColor: '#fff',
        minWidth: '150px',
    },
    statusBadge: {
        padding: '4px 8px',
        borderRadius: '12px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
};
