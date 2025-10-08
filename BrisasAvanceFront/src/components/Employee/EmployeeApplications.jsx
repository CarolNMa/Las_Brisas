import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';
import EmployeeNewApplication from './EmployeeNewApplication';

export default function EmployeeApplications({ employeeId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getMyApplications(employeeId);
      setApplications(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError('Error al cargar las solicitudes');
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreated = () => {
    setShowModal(false);
    loadApplications();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprobado': return '#d4edda';
      case 'Rechazado': return '#f8d7da';
      case 'Pendiente': return '#fff3cd';
      default: return '#e2e3e5';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Aprobado': return '#155724';
      case 'Rechazado': return '#721c24';
      case 'Pendiente': return '#856404';
      default: return '#383d41';
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando solicitudes...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Mis Solicitudes</h2>

      <div style={styles.header}>
        <button style={styles.button} onClick={() => setShowModal(true)}>
          Nueva Solicitud
        </button>
      </div>

      <div style={styles.applicationsContainer}>
        {applications.length > 0 ? (
          applications.map((application, index) => (
            <div key={index} style={styles.applicationCard}>
              <div style={styles.applicationHeader}>
                <h3>
                  {application.applicationTypeName ||
                    application.applicationType ||
                    application.type ||
                    'Solicitud'}
                </h3>
                <span
                  style={{
                    ...styles.status,
                    background: getStatusColor(application.status),
                    color: getStatusTextColor(application.status),
                  }}
                >
                  {application.status === 'Aprobado'
                    ? 'Aprobada'
                    : application.status === 'Rechazado'
                      ? 'Rechazada'
                      : application.status === 'Pendiente'
                        ? 'Pendiente'
                        : application.status}
                </span>
              </div>

              <div style={styles.applicationDetails}>
                <div style={styles.detailRow}>
                  <div style={styles.detailItem}>
                    <strong>Fecha de Solicitud:</strong>
                    <span>
                      {new Date(
                        application.dateCreate ||
                        application.createdAt ||
                        application.date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Tipo:</strong>
                    <span>
                      {application.applicationTypeName ||
                        application.applicationType ||
                        application.type}
                    </span>
                  </div>
                </div>

                {application.dateStart && application.dateEnd && (
                  <div style={styles.detailRow}>
                    <div style={styles.detailItem}>
                      <strong>Desde:</strong>
                      <span>{new Date(application.dateStart).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <strong>Hasta:</strong>
                      <span>{new Date(application.dateEnd).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {application.reason && (
                  <div style={styles.detailItem}>
                    <strong>Descripción:</strong>
                    <p style={styles.description}>{application.reason}</p>
                  </div>
                )}

                {application.comments && (
                  <div style={styles.detailItem}>
                    <strong>Comentarios:</strong>
                    <p style={styles.description}>{application.comments}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noApplications}>
            <p>No tienes solicitudes registradas</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <button style={styles.closeButton} onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>
            <EmployeeNewApplication employeeId={employeeId} onCreated={handleCreated} />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    marginLeft: "250px",
    padding: "30px 40px",
    background: "#f9fafb",
    minHeight: "100vh",
  },

  title: {
    color: "#b00",
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },

  button: {
    padding: "10px 20px",
    background: "#b00",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  },

  applicationsContainer: {
    padding: "10px",
  },

  applicationCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "850px",
    margin: "0 auto 20px auto",
  },

  applicationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "10px",
  },

  status: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  applicationDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  detailRow: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
  },

  detailItem: {
    flex: 1,
    minWidth: "200px",
  },

  description: {
    margin: "5px 0 0 0",
    color: "#555",
    lineHeight: "1.5",
  },

  noApplications: {
    textAlign: "center",
    padding: "50px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "850px",
    margin: "0 auto",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modalContent: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  closeButton: {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
};
