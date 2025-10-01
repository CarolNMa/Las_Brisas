import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function EmployeeContract() {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContract();
  }, []);

  const loadContract = async () => {
    try {
      setLoading(true);
      const data = await api.getMyContract();
      setContract(data.data || data);
    } catch (err) {
      setError('Error al cargar el contrato');
      console.error('Error loading contract:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando contrato...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  }

  if (!contract) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>No se encontró información de contrato</div>;
  }

  return (
    <div>
      <h2>Mi Contrato</h2>
      <div style={styles.contractContainer}>
        <div style={styles.contractCard}>
          <div style={styles.contractHeader}>
            <h3>Detalles del Contrato</h3>
            <span
              style={{
                ...styles.status,
                ...(contract.status?.toLowerCase() === 'activo'
                  ? styles.statusActive
                  : styles.statusInactive),
              }}
            >
              {contract.status}
            </span>
          </div>

          <div style={styles.contractDetails}>
            <div style={styles.detailRow}>
              <div style={styles.detailItem}>
                <strong>Tipo de Contrato:</strong>
                <span>{contract.type}</span>
              </div>
              <div style={styles.detailItem}>
                <strong>Empleado ID:</strong>
                <span>{contract.employee}</span>
              </div>
            </div>

            <div style={styles.detailRow}>
              <div style={styles.detailItem}>
                <strong>Fecha de Inicio:</strong>
                <span>{new Date(contract.dateStart).toLocaleDateString()}</span>
              </div>
              <div style={styles.detailItem}>
                <strong>Fecha de Fin:</strong>
                <span>
                  {contract.dateEnd
                    ? new Date(contract.dateEnd).toLocaleDateString()
                    : 'Indefinido'}
                </span>
              </div>
            </div>

            <div style={styles.detailRow}>
              <div style={styles.detailItem}>
                <strong>Última Renovación:</strong>
                <span>{new Date(contract.dateUpdate).toLocaleDateString()}</span>
              </div>
            </div>

            {contract.documentUrl && (
              <div style={styles.detailItem}>
                <strong>Documento:</strong>{' '}
                <a
                  href={contract.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563eb', textDecoration: 'underline' }}
                >
                  Descargar Contrato
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  contractContainer: {
    padding: '20px',
  },
  contractCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto',
  },
  contractHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '20px',
  },
  contractDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  detailRow: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap',
  },
  detailItem: {
    flex: 1,
    minWidth: '200px',
    fontSize: '16px',
    color: '#333',
  },
  status: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#fff',
  },
  statusActive: {
    background: '#22c55e',
  },
  statusInactive: {
    background: '#ef4444',
  },
};
