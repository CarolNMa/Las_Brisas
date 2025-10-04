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
            console.error("❌ Error guardando módulo:", err);
            alert("Error guardando módulo");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h3>{form.id ? "Editar Módulo" : "Nuevo Módulo"}</h3>
            <input
                className={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre del módulo"
            />
            <textarea
                className={styles.textarea}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descripción"
            />
            <input
                className={styles.input}
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="URL del video"
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button className={styles.button} onClick={handleSave} disabled={saving}>
                    {saving ? "Guardando..." : "Guardar"}
                </button>
                <button className={styles.buttonCancel} onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
}
