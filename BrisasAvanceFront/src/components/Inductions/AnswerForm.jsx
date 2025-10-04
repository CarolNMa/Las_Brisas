import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";

export default function AnswerForm({ question, answerData = null, onClose, onSaved }) {
    const [form, setForm] = useState({
        id: 0,
        answer: "",
        responseCorrect: false,
        questionId: question?.id || 0,
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (answerData) {
            setForm({
                id: answerData.id,
                answer: answerData.answer || "",
                responseCorrect: !!answerData.responseCorrect,
                questionId: question?.id || 0,
            });
        }
    }, [answerData, question]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = async () => {
        if (!form.answer?.trim()) {
            alert("⚠️ El texto de la respuesta es obligatorio");
            return;
        }

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
            <h3>{form.id ? "Editar Respuesta" : "Nueva Respuesta"}</h3>
            <p><strong>Pregunta:</strong> {question?.question}</p>

            {/* Campo de texto */}
            <textarea
                className={styles.textarea}
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="Escribe la respuesta (ej: Verdadero, Falso, Opción A...)"
            />

            {/* Checkbox de respuesta correcta */}
            <div style={{ marginTop: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                        type="checkbox"
                        name="responseCorrect"
                        checked={form.responseCorrect}
                        onChange={handleChange}
                    />
                    Es la respuesta correcta
                </label>
            </div>

            {/* Botones */}
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button className={styles.button} onClick={handleSave} disabled={saving}>
                    {saving ? "Guardando..." : "💾 Guardar"}
                </button>
                <button className={styles.buttonCancel} onClick={onClose}>
                    ❌ Cancelar
                </button>
            </div>
        </div>
    );
}
