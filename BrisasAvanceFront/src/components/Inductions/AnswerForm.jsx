import { useEffect, useState } from "react";
import ApiService from "../../services/api";

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
            await ApiService.saveAnswer(form); // crea/actualiza según tenga id
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
        <div style={styles.wrapper}>
            <h4>{form.id ? "Editar respuesta" : "Nueva respuesta"}</h4>
            <input
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="Texto de la respuesta"
                style={styles.input}
            />
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                    type="checkbox"
                    name="responseCorrect"
                    checked={form.responseCorrect}
                    onChange={handleChange}
                />
                ¿Es correcta?
            </label>

            <div style={styles.actions}>
                <button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "💾 Guardar"}</button>
                <button onClick={onClose}>❌ Cancelar</button>
            </div>
        </div>
    );
}

const styles = {
    wrapper: { padding: 12, background: "#fff", borderRadius: 8, maxWidth: 520 },
    input: { width: "100%", margin: "6px 0", padding: 8 },
    actions: { display: "flex", gap: 8, marginTop: 8 },
};
