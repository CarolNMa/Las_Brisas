import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import QuestionList from "./QuestionList"; // 🔹 Nuevo componente para preguntas

export default function ModuleDetail({ moduleId }) {
    const [module, setModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showQuestions, setShowQuestions] = useState(false);

    useEffect(() => {
        load();
    }, [moduleId]);

    const load = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getModuleById(moduleId);
            setModule(data);
        } catch (err) {
            console.error("❌ Error cargando módulo:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Cargando módulo...</p>;
    if (!module) return <p>No se encontró el módulo</p>;

    return (
        <div style={styles.card}>
            <h2>{module.name}</h2>
            <p>{module.description}</p>

            {module.videoUrl && (
                <div style={{ marginTop: "15px" }}>
                    <h4>Video:</h4>
                    <iframe
                        width="560"
                        height="315"
                        src={module.videoUrl}
                        title={module.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            <div style={{ marginTop: "20px" }}>
                <button
                    style={styles.btn}
                    onClick={() => setShowQuestions(!showQuestions)}
                >
                    {showQuestions ? "⬅️ Ocultar Preguntas" : "📑 Ver Preguntas"}
                </button>
            </div>

            {showQuestions && (
                <div style={{ marginTop: "20px" }}>
                    <QuestionList moduleId={module.id} />
                </div>
            )}
        </div>
    );
}
