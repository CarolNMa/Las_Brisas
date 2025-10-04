import { useState, useEffect } from "react";
import { styles } from "../Dashboard/styles";
import ApiService from "../../services/api";
import Modal from "../Layout/Modal";
import InductionForm from "../Inductions/InductionForm";
import ModuleList from "../Inductions/ModuleList";
import ModuleDetail from "../Inductions/ModuleDetails";

export default function InductionsModule() {
    const [inductions, setInductions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [view, setView] = useState("list"); 
    const [selectedInduction, setSelectedInduction] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllInductions();
            setInductions(data.data || data);
        } catch (err) {
            console.error("❌ Error cargando inducciones:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta inducción?")) return;
        try {
            await ApiService.deleteInduction(id);
            setInductions(inductions.filter((i) => i.id !== id));
        } catch (err) {
            console.error("❌ Error eliminando inducción:", err);
        }
    };

    const handleOpenModal = (induction = null) => {
        setEditing(induction);
        setModalOpen(true);
    };

    const handleSaved = () => {
        setModalOpen(false);
        loadData();
    };

    if (loading) return <p>Cargando inducciones...</p>;

    if (view === "modules" && selectedInduction) {
        return (
            <div style={styles.card}>
                <button style={styles.btnAlt} onClick={() => setView("list")}>⬅️ Volver</button>
                <ModuleList
                    induction={selectedInduction}
                    onSelectModule={(m) => {
                        setSelectedModule(m);
                        setView("moduleDetail");
                    }}
                />
            </div>
        );
    }

    if (view === "moduleDetail" && selectedModule) {
        return (
            <div style={styles.card}>
                <button style={styles.btnAlt} onClick={() => setView("modules")}>⬅️ Volver</button>
                <ModuleDetail moduleId={selectedModule.id} />
            </div>
        );
    }

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Inducciones</h2>
                <button style={styles.btn} onClick={() => handleOpenModal()}>
                    Nueva Inducción
                </button>
            </div>

            {/* Tabla */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Descripción</th>
                        <th style={styles.th}>Tipo</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {inductions.map((i) => (
                        <tr key={i.id} style={styles.tr}>
                            <td style={styles.td}>{i.name}</td>
                            <td style={styles.td}>{i.description}</td>
                            <td style={styles.td}>{i.type}</td>
                            <td style={styles.td}>{i.status}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => { setSelectedInduction(i); setView("modules"); }}>
                                    📂 Módulos
                                </button>{" "}
                                <button style={styles.btnSmall} onClick={() => handleOpenModal(i)}>
                                    ✏️ Editar
                                </button>{" "}
                                <button style={styles.btnAlt} onClick={() => handleDelete(i.id)}>
                                    🗑️ Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Crear/Editar */}
            {modalOpen && (
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                >
                    <InductionForm induction={editing || {}} onClose={() => setModalOpen(false)} onSaved={handleSaved} />
                </Modal>
            )}
        </div>
    );
}
