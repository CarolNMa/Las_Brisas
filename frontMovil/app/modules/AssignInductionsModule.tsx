import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

interface InductionAssignment {
  id: number;
  inductionId: number;
  inductionName: string;
  employeeId: number;
  employeeName: string;
  dateAssignment: string;
  dateComplete: string;
  deadline: string;
  dateSeen: string;
  status: "pendiente" | "aprobado" | "rechazado";
  visto: "si" | "no";
  points: number;
}

export default function AssignInductionsModule() {
  const [assignments, setAssignments] = useState<InductionAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Mock data showing all backend fields
      const mockAssignments: InductionAssignment[] = [
        {
          id: 1,
          inductionId: 1,
          inductionName: "Inducción de Seguridad Laboral",
          employeeId: 1,
          employeeName: "Juan García",
          dateAssignment: "2024-06-01T10:30:00Z",
          dateComplete: "2024-06-05T14:15:00Z",
          deadline: "2024-06-15T23:59:00Z",
          dateSeen: "2024-06-02T09:00:00Z",
          status: "aprobado",
          visto: "si",
          points: 95,
        },
        {
          id: 2,
          inductionId: 2,
          inductionName: "Capacitación en React Native",
          employeeId: 2,
          employeeName: "María Rodríguez",
          dateAssignment: "2024-07-01T08:00:00Z",
          dateComplete: "2024-07-01T08:00:00Z", // Not completed yet
          deadline: "2024-07-15T23:59:00Z",
          dateSeen: "2024-07-01T08:30:00Z",
          status: "pendiente",
          visto: "si",
          points: 0,
        },
        {
          id: 3,
          inductionId: 3,
          inductionName: "Inducción de Recursos Humanos",
          employeeId: 3,
          employeeName: "Carlos Martínez",
          dateAssignment: "2024-08-01T10:00:00Z",
          dateComplete: "2024-08-01T10:00:00Z", // Not completed yet
          deadline: "2024-08-10T23:59:00Z",
          dateSeen: "2024-08-01T10:00:00Z",
          status: "pendiente",
          visto: "no",
          points: 0,
        },
        {
          id: 4,
          inductionId: 4,
          inductionName: "Capacitación en Gestión de Proyectos",
          employeeId: 4,
          employeeName: "Ana López",
          dateAssignment: "2024-05-15T14:20:00Z",
          dateComplete: "2024-05-20T16:45:00Z",
          deadline: "2024-06-01T23:59:00Z",
          dateSeen: "2024-05-16T11:30:00Z",
          status: "aprobado",
          visto: "si",
          points: 88,
        },
      ];

      setAssignments(mockAssignments);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
    assignment.inductionName.toLowerCase().includes(searchText.toLowerCase()) ||
    assignment.status.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderAssignment = ({ item }: { item: InductionAssignment }) => (
    <View style={styles.assignmentCard}>
      <View style={styles.assignmentInfo}>
        <Text style={styles.fieldLabel}>ID Asignación:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>ID Inducción:</Text>
        <Text style={styles.fieldValue}>{item.inductionId}</Text>

        <Text style={styles.fieldLabel}>Nombre Inducción:</Text>
        <Text style={styles.fieldValue}>{item.inductionName}</Text>

        <Text style={styles.fieldLabel}>ID Empleado:</Text>
        <Text style={styles.fieldValue}>{item.employeeId}</Text>

        <Text style={styles.fieldLabel}>Nombre Empleado:</Text>
        <Text style={styles.fieldValue}>{item.employeeName}</Text>

        <Text style={styles.fieldLabel}>Fecha Asignación:</Text>
        <Text style={styles.fieldValue}>{new Date(item.dateAssignment).toLocaleString()}</Text>

        <Text style={styles.fieldLabel}>Fecha Completado:</Text>
        <Text style={styles.fieldValue}>{new Date(item.dateComplete).toLocaleString()}</Text>

        <Text style={styles.fieldLabel}>Fecha Límite:</Text>
        <Text style={styles.fieldValue}>{new Date(item.deadline).toLocaleString()}</Text>

        <Text style={styles.fieldLabel}>Fecha Visto:</Text>
        <Text style={styles.fieldValue}>{new Date(item.dateSeen).toLocaleString()}</Text>

        <Text style={styles.fieldLabel}>Estado:</Text>
        <Text style={[styles.status,
          item.status === "aprobado" ? styles.approved :
          item.status === "rechazado" ? styles.rejected : styles.pending
        ]}>
          {item.status === "aprobado" ? "Aprobado" :
           item.status === "rechazado" ? "Rechazado" : "Pendiente"}
        </Text>

        <Text style={styles.fieldLabel}>Visto:</Text>
        <Text style={[styles.seen, item.visto === "si" ? styles.yes : styles.no]}>
          {item.visto === "si" ? "Sí" : "No"}
        </Text>

        <Text style={styles.fieldLabel}>Puntos:</Text>
        <Text style={styles.fieldValue}>{item.points}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando asignaciones de inducción...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por empleado, inducción o estado..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredAssignments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAssignment}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron asignaciones</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 20 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  list: { padding: 20 },
  assignmentCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  assignmentInfo: {},
  fieldLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginTop: 8,
    textTransform: "uppercase",
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  approved: { backgroundColor: "#d4edda", color: "#155724" },
  rejected: { backgroundColor: "#f8d7da", color: "#721c24" },
  pending: { backgroundColor: "#fff3cd", color: "#856404" },
  seen: {
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  yes: { backgroundColor: "#d4edda", color: "#155724" },
  no: { backgroundColor: "#f8d7da", color: "#721c24" },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

