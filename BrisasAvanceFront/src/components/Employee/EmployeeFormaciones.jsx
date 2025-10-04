import { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import EmployeeTakeInduction from './EmployeeTakeInduction';
import EmployeeTakeTraining from './EmployeeTakeTraining';

export default function EmployeeFormaciones() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [takingAssignment, setTakingAssignment] = useState(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getMyAssignments();
      setAssignments(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError("Error al cargar tus formaciones");
      console.error("❌ Error cargando asignaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAssignment = (assignment) => {
    setTakingAssignment(assignment);
  };

  const handleComplete = () => {
    setTakingAssignment(null);
    loadAssignments(); // recargar estado actualizado
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "aprobado":
        return "✅ Completada";
      case "pendiente":
        return "⌛ Pendiente";
      default:
        return status;
    }
  };

  if (loading)
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando formaciones...</div>;
  if (error)
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;

  // Si está dentro de una inducción
  if (takingAssignment) {
    if (takingAssignment.inductionType === "capacitacion") {
      // 🚀 Mostrar vista simplificada de capacitación
      return (
        <EmployeeTakeTraining
          assignment={takingAssignment}
          onComplete={handleComplete}
        />
      );
    }

    // 🚀 Vista normal de inducción
    return (
      <div>
        <button
          onClick={() => setTakingAssignment(null)}
          style={{ marginBottom: "20px", padding: "8px 16px" }}
        >
          ← Volver
        </button>
        <EmployeeTakeInduction
          assignmentId={takingAssignment.id}
          inductionId={takingAssignment.inductionId}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>Mis Formaciones (Inducciones y Capacitaciones)</h2>
      <div style={styles.container}>
        {assignments.length > 0 ? (
          assignments.map((a) => (
            <div key={a.id} style={styles.card}>
              <div style={styles.header}>
                <h3>{a.inductionName}</h3>
                <span
                  style={{
                    ...styles.status,
                    background:
                      a.inductionType === "capacitacion" ? "#D1E7DD" : "#E7F1FF",
                    color:
                      a.inductionType === "capacitacion" ? "#0F5132" : "#084298",
                  }}
                >
                  {a.inductionType === "capacitacion" ? "Capacitación" : "Inducción"}
                </span>
              </div>

              <div style={styles.body}>
                <p><strong>Fecha asignación:</strong> {new Date(a.dateAssignment).toLocaleDateString()}</p>
                {a.dateComplete && (
                  <p><strong>Finalizada:</strong> {new Date(a.dateComplete).toLocaleDateString()}</p>
                )}
                <p><strong>Puntos:</strong> {a.points}</p>
                <p><strong>Estado:</strong> {getStatusLabel(a.status)}</p>
              </div>

              {a.status?.toLowerCase() === "pendiente" && (
                <button
                  style={styles.takeBtn}
                  onClick={() => handleTakeAssignment(a)}
                >
                  {a.inductionType === "capacitacion"
                    ? "Tomar Capacitación"
                    : "Tomar Inducción"}
                </button>
              )}
            </div>
          ))
        ) : (
          <div style={styles.noData}>No tienes formaciones asignadas</div>
        )}
      </div>
    </div>
  );
}

// ✅ Estilos reutilizables
const styles = {
  container: {
    padding: "20px",
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  status: {
    fontSize: "12px",
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: "6px",
    background: "#f1f1f1",
  },
  body: {
    flex: 1,
    fontSize: "14px",
    color: "#555",
    marginBottom: "15px",
  },
  takeBtn: {
    background: "#007bff",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  noData: {
    textAlign: "center",
    padding: "50px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
};
