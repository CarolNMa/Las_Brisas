import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";
import QuestionForm from "./QuestionForm";

export default function QuestionList({ moduleId }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        if (moduleId) load();
    }, [moduleId]);

    const load = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getQuestionsByModule(moduleId);
            setQuestions(data.data || data);
        } catch (err) {
            console.error("❌ Error cargando preguntas:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta pregunta?")) return;
        try {
            await ApiService.deleteQuestion(id);
            setQuestions(questions.filter((q) => q.id !== id));
        } catch (err) {
            console.error("❌ Error eliminando pregunta:", err);
        }
    };

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Preguntas del módulo</h3>
                <button
                    style={styles.btn}
                    onClick={() => {
                        setEditing(null);
                        setModalOpen(true);
                    }}
                >
                    ➕ Nueva Pregunta
                </button>
            </div>

            {/* Tabla */}
            {loading ? (
                <p>Cargando preguntas...</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Pregunta</th>
                            <th style={styles.th}>Tipo</th>
                            <th style={styles.th}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={styles.td}>
                                    No hay preguntas registradas
                                </td>
                            </tr>
                        ) : (
                            questions.map((q) => (
                                <tr key={q.id}>
                                    <td style={styles.td}>{q.question}</td>
                                    <td style={styles.td}>{q.type}</td>
                                    <td style={styles.td}>
                                        <button
                                            style={styles.btnSmall}
                                            onClick={() => {
                                                setEditing(q);
                                                setModalOpen(true);
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>{" "}
                                        <button
                                            style={styles.btnAlt}
                                            onClick={() => handleDelete(q.id)}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            {/* Modal */}
            {modalOpen && (
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <QuestionForm
                        moduleId={moduleId}
                        questionData={editing}
                        onClose={() => setModalOpen(false)}
                        onSaved={load}
                    />
                </Modal>
            )}
        </div>
    );
}
