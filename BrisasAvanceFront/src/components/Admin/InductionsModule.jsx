import { useState, useEffect } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import Modal from "../Layout/Modal";

import InductionModules from "./InductionModules";

export default function InductionsModule() {
    const [inductions, setInductions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("general");
    const [selectedInduction, setSelectedInduction] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", date: "", status: "pendiente" });

    useEffect(() => {
        loadInductions();
    }, []);

    const loadInductions = async () => {
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

    const handleOpenModal = (induction = null) => {
        setForm(induction || { name: "", description: "", date: "", status: "pendiente" });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (form.id) {
                await ApiService.updateInduction(form.id, form);
            } else {
                await ApiService.createInduction(form);
            }
            loadInductions();
            setModalOpen(false);
        } catch (err) {
            console.error("❌ Error guardando inducción:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta inducción?")) return;
        try {
            await ApiService.deleteInduction(id);
            loadInductions();
        } catch (err) {
            console.error("❌ Error eliminando inducción:", err);
        }
    };

    if (loading) return <p>Cargando inducciones...</p>;

    return (
        <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Gestión de Inducciones</h2>
                <button style={styles.btn} onClick={() => handleOpenModal()}>Nueva Inducción</button>
            </div>

            {/* Tabla de inducciones */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Descripción</th>
                        <th style={styles.th}>Fecha</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {inductions.map((i) => (
                        <tr key={i.id} style={styles.tr}>
                            <td style={styles.td}>{i.name}</td>
                            <td style={styles.td}>{i.description}</td>
                            <td style={styles.td}>{i.date}</td>
                            <td style={styles.td}>{i.status}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => setSelectedInduction(i)}>
                                    Ver Detalle
                                </button>
                                <button style={styles.btnSmall} onClick={() => handleOpenModal(i)}>
                                    Editar
                                </button>
                                <button style={styles.btnAlt} onClick={() => handleDelete(i.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Crear/Editar */}
            {modalOpen && (
                <Modal open={modalOpen} title={form.id ? "Editar Inducción" : "Nueva Inducción"} onClose={() => setModalOpen(false)}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>Nombre:
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </label>
                        <label>Descripción:
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        </label>
                        <label>Fecha:
                            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                        </label>
                        <label>Estado:
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="pendiente">Pendiente</option>
                                <option value="en curso">En curso</option>
                                <option value="finalizado">Finalizado</option>
                            </select>
                        </label>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <button style={styles.btnAlt} onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button style={styles.btn} onClick={handleSave}>Guardar</button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Tabs de detalle */}
            {selectedInduction && (
                <div style={{ marginTop: 20 }}>
                    <h3>Detalle de: {selectedInduction.name}</h3>
                    <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
                        <button style={activeTab === "general" ? styles.btn : styles.btnSmall} onClick={() => setActiveTab("general")}>
                            General
                        </button>
                        <button style={activeTab === "modules" ? styles.btn : styles.btnSmall} onClick={() => setActiveTab("modules")}>
                            Módulos
                        </button>
                    </div>

                    {/* General */}
                    {activeTab === "general" && (
                        <div>
                            <p><strong>Descripción:</strong> {selectedInduction.description}</p>
                            <p><strong>Fecha:</strong> {selectedInduction.date}</p>
                            <p><strong>Estado:</strong> {selectedInduction.status}</p>
                        </div>
                    )}

                    {/* Módulos */}
                    {activeTab === "modules" && (
                        <InductionModules inductionId={selectedInduction.id} />
                    )}
                </div>
            )}
        </div>
    );
}
