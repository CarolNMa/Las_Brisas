import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";

export default function ApplicationsModule() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllApplications();
            setApplications(data.data || data);
        } catch (err) {
            console.error("Error cargando solicitudes:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("¿Aprobar esta solicitud?")) return;
        try {
            await ApiService.approveApplication(id);
            await loadData();
        } catch (err) {
            console.error("Error aprobando solicitud:", err);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("¿Rechazar esta solicitud?")) return;
        try {
            await ApiService.rejectApplication(id);
            await loadData();
        } catch (err) {
            console.error("Error rechazando solicitud:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta solicitud?")) return;
        try {
            await ApiService.deleteApplication(id);
            setApplications(applications.filter((a) => a.id !== id));
        } catch (err) {
            console.error("Error eliminando solicitud:", err);
        }
    };

    const handleExport = () => {
        exportCSV("solicitudes.csv", applications);
    };

    if (loading) return <p>Cargando solicitudes...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Solicitudes</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={styles.btnSmall} onClick={handleExport}>
                        Exportar
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Empleado</th>
                        <th style={styles.th}>Tipo</th>
                        <th style={styles.th}>Fecha Inicio</th>
                        <th style={styles.th}>Fecha Fin</th>
                        <th style={styles.th}>Motivo</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((a, idx) => (
                        <tr key={a.id || `app-${idx}`} style={styles.tr}>
                            <td style={styles.td}>{a.employee?.firstName} {a.employee?.lastName}</td>
                            <td style={styles.td}>{a.application_type?.name}</td>
                            <td style={styles.td}>{a.dateStart}</td>
                            <td style={styles.td}>{a.dateEnd}</td>
                            <td style={styles.td}>{a.reason}</td>
                            <td style={styles.td}>{a.status}</td>
                            <td style={styles.td}>
                                {a.status === "Pendiente" && (
                                    <>
                                        <button style={styles.btnSmall} onClick={() => handleApprove(a.id)}>Aprobar</button>{" "}
                                        <button style={styles.btnAlt} onClick={() => handleReject(a.id)}>Rechazar</button>{" "}
                                    </>
                                )}
                                <button style={styles.btnAlt} onClick={() => handleDelete(a.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
