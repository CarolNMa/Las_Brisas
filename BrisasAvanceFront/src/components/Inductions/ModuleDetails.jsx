import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import QuestionList from "./QuestionList"; // Solo se usa en inducciones

export default function ModuleDetail({ moduleId, showQuestions = true }) {
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inductionType, setInductionType] = useState("induction"); // por defecto
    const [showQs, setShowQs] = useState(false);

    // =============================
    // Cargar datos del módulo
    // =============================
    useEffect(() => {
        loadModule();
    }, [moduleId]);

    const loadModule = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getModuleById(moduleId);
            setModule(data);

            // Obtener tipo de la inducción (o capacitación)
            if (data?.induction?.type) {
                setInductionType(data.induction.type);
            }
        } catch (err) {
            console.error("❌ Error cargando módulo:", err);
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // Renderizado
    // =============================
    if (loading) return <p>Cargando módulo...</p>;
    if (!module) return <p>No se encontró el módulo</p>;

    const isCapacitacion = inductionType === "capacitacion";

    return (
        <div style={styles.card}>
            <h2>{module.name}</h2>
            <p>{module.description}</p>

            {/* Mostrar video */}
            {module.videoUrl && (
                <div style={{ marginTop: 20 }}>
                    <h4>🎬 Video:</h4>
                    <iframe
                        width="640"
                        height="360"
                        src={module.videoUrl}
                        title={module.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            {/* Mostrar tipo */}
            <div style={{ marginTop: 15 }}>
                <strong>Tipo de formación:</strong>{" "}
                {isCapacitacion ? "Capacitación" : "Inducción"}
            </div>

            {/* Preguntas solo para inducciones */}
            {!isCapacitacion && (
                <div style={{ marginTop: 20 }}>
                    <button
                        style={styles.btn}
                        onClick={() => setShowQs(!showQs)}
                    >
                        {showQs ? "⬅️ Ocultar Preguntas" : "📑 Ver Preguntas"}
                    </button>

                    {showQs && (
                        <div style={{ marginTop: 20 }}>
                            <QuestionList moduleId={module.id} />
                        </div>
                    )}
                </div>
            )}

            {/* Mensaje para capacitaciones */}
            {isCapacitacion && (
                <div
                    style={{
                        marginTop: 25,
                        background: "#f8f9fa",
                        padding: "12px 15px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                    }}
                >
                    <p>
                        🧠 Esta formación es una{" "}
                        <strong>Capacitación</strong>. No contiene preguntas;
                        el empleado solo debe visualizar el video para
                        completarla y recibirá automáticamente{" "}
                        <strong>100 puntos</strong>.
                    </p>
                </div>
            )}
        </div>
    );
}
