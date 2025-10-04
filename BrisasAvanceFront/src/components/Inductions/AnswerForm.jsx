import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";

export default function AnswerForm({ questionId, answerData = null, onClose, onSaved }) {
    const [form, setForm] = useState({
        id: 0,
        answer: "",
        responseCorrect: false,
        questionId,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (answerData) {
            setForm({
                id: answerData.id,
                answer: answerData.answer,
                responseCorrect: !!answerData.responseCorrect,
                questionId,
            });
        }
    }, [answerData, questionId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSave = async () => {
        if (!form.answer?.trim()) return alert("La respuesta no puede estar vacía");
        try {
            setSaving(true);
            await ApiService.saveAnswer(form);
            onSaved?.();
            onClose?.();
        } catch (err) {
            console.error("❌ Error guardando respuesta:", err);
            alert("Error guardando respuesta");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h4>{form.id ? "Editar Respuesta" : "Nueva Respuesta"}</h4>
            <input
                className={styles.input}
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="Texto de la respuesta"
            />
            <label style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0" }}>
                <input
                    type="checkbox"
                    name="responseCorrect"
                    checked={form.responseCorrect}
                    onChange={handleChange}
                />
                ¿Es correcta?
            </label>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button className={styles.button} onClick={handleSave} disabled={saving}>
                    {saving ? "Guardando..." : "💾 Guardar"}
                </button>
                <button className={styles.buttonCancel} onClick={onClose}>❌ Cancelar</button>
            </div>
        </div>
    );
}
