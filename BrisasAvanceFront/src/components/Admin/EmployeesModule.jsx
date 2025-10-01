import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function EmployeesModule() {
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        tipoDocumento: "cc",
        documentNumber: "",
        birthdate: "",
        photoProfile: "default.png",
        gender: "male",
        phone: "",
        email: "",
        civilStatus: "single",
        address: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [emps, usrs] = await Promise.all([
                ApiService.getAllEmployees(),
                ApiService.getAllUsers(),
            ]);
            setEmployees(emps.data || emps);
            setUsers(usrs.data || usrs);
        } catch (err) {
            console.error("Error cargando datos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este empleado?")) return;
        await ApiService.deleteEmployee(id);
        setEmployees(employees.filter((e) => e.id !== id));
    };

    const handleOpen = (emp = null) => {
        setEditing(emp);
        setForm(
            emp || {
                userId: "",
                firstName: "",
                lastName: "",
                tipoDocumento: "cc",
                documentNumber: "",
                birthdate: "",
                photoProfile: "default.png",
                gender: "male",
                phone: "",
                email: "",
                civilStatus: "single",
                address: "",
            }
        );
        setErrors({});
        setModalOpen(true);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.userId) {
            newErrors.userId = "Debe seleccionar un usuario.";
        }

        if (!form.firstName || form.firstName.trim().length < 2) {
            newErrors.firstName = "El nombre es obligatorio y debe tener al menos 2 caracteres.";
        }

        if (!form.lastName || form.lastName.trim().length < 2) {
            newErrors.lastName = "El apellido es obligatorio y debe tener al menos 2 caracteres.";
        }

        if (!form.documentNumber || form.documentNumber.trim().length < 5) {
            newErrors.documentNumber = "El número de documento es obligatorio y debe tener al menos 5 caracteres.";
        }

        if (!form.birthdate) {
            newErrors.birthdate = "La fecha de nacimiento es obligatoria.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email || !emailRegex.test(form.email)) {
            newErrors.email = "Debe ingresar un correo electrónico válido.";
        }

        const phoneRegex = /^\+?[0-9\s\-\(\)]{7,15}$/;
        if (!form.phone || !phoneRegex.test(form.phone)) {
            newErrors.phone = "Debe ingresar un número de teléfono válido.";
        }

        if (!form.address || form.address.trim().length < 5) {
            newErrors.address = "La dirección es obligatoria y debe tener al menos 5 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        if (editing) {
            await ApiService.updateEmployee(editing.id, form);
            setEmployees(employees.map((e) => (e.id === editing.id ? { ...e, ...form } : e)));
        } else {
            const newEmp = await ApiService.createEmployee(form);
            setEmployees([...employees, newEmp.data || newEmp]);
        }
        setModalOpen(false);
    };

    const handleExport = () => exportCSV("empleados.csv", employees);

    if (loading) return <p>Cargando empleados...</p>;

    return (
        <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Empleados</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button style={styles.btnSmall} onClick={handleExport}>
                        Exportar
                    </button>
                    <button style={styles.btn} onClick={() => handleOpen()}>
                        Nuevo
                    </button>
                </div>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Documento</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Teléfono</th>
                        <th style={styles.th}>Dirección</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((e) => (
                        <tr key={e.id}>
                            <td style={styles.td}>{e.id}</td>
                            <td style={styles.td}>
                                {e.firstName} {e.lastName}
                            </td>
                            <td style={styles.td}>
                                {e.tipoDocumento?.toUpperCase()} {e.documentNumber}
                            </td>
                            <td style={styles.td}>{e.email}</td>
                            <td style={styles.td}>{e.phone}</td>
                            <td style={styles.td}>{e.address}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => handleOpen(e)}>
                                    Editar
                                </button>{" "}
                                <button style={styles.btnAlt} onClick={() => handleDelete(e.id)}>
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
                    title={editing ? "Editar Empleado" : "Nuevo Empleado"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div>
                            <select
                                value={form.userId}
                                onChange={(e) => setForm({ ...form, userId: parseInt(e.target.value) })}
                                style={{ width: "100%", padding: 6, border: errors.userId ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            >
                                <option value="">-- Selecciona un usuario --</option>
                                {users.map((u) => (
                                    <option key={u.idUser} value={u.idUser}>
                                        {u.username} ({u.email})
                                    </option>
                                ))}
                            </select>
                            {errors.userId && <span style={{ color: "red", fontSize: "12px" }}>{errors.userId}</span>}
                        </div>

                        <div>
                            <input
                                placeholder="Nombre"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.firstName ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.firstName && <span style={{ color: "red", fontSize: "12px" }}>{errors.firstName}</span>}
                        </div>
                        <div>
                            <input
                                placeholder="Apellido"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.lastName ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.lastName && <span style={{ color: "red", fontSize: "12px" }}>{errors.lastName}</span>}
                        </div>
                        <select
                            value={form.tipoDocumento}
                            onChange={(e) => setForm({ ...form, tipoDocumento: e.target.value })}
                            style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                        >
                            <option value="cc">Cédula</option>
                            <option value="ti">Tarjeta Identidad</option>
                            <option value="dni">DNI</option>
                            <option value="pasaporte">Pasaporte</option>
                        </select>
                        <div>
                            <input
                                placeholder="Número Documento"
                                value={form.documentNumber}
                                onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.documentNumber ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.documentNumber && <span style={{ color: "red", fontSize: "12px" }}>{errors.documentNumber}</span>}
                        </div>
                        <div>
                            <input
                                type="date"
                                value={form.birthdate}
                                onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.birthdate ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.birthdate && <span style={{ color: "red", fontSize: "12px" }}>{errors.birthdate}</span>}
                        </div>
                        <input
                            placeholder="Foto perfil"
                            value={form.photoProfile}
                            onChange={(e) => setForm({ ...form, photoProfile: e.target.value })}
                        />
                        <select
                            value={form.gender}
                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                        >
                            <option value="male">Masculino</option>
                            <option value="female">Femenino</option>
                            <option value="other">Otro</option>
                        </select>
                        <div>
                            <input
                                placeholder="Teléfono"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.phone ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.phone && <span style={{ color: "red", fontSize: "12px" }}>{errors.phone}</span>}
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Correo"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.email ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.email && <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>}
                        </div>
                        <select
                            value={form.civilStatus}
                            onChange={(e) => setForm({ ...form, civilStatus: e.target.value })}
                            style={{ width: "100%", padding: 6, border: "1px solid #ddd", borderRadius: 4 }}
                        >
                            <option value="single">Soltero</option>
                            <option value="married">Casado</option>
                            <option value="divorced">Divorciado</option>
                            <option value="widowed">Viudo</option>
                        </select>
                        <div>
                            <input
                                placeholder="Dirección"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                style={{ width: "100%", padding: 6, border: errors.address ? "1px solid red" : "1px solid #ddd", borderRadius: 4 }}
                            />
                            {errors.address && <span style={{ color: "red", fontSize: "12px" }}>{errors.address}</span>}
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
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
