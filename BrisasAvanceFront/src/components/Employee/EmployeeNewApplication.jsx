import { useState, useEffect } from "react";
import api from "../../services/api";

export default function EmployeeNewApplication({ employeeId, onCreated }) {
    const [form, setForm] = useState({
        applicationTypeId: "",
        description: "",
        startDate: "",
        endDate: "",
        file: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [applicationTypes, setApplicationTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(true);

    useEffect(() => {
        loadTypes();
    }, []);

    const loadTypes = async () => {
        try {
            const data = await api.getAllApplicationTypes();
            setApplicationTypes(data.data || data);
        } catch (err) {
            console.error("Error cargando tipos de solicitud:", err);
            setMessage({ type: "error", text: "Error al cargar tipos de solicitud" });
        } finally {
            setLoadingTypes(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (e.target.type === "file") {
            setForm({ ...form, file: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append("applicationTypeid", form.applicationTypeId);
            formData.append("reason", form.description);
            if (form.startDate) formData.append("dateStart", `${form.startDate}T00:00:00`);
            if (form.endDate) formData.append("dateEnd", `${form.endDate}T00:00:00`);
            if (form.file) formData.append("file", form.file);

            const response = await api.createApplication(formData, true);

            setMessage({ type: "success", text: "Solicitud enviada correctamente ✅" });

            if (onCreated) onCreated();

            setForm({
                applicationTypeId: "",
                description: "",
                startDate: "",
                endDate: "",
                file: null,
            });
        } catch (err) {
            console.error("Error creando solicitud:", err);
            setMessage({ type: "error", text: "Error al enviar la solicitud ❌" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.formContainer}>
            <h2>Nueva Solicitud</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Tipo */}
                <div style={styles.formGroup}>
                    <label>Tipo de Solicitud</label>
                    {loadingTypes ? (
                        <p>Cargando tipos...</p>
                    ) : (
                        <select
                            name="applicationTypeId"
                            value={form.applicationTypeId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Seleccionar --</option>
                            {applicationTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Descripción */}
                <div style={styles.formGroup}>
                    <label>Descripción</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Fechas */}
                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label>Fecha Inicio</label>
                        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                    </div>
                    <div style={styles.formGroup}>
                        <label>Fecha Fin</label>
                        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
                    </div>
                </div>

                {/* Archivo */}
                <div style={styles.formGroup}>
                    <label>Documento Adjunto (si aplica)</label>
                    <input type="file" name="file" onChange={handleChange} />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? "Enviando..." : "Enviar Solicitud"}
                </button>
            </form>

            {message && (
                <div
                    style={{
                        marginTop: "15px",
                        padding: "10px",
                        borderRadius: "6px",
                        color: message.type === "success" ? "#155724" : "#721c24",
                        background: message.type === "success" ? "#d4edda" : "#f8d7da",
                    }}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
}

const styles = {
    formContainer: {
        maxWidth: "600px",
        margin: "20px auto",
        background: "#fff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    formGroup: { display: "flex", flexDirection: "column", gap: "5px" },
    formRow: { display: "flex", gap: "20px" },
    button: {
        padding: "10px 20px",
        background: "#dc3545",
        color: "#fff",
        fontWeight: "bold",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
};
