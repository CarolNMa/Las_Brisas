import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";

export default function ModuleForm({ inductionId, moduleData = null, onClose, onSaved }) {
    const [form, setForm] = useState({
        id: 0,
        name: "",
        description: "",
        videoUrl: "",
        inductionId: inductionId || 0,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (moduleData) {
            setForm({
                id: moduleData.id,
                name: moduleData.name || "",
                description: moduleData.description || "",
                videoUrl: moduleData.videoUrl || moduleData.video_url || "",
                inductionId: moduleData.inductionId || inductionId || 0,
            });
        }
    }, [moduleData, inductionId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.name?.trim()) return alert("El nombre es obligatorio");
        if (!form.description?.trim()) return alert("La descripción es obligatoria");
        if (!form.videoUrl?.startsWith("http")) return alert("La URL del video debe ser válida (http/https)");

        try {
            setSaving(true);
            if (form.id) {
                await ApiService.updateModule(form.id, form);
            } else {
                await ApiService.saveModule(form);
            }
            onSaved?.();
            onClose?.();
        } catch (err) {
            console.error("Error guardando módulo:", err);
            alert("Error guardando módulo");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h3>{form.id ? "Editar Módulo" : "Nuevo Módulo"}</h3>

            {/* Nombre */}
            <input
                style={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre del módulo"
            />

            {/* Descripción */}
            <textarea
                style={styles.textarea}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción"
            />

            {/* URL del video */}
            <input
                style={styles.input}
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="URL del video"
            />

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
