import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function EmployeeApplications({ employeeId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await api.getMyApplications();
      setApplications(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError('Error al cargar las solicitudes');
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#d4edda';
      case 'REJECTED': return '#f8d7da';
      case 'PENDING': return '#fff3cd';
      default: return '#e2e3e5';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#155724';
      case 'REJECTED': return '#721c24';
      case 'PENDING': return '#856404';
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
    <div>
      <h2>Mis Solicitudes</h2>
      <div style={styles.applicationsContainer}>
        {applications.length > 0 ? (
          applications.map((application, index) => (
            <div key={index} style={styles.applicationCard}>
              <div style={styles.applicationHeader}>
                <h3>{application.type || 'Solicitud'}</h3>
                <span style={{
                  ...styles.status,
                  background: getStatusColor(application.status),
                  color: getStatusTextColor(application.status)
                }}>
                  {application.status === 'APPROVED' ? 'Aprobada' :
                   application.status === 'REJECTED' ? 'Rechazada' :
                   application.status === 'PENDING' ? 'Pendiente' : application.status}
                </span>
              </div>

              <div style={styles.applicationDetails}>
                <div style={styles.detailRow}>
                  <div style={styles.detailItem}>
                    <strong>Fecha de Solicitud:</strong>
                    <span>{new Date(application.createdAt || application.date).toLocaleDateString()}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Tipo:</strong>
                    <span>{application.applicationType || application.type}</span>
                  </div>
                </div>

                {application.startDate && application.endDate && (
                  <div style={styles.detailRow}>
                    <div style={styles.detailItem}>
                      <strong>Desde:</strong>
                      <span>{new Date(application.startDate).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <strong>Hasta:</strong>
                      <span>{new Date(application.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {application.description && (
                  <div style={styles.detailItem}>
                    <strong>Descripción:</strong>
                    <p style={styles.description}>{application.description}</p>
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
    </div>
  );
}

const styles = {
  applicationsContainer: {
    padding: '20px',
  },
  applicationCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto 20px auto',
  },
  applicationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '15px',
  },
  status: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  applicationDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  detailRow: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap',
  },
  detailItem: {
    flex: 1,
    minWidth: '200px',
  },
  description: {
    margin: '5px 0 0 0',
    color: '#555',
    lineHeight: '1.5',
  },
  noApplications: {
    textAlign: 'center',
    padding: '50px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto',
  },
};