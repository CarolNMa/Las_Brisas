import { useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";

export default function InductionForm({ induction, onClose, onSaved }) {
    const [form, setForm] = useState({
        id: induction?.id || 0,
        name: induction?.name || "",
        description: induction?.description || "",
        type: induction?.type || "induction",
        status: induction?.status || "pendiente",
    });

    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const validateForm = () => {
        const newErrors = {};
        if (!form.name || form.name.trim().length < 3) {
            newErrors.name = "El nombre es obligatorio y debe tener al menos 3 caracteres.";
        }
        if (!form.description || form.description.trim().length < 5) {
            newErrors.description = "La descripción es obligatoria y debe tener al menos 5 caracteres.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        try {
            setSaving(true);
            await ApiService.saveInduction(form);
            if (onSaved) onSaved();
            onClose();
        } catch (err) {
            console.error("Error guardando inducción:", err);
            alert("Error guardando inducción");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3>{form.id ? "Editar Inducción" : "Nueva Inducción"}</h3>

            {/* Nombre */}
            <label>
                Nombre:
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={styles.input}
                    style={{ border: errors.name ? "1px solid red" : "" }}
                />
                {errors.name && <span style={{ color: "red", fontSize: "12px" }}>{errors.name}</span>}
            </label>

            {/* Descripción */}
            <label>
                Descripción:
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    onFocus={(e) => (e.target.style.border = "1px solid #2563eb")}
                    onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
                    style={{
                        ...styles.textarea,
                        border: errors.description ? "1px solid red" : "1px solid #ddd",
                    }}
                />

                {errors.description && (
                    <span style={{ color: "red", fontSize: "12px" }}>{errors.description}</span>
                )}
            </label>

            {/* Tipo */}
            <label>
                Tipo:
                <select name="type" value={form.type} onChange={handleChange} className={styles.input}>
                    <option value="induction">Inducción</option>
                    <option value="capacitacion">Capacitación</option>
                </select>
            </label>

            {/* Estado */}
            <label>
                Estado:
                <select name="status" value={form.status} onChange={handleChange} className={styles.input}>
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                </select>
            </label>

            {/* Botones */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                <button className={styles.btnAlt} onClick={onClose}>
                    Cancelar
                </button>
                <button className={styles.btn} onClick={handleSave} disabled={saving}>
                    {saving ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </div>
    );
}
