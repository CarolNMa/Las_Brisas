import { useState, useEffect } from 'react';
import api from '../../services/api';
import EmployeeTakeInduction from './EmployeeTakeInduction';

export default function EmployeeInductions({ employeeId }) {
   const [inductions, setInductions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [takingInduction, setTakingInduction] = useState(null);

  useEffect(() => {
    loadInductions();
  }, []);

  const loadInductions = async () => {
    try {
      setLoading(true);
      const data = await api.getMyInductions();
      setInductions(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError('Error al cargar las inducciones');
      console.error('Error loading inductions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return '#d4edda';
      case 'IN_PROGRESS': return '#fff3cd';
      case 'PENDING': return '#e2e3e5';
      default: return '#e2e3e5';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'aprobado': return '#155724';
      case 'en_progreso': return '#856404';
      case 'pendiente': return '#383d41';
      default: return '#383d41';
    }
  };

  const handleTakeInduction = (inductionId) => {
    setTakingInduction(inductionId);
  };

  const handleInductionComplete = (points) => {
    setTakingInduction(null);
    loadInductions(); // Reload to show updated status
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando inducciones...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  }

  if (takingInduction) {
    return (
      <div>
        <button
          onClick={() => setTakingInduction(null)}
          style={{ marginBottom: '20px', padding: '8px 16px' }}
        >
          ← Volver a Inducciones
        </button>
        <EmployeeTakeInduction
          inductionId={takingInduction}
          onComplete={handleInductionComplete}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>Inducciones</h2>
      <div style={styles.inductionsContainer}>
        {inductions.length > 0 ? (
          inductions.map((induction, index) => (
            <div key={index} style={styles.inductionCard}>
              <div style={styles.inductionHeader}>
                <h3>{induction.induction?.title || induction.title}</h3>
                <span style={{
                  ...styles.status,
                  background: getStatusColor(induction.status),
                  color: getStatusTextColor(induction.status)
                }}>
                  {induction.status === 'aprobado' ? 'Completada' :
                   induction.status === 'en_progreso' ? 'En Progreso' :
                   induction.status === 'pendiente' ? 'Pendiente' : induction.status}
                </span>
              </div>

              <div style={styles.inductionDetails}>
                <div style={styles.detailRow}>
                  <div style={styles.detailItem}>
                    <strong>Fecha de Asignación:</strong>
                    <span>{new Date(induction.dateAssignment).toLocaleDateString()}</span>
                  </div>
                  {induction.dateComplete && (
                    <div style={styles.detailItem}>
                      <strong>Fecha de Finalización:</strong>
                      <span>{new Date(induction.dateComplete).toLocaleDateString()}</span>
                    </div>
                  )}
                  {induction.status === 'pendiente' && (
                    <div style={styles.detailItem}>
                      <button
                        onClick={() => handleTakeInduction(induction.inductionId)}
                        style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        Tomar Inducción
                      </button>
                    </div>
                  )}
                </div>

                {induction.induction?.description && (
                  <div style={styles.detailItem}>
                    <strong>Descripción:</strong>
                    <p style={styles.description}>{induction.induction.description}</p>
                  </div>
                )}

                {induction.progress !== undefined && (
                  <div style={styles.detailItem}>
                    <strong>Progreso:</strong>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${induction.progress}%`
                        }}
                      />
                    </div>
                    <span style={styles.progressText}>{induction.progress}% completado</span>
                  </div>
                )}

                {induction.modules && induction.modules.length > 0 && (
                  <div style={styles.detailItem}>
                    <strong>Módulos:</strong>
                    <div style={styles.modules}>
                      {induction.modules.map((module, idx) => (
                        <div key={idx} style={styles.module}>
                          <span>{module.title}</span>
                          <span style={{
                            ...styles.moduleStatus,
                            background: module.completed ? '#d4edda' : '#fff3cd',
                            color: module.completed ? '#155724' : '#856404'
                          }}>
                            {module.completed ? '✓' : '○'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={styles.noInductions}>
            <p>No tienes inducciones asignadas</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  inductionsContainer: {
    padding: '20px',
  },
  inductionCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto 20px auto',
  },
  inductionHeader: {
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
  inductionDetails: {
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
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#e9ecef',
    borderRadius: '4px',
    margin: '5px 0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#28a745',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: '#666',
  },
  modules: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '10px',
  },
  module: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: '#f8f9fa',
    borderRadius: '6px',
  },
  moduleStatus: {
    padding: '2px 6px',
    borderRadius: '50%',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  noInductions: {
    textAlign: 'center',
    padding: '50px',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto',
  },
};