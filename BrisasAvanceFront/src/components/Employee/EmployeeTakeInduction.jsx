import { useState, useEffect } from "react";
import { Video } from "lucide-react";
import ApiService from "../../services/api";

export default function EmployeeTakeInduction({ assignmentId, inductionId, onComplete }) {
    const [induction, setInduction] = useState(null);
    const [modules, setModules] = useState([]);
    const [currentModule, setCurrentModule] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadInductionData();
    }, [inductionId]);

    const loadInductionData = async () => {
        try {
            setLoading(true);
            const [indData, modData] = await Promise.all([
                ApiService.getInductionById(inductionId),
                ApiService.getModulesByInduction(inductionId),
            ]);

            setInduction(indData.data || indData);
            setModules(modData.data || modData);
        } catch (err) {
            console.error("Error cargando inducción:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (assignmentId) {
            ApiService.request(`/induction-employee/${assignmentId}/seen`, {
                method: "PUT",
            })
                .then(() => console.log("Inducción marcada como vista"))
                .catch((err) => console.warn("No se pudo marcar como vista:", err));
        }
    }, [assignmentId]);

    useEffect(() => {
        if (modules[currentModule]) {
            loadQuestions(modules[currentModule].id);
        }
    }, [currentModule, modules]);

    const loadQuestions = async (moduleId) => {
        try {
            const qs = await ApiService.getQuestionsByModule(moduleId);
            const withAnswers = await Promise.all(
                (qs.data || qs).map(async (q) => {
                    const resps = await ApiService.getAnswersByQuestion(q.id);
                    return { ...q, answers: resps.data || resps };
                })
            );
            setQuestions(withAnswers);
        } catch (err) {
            console.error("Error cargando preguntas:", err);
        }
    };

    const handleAnswerChange = (questionId, answerId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    const nextModule = () => {
        if (currentModule < modules.length - 1) {
            setCurrentModule(currentModule + 1);
        }
    };

    const prevModule = () => {
        if (currentModule > 0) {
            setCurrentModule(currentModule - 1);
        }
    };

    const completeInduction = async () => {
        try {
            setSubmitting(true);

            let correctCount = 0;
            let totalQuestions = 0;

            questions.forEach((q) => {
                const selectedAnswerId = answers[q.id];
                totalQuestions++;

                if (q.answers && selectedAnswerId) {
                    const selectedAnswer = q.answers.find((a) => a.id === parseInt(selectedAnswerId));
                    if (selectedAnswer?.responseCorrect) {
                        correctCount++;
                    }
                }
            });

            const points =
                totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

            console.log(`Puntos obtenidos: ${points} (${correctCount}/${totalQuestions} correctas)`);

            await ApiService.completeAssignment(assignmentId, points);
            alert(`Inducción completada con ${points} puntos`);
            onComplete && onComplete(points);
        } catch (err) {
            console.error("Error completando inducción:", err);
            alert("Error completando inducción");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Cargando inducción...</div>;
    const module = modules[currentModule];
    if (!module) return <div>No hay módulos disponibles</div>;

    const videoLink =
        module.videoUrl || module.video_url || module.urlVideo || module.video;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ marginBottom: "20px" }}>
                <h2>{induction?.name || "Inducción"}</h2>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>
                        Módulo {currentModule + 1} de {modules.length}
                    </span>
                    <div>
                        <button
                            onClick={prevModule}
                            disabled={currentModule === 0}
                            style={{ marginRight: "10px" }}
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={
                                currentModule === modules.length - 1
                                    ? completeInduction
                                    : nextModule
                            }
                            disabled={submitting}
                        >
                            {currentModule === modules.length - 1
                                ? submitting
                                    ? "Completando..."
                                    : "Completar Inducción"
                                : "Siguiente →"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Detalles del módulo */}
            <div style={{ marginBottom: "20px" }}>
                <h3>{module.name}</h3>
                {module.description && <p style={{ color: "#555" }}>{module.description}</p>}
            </div>

            {/* Link al video */}
            {videoLink && (
                <div style={{ marginBottom: "20px" }}>
                    <p>
                        <strong>Video del módulo:</strong>
                    </p>
                    <a
                        href={videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-block",
                            background: "#007bff",
                            color: "#fff",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        <Video size={16} style={{ marginRight: 4 }} /> Ver video aquí
                    </a>
                </div>
            )}

            {/* Preguntas del módulo */}
            {questions.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Preguntas del módulo</h3>
                    {questions.map((q) => (
                        <div
                            key={q.id}
                            style={{
                                marginBottom: "15px",
                                borderBottom: "1px solid #eee",
                                paddingBottom: "10px",
                            }}
                        >
                            <p style={{ fontWeight: "600" }}>{q.question}</p>

                            {/* Verdadero / Falso */}
                            {q.type === "truefalse" ? (
                                <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`q-${q.id}`}
                                            value="true"
                                            onChange={() => handleAnswerChange(q.id, "true")}
                                            style={{
                                                accentColor: "#b00",
                                                cursor: "pointer",
                                                transform: "translateY(-1px)",
                                            }}
                                        />
                                        Verdadero
                                    </label>

                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`q-${q.id}`}
                                            value="false"
                                            onChange={() => handleAnswerChange(q.id, "false")}
                                            style={{
                                                accentColor: "#b00",
                                                cursor: "pointer",
                                                transform: "translateY(-1px)",
                                            }}
                                        />
                                        Falso
                                    </label>
                                </div>
                            ) : (
                                // Selección múltiple (alineada)
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "auto 1fr",
                                        rowGap: "8px",
                                        columnGap: "10px",
                                        marginTop: "8px",
                                        alignItems: "center",
                                    }}
                                >
                                    {q.answers?.map((a) => (
                                        <label
                                            key={a.id}
                                            style={{
                                                display: "contents",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name={`q-${q.id}`}
                                                value={a.id}
                                                onChange={() => handleAnswerChange(q.id, a.id)}
                                                style={{
                                                    accentColor: "#b00",
                                                    cursor: "pointer",
                                                    width: "18px",
                                                    height: "18px",
                                                    marginLeft: "5px",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "15px",
                                                    color: "#333",
                                                    userSelect: "none",
                                                }}
                                            >
                                                {a.answer}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
