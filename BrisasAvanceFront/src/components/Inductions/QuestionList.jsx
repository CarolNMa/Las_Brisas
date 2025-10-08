import { useEffect, useState } from "react";
import { ArrowLeft, Plus, RefreshCw, MessageCircle, Edit, Trash2 } from "lucide-react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";
import QuestionForm from "./QuestionForm";
import AnswerList from "./AnswerList";

export default function QuestionList({ moduleId }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        if (moduleId) load();
    }, [moduleId]);

    const load = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getQuestionsByModule(moduleId);
            setQuestions(data.data || data);
        } catch (err) {
            console.error("Error cargando preguntas:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta pregunta?")) return;
        try {
            await ApiService.deleteQuestion(id);
            load();
        } catch (err) {
            console.error("Error eliminando pregunta:", err);
        }
    };

    const handleSaved = () => {
        setModalOpen(false);
        load();
    };

    if (loading) return <p>Cargando preguntas...</p>;

    if (selectedQuestion) {
        return (
            <div style={styles.card}>
                <button style={styles.btnAlt} onClick={() => setSelectedQuestion(null)}>
                    <ArrowLeft size={16} style={{ marginRight: 4 }} /> Volver a preguntas
                </button>
                <AnswerList question={selectedQuestion} />
            </div>
        );
    }

    return (
        <div style={styles.card}>
            <h3>Preguntas del módulo</h3>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <button style={styles.btn} onClick={() => { setEditing(null); setModalOpen(true); }}>
                    <Plus size={16} style={{ marginRight: 4 }} /> Nueva Pregunta
                </button>
                <button style={styles.btnAlt} onClick={load}><RefreshCw size={16} style={{ marginRight: 4 }} /> Actualizar</button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Pregunta</th>
                        <th style={styles.th}>Tipo</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((q) => (
                        <tr key={q.id}>
                            <td style={styles.td}>{q.question}</td>
                            <td style={styles.td}>
                                {q.type === "truefalse" ? "Verdadero / Falso" : "Selección múltiple"}
                            </td>
                            <td style={styles.td}>
                                <button
                                    style={styles.btnSmall}
                                    onClick={() => setSelectedQuestion(q)}
                                >
                                    <MessageCircle size={16} style={{ marginRight: 4 }} /> Respuestas
                                </button>{" "}
                                <button
                                    style={styles.btnSmall}
                                    onClick={() => { setEditing(q); setModalOpen(true); }}
                                >
                                    <Edit size={16} style={{ marginRight: 4 }} /> Editar
                                </button>{" "}
                                <button
                                    style={styles.btnAlt}
                                    onClick={() => handleDelete(q.id)}
                                >
                                    <Trash2 size={16} style={{ marginRight: 4 }} /> Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <QuestionForm
                        moduleId={moduleId}
                        questionData={editing}
                        onClose={() => setModalOpen(false)}
                        onSaved={handleSaved}
                    />
                </Modal>
            )}
        </div>
    );
}
