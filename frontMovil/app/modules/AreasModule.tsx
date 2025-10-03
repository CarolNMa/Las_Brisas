import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

interface Area {
  id: number;
  nameArea: string;
  description: string;
}

export default function AreasModule() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Mock data showing all backend fields
      const mockAreas: Area[] = [
        {
          id: 1,
          nameArea: "Desarrollo de Software",
          description: "Área responsable del desarrollo y mantenimiento de aplicaciones",
        },
        {
          id: 2,
          nameArea: "Recursos Humanos",
          description: "Gestión del talento humano y procesos administrativos",
        },
        {
          id: 3,
          nameArea: "Diseño y UX/UI",
          description: "Creación de interfaces y experiencias de usuario",
        },
        {
          id: 4,
          nameArea: "Calidad y Testing",
          description: "Aseguramiento de calidad y pruebas de software",
        },
        {
          id: 5,
          nameArea: "Infraestructura",
          description: "Gestión de servidores, bases de datos y sistemas",
        },
      ];

      setAreas(mockAreas);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAreas = areas.filter(area =>
    area.nameArea.toLowerCase().includes(searchText.toLowerCase()) ||
    area.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderArea = ({ item }: { item: Area }) => (
    <View style={styles.areaCard}>
      <View style={styles.areaInfo}>
        <Text style={styles.fieldLabel}>ID Área:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Nombre del Área:</Text>
        <Text style={styles.fieldValue}>{item.nameArea}</Text>

        <Text style={styles.fieldLabel}>Descripción:</Text>
        <Text style={styles.fieldValue}>{item.description}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando áreas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o descripción..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredAreas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArea}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron áreas</Text>
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
  areaCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  areaInfo: {},
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
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

