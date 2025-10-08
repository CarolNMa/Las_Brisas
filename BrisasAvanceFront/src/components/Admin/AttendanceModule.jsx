import { useEffect, useState } from "react";
import { CheckCircle, X, AlertTriangle, ClipboardList, Clock, LogOut, RefreshCw } from "lucide-react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";

export default function AttendanceModule() {
    const [attendances, setAttendances] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        employeeId: "",
        date: "",
        status: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [att, emp] = await Promise.all([
                ApiService.getAllAttendance(),
                ApiService.getAllEmployees(),
            ]);
            setAttendances(att.data || att);
            setEmployees(emp.data || emp);
        } catch (err) {
            console.error("Error cargando asistencias:", err);
            alert("Error cargando asistencias. Verifica el backend.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter((prev) => ({ ...prev, [name]: value }));
    };

    const filteredAttendances = attendances.filter((a) => {
        const matchEmployee =
            !filter.employeeId || a.employee === parseInt(filter.employeeId);
        const matchDate =
            !filter.date || (a.date && a.date.startsWith(filter.date));
        const matchStatus =
            !filter.status ||
            a.status.toLowerCase() === filter.status.toLowerCase();

        return matchEmployee && matchDate && matchStatus;
    });

    const handleExport = () => {
        const cleanData = filteredAttendances.map((a) => {
            const employee = employees.find((e) => e.id === a.employee);
            return {
                Empleado: employee ? `${employee.firstName} ${employee.lastName}` : "—",
                Fecha: a.date || "—",
                "Hora Entrada": a.timeStart || "—",
                "Hora Salida": a.timeEnd || "—",
                Estado:
                    a.status === "presente"
                        ? "Presente"
                        : a.status === "tarde"
                            ? "Tarde"
                            : a.status === "ausente"
                                ? "Ausente"
                                : "—",
            };
        });

        exportCSV("asistencias.csv", cleanData);
    };

    const handleRegister = async (type) => {
        try {
            await ApiService.registerAttendance(type);
            alert(
                type === "CHECK_IN"
                    ? "Entrada registrada correctamente"
                    : "Salida registrada correctamente"
            );
            loadData();
        } catch (err) {
            console.error("Error registrando asistencia:", err);
            if (err.message.includes("Ya registraste entrada")) {
                alert("Ya registraste tu entrada hoy.");
            } else if (err.message.includes("Ya registraste salida")) {
                alert("Ya registraste tu salida hoy.");
            } else {
                alert("Error registrando asistencia");
            }
        }
    };

    if (loading) return <p>Cargando asistencias...</p>;

    return (
        <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Registro de Asistencias</h2>
                <button style={styles.btnSmall} onClick={handleExport}>
                    Exportar CSV
                </button>
            </div>

            {/* Botones de registro personal */}
            <div style={{ margin: "15px 0", textAlign: "center" }}>
                <button
                    onClick={() => handleRegister("CHECK_IN")}
                    style={{
                        ...styles.btnSmall,
                        backgroundColor: "#28a745",
                        color: "#fff",
                        marginRight: "10px",
                    }}
                >
                    <Clock size={16} style={{ marginRight: 4 }} /> Registrar Entrada
                </button>
                <button
                    onClick={() => handleRegister("CHECK_OUT")}
                    style={{
                        ...styles.btnSmall,
                        backgroundColor: "#dc3545",
                        color: "#fff",
                    }}
                >
                    <LogOut size={16} style={{ marginRight: 4 }} /> Registrar Salida
                </button>
            </div>

            {/* Filtros */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "15px",
                    alignItems: "center",
                }}
            >
                <select
                    name="employeeId"
                    value={filter.employeeId}
                    onChange={handleFilterChange}
                    style={styles.input}
                >
                    <option value="">Todos los empleados</option>
                    {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.firstName} {e.lastName}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    name="date"
                    value={filter.date}
                    onChange={handleFilterChange}
                    style={styles.input}
                />

                <select
                    name="status"
                    value={filter.status}
                    onChange={handleFilterChange}
                    style={styles.input}
                >
                    <option value="">Todos los estados</option>
                    <option value="presente">Presente</option>
                    <option value="ausente">Ausente</option>
                    <option value="tarde">Tarde</option>
                </select>

                <button style={styles.btnAlt} onClick={loadData}>
                    <RefreshCw size={16} style={{ marginRight: 4 }} /> Actualizar
                </button>
            </div>

            {/* Tabla de asistencias */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Empleado</th>
                        <th style={styles.th}>Fecha</th>
                        <th style={styles.th}>Hora Entrada</th>
                        <th style={styles.th}>Hora Salida</th>
                        <th style={styles.th}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAttendances.length > 0 ? (
                        filteredAttendances.map((a) => {
                            const employee = employees.find((e) => e.id === a.employee);
                            return (
                                <tr key={a.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        {employee
                                            ? `${employee.firstName} ${employee.lastName}`
                                            : "—"}
                                    </td>
                                    <td style={styles.td}>{a.date || "—"}</td>
                                    <td style={styles.td}>{a.timeStart || "—"}</td>
                                    <td style={styles.td}>{a.timeEnd || "—"}</td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                color:
                                                    a.status === "presente"
                                                        ? "green"
                                                        : a.status === "tarde"
                                                            ? "orange"
                                                            : a.status === "ausente"
                                                                ? "red"
                                                                : "gray",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {a.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td style={styles.td} colSpan="5">
                                No hay registros de asistencia
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
