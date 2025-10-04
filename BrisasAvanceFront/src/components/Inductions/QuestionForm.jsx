import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";

// ✅ Solo dos tipos permitidos
const TYPE_OPTIONS = [
    { value: "truefalse", label: "Verdadero / Falso" },
    { value: "multiplechoice", label: "Selección múltiple" },
];

export default function QuestionForm({ moduleId, questionData = null, onClose, onSaved }) {
    const [form, setForm] = useState({
        id: 0,
        question: "",
        type: "truefalse", // ✅ por defecto ahora Verdadero/Falso
        moduleInductionId: moduleId,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (questionData) {
            setForm({
                id: questionData.id,
                question: questionData.question,
                type: (questionData.type || "truefalse").toLowerCase(), // ✅ usar solo permitido
                moduleInductionId: moduleId,
            });
        }
    }, [questionData, moduleId]);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        if (!form.question?.trim()) return alert("La pregunta no puede estar vacía");
        try {
            setSaving(true);
            await ApiService.saveQuestion(form);
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
        <div>
            <h3>{form.id ? "✏️ Editar Pregunta" : "➕ Nueva Pregunta"}</h3>

            <textarea
                className={styles.textarea}
                name="question"
                value={form.question}
                onChange={handleChange}
                placeholder="Escribe la pregunta"
            />

            <select
                className={styles.input}
                name="type"
                value={form.type}
                onChange={handleChange}
            >
                {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                    className={styles.button}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Guardando..." : "💾 Guardar"}
                </button>
                <button
                    className={styles.buttonCancel}
                    onClick={onClose}
                >
                    ❌ Cancelar
                </button>
            </div>
        </div>
    );
}
