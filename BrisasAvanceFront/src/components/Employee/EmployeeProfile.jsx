import { useState, useEffect } from "react";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaTransgender,
  FaBirthdayCake,
  FaUser,
  FaIdCard,
  FaEnvelope,
} from "react-icons/fa";
import api from "../../services/api";

const styles = {
  container: {
    marginLeft: "250px",
    padding: "30px 40px",
    background: "#f9fafb",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "25px",
    color: "#b00",
    fontSize: "22px",
    fontWeight: "700",
  },
  card: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    background: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    maxWidth: "950px",
    margin: "0 auto",
    alignItems: "flex-start",
    gap: "30px",
  },
  left: {
    textAlign: "center",
    borderRight: "2px solid #f3f3f3",
    paddingRight: "25px",
    paddingLeft: "10px", 
  },
  right: {
    background: "#fafafa",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#b00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px auto",
  },
  avatarImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
  },
  avatarText: {
    color: "#fff",
    fontSize: "40px",
    fontWeight: "bold",
  },
  name: {
    margin: "10px 0",
    fontSize: "20px",
    fontWeight: "bold",
  },
  email: {
    color: "#555",
    fontSize: "14px",
    marginBottom: "10px",
  },
  detailItem: {
    fontSize: "15px",
    color: "#444",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  icon: {
    color: "#b00",
    minWidth: "20px",
  },
  buttonPrimary: {
    marginTop: "15px",
    background: "#b00",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.2s",
  },
  buttonSecondary: {
    background: "#fff",
    color: "#111",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: "500",
    marginLeft: "8px",
  },
  sectionTitle: {
    marginTop: "20px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },
};

export default function EmployeeProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getMyProfile();
      setProfile(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        photoProfile: data.photoProfile,
        civilStatus: data.civilStatus,
        gender: data.gender,
      });
    } catch (err) {
      setError("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      newErrors.firstName =
        "El nombre es obligatorio y debe tener al menos 2 caracteres.";
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName =
        "El apellido es obligatorio y debe tener al menos 2 caracteres.";
    }
    const phoneRegex = /^\+?[0-9\s\-\(\)]{7,15}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Debe ingresar un número de teléfono válido.";
    }
    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address =
        "La dirección es obligatoria y debe tener al menos 5 caracteres.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const updated = await api.updateMyProfile(formData);
      setProfile(updated);
      setEditMode(false);
    } catch (err) {
      alert("Error al actualizar perfil");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Cargando perfil...
      </div>
    );
  if (error)
    return (
      <div
        style={{ textAlign: "center", padding: "50px", color: "red" }}
      >
        <h3>{error}</h3>
      </div>
    );

  const traducirGenero = (g) =>
    g === "male"
      ? "Masculino"
      : g === "female"
      ? "Femenino"
      : g === "other"
      ? "Otro"
      : "No especificado";

  const traducirEstado = (s) =>
    s === "single"
      ? "Soltero/a"
      : s === "married"
      ? "Casado/a"
      : s === "divorced"
      ? "Divorciado/a"
      : s === "widowed"
      ? "Viudo/a"
      : "No especificado";

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mi Perfil</h2>
      <div style={styles.card}>
        {/* Columna izquierda */}
        <div style={styles.left}>
          {profile?.photoProfile ? (
            <img
              src={profile.photoProfile}
              alt="Foto de perfil"
              style={styles.avatarImage}
            />
          ) : (
            <div style={styles.avatar}>
              <span style={styles.avatarText}>
                {profile?.firstName?.charAt(0)}
                {profile?.lastName?.charAt(0)}
              </span>
            </div>
          )}
          <h3 style={styles.name}>
            {profile?.firstName} {profile?.lastName}
          </h3>
          <p style={styles.email}>
            <FaEnvelope /> {profile?.email}
          </p>
        </div>

        {/* Columna derecha */}
        <div style={styles.right}>
          {editMode ? (
            <>
              <label>Nombre:</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={{
                  border: errors.firstName
                    ? "1px solid red"
                    : "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "6px",
                }}
              />
              {errors.firstName && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.firstName}
                </span>
              )}

              <label>Apellido:</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={{
                  border: errors.lastName
                    ? "1px solid red"
                    : "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "6px",
                }}
              />
              {errors.lastName && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.lastName}
                </span>
              )}

              <label>Teléfono:</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  border: errors.phone
                    ? "1px solid red"
                    : "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "6px",
                }}
              />
              {errors.phone && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.phone}
                </span>
              )}

              <label>Dirección:</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{
                  border: errors.address
                    ? "1px solid red"
                    : "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "6px",
                }}
              />
              {errors.address && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors.address}
                </span>
              )}

              <label>Estado civil:</label>
              <select
                name="civilStatus"
                value={formData.civilStatus}
                onChange={handleChange}
                style={{
                  borderRadius: "6px",
                  padding: "6px",
                }}
              >
                <option value="single">Soltero/a</option>
                <option value="married">Casado/a</option>
                <option value="divorced">Divorciado/a</option>
                <option value="widowed">Viudo/a</option>
              </select>

              <label>Género:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{
                  borderRadius: "6px",
                  padding: "6px",
                }}
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>

              <div>
                <button style={styles.buttonPrimary} onClick={handleSave}>
                  Guardar
                </button>
                <button
                  style={styles.buttonSecondary}
                  onClick={() => setEditMode(false)}
                >
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={styles.detailItem}>
                <FaIdCard style={styles.icon} />
                <strong>Documento:</strong>{" "}
                {profile?.tipoDocumento} {profile?.documentNumber}
              </div>
              <div style={styles.detailItem}>
                <FaBirthdayCake style={styles.icon} />
                <strong>Fecha de Nacimiento:</strong> {profile?.birthdate}
              </div>
              <div style={styles.detailItem}>
                <FaTransgender style={styles.icon} />
                <strong>Género:</strong> {traducirGenero(profile?.gender)}
              </div>
              <div style={styles.detailItem}>
                <FaPhone style={styles.icon} />
                <strong>Teléfono:</strong> {profile?.phone}
              </div>
              <div style={styles.detailItem}>
                <FaUser style={styles.icon} />
                <strong>Estado Civil:</strong>{" "}
                {traducirEstado(profile?.civilStatus)}
              </div>
              <div style={styles.detailItem}>
                <FaMapMarkerAlt style={styles.icon} />
                <strong>Dirección:</strong> {profile?.address}
              </div>

              <button
                style={styles.buttonPrimary}
                onClick={() => {
                  setEditMode(true);
                  setErrors({});
                }}
              >
                Editar información personal
              </button>
            </>
          )}

          <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

          <h3 style={styles.sectionTitle}>Información Laboral</h3>
          <p>
            <strong>Cargos:</strong> {profile?.cargos?.join(", ")}
          </p>
          <p>
            <strong>Áreas:</strong> {profile?.areas?.join(", ")}
          </p>
          <p>
            <strong>Ubicaciones:</strong> {profile?.locations?.join(", ")}
          </p>
          <p>
            <strong>Horarios:</strong> {profile?.horarios?.join(" | ")}
          </p>
          <p>
            <strong>Contratos:</strong> {profile?.contratos?.join(" | ")}
          </p>
          <p>
            <strong>Certificados:</strong> {profile?.certificados?.join(" | ")}
          </p>
        </div>
      </div>
    </div>
  );
}
