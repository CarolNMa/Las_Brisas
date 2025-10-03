import { useEffect, useState } from "react";
import ApiService from "../../services/api";

const TYPE_OPTIONS = [
    { value: "multiplechoice", label: "Selección múltiple" },
    { value: "singlechoice", label: "Selección única" },
    { value: "open", label: "Abierta" },
];

export default function QuestionForm({ moduleId, questionData = null, onClose, onSaved }) {
    const [form, setForm] = useState({
        id: 0,
        question: "",
        type: "multiplechoice",
        moduleInductionId: moduleId,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (questionData) {
            setForm({
                id: questionData.id,
                question: questionData.question,
                type: (questionData.type || "multiplechoice").toLowerCase(),
                moduleInductionId: moduleId,
            });
        }
    }, [questionData, moduleId]);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        if (!form.question?.trim()) return alert("La pregunta no puede estar vacía");
        try {
            setSaving(true);
            await ApiService.saveQuestion(form); // el service resuelve crear/actualizar por tener o no id
            onSaved?.();
            onClose?.();
        } catch (err) {
            console.error("❌ Error guardando pregunta:", err);
            alert("Error guardando pregunta");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <h3>{form.id ? "Editar pregunta" : "Nueva pregunta"}</h3>
            <textarea
                name="question"
                value={form.question}
                onChange={handleChange}
                placeholder="Escribe la pregunta"
                style={styles.textarea}
            />
            <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
                {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>

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
    textarea: { width: "100%", minHeight: 90, margin: "6px 0", padding: 8 },
    actions: { display: "flex", gap: 8, marginTop: 8 },
};
