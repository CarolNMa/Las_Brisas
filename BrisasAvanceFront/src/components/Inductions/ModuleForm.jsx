import { useEffect, useState } from "react";
import ApiService from "../../services/api";

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
        if (!form.inductionId) return alert("Falta el ID de la inducción");

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
            console.error("❌ Error guardando módulo:", err);
            alert("Error guardando módulo");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <h3>{form.id ? "Editar módulo" : "Nuevo módulo"}</h3>
            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre del módulo"
                style={styles.input}
            />
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción"
                style={styles.textarea}
            />
            <input
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="URL del video"
                style={styles.input}
            />
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
