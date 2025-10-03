import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

interface Position {
  id: number;
  namePost: string;
  description: string;
  jobFunction: string;
  requirements: string;
}

export default function PositionsModule() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Mock data showing all backend fields
      const mockPositions: Position[] = [
        {
          id: 1,
          namePost: "Desarrollador Senior",
          description: "Desarrollador de software con experiencia en tecnologías web",
          jobFunction: "Desarrollar aplicaciones web y móviles, mantener código existente, colaborar con el equipo de desarrollo",
          requirements: "5+ años de experiencia, conocimientos en React, Node.js, bases de datos SQL/NoSQL",
        },
        {
          id: 2,
          namePost: "Analista de Recursos Humanos",
          description: "Encargado de gestionar procesos de selección y desarrollo del personal",
          jobFunction: "Realizar procesos de reclutamiento, entrevistas, capacitación, gestión de nómina",
          requirements: "Experiencia en RRHH, conocimientos en legislación laboral, habilidades de comunicación",
        },
        {
          id: 3,
          namePost: "Gerente de Proyecto",
          description: "Liderar equipos de desarrollo y asegurar entrega de proyectos",
          jobFunction: "Planificar proyectos, coordinar equipos, gestionar presupuestos, reportar avances",
          requirements: "Experiencia en gestión de proyectos, conocimientos en metodologías ágiles, liderazgo",
        },
        {
          id: 4,
          namePost: "Diseñador UX/UI",
          description: "Crear interfaces de usuario intuitivas y atractivas",
          jobFunction: "Diseñar wireframes, mockups, prototipos, realizar pruebas de usabilidad",
          requirements: "Portafolio de diseño, conocimientos en Figma/Sketch, principios de UX/UI",
        },
      ];

      setPositions(mockPositions);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPositions = positions.filter(position =>
    position.namePost.toLowerCase().includes(searchText.toLowerCase()) ||
    position.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderPosition = ({ item }: { item: Position }) => (
    <View style={styles.positionCard}>
      <View style={styles.positionInfo}>
        <Text style={styles.fieldLabel}>ID Posición:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Nombre del Cargo:</Text>
        <Text style={styles.fieldValue}>{item.namePost}</Text>

        <Text style={styles.fieldLabel}>Descripción:</Text>
        <Text style={styles.fieldValue}>{item.description}</Text>

        <Text style={styles.fieldLabel}>Función del Trabajo:</Text>
        <Text style={styles.fieldValue}>{item.jobFunction}</Text>

        <Text style={styles.fieldLabel}>Requisitos:</Text>
        <Text style={styles.fieldValue}>{item.requirements}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando posiciones...</Text>
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
        data={filteredPositions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPosition}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron posiciones</Text>
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
  positionCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  positionInfo: {},
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

