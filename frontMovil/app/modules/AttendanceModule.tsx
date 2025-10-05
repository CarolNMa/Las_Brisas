import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ApiService from "../../services/api";

interface Attendance {
  id: number;
  employee: number;
  date: string;
  timeStart?: string;
  timeEnd?: string;
  status: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

export default function AttendanceModule() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    employeeId: "",
    date: "",
    status: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [att, emp] = await Promise.all([
        ApiService.getAllAttendance(),
        ApiService.getEmployees(),
      ]);
      setAttendances(att);
      setEmployees(emp);
    } catch (err: any) {
      console.error("❌ Error cargando asistencias:", err);
      Alert.alert("Error", "Error cargando asistencias. Verifica el backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const filteredAttendances = attendances.filter((a) => {
    const matchEmployee =
      !filter.employeeId || a.employee === parseInt(filter.employeeId);
    const matchDate =
      !filter.date || (a.date && a.date.startsWith(filter.date));
    const matchStatus =
      !filter.status ||
      a.status.toLowerCase() === filter.status.toLowerCase();

    return matchEmployee && matchDate && matchStatus;
  });


  const renderAttendanceItem = ({ item }: { item: Attendance }) => {
    const employee = employees.find((e) => e.id === item.employee);
    return (
      <View style={styles.card}>
        <Text style={styles.employeeText}>
          {employee ? `${employee.firstName} ${employee.lastName}` : "—"}
        </Text>
        <Text style={styles.cardText}>{item.date || "—"}</Text>
        <Text style={styles.timeText}>Entrada: {item.timeStart || "—"}</Text>
        <Text style={styles.timeText}>Salida: {item.timeEnd || "—"}</Text>
        <Text
          style={[
            styles.statusText,
            {
              color:
                item.status === "presente"
                  ? "green"
                  : item.status === "tarde"
                  ? "orange"
                  : item.status === "ausente"
                  ? "red"
                  : "gray",
            },
          ]}
        >
          {item.status}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a50000" />
        <Text>Cargando asistencias...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📋 Registro de Asistencias</Text>


      {/* Filtros */}
      <View style={styles.filterContainer}>
        <Text style={styles.label}>Empleado:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={filter.employeeId}
            onValueChange={(value) => handleFilterChange("employeeId", value)}
            style={styles.picker}
          >
            <Picker.Item label="Todos los empleados" value="" />
            {employees.map((e) => (
              <Picker.Item
                key={e.id}
                label={`${e.firstName} ${e.lastName}`}
                value={e.id.toString()}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Fecha:</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={filter.date}
          onChangeText={(value) => handleFilterChange("date", value)}
        />

        <Text style={styles.label}>Estado:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={filter.status}
            onValueChange={(value) => handleFilterChange("status", value)}
            style={styles.picker}
          >
            <Picker.Item label="Todos los estados" value="" />
            <Picker.Item label="Presente" value="presente" />
            <Picker.Item label="Ausente" value="ausente" />
            <Picker.Item label="Tarde" value="tarde" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={loadData}>
          <Text style={styles.refreshText}>🔄 Actualizar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de asistencias */}
      <FlatList
        data={filteredAttendances}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAttendanceItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay registros de asistencia</Text>
        }
        style={styles.list}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a50000",
    textAlign: "center",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#333" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: { height: 50 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  refreshButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  refreshText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  list: { marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  employeeText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cardText: { fontSize: 16, color: "#333", marginTop: 2 },
  timeText: { fontSize: 14, color: "#666", marginTop: 2 },
  statusText: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
