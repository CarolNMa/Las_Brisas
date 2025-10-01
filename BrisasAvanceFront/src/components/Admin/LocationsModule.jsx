import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function LocationsModule() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [form, setForm] = useState({ name: "", address: "" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllLocations();
            setLocations(data.data || data);
        } catch (err) {
            console.error("Error cargando ubicaciones:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta ubicación?")) return;
        try {
            await ApiService.deleteLocation(id);
            setLocations(locations.filter((l) => l.id !== id));
        } catch (err) {
            console.error("Error eliminando ubicación:", err);
        }
    };

    const handleExport = () => {
        exportCSV("ubicaciones.csv", locations);
    };

    const handleOpenModal = (location = null) => {
        setEditingLocation(location);
        setForm(location || { name: "", address: "" });
        setModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingLocation) {
                await ApiService.updateLocation(editingLocation.id, form);
                setLocations(locations.map((l) => (l.id === editingLocation.id ? { ...l, ...form } : l)));
            } else {
                const newLocation = await ApiService.createLocation(form);
                setLocations([...locations, newLocation.data || newLocation]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error guardando ubicación:", err);
        }
    };

    if (loading) return <p>Cargando ubicaciones...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Ubicaciones</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={styles.btnSmall} onClick={handleExport}>
                        Exportar
                    </button>
                    <button style={styles.btn} onClick={() => handleOpenModal()}>
                        Nuevo
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Dirección</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((l) => (
                        <tr key={l.id} style={styles.tr}>
                            <td style={styles.td}>{l.name}</td>
                            <td style={styles.td}>{l.address}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => handleOpenModal(l)}>
                                    Editar
                                </button>{" "}
                                <button style={styles.btnAlt} onClick={() => handleDelete(l.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <Modal
                    open={modalOpen}
                    title={editingLocation ? "Editar Ubicación" : "Nueva Ubicación"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </label>
                        <label>
                            Dirección:
                            <input
                                type="text"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </label>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                            <button style={styles.btnAlt} onClick={() => setModalOpen(false)}>
                                Cancelar
                            </button>
                            <button style={styles.btn} onClick={handleSave}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
