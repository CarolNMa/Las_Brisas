import { useState, useEffect } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";

export default function InductionAnswers({ questionId }) {
    const [answers, setAnswers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ texto_respuesta: "", respuesta_correcta: false });
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        if (questionId) loadAnswers();
    }, [questionId]);

    const loadAnswers = async () => {
        try {
            const data = await ApiService.getAnswersByQuestion(questionId);
            setAnswers(data.data || data);
        } catch (err) {
            console.error("❌ Error cargando respuestas:", err);
        }
    };

    const openModal = (answer = null) => {
        setEditing(answer);
        setForm(answer || { texto_respuesta: "", respuesta_correcta: false });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await ApiService.updateAnswer(editing.id, form);
            } else {
                await ApiService.createAnswer({ ...form, id_pregunta: questionId });
            }
            loadAnswers();
            setModalOpen(false);
        } catch (err) {
            console.error("❌ Error guardando respuesta:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta respuesta?")) return;
        try {
            await ApiService.deleteAnswer(id);
            loadAnswers();
        } catch (err) {
            console.error("❌ Error eliminando respuesta:", err);
        }
    };

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <h5>Respuestas</h5>
                <button style={styles.btn} onClick={() => openModal()}>Nueva Respuesta</button>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Texto</th>
                        <th style={styles.th}>Correcta</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {answers.map((a) => (
                        <tr key={a.id} style={styles.tr}>
                            <td style={styles.td}>{a.texto_respuesta}</td>
                            <td style={styles.td}>{a.respuesta_correcta ? "✅ Sí" : "❌ No"}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => openModal(a)}>Editar</button>
                                <button style={styles.btnAlt} onClick={() => handleDelete(a.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <Modal open={modalOpen} title={editing ? "Editar Respuesta" : "Nueva Respuesta"} onClose={() => setModalOpen(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Texto de la respuesta:
                            <input
                                type="text"
                                value={form.texto_respuesta}
                                onChange={(e) => setForm({ ...form, texto_respuesta: e.target.value })}
                            />
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input
                                type="checkbox"
                                checked={form.respuesta_correcta}
                                onChange={(e) => setForm({ ...form, respuesta_correcta: e.target.checked })}
                            />
                            ¿Es la respuesta correcta?
                        </label>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <button style={styles.btnAlt} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button style={styles.btn} onClick={handleSave}>Guardar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
