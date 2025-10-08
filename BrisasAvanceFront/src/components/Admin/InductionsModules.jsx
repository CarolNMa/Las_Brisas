import { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Plus, Folder, Edit, Trash2 } from "lucide-react";
import { styles } from "../Dashboard/styles";
import ApiService from "../../services/api";
import Modal from "../Layout/Modal";
import InductionForm from "../Inductions/InductionForm";
import ModuleList from "../Inductions/ModuleList";
import ModuleDetail from "../Inductions/ModuleDetails";

export default function FormacionesModule() {
    const [formaciones, setFormaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("list");
    const [selectedFormacion, setSelectedFormacion] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [filterType, setFilterType] = useState("todos");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllInductions();
            setFormaciones(data.data || data);
        } catch (err) {
            console.error("Error cargando formaciones:", err);
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta formación?")) return;
        try {
            await ApiService.deleteInduction(id);
            setFormaciones(formaciones.filter((f) => f.id !== id));
        } catch (err) {
            console.error("Error eliminando formación:", err);
        }
    };


    const handleOpenModal = (formacion = null) => {
        setEditing(formacion);
        setModalOpen(true);
    };

    const handleSaved = () => {
        setModalOpen(false);
        loadData();
    };


    if (loading) return <p>Cargando formaciones...</p>;

    if (view === "modules" && selectedFormacion) {
        return (
            <div style={styles.card}>
                <button style={styles.btnAlt} onClick={() => setView("list")}><ArrowLeft size={16} style={{ marginRight: 4 }} /> Volver</button>
                <ModuleList
                    induction={selectedFormacion}
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
                <button style={styles.btnAlt} onClick={() => setView("modules")}><ArrowLeft size={16} style={{ marginRight: 4 }} /> Volver</button>
                <ModuleDetail moduleId={selectedModule.id} showQuestions={selectedFormacion?.type === "induction"} />
            </div>
        );
    }


    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2><BookOpen size={20} style={{ marginRight: 8 }} /> Formaciones (Inducciones y Capacitaciones)</h2>
                <div style={{ display: "flex", gap: 10 }}>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ padding: 6, borderRadius: 4 }}
                    >
                        <option value="todos">Todos</option>
                        <option value="induction">Inducciones</option>
                        <option value="capacitacion">Capacitaciones</option>
                    </select>
                    <button style={styles.btn} onClick={() => handleOpenModal()}>
                        <Plus size={16} style={{ marginRight: 4 }} /> Nueva
                    </button>
                </div>
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
                    {formaciones
                        .filter((f) => filterType === "todos" || f.type === filterType)
                        .map((f) => (
                            <tr key={f.id} style={styles.tr}>
                                <td style={styles.td}>{f.name}</td>
                                <td style={styles.td}>{f.description}</td>
                                <td style={styles.td}>
                                    {f.type === "induction" ? "Inducción" : "Capacitación"}
                                </td>
                                <td style={styles.td}>{f.status}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.btnSmall}
                                        onClick={() => {
                                            setSelectedFormacion(f);
                                            setView("modules");
                                        }}
                                    >
                                        <Folder size={16} style={{ marginRight: 4 }} /> Módulos
                                    </button>{" "}
                                    <button
                                        style={styles.btnSmall}
                                        onClick={() => handleOpenModal(f)}
                                    >
                                       Editar
                                    </button>{" "}
                                    <button
                                        style={styles.btnAlt}
                                        onClick={() => handleDelete(f.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* Modal Crear/Editar */}
            {modalOpen && (
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <InductionForm
                        induction={editing || {}}
                        onClose={() => setModalOpen(false)}
                        onSaved={handleSaved}
                    />
                </Modal>
            )}
        </div>
    );
}
