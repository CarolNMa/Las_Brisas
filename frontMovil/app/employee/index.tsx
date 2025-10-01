import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllEmployees } from "../../services/api";
import HeaderAdmin from "@/components/Header";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  tipoDocumento: string;
  documentNumber: string;
  email: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("username").then(setUsername);

    getAllEmployees()
      .then(setEmployees)
      .catch((err) => console.error("Error cargando empleados:", err))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.role}>{item.tipoDocumento}: {item.documentNumber}</Text>
        <Text style={styles.area}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/employee/[id]",
            params: { id: String(item.id) },
          })
        }
      >
        <Text style={styles.buttonText}>Ver</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#a50000" />
        <Text>Cargando empleados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderAdmin />
      <Text style={styles.header}>Lista de Empleados</Text>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa", justifyContent: "center" },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  adminText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  logoutButton: {
    backgroundColor: "#a50000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15, color: "#a50000" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 5,
    marginTop: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: { fontSize: 16, fontWeight: "bold", color: "#000" },
  role: { fontSize: 14, color: "#000" },
  area: { fontSize: 13, color: "#000" },
  button: {
    backgroundColor: "#a50000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
