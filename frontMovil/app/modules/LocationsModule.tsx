import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

interface Location {
  id: number;
  nameLocation: string;
  address: string;
}

export default function LocationsModule() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Mock data showing all backend fields
      const mockLocations: Location[] = [
        {
          id: 1,
          nameLocation: "Oficina Principal Bogotá",
          address: "Carrera 7 #23-45, Bogotá, Colombia",
        },
        {
          id: 2,
          nameLocation: "Sucursal Medellín",
          address: "Calle 50 #30-25, Medellín, Colombia",
        },
        {
          id: 3,
          nameLocation: "Centro de Desarrollo Cali",
          address: "Avenida 6N #23-45, Cali, Colombia",
        },
        {
          id: 4,
          nameLocation: "Oficina Barranquilla",
          address: "Carrera 45 #20-30, Barranquilla, Colombia",
        },
        {
          id: 5,
          nameLocation: "Centro Logístico Cartagena",
          address: "Manga Calle 25 #5-60, Cartagena, Colombia",
        },
      ];

      setLocations(mockLocations);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(location =>
    location.nameLocation.toLowerCase().includes(searchText.toLowerCase()) ||
    location.address.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderLocation = ({ item }: { item: Location }) => (
    <View style={styles.locationCard}>
      <View style={styles.locationInfo}>
        <Text style={styles.fieldLabel}>ID Ubicación:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Nombre de Ubicación:</Text>
        <Text style={styles.fieldValue}>{item.nameLocation}</Text>

        <Text style={styles.fieldLabel}>Dirección:</Text>
        <Text style={styles.fieldValue}>{item.address}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando ubicaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o dirección..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLocation}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron ubicaciones</Text>
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
  locationCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  locationInfo: {},
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

