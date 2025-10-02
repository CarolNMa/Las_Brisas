import { useState, useEffect } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";

export default function InductionModules({ inductionId }) {
    const [modules, setModules] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", videoUrl: "" });
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        if (inductionId) loadModules();
    }, [inductionId]);

    const loadModules = async () => {
        try {
            const data = await ApiService.getModulesByInduction(inductionId);
            const modulesFormatted = (data.data || data).map(m => ({
                ...m,
                videoUrl: m.videoUrl || m.video_url 
            }));
            setModules(modulesFormatted);
        } catch (err) {
            console.error("❌ Error cargando módulos:", err);
        }
    };

    const openModal = (module = null) => {
        setEditing(module);
        setForm(
            module || { name: "", description: "", videoUrl: "" }
        );
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const payload = {
                name: form.name,
                description: form.description,
                videoUrl: form.videoUrl,
                inductionId: inductionId,
            };

            console.log("📤 Enviando módulo:", payload);

            if (editing) {
                await ApiService.updateModule(editing.id, payload);
            } else {
                await ApiService.createModule(payload);
            }
            loadModules();
            setModalOpen(false);
        } catch (err) {
            console.error("❌ Error guardando módulo:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este módulo?")) return;
        try {
            await ApiService.deleteModule(id);
            loadModules();
        } catch (err) {
            console.error("❌ Error eliminando módulo:", err);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <h4>Módulos de la inducción</h4>
                <button style={styles.btn} onClick={() => openModal()}>Nuevo Módulo</button>
            </div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Título</th>
                        <th style={styles.th}>Descripción</th>
                        <th style={styles.th}>Video</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {modules.map((m) => (
                        <tr key={m.id} style={styles.tr}>
                            <td style={styles.td}>{m.name}</td>
                            <td style={styles.td}>{m.description}</td>
                            <td style={styles.td}>
                                <a
                                    href={m.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ver Video
                                </a>
                            </td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => openModal(m)}>Editar</button>
                                <button style={styles.btnAlt} onClick={() => handleDelete(m.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <Modal open={modalOpen} title={editing ? "Editar Módulo" : "Nuevo Módulo"} onClose={() => setModalOpen(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Título:
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </label>
                        <label>
                            Descripción:
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </label>
                        <label>
                            Video URL:
                            <input
                                type="text"
                                value={form.videoUrl}
                                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                            />
                        </label>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <button style={styles.btnAlt} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button style={styles.btn} onClick={handleSave}>Guardar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
