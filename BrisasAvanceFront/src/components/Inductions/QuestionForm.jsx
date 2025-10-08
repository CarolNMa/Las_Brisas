import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";


const TYPE_OPTIONS = [
    { value: "truefalse", label: "Verdadero / Falso" },
    { value: "multiplechoice", label: "Selección múltiple" },
];

export default function QuestionForm({ moduleId, questionData = null, onClose, onSaved }) {
    const [form, setForm] = useState({
        id: 0,
        question: "",
        type: "truefalse",
        moduleInductionId: moduleId,
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (questionData) {
            setForm({
                id: questionData.id,
                question: questionData.question,
                type: (questionData.type || "truefalse").toLowerCase(),
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
            console.error("Error guardando pregunta:", err);
            alert("Error guardando pregunta");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3>{form.id ? "Editar Pregunta" : "Nueva Pregunta"}</h3>

            {/* Campo de texto */}
            <textarea
                name="question"
                value={form.question}
                onChange={handleChange}
                placeholder="Escribe la pregunta"
                style={styles.textarea}
            />

            {/* Selector de tipo */}
            <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={styles.input} 
            >
                {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {/* Botones */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                    style={styles.btn}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Guardando..." : "Guardar"}
                </button>

                <button
                    style={styles.btnAlt}
                    onClick={onClose}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
