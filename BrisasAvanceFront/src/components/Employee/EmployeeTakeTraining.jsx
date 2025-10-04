import { useEffect, useState } from "react";
import ApiService from "../../services/api";

export default function EmployeeTakeTraining({ assignment, onComplete }) {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentModule, setCurrentModule] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadModules();
        markAsSeen(); // 👁️ marcar como vista al entrar
    }, []);

    // ==============================
    // Cargar módulos de capacitación
    // ==============================
    const loadModules = async () => {
        try {
            const data = await ApiService.getModulesByInduction(assignment.inductionId);
            setModules(data.data || data);
        } catch (err) {
            console.error("❌ Error cargando módulos de capacitación:", err);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // Marcar como vista
    // ==============================
    const markAsSeen = async () => {
        try {
            await ApiService.request(`/induction-employee/${assignment.id}/seen`, {
                method: "PUT",
            });
            console.log("👁️ Capacitación marcada como vista");
        } catch (err) {
            console.warn("⚠️ No se pudo marcar como vista:", err);
        }
    };

    // ==============================
    // Completar capacitación (100 puntos)
    // ==============================
    const markComplete = async () => {
        try {
            setSubmitting(true);
            await ApiService.request(`/induction-employee/${assignment.id}/complete-training`, {
                method: "PUT",
            });
            alert("🎓 Capacitación completada correctamente con 100 puntos");
            onComplete && onComplete();
        } catch (err) {
            console.error("❌ Error completando capacitación:", err);
            alert("Error al completar la capacitación");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Cargando capacitación...</div>;

    const module = modules[currentModule];
    if (!module) return <div>No hay módulos disponibles</div>;

    // Asegurarse de tener una URL válida
    const videoUrl =
        module.videoUrl || module.video_url || module.urlVideo || module.video;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h2>{assignment.inductionName}</h2>

            {/* Información del módulo */}
            <div style={{ marginBottom: "20px" }}>
                <h3>{module.name}</h3>
                {module.description && (
                    <p style={{ color: "#555", marginTop: "5px" }}>{module.description}</p>
                )}
            </div>

            {/* Video embebido o link */}
            {videoUrl ? (
                <div style={{ margin: "20px 0" }}>

                    <p style={{ marginTop: "10px" }}>
                        🎥{" "}
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#007bff", fontWeight: "bold" }}
                        >
                            Ver video
                        </a>
                    </p>
                </div>
            ) : (
                <p style={{ color: "gray" }}>⚠️ No hay video disponible para este módulo.</p>
            )}

            {/* Navegación entre módulos */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                }}
            >
                <button
                    onClick={() => {
                        if (currentModule > 0) setCurrentModule(currentModule - 1);
                    }}
                    disabled={currentModule === 0}
                >
                    ← Anterior
                </button>

                {currentModule < modules.length - 1 ? (
                    <button onClick={() => setCurrentModule(currentModule + 1)}>
                        Siguiente →
                    </button>
                ) : (
                    <button onClick={markComplete} disabled={submitting}>
                        {submitting ? "Completando..." : "Finalizar Capacitación"}
                    </button>
                )}
            </div>
        </div>
    );
}
