import { useState, useEffect } from "react";
import ApiService from "../../services/api";

export default function AssignInductionModule() {
    const [assignments, setAssignments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [inductions, setInductions] = useState([]);
    const [form, setForm] = useState({ employeeId: "", inductionId: "", deadline: "" });

    const loadData = async () => {
        try {
            const [emps, inds, assigns] = await Promise.all([
                ApiService.getAllEmployees(),
                ApiService.getAllInductions(),
                ApiService.getAllAssignments(),
            ]);
            setEmployees(emps.data || emps);
            setInductions(inds.data || inds);
            setAssignments(assigns.data || assigns);
        } catch (err) {
            console.error("❌ Error cargando datos:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAssign = async () => {
        try {
            await ApiService.assignInduction(form);
            loadData();
            setForm({ employeeId: "", inductionId: "", deadline: "" });
        } catch (err) {
            console.error("❌ Error asignando inducción:", err);
        }
    };

    return (
        <div>
            <h2>📝 Asignar Inducciones</h2>
            <div>
                <select name="employeeId" value={form.employeeId} onChange={handleChange}>
                    <option value="">-- Seleccione Empleado --</option>
                    {employees.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.firstName} {e.lastName}
                        </option>
                    ))}
                </select>

                <select name="inductionId" value={form.inductionId} onChange={handleChange}>
                    <option value="">-- Seleccione Inducción --</option>
                    {inductions.map((i) => (
                        <option key={i.id} value={i.id}>
                            {i.name}
                        </option>
                    ))}
                </select>

                <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
                <button onClick={handleAssign}>➕ Asignar</button>
            </div>

            <h3>📋 Lista de Asignaciones</h3>
            <table>
                <thead>
                    <tr>
                        <th>Empleado</th>
                        <th>Inducción</th>
                        <th>Estado</th>
                        <th>Puntos</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((a) => (
                        <tr key={a.id}>
                            <td>{a.employeeName}</td>
                            <td>{a.inductionName}</td>
                            <td>{a.status}</td>
                            <td>{a.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
