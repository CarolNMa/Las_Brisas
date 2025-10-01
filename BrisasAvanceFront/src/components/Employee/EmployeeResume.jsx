import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function EmployeeResume() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResumePdf();
  }, []);

  const loadResumePdf = async () => {
    try {
      setLoading(true);
      const blob = await api.getMyResumeFile(); // trae el PDF como blob
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError('Error al cargar la hoja de vida');
      console.error('Error loading resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await api.downloadMyResume();
    } catch (err) {
      console.error("Error descargando hoja de vida:", err);
      alert("No se pudo descargar la hoja de vida");
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando hoja de vida...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  }

  if (!pdfUrl) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>No se encontró hoja de vida</div>;
  }

  return (
    <div style={styles.resumeContainer}>
      <div style={styles.resumeCard}>
        {/* 👇 PDF en pantalla */}
        <iframe
          src={pdfUrl}
          title="Hoja de Vida"
          style={{ width: "100%", height: "80vh", border: "none", borderRadius: "8px" }}
        />
        
        {/* 👇 Botón de descarga */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={handleDownload} style={styles.downloadButton}>
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  resumeContainer: { padding: '20px' },
  resumeCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    margin: '0 auto',
  },
  downloadButton: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};
