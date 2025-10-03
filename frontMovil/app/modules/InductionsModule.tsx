import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

interface Induction {
  id: number;
  name: string;
  description: string;
  type: "induction" | "capacitacion";
  status: "pendiente" | "aprobado" | "rechazado";
  dateCreate: string;
  dateUpdate: string;
}

export default function InductionsModule() {
  const [inductions, setInductions] = useState<Induction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Mock data showing all backend fields
      const mockInductions: Induction[] = [
        {
          id: 1,
          name: "Inducción de Seguridad Laboral",
          description: "Curso obligatorio sobre normas de seguridad en el trabajo",
          type: "induction",
          status: "aprobado",
          dateCreate: "2024-01-15T10:30:00Z",
          dateUpdate: "2024-06-20T14:15:00Z",
        },
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
          id: 3,
          name: "Inducción de Recursos Humanos",
          description: "Información sobre políticas y procedimientos de RRHH",
          type: "induction",
          status: "pendiente",
          dateCreate: "2024-05-08T11:20:00Z",
          dateUpdate: "2024-05-08T11:20:00Z",
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
          id: 5,
          name: "Inducción de Ética Empresarial",
          description: "Código de ética y valores corporativos",
          type: "induction",
          status: "rechazado",
          dateCreate: "2024-04-20T13:30:00Z",
          dateUpdate: "2024-04-25T09:15:00Z",
        },
      ];

      setInductions(mockInductions);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInductions = inductions.filter(induction =>
    induction.name.toLowerCase().includes(searchText.toLowerCase()) ||
    induction.description.toLowerCase().includes(searchText.toLowerCase()) ||
    induction.type.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderInduction = ({ item }: { item: Induction }) => (
    <View style={styles.inductionCard}>
      <View style={styles.inductionInfo}>
        <Text style={styles.fieldLabel}>ID Inducción:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Nombre:</Text>
        <Text style={styles.fieldValue}>{item.name}</Text>

        <Text style={styles.fieldLabel}>Descripción:</Text>
        <Text style={styles.fieldValue}>{item.description}</Text>

        <Text style={styles.fieldLabel}>Tipo:</Text>
        <Text style={styles.fieldValue}>
          {item.type === "induction" ? "Inducción" : "Capacitación"}
        </Text>

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
        <Text>Cargando inducciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, descripción o tipo..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredInductions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderInduction}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron inducciones</Text>
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
  inductionCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  inductionInfo: {},
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

