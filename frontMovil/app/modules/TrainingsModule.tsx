import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

interface Training {
  id: number;
  name: string;
  description: string;
  type: "induction" | "capacitacion";
  status: "pendiente" | "aprobado" | "rechazado";
  dateCreate: string;
  dateUpdate: string;
}

export default function TrainingsModule() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Mock data showing all backend fields (only capacitacion type)
      const mockTrainings: Training[] = [
        {
          id: 2,
          name: "Capacitación en React Native",
          description: "Curso avanzado de desarrollo móvil con React Native",
          type: "capacitacion",
          status: "aprobado",
          dateCreate: "2024-03-10T09:45:00Z",
          dateUpdate: "2024-07-05T16:20:00Z",
        },
        {
          id: 4,
          name: "Capacitación en Gestión de Proyectos",
          description: "Metodologías ágiles y gestión de proyectos",
          type: "capacitacion",
          status: "aprobado",
          dateCreate: "2024-02-12T15:10:00Z",
          dateUpdate: "2024-08-01T10:45:00Z",
        },
        {
          id: 6,
          name: "Capacitación en Diseño UX/UI",
          description: "Principios de diseño de interfaces y experiencia de usuario",
          type: "capacitacion",
          status: "pendiente",
          dateCreate: "2024-09-01T11:30:00Z",
          dateUpdate: "2024-09-01T11:30:00Z",
        },
        {
          id: 7,
          name: "Capacitación en Base de Datos",
          description: "Administración y optimización de bases de datos SQL y NoSQL",
          type: "capacitacion",
          status: "aprobado",
          dateCreate: "2024-04-15T13:20:00Z",
          dateUpdate: "2024-09-10T14:15:00Z",
        },
        {
          id: 8,
          name: "Capacitación en DevOps",
          description: "Prácticas de integración y entrega continua",
          type: "capacitacion",
          status: "rechazado",
          dateCreate: "2024-05-20T10:00:00Z",
          dateUpdate: "2024-05-25T09:30:00Z",
        },
      ];

      setTrainings(mockTrainings);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = trainings.filter(training =>
    training.name.toLowerCase().includes(searchText.toLowerCase()) ||
    training.description.toLowerCase().includes(searchText.toLowerCase()) ||
    training.status.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderTraining = ({ item }: { item: Training }) => (
    <View style={styles.trainingCard}>
      <View style={styles.trainingInfo}>
        <Text style={styles.fieldLabel}>ID Capacitación:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Nombre:</Text>
        <Text style={styles.fieldValue}>{item.name}</Text>

        <Text style={styles.fieldLabel}>Descripción:</Text>
        <Text style={styles.fieldValue}>{item.description}</Text>

        <Text style={styles.fieldLabel}>Tipo:</Text>
        <Text style={styles.fieldValue}>Capacitación</Text>

        <Text style={styles.fieldLabel}>Estado:</Text>
        <Text style={[styles.status,
          item.status === "aprobado" ? styles.approved :
          item.status === "rechazado" ? styles.rejected : styles.pending
        ]}>
          {item.status === "aprobado" ? "Aprobado" :
           item.status === "rechazado" ? "Rechazado" : "Pendiente"}
        </Text>

        <Text style={styles.fieldLabel}>Fecha Creación:</Text>
        <Text style={styles.fieldValue}>{new Date(item.dateCreate).toLocaleString()}</Text>

        <Text style={styles.fieldLabel}>Última Actualización:</Text>
        <Text style={styles.fieldValue}>{new Date(item.dateUpdate).toLocaleString()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando capacitaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, descripción o estado..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredTrainings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTraining}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron capacitaciones</Text>
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
  trainingCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  trainingInfo: {},
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
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

