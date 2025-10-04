import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";
import AnswerForm from "./AnswerForm";

export default function AnswerList({ question, onBack }) {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        if (question?.id) {
            load();
        }
    }, [question]);

    const load = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAnswersByQuestion(question.id);
            setAnswers(data.data || data);
        } catch (err) {
            console.error("❌ Error cargando respuestas:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta respuesta?")) return;
        try {
            await ApiService.deleteAnswer(id);
            setAnswers(answers.filter((a) => a.id !== id));
        } catch (err) {
            console.error("❌ Error eliminando respuesta:", err);
        }
    };

    const handleOpenModal = (answer = null) => {
        setEditing(answer);
        setModalOpen(true);
    };

    const handleSaved = () => {
        setModalOpen(false);
        load();
    };

    if (loading) return <p>Cargando respuestas...</p>;

    return (
        <div style={styles.card}>

            <h3 style={{ marginTop: "10px" }}>
                Respuestas de: <strong>{question?.question}</strong>
            </h3>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button className={styles.btn} onClick={() => handleOpenModal()}>
                    ➕ Nueva Respuesta
                </button>
                <button className={styles.btnAlt} onClick={load}>
                    🔄 Actualizar
                </button>
            </div>

            <table style={{ ...styles.table, marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th style={styles.th}>Respuesta</th>
                        <th style={styles.th}>¿Correcta?</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {answers.length > 0 ? (
                        answers.map((a) => (
                            <tr key={a.id} style={styles.tr}>
                                <td style={styles.td}>{a.answer}</td>
                                <td style={styles.td}>
                                    {a.responseCorrect ? (
                                        <span style={{ color: "green" }}>✅ Sí</span>
                                    ) : (
                                        <span style={{ color: "red" }}>❌ No</span>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    <button className={styles.btnSmall} onClick={() => handleOpenModal(a)}>
                                        ✏️ Editar
                                    </button>{" "}
                                    <button className={styles.btnAlt} onClick={() => handleDelete(a.id)}>
                                        🗑️ Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={styles.td} colSpan="3">No hay respuestas registradas.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {modalOpen && (
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <AnswerForm
                        question={question}
                        answerData={editing}
                        onClose={() => setModalOpen(false)}
                        onSaved={handleSaved}
                    />
                </Modal>
            )}
        </div>
    );
}
