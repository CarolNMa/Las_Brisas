import { useState, useEffect } from "react";
import api from "../../services/api";

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
      const blob = await api.getMyResumeFile();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError("Error al cargar la hoja de vida");
      console.error("Error loading resume:", err);
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

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Cargando hoja de vida...
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        {error}
      </div>
    );

  if (!pdfUrl)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        No se encontró hoja de vida
      </div>
    );

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Mi Hoja de Vida</h2>

      <div style={styles.resumeContainer}>
        <div style={styles.resumeCard}>
          {/* PDF en pantalla */}
          <iframe
            src={pdfUrl}
            title="Hoja de Vida"
            style={{
              width: "100%",
              height: "80vh",
              border: "none",
              borderRadius: "8px",
            }}
          />

          {/* Botón de descarga */}
          <div style={{ textAlign: "center", marginTop: "25px" }}>
            <button onClick={handleDownload} style={styles.downloadButton}>
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
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
    marginBottom: "25px",
  },

  resumeContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  resumeCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "950px",
    width: "100%",
  },

  downloadButton: {
    backgroundColor: "#b00",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background 0.3s ease",
  },
};
