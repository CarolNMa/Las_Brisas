import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import DashboardSummary from "./DashboardSummary";

export default function Dashboard() {
    const [empleados, setEmpleados] = useState([]);
    const [users, setUsers] = useState([]);
    const [applications, setApplications] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [areas, setAreas] = useState([]);
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState("resumen");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [
                    empleadosData,
                    usersData,
                    appsData,
                    contratosData,
                    areasData,
                    asistenciasData,
                ] = await Promise.all([
                    ApiService.getAllEmployees(),
                    ApiService.getAllUsers(),
                    ApiService.getAllApplications(),
                    ApiService.getAllContracts(),
                    ApiService.getAllAreas(),
                    ApiService.getAllAttendance(),
                ]);

                setEmpleados(empleadosData.data || empleadosData);
                setUsers(usersData.data || usersData);
                setApplications(appsData.data || appsData);
                setContratos(contratosData.data || contratosData);
                setAreas(areasData.data || areasData);
                setAsistencias(asistenciasData.data || asistenciasData);
            } catch (err) {
                console.error("❌ Error cargando datos del dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <p>Cargando resumen...</p>;

    return (
        <DashboardSummary
            empleados={empleados}
            users={users}
            applications={applications}
            contratos={contratos}
            areas={areas}
            asistencias={asistencias}
            setActive={setActive}
        />
    );
}
