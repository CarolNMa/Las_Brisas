import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

interface EmployeePost {
  id: number;
  employeeId: number;
  employeeName: string;
  postId: number;
  postName: string;
}

export default function EmployeePostsModule() {
  const [employeePosts, setEmployeePosts] = useState<EmployeePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Mock data showing all backend fields
      const mockEmployeePosts: EmployeePost[] = [
        {
          id: 1,
          employeeId: 1,
          employeeName: "Juan García",
          postId: 1,
          postName: "Desarrollador Senior",
        },
        {
          id: 2,
          employeeId: 2,
          employeeName: "María Rodríguez",
          postId: 2,
          postName: "Analista de Recursos Humanos",
        },
        {
          id: 3,
          employeeId: 3,
          employeeName: "Carlos Martínez",
          postId: 1,
          postName: "Desarrollador Senior",
        },
        {
          id: 4,
          employeeId: 4,
          employeeName: "Ana López",
          postId: 3,
          postName: "Gerente de Proyecto",
        },
        {
          id: 5,
          employeeId: 1,
          employeeName: "Juan García",
          postId: 4,
          postName: "Diseñador UX/UI",
        },
      ];

      setEmployeePosts(mockEmployeePosts);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployeePosts = employeePosts.filter(post =>
    post.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
    post.postName.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderEmployeePost = ({ item }: { item: EmployeePost }) => (
    <View style={styles.employeePostCard}>
      <View style={styles.employeePostInfo}>
        <Text style={styles.fieldLabel}>ID Relación:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>ID Empleado:</Text>
        <Text style={styles.fieldValue}>{item.employeeId}</Text>

        <Text style={styles.fieldLabel}>Nombre Empleado:</Text>
        <Text style={styles.fieldValue}>{item.employeeName}</Text>

        <Text style={styles.fieldLabel}>ID Cargo:</Text>
        <Text style={styles.fieldValue}>{item.postId}</Text>

        <Text style={styles.fieldLabel}>Nombre del Cargo:</Text>
        <Text style={styles.fieldValue}>{item.postName}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando relaciones empleado-cargo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por empleado o cargo..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredEmployeePosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEmployeePost}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron relaciones empleado-cargo</Text>
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
  employeePostCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  employeePostInfo: {},
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

