import { useState, useEffect } from "react";
import {
  FaPhone, FaMapMarkerAlt, FaTransgender, FaBirthdayCake, FaUser,
  FaIdCard, FaCalendarAlt, FaEnvelope
} from "react-icons/fa";
import api from "../../services/api";

const styles = {
  title: {
    marginBottom: "20px",
  },
  card: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    background: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    maxWidth: "900px",
    margin: "0 auto",
    alignItems: "center",
  },
  left: {
    textAlign: "center",
    borderRight: "1px solid #eee",
    paddingRight: "20px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#2563eb",
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
  right: {
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  detailItem: {
    fontSize: "15px",
    color: "#444",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  icon: {
    color: "#2563eb",
    minWidth: "20px",
  },
};

export default function EmployeeProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

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

  const handleSave = async () => {
    try {
      const updated = await api.updateMyProfile(formData);
      setProfile(updated);
      setEditMode(false);
    } catch (err) {
      alert("Error al actualizar perfil");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Cargando perfil...</div>;
  if (error) return <div style={{ textAlign: "center", padding: "50px", color: "red" }}><h3>{error}</h3></div>;

  return (
    <div>
      <h2 style={styles.title}>Mi Perfil</h2>
      <div style={styles.card}>
        <div style={styles.left}>
          {profile?.photoProfile ? (
            <img src={profile.photoProfile} alt="Foto de perfil" style={styles.avatarImage} />
          ) : (
            <div style={styles.avatar}>
              <span style={styles.avatarText}>
                {profile?.firstName?.charAt(0)}
                {profile?.lastName?.charAt(0)}
              </span>
            </div>
          )}
          <h3 style={styles.name}>{profile?.firstName} {profile?.lastName}</h3>
          <p style={styles.email}><FaEnvelope /> {profile?.email}</p>
        </div>

        <div style={styles.right}>
          {editMode ? (
            <>
              <label>Nombre:</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} />

              <label>Apellido:</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} />

              <label>Teléfono:</label>
              <input name="phone" value={formData.phone} onChange={handleChange} />

              <label>Dirección:</label>
              <input name="address" value={formData.address} onChange={handleChange} />

              <label>Estado civil:</label>
              <select name="civilStatus" value={formData.civilStatus} onChange={handleChange}>
                <option value="single">Soltero/a</option>
                <option value="married">Casado/a</option>
                <option value="divorced">Divorciado/a</option>
                <option value="widowed">Viudo/a</option>
              </select>

              <label>Género:</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>

              <button onClick={handleSave}>Guardar</button>
              <button onClick={() => setEditMode(false)}>Cancelar</button>
            </>
          ) : (
            <>
              <div style={styles.detailItem}><FaIdCard style={styles.icon} /><strong>Documento:</strong> {profile?.tipoDocumento} {profile?.documentNumber}</div>
              <div style={styles.detailItem}><FaBirthdayCake style={styles.icon} /><strong>Fecha de Nacimiento:</strong> {profile?.birthdate}</div>
              <div style={styles.detailItem}><FaTransgender style={styles.icon} /><strong>Género:</strong> {profile?.gender}</div>
              <div style={styles.detailItem}><FaPhone style={styles.icon} /><strong>Teléfono:</strong> {profile?.phone}</div>
              <div style={styles.detailItem}><FaUser style={styles.icon} /><strong>Estado Civil:</strong> {profile?.civilStatus}</div>
              <div style={styles.detailItem}><FaMapMarkerAlt style={styles.icon} /><strong>Dirección:</strong> {profile?.address}</div>
              <button onClick={() => setEditMode(true)}>Editar información personal</button>
            </>
          )}

          <hr />
          <h3>Información Laboral</h3>
          <p><strong>Cargos:</strong> {profile?.cargos?.join(", ")}</p>
          <p><strong>Áreas:</strong> {profile?.areas?.join(", ")}</p>
          <p><strong>Ubicaciones:</strong> {profile?.locations?.join(", ")}</p>
          <p><strong>Horarios:</strong> {profile?.horarios?.join(" | ")}</p>
          <p><strong>Contratos:</strong> {profile?.contratos?.join(" | ")}</p>
          <p><strong>Certificados:</strong> {profile?.certificados?.join(" | ")}</p>
        </div>
      </div>
    </div>
  );
}
