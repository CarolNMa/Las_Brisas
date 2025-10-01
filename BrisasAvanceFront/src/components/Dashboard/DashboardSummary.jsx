import Card from "../Layout/Tarjeta";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";

export default function DashboardSummary({
    empleados,
    users,
    applications,
    contratos,
    areas,
    asistencias,
    setActive,
}) {
    const employeesByArea = areas.map((area) => ({
        name: area.name,
        count: empleados.filter((e) =>
            e.area?.id === area.id || e.areaId === area.id
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

    return (
        <div>
            <h2>Resumen general</h2>
            <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                <Card title="👥 Empleados" value={empleados.length} />
                <Card title="👤 Usuarios" value={users.length} />
                <Card title="📩 Solicitudes" value={applications.length} />
                <Card title="📄 Contratos" value={contratos.length} />
                <Card title="🏢 Áreas" value={areas.length} />
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
                        📊 Exportar Empleados
                    </button>
                    <button
                        onClick={() => exportCSV("applications_all.csv", applications)}
                        style={styles.btnAlt}
                    >
                        📋 Exportar Solicitudes
                    </button>
                    <button onClick={() => setActive("empleados")} style={styles.btn}>
                        👥 Gestionar Empleados
                    </button>
                    <button onClick={() => setActive("applications")} style={styles.btnAlt}>
                        📩 Ver Solicitudes
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
