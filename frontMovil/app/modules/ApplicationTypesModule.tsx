import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

interface ApplicationType {
  id: number;
  name: string;
  required: boolean;
}

export default function ApplicationTypesModule() {
  const [applicationTypes, setApplicationTypes] = useState<ApplicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Mock data showing all backend fields
      const mockApplicationTypes: ApplicationType[] = [
        {
          id: 1,
          name: "Vacaciones",
          required: true,
        },
        {
          id: 2,
          name: "Permiso Médico",
          required: true,
        },
        {
          id: 3,
          name: "Licencia de Maternidad",
          required: true,
        },
        {
          id: 4,
          name: "Permiso de Capacitación",
          required: false,
        },
        {
          id: 5,
          name: "Permiso Personal",
          required: false,
        },
        {
          id: 6,
          name: "Licencia por Luto",
          required: true,
        },
      ];

      setApplicationTypes(mockApplicationTypes);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplicationTypes = applicationTypes.filter(type =>
    type.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderApplicationType = ({ item }: { item: ApplicationType }) => (
    <View style={styles.applicationTypeCard}>
      <View style={styles.applicationTypeInfo}>
        <Text style={styles.fieldLabel}>ID Tipo Solicitud:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Nombre:</Text>
        <Text style={styles.fieldValue}>{item.name}</Text>

        <Text style={styles.fieldLabel}>Requerido:</Text>
        <Text style={[styles.required, item.required ? styles.yes : styles.no]}>
          {item.required ? "Sí" : "No"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando tipos de solicitud...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredApplicationTypes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderApplicationType}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron tipos de solicitud</Text>
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
  applicationTypeCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  applicationTypeInfo: {},
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
  required: {
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

