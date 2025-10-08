import { useState, useEffect } from "react";
import { Folder, Plus, BookOpen, Edit, Trash2 } from "lucide-react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";
import ModuleForm from "./ModuleForm";

export default function ModuleList({ induction, onSelectModule }) {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        load();
    }, [induction]);

    const load = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getModulesByInduction(induction.id);
            setModules(data.data || data);
        } catch (err) {
            console.error("Error cargando módulos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este módulo?")) return;
        try {
            await ApiService.deleteModule(id);
            setModules(modules.filter((m) => m.id !== id));
        } catch (err) {
            console.error("Error eliminando módulo:", err);
        }
    };

    const handleOpenModal = (module = null) => {
        setEditing(module);
        setModalOpen(true);
    };

    const handleSaved = () => {
        setModalOpen(false);
        load();
    };

    if (loading) return <p>Cargando módulos...</p>;

    return (
        <div>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3><Folder size={16} style={{ marginRight: 8 }} /> Módulos de {induction.name}</h3>
                <button style={styles.btn} onClick={() => handleOpenModal()}>
                    <Plus size={16} style={{ marginRight: 4 }} /> Nuevo Módulo
                </button>
            </div>

            {modules.length === 0 ? (
                <p>No hay módulos</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Nombre</th>
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
                                    <a href={m.videoUrl || m.video_url} target="_blank" rel="noreferrer">
                                        Ver video
                                    </a>

                                </td>
                                <td style={styles.td}>
                                    <button style={styles.btnSmall} onClick={() => onSelectModule(m)}>
                                        <BookOpen size={16} style={{ marginRight: 4 }} /> Ver
                                    </button>{" "}
                                    <button style={styles.btnSmall} onClick={() => handleOpenModal(m)}>
                                        <Edit size={16} style={{ marginRight: 4 }} /> Editar
                                    </button>{" "}
                                    <button style={styles.btnAlt} onClick={() => handleDelete(m.id)}>
                                        <Trash2 size={16} style={{ marginRight: 4 }} /> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal Crear/Editar */}
            {modalOpen && (
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <ModuleForm
                        inductionId={induction.id}
                        moduleData={editing}
                        onClose={() => setModalOpen(false)}
                        onSaved={handleSaved}
                    />
                </Modal>
            )}
        </div>
    );
}
