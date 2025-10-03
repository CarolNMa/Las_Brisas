import { useEffect, useMemo, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

const initialForm = {
    time_start: "08:00",
    time_end: "12:00",
    shift: "MANANA",
    overtime: "00:00",
    dayWeek: "LUNES",
};

export default function SchedulesModule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // filtros
    const [qDay, setQDay] = useState("");
    const [qShift, setQShift] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getAllSchedules();
            setSchedules(data.data || data);
        } catch (err) {
            console.error("Error cargando horarios:", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = useMemo(() => {
        return (schedules || []).filter(
            (it) =>
                (qDay ? it.dayWeek === qDay : true) &&
                (qShift ? it.shift === qShift : true)
        );
    }, [schedules, qDay, qShift]);

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este horario?")) return;
        try {
            await ApiService.deleteSchedule(id);
            setSchedules(schedules.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Error eliminando horario:", err);
        }
    };

    const handleExport = () => {
        exportCSV("schedules.csv", schedules);
    };

    const handleOpenModal = (schedule = null) => {
        setEditingSchedule(schedule);
        setForm(
            schedule || {
                time_start: "08:00",
                time_end: "12:00",
                shift: "MANANA",
                overtime: "00:00",
                dayWeek: "LUNES",
            }
        );
        setErrors({});
        setModalOpen(true);
    };

    const validateForm = () => {
        const newErrors = {};
        if (form.time_start >= form.time_end) {
            newErrors.time_start = "La hora de inicio debe ser menor que la hora fin.";
        }
        if (!form.dayWeek) {
            newErrors.dayWeek = "El día de la semana es obligatorio.";
        }
        if (!form.shift) {
            newErrors.shift = "El turno es obligatorio.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            if (editingSchedule) {
                await ApiService.updateSchedule(editingSchedule.id, form);
                setSchedules(
                    schedules.map((s) =>
                        s.id === editingSchedule.id ? { ...s, ...form } : s
                    )
                );
            } else {
                const newSchedule = await ApiService.createSchedule(form);
                setSchedules([...schedules, newSchedule.data || newSchedule]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("Error guardando horario:", err);
        }
    };

    if (loading) return <p>Cargando horarios...</p>;

    return (
        <div style={styles.card}>
            {/* Encabezado */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h2>Horarios</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={styles.btnSmall} onClick={handleExport}>
                        Exportar
                    </button>
                    <button style={styles.btn} onClick={() => handleOpenModal()}>
                        Nuevo
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
                <select
                    style={styles.input}
                    value={qDay}
                    onChange={(e) => setQDay(e.target.value)}
                >
                    <option value="">Todos los días</option>
                    {[
                        "LUNES",
                        "MARTES",
                        "MIERCOLES",
                        "JUEVES",
                        "VIERNES",
                        "SABADO",
                        "DOMINGO",
                    ].map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>

                <select
                    style={styles.input}
                    value={qShift}
                    onChange={(e) => setQShift(e.target.value)}
                >
                    <option value="">Todos los turnos</option>
                    {["MANANA", "TARDE", "NOCHE"].map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabla */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Día</th>
                        <th style={styles.th}>Inicio</th>
                        <th style={styles.th}>Fin</th>
                        <th style={styles.th}>Turno</th>
                        <th style={styles.th}>Extra</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((s) => (
                        <tr key={s.id} style={styles.tr}>
                            <td style={styles.td}>{s.dayWeek}</td>
                            <td style={styles.td}>{s.time_start}</td>
                            <td style={styles.td}>{s.time_end}</td>
                            <td style={styles.td}>{s.shift}</td>
                            <td style={styles.td}>{s.overtime}</td>
                            <td style={styles.td}>
                                <button
                                    style={styles.btnSmall}
                                    onClick={() => handleOpenModal(s)}
                                >
                                    Editar
                                </button>{" "}
                                <button
                                    style={styles.btnAlt}
                                    onClick={() => handleDelete(s.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {modalOpen && (
                <Modal
                    open={modalOpen}
                    title={editingSchedule ? "Editar Horario" : "Nuevo Horario"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <label>
                            Día:
                            <select
                                style={{
                                    ...styles.input,
                                    border: errors.dayWeek ? "1px solid red" : "1px solid #ddd",
                                }}
                                value={form.dayWeek}
                                onChange={(e) =>
                                    setForm({ ...form, dayWeek: e.target.value })
                                }
                            >
                                {[
                                    "LUNES",
                                    "MARTES",
                                    "MIERCOLES",
                                    "JUEVES",
                                    "VIERNES",
                                    "SABADO",
                                    "DOMINGO",
                                ].map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                            {errors.dayWeek && (
                                <span style={{ color: "red", fontSize: "12px" }}>
                                    {errors.dayWeek}
                                </span>
                            )}
                        </label>

                        <label>
                            Hora inicio:
                            <input
                                type="time"
                                style={{
                                    ...styles.input,
                                    border: errors.time_start
                                        ? "1px solid red"
                                        : "1px solid #ddd",
                                }}
                                value={form.time_start}
                                onChange={(e) =>
                                    setForm({ ...form, time_start: e.target.value })
                                }
                            />
                            {errors.time_start && (
                                <span style={{ color: "red", fontSize: "12px" }}>
                                    {errors.time_start}
                                </span>
                            )}
                        </label>

                        <label>
                            Hora fin:
                            <input
                                type="time"
                                style={styles.input}
                                value={form.time_end}
                                onChange={(e) =>
                                    setForm({ ...form, time_end: e.target.value })
                                }
                            />
                        </label>

                        <label>
                            Turno:
                            <select
                                style={{
                                    ...styles.input,
                                    border: errors.shift ? "1px solid red" : "1px solid #ddd",
                                }}
                                value={form.shift}
                                onChange={(e) => setForm({ ...form, shift: e.target.value })}
                            >
                                {["MANANA", "TARDE", "NOCHE"].map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            {errors.shift && (
                                <span style={{ color: "red", fontSize: "12px" }}>
                                    {errors.shift}
                                </span>
                            )}
                        </label>

                        <label>
                            Horas extra:
                            <input
                                type="time"
                                style={styles.input}
                                value={form.overtime}
                                onChange={(e) =>
                                    setForm({ ...form, overtime: e.target.value })
                                }
                            />
                        </label>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 8,
                                marginTop: 12,
                            }}
                        >
                            <button
                                style={styles.btnAlt}
                                onClick={() => setModalOpen(false)}
                            >
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
