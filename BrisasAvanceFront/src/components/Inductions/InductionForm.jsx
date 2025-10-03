import { useState } from "react";
import ApiService from "../../services/api";

export default function InductionForm({ induction, onClose }) {
    const [form, setForm] = useState(induction);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            await ApiService.saveInduction(form);
            onClose();
        } catch (err) {
            console.error("❌ Error guardando inducción:", err);
        }
    };

    return (
        <div>
            <h3>{form.id ? "Editar Inducción" : "Nueva Inducción"}</h3>
            <input name="name" value={form.name || ""} onChange={handleChange} placeholder="Nombre" />
            <textarea name="description" value={form.description || ""} onChange={handleChange} placeholder="Descripción" />
            <select name="type" value={form.type || "INDUCTION"} onChange={handleChange}>
                <option value="INDUCTION">Inducción</option>
                <option value="CAPACITACION">Capacitación</option>
            </select>
            <select name="status" value={form.status || "PENDIENTE"} onChange={handleChange}>
                <option value="PENDIENTE">Pendiente</option>
                <option value="APROBADO">Aprobado</option>
                <option value="RECHAZADO">Rechazado</option>
            </select>
            <button onClick={handleSave}>💾 Guardar</button>
            <button onClick={onClose}>❌ Cancelar</button>
        </div>
    );
}
