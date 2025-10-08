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
            alert("El texto de la respuesta es obligatorio");
            return;
        }

        try {
            setSaving(true);
            await ApiService.saveAnswer(form);
            onSaved?.();
            onClose?.();
        } catch (err) {
            console.error("Error guardando respuesta:", err);
            alert("Error guardando respuesta");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3>{form.id ? "Editar Respuesta" : "Nueva Respuesta"}</h3>
            <p>
                <strong>Pregunta:</strong> {question?.question}
            </p>

            {/* Campo de texto */}
            <textarea
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="Escribe la respuesta (ej: Verdadero, Falso, Opción A...)"
                style={styles.textarea}
            />

            {/* Checkbox*/}
            <label>
                <div style={{ alignItems: "center", gap: 8, display: "inline-flex", marginTop: "10px" }}>
                    <input
                        type="checkbox"
                        name="responseCorrect"
                        checked={form.responseCorrect}
                        onChange={handleChange}
                    />
                    Es la respuesta correcta
                </div>
            </label>

            {/* Botones */}
            <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "flex-end" }}>
                <button
                    style={styles.btnAlt}
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button
                    style={styles.btn}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </div>
    );
}
