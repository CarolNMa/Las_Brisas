import { useState, useEffect } from "react";
import { CheckCircle, Clock } from "lucide-react";
import ApiService from "../../services/api";
import EmployeeTakeInduction from "./EmployeeTakeInduction";
import EmployeeTakeTraining from "./EmployeeTakeTraining";

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
      console.error("Error cargando asignaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAssignment = (assignment) => {
    setTakingAssignment(assignment);
  };

  const handleComplete = () => {
    setTakingAssignment(null);
    loadAssignments();
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "aprobado":
        return (
          <>
            <CheckCircle size={16} style={{ marginRight: 4, color: "#16a34a" }} />{" "}
            Completada
          </>
        );
      case "pendiente":
        return (
          <>
            <Clock size={16} style={{ marginRight: 4, color: "#f59e0b" }} />{" "}
            Pendiente
          </>
        );
      default:
        return status;
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Cargando formaciones...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        {error}
      </div>
    );

  if (takingAssignment) {
    if (takingAssignment.inductionType === "capacitacion") {
      return (
        <EmployeeTakeTraining
          assignment={takingAssignment}
          onComplete={handleComplete}
        />
      );
    }

    return (
      <div style={styles.page}>
        <button
          onClick={() => setTakingAssignment(null)}
          style={styles.backButton}
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
    <div style={styles.page}>
      <h2 style={styles.title}>Mis Formaciones (Inducciones y Capacitaciones)</h2>

      <div style={styles.container}>
        {assignments.length > 0 ? (
          assignments.map((a) => (
            <div key={a.id} style={styles.card}>
              <div style={styles.header}>
                <h3 style={styles.cardTitle}>{a.inductionName}</h3>
                <span
                  style={{
                    ...styles.status,
                    background:
                      a.inductionType === "capacitacion" ? "#D1E7DD" : "#E7F1FF",
                    color:
                      a.inductionType === "capacitacion" ? "#0F5132" : "#084298",
                  }}
                >
                  {a.inductionType === "capacitacion"
                    ? "Capacitación"
                    : "Inducción"}
                </span>
              </div>

              <div style={styles.body}>
                <p>
                  <strong>Fecha asignación:</strong>{" "}
                  {new Date(a.dateAssignment).toLocaleDateString()}
                </p>
                {a.dateComplete && (
                  <p>
                    <strong>Finalizada:</strong>{" "}
                    {new Date(a.dateComplete).toLocaleDateString()}
                  </p>
                )}
                <p>
                  <strong>Puntos:</strong> {a.points}
                </p>
                <p>
                  <strong>Estado:</strong> {getStatusLabel(a.status)}
                </p>
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
  backButton: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "500",
    color: "#111",
    marginBottom: "20px",
  },
  container: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s ease",
  },
  cardTitle: {
    color: "#333",
    fontSize: "16px",
    fontWeight: "600",
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
  },
  body: {
    flex: 1,
    fontSize: "14px",
    color: "#555",
    marginBottom: "15px",
  },
  takeBtn: {
    background: "#b00",
    color: "#fff",
    padding: "10px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    alignSelf: "flex-start",
    fontWeight: "600",
    transition: "background 0.3s ease",
  },
  noData: {
    textAlign: "center",
    padding: "50px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
};
