import { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { styles } from "../Dashboard/styles";
import { exportCSV } from "../Comunes/Utils/exportCSV";
import Modal from "../Layout/Modal";

export default function UsersModule() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        status: "ACTIVE",
        rol: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [usrs, rls] = await Promise.all([
                ApiService.getAllUsers(),
                ApiService.getAllRoles(),
            ]);
            setUsers(usrs.data || usrs);
            setRoles(rls.data || rls);
        } catch (err) {
            console.error("❌ Error cargando datos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (idUser) => {
        if (!window.confirm("¿Eliminar este usuario?")) return;
        try {
            await ApiService.deleteUser(idUser);
            setUsers(users.filter((u) => u.idUser !== idUser));
        } catch (err) {
            console.error("❌ Error eliminando usuario:", err);
        }
    };

    const handleOpen = (user = null) => {
        setEditing(user);
        setForm(
            user || {
                username: "",
                email: "",
                password: "",
                status: "ACTIVE",
                rol: "",
            }
        );
        setErrors({});
        setModalOpen(true);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!form.username || form.username.trim().length < 3) {
            newErrors.username = "El nombre de usuario es obligatorio y debe tener al menos 3 caracteres.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email || !emailRegex.test(form.email)) {
            newErrors.email = "Debe ingresar un correo electrónico válido.";
        }

        if (!editing && (!form.password || form.password.length < 6)) {
            newErrors.password = "La contraseña es obligatoria y debe tener al menos 6 caracteres.";
        }

        if (!form.rol) {
            newErrors.rol = "Debe seleccionar un rol.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            if (editing) {
                await ApiService.updateUser(editing.idUser, form);
                setUsers(users.map((u) => (u.idUser === editing.idUser ? { ...u, ...form } : u)));
            } else {
                const newUser = await ApiService.registerUser({ ...form, status: "ACTIVE" });
                setUsers([...users, newUser.data || newUser]);
            }
            setModalOpen(false);
        } catch (err) {
            console.error("❌ Error guardando usuario:", err);
        }
    };

    const handleExport = () => {
        const cleanUsers = users.map(u => ({
            id: u.idUser,
            usuario: u.username,
            email: u.email,
            rol: Array.isArray(u.roles)
                ? u.roles.map(r => r.name).join(", ")
                : u.role?.name || "—",
            estado: u.status,
            creado: u.createdAt,
        }));

        exportCSV("usuarios.csv", cleanUsers);
    };


    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Usuarios</h2>
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
                        <th style={styles.th}>Usuario</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Rol</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, index) => (
                        <tr key={u.idUser || u.email || index}>
                            <td style={styles.td}>{u.idUser}</td>
                            <td style={styles.td}>{u.username}</td>
                            <td style={styles.td}>{u.email}</td>
                            <td style={styles.td}>
                                {Array.isArray(u.roles)
                                    ? u.roles.map((r) => r.name).join(", ")
                                    : u.role?.name || "—"}
                            </td>
                            <td style={styles.td}>{u.status}</td>
                            <td style={styles.td}>
                                <button style={styles.btnSmall} onClick={() => handleOpen(u)}>
                                    Editar
                                </button>{" "}
                                <button style={styles.btnAlt} onClick={() => handleDelete(u.idUser)}>
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
                    title={editing ? "Editar Usuario" : "Nuevo Usuario"}
                    onClose={() => setModalOpen(false)}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {/* Username */}
                        <div>
                            <input
                                placeholder="Usuario"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: 6,
                                    border: errors.username ? "1px solid red" : "1px solid #ddd",
                                    borderRadius: 4,
                                }}
                            />
                            {errors.username && (
                                <span style={{ color: "red", fontSize: "12px" }}>{errors.username}</span>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Correo"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: 6,
                                    border: errors.email ? "1px solid red" : "1px solid #ddd",
                                    borderRadius: 4,
                                }}
                            />
                            {errors.email && (
                                <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>
                            )}
                        </div>

                        {/* Contraseña (solo al crear) */}
                        {!editing && (
                            <div>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: 6,
                                        border: errors.password ? "1px solid red" : "1px solid #ddd",
                                        borderRadius: 4,
                                    }}
                                />
                                {errors.password && (
                                    <span style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>
                                )}
                            </div>
                        )}

                        {/* Roles */}
                        <div>
                            <select
                                value={form.rol}
                                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: 6,
                                    border: errors.rol ? "1px solid red" : "1px solid #ddd",
                                    borderRadius: 4,
                                }}
                            >
                                <option value="">-- Selecciona un rol --</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.name}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                            {errors.rol && (
                                <span style={{ color: "red", fontSize: "12px" }}>{errors.rol}</span>
                            )}
                        </div>

                        {/* Estado */}
                        {editing ? (
                            <div>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: 6,
                                        border: "1px solid #ddd",
                                        borderRadius: 4,
                                    }}
                                >
                                    <option value="ACTIVE">Activo</option>
                                    <option value="INACTIVE">Inactivo</option>
                                </select>
                            </div>
                        ) : (
                            <div>
                                <input type="hidden" value="ACTIVE" />
                                <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
                                    Estado: <strong>Activo</strong>
                                </p>
                            </div>
                        )}

                        {/* Botones */}
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
