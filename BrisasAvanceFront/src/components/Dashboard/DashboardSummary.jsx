import { useEffect, useState } from "react";
import { RefreshCw, Users, User, Mail, FileText, Building, BarChart3, ClipboardList } from "lucide-react";
import Card from "../Layout/Tarjeta";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import ApiService from "../../services/api";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell,
} from "recharts";

export default function DashboardSummary({ setActive }) {
    const [empleados, setEmpleados] = useState([]);
    const [users, setUsers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [areas, setAreas] = useState([]);
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar datos individualmente para que si una API falla, las demás sigan funcionando
            const results = await Promise.allSettled([
                ApiService.getAllEmployees().catch(err => { console.warn("Error cargando empleados:", err); return []; }),
                ApiService.getAllUsers().catch(err => { console.warn("Error cargando usuarios:", err); return []; }),
                ApiService.getAllApplications().catch(err => { console.warn("Error cargando solicitudes:", err); return []; }),
                ApiService.getAllContracts().catch(err => { console.warn("Error cargando contratos:", err); return []; }),
                ApiService.getAllAreas().catch(err => { console.warn("Error cargando áreas:", err); return []; }),
                ApiService.getAllAttendance().catch(err => { console.warn("Error cargando asistencias:", err); return []; }),
            ]);

            setEmpleados(results[0].status === 'fulfilled' ? results[0].value || [] : []);
            setUsers(results[1].status === 'fulfilled' ? results[1].value || [] : []);
            setApplications(results[2].status === 'fulfilled' ? results[2].value || [] : []);
            setContratos(results[3].status === 'fulfilled' ? results[3].value || [] : []);
            setAreas(results[4].status === 'fulfilled' ? results[4].value || [] : []);
            setAsistencias(results[5].status === 'fulfilled' ? results[5].value || [] : []);

            // Verificar si todas las APIs fallaron
            const allFailed = results.every(result => result.status === 'rejected');
            if (allFailed) {
                setError("Error al cargar los datos desde las APIs. Verifica que el backend esté ejecutándose y que tengas permisos de administrador.");
            }
        } catch (err) {
            console.error("Error general cargando datos del dashboard:", err);
            setError("Error general al cargar los datos. Revisa la consola para más detalles.");
        } finally {
            setLoading(false);
        }
    };

    // ---- Procesamiento de datos ----
    const employeesByArea = areas.map((area) => ({
        name: area.name,
        count: empleados.filter(
            (e) => e.area?.id === area.id || e.areaId === area.id
        ).length,
    }));

    const attendanceStatus = asistencias.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {});
    const attendanceData = Object.entries(attendanceStatus).map(
        ([status, count]) => ({ name: status, value: count })
    );

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: 50 }}>
                <h2>Cargando datos del dashboard...</h2>
                <p>Conectando con las APIs para obtener la información más reciente.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", padding: 50, color: "red" }}>
                <h2>Error al cargar datos</h2>
                <p>{error}</p>
                <button onClick={loadData} style={styles.btn}>
                    <RefreshCw size={16} style={{ marginRight: 4 }} /> Reintentar
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2>Resumen general</h2>
            <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                <Card title={<><Users size={14} style={{ marginRight: 4 }} /> Empleados</>} value={empleados.length} />
                <Card title={<><User size={14} style={{ marginRight: 4 }} /> Usuarios</>} value={users.length} />
                <Card title={<><Mail size={14} style={{ marginRight: 4 }} /> Solicitudes</>} value={applications.length} />
                <Card title={<><FileText size={14} style={{ marginRight: 4 }} /> Contratos</>} value={contratos.length} />
                <Card title={<><Building size={14} style={{ marginRight: 4 }} /> Áreas</>} value={areas.length} />
            </div>

            <div style={{ display: "flex", gap: 20, marginTop: 30, flexWrap: "wrap" }}>
                <div style={styles.chartContainer}>
                    <h3>Empleados por Área</h3>
                    <BarChart width={400} height={300} data={employeesByArea}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </div>

                <div style={styles.chartContainer}>
                    <h3>Estado de Asistencias</h3>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={attendanceData}
                            cx={200}
                            cy={150}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {attendanceData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
            </div>

            <div style={{ marginTop: 30 }}>
                <h3>Acciones Rápidas</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                        onClick={() => exportCSV("empleados_all.csv", empleados)}
                        style={styles.btn}
                    >
                        <BarChart3 size={16} style={{ marginRight: 4 }} /> Exportar Empleados
                    </button>
                    <button
                        onClick={() => exportCSV("applications_all.csv", applications)}
                        style={styles.btnAlt}
                    >
                        <ClipboardList size={16} style={{ marginRight: 4 }} /> Exportar Solicitudes
                    </button>
                    <button onClick={() => setActive("empleados")} style={styles.btn}>
                        <Users size={16} style={{ marginRight: 4 }} /> Gestionar Empleados
                    </button>
                    <button onClick={() => setActive("applications")} style={styles.btnAlt}>
                        <Mail size={16} style={{ marginRight: 4 }} /> Ver Solicitudes
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    chartContainer: {
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        minWidth: 400,
        flex: 1,
    },
    btn: {
        padding: "8px 14px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 600,
    },
    btnAlt: {
        padding: "8px 14px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 500,
        color: "#111",
    },
};
