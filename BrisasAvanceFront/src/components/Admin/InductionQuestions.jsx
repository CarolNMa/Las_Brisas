import { useState, useEffect } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";
import InductionAnswers from "./InductionAnswer"; 

export default function InductionQuestions({ moduleId }) {
    const [questions, setQuestions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ texto_pregunta: "", tipo_pregunta: "multiple" });
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        if (moduleId) loadQuestions();
    }, [moduleId]);

    const loadQuestions = async () => {
        try {
            const data = await ApiService.getQuestionsByModule(moduleId);
            setQuestions(data.data || data);
        } catch (err) {
            console.error("❌ Error cargando preguntas:", err);
        }
    };

    const openModal = (q = null) => {
        setEditing(q);
        setForm(q || { texto_pregunta: "", tipo_pregunta: "multiple" });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editing) {
                await ApiService.updateQuestion(editing.id, form);
            } else {
                await ApiService.createQuestion({ ...form, id_modulo: moduleId });
            }
            loadQuestions();
            setModalOpen(false);
        } catch (err) {
            console.error("❌ Error guardando pregunta:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta pregunta?")) return;
        try {
            await ApiService.deleteQuestion(id);
            loadQuestions();
        } catch (err) {
            console.error("❌ Error eliminando pregunta:", err);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <h4>Preguntas del módulo</h4>
                <button style={styles.btn} onClick={() => openModal()}>Nueva Pregunta</button>
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
                        <>
                            <tr key={q.id} style={styles.tr}>
                                <td style={styles.td}>{q.texto_pregunta}</td>
                                <td style={styles.td}>{q.tipo_pregunta}</td>
                                <td style={styles.td}>
                                    <button style={styles.btnSmall} onClick={() => openModal(q)}>Editar</button>
                                    <button style={styles.btnAlt} onClick={() => handleDelete(q.id)}>Eliminar</button>
                                </td>
                            </tr>

                            {/* 👇 Aquí renderizamos las respuestas de cada pregunta */}
                            <tr>
                                <td colSpan={3} style={{ background: "#fafafa", padding: "10px 15px" }}>
                                    <InductionAnswers questionId={q.id} />
                                </td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <Modal open={modalOpen} title={editing ? "Editar Pregunta" : "Nueva Pregunta"} onClose={() => setModalOpen(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Texto de la Pregunta:
                            <input
                                type="text"
                                value={form.texto_pregunta}
                                onChange={(e) => setForm({ ...form, texto_pregunta: e.target.value })}
                            />
                        </label>
                        <label>
                            Tipo:
                            <select
                                value={form.tipo_pregunta}
                                onChange={(e) => setForm({ ...form, tipo_pregunta: e.target.value })}
                            >
                                <option value="multiple">Opción Múltiple</option>
                                <option value="truefalse">Verdadero / Falso</option>
                            </select>
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
