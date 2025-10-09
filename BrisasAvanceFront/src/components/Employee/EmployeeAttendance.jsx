import { useState, useEffect } from "react";
import api from "../../services/api";

export default function EmployeeAttendance({ employeeId }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await api.getMyAttendance();
      setAttendance(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError("Error al cargar la asistencia");
      console.error("Error loading attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (type) => {
    try {
      await api.registerAttendance(type);
      alert(
        type === "CHECK_IN"
          ? "Entrada registrada correctamente"
          : "Salida registrada correctamente"
      );
      loadAttendance();
    } catch (err) {
      console.error("Error registrando asistencia:", err);
      if (err.message.includes("Ya registraste entrada")) {
        alert("Ya registraste tu entrada hoy.");
      } else if (err.message.includes("Ya registraste salida")) {
        alert("Ya registraste tu salida hoy.");
      } else {
        alert("Error registrando asistencia");
      }
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [h, m] = timeString.split(":");
    return `${h}:${m}`;
  };

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "N/A";

    const [h1, m1] = checkIn.split(":").map(Number);
    const [h2, m2] = checkOut.split(":").map(Number);

    const startMinutes = h1 * 60 + m1;
    const endMinutes = h2 * 60 + m2;
    const diffMinutes = endMinutes - startMinutes;

    if (diffMinutes < 0) return "N/A";

    const hours = (diffMinutes / 60).toFixed(2);
    return hours + " hrs";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PRESENT":
        return "#d4edda";
      case "ABSENT":
        return "#f8d7da";
      case "LATE":
        return "#fff3cd";
      case "HALF_DAY":
        return "#d1ecf1";
      default:
        return "#e2e3e5";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "PRESENT":
        return "#155724";
      case "ABSENT":
        return "#721c24";
      case "LATE":
        return "#856404";
      case "HALF_DAY":
        return "#0c5460";
      default:
        return "#383d41";
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Cargando asistencia...
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        {error}
      </div>
    );

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Mi Asistencia</h2>

      {/* Botones */}
      <div style={styles.buttonsContainer}>
        <button
          onClick={() => handleRegister("CHECK_IN")}
          style={styles.btnGreen}
        >
          Registrar Entrada
        </button>
        <button
          onClick={() => handleRegister("CHECK_OUT")}
          style={styles.btnRed}
        >
          Registrar Salida
        </button>
      </div>

      <div style={styles.attendanceContainer}>
        {attendance.length > 0 ? (
          <div style={styles.attendanceTable}>
            <div style={styles.tableHeader}>
              <div style={styles.headerCell}>Fecha</div>
              <div style={styles.headerCell}>Entrada</div>
              <div style={styles.headerCell}>Salida</div>
              <div style={styles.headerCell}>Horas</div>
              <div style={styles.headerCell}>Estado</div>
            </div>

            {attendance.map((record, index) => (
              <div key={index} style={styles.tableRow}>
                <div style={styles.cell}>
                  {new Date(record.date).toLocaleDateString("es-ES", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div style={styles.cell}>{formatTime(record.timeStart)}</div>
                <div style={styles.cell}>{formatTime(record.timeEnd)}</div>
                <div style={styles.cell}>
                  {calculateHours(record.timeStart, record.timeEnd)}
                </div>
                <div style={styles.cell}>
                  <span
                    style={{
                      ...styles.status,
                      background: getStatusColor(record.status),
                      color: getStatusTextColor(record.status),
                    }}
                  >
                    {record.status === "PRESENT"
                      ? "Presente"
                      : record.status === "ABSENT"
                        ? "Ausente"
                        : record.status === "LATE"
                          ? "Tarde"
                          : record.status === "HALF_DAY"
                            ? "Medio Día"
                            : record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noAttendance}>
            <p>No hay registros de asistencia disponibles</p>
          </div>
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
    marginBottom: "20px",
  },

  buttonsContainer: {
    textAlign: "center",
    marginBottom: "25px",
  },

  btnGreen: {
    margin: "0 10px",
    padding: "10px 20px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.3s ease",
  },

  btnRed: {
    margin: "0 10px",
    padding: "10px 20px",
    background: "#b00",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background 0.3s ease",
  },

  attendanceContainer: {
    padding: "10px",
  },

  attendanceTable: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "1000px",
    margin: "0 auto",
    overflow: "hidden",
  },

  tableHeader: {
    display: "flex",
    background: "#f8f9fa",
    borderBottom: "2px solid #dee2e6",
    fontWeight: "bold",
    color: "#495057",
  },

  headerCell: {
    flex: 1,
    padding: "15px 10px",
    textAlign: "center",
    minWidth: "120px",
  },

  tableRow: {
    display: "flex",
    borderBottom: "1px solid #dee2e6",
  },

  cell: {
    flex: 1,
    padding: "12px 10px",
    textAlign: "center",
    minWidth: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  status: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  noAttendance: {
    textAlign: "center",
    padding: "50px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: "800px",
    margin: "0 auto",
  },
};
