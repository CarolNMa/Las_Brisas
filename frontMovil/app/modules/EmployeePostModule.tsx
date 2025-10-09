import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../services/api";

interface EmployeePost {
  id: number;
  employeeId: number;
  employeeName?: string; 
  postId: number;
  postName?: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
}

interface Position {
  id: number;
  namePost: string;
}

export default function EmployeePostModule() {
  const [relations, setRelations] = useState<EmployeePost[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    postId: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [relationsResponse, employeesResponse, positionsResponse] = await Promise.all([
        api.getEmployeePosts(),
        api.getEmployees(),
        api.getPositions(),
      ]);

      setRelations(relationsResponse);
      setEmployees(employeesResponse);
      setPositions(positionsResponse);
    } catch (err) {
      console.error("Error cargando datos:", err);
      Alert.alert("Error", "Error al cargar las relaciones empleado-cargo");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.employeeId || isNaN(parseInt(form.employeeId, 10))) {
      newErrors.employeeId = "Debe seleccionar un empleado válido.";
    }

    if (!form.postId || isNaN(parseInt(form.postId, 10))) {
      newErrors.postId = "Debe seleccionar un cargo válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const employee = employees.find((e) => e.id === parseInt(form.employeeId));
      const position = positions.find((p) => p.id === parseInt(form.postId));

      const employeePostData = {
        employeeId: parseInt(form.employeeId, 10),
        postId: parseInt(form.postId, 10),
      };

      const newRelation = await api.createEmployeePost(employeePostData);

      const completeRelation: EmployeePost = {
        ...newRelation,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : "Desconocido",
        postName: position ? position.namePost : "Desconocido",
      };

      setRelations([...relations, completeRelation]);
      setModalVisible(false);
    } catch (err) {
      console.error("Error guardando relación:", err);
      Alert.alert("Error", "Error al guardar la relación");
    }
  };

  const filteredRelations = relations.filter((relation) =>
    (relation.employeeName ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
    (relation.postName ?? "").toLowerCase().includes(searchText.toLowerCase())
  );

  const renderRelation = ({ item }: { item: EmployeePost }) => (
    <View style={styles.relationCard}>
      <Text style={styles.fieldLabel}>ID Relación:</Text>
      <Text style={styles.fieldValue}>{item.id}</Text>

      <Text style={styles.fieldLabel}>Empleado:</Text>
      <Text style={styles.fieldValue}>
        {item.employeeName ?? "Desconocido"} (ID {item.employeeId})
      </Text>

      <Text style={styles.fieldLabel}>Cargo:</Text>
      <Text style={styles.fieldValue}>
        {item.postName ?? "Desconocido"} (ID {item.postId})
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Cargando relaciones empleado-cargo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerActions}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por empleado o cargo..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
          <Text style={styles.btnText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRelations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRelation}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron relaciones empleado-cargo</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva relación Empleado ↔ Cargo</Text>

            <Text style={styles.label}>Empleado:</Text>
            <View style={[styles.pickerContainer, errors.employeeId && styles.inputError]}>
              <Picker
                selectedValue={form.employeeId}
                onValueChange={(value) => setForm({ ...form, employeeId: value })}
                style={styles.picker}
              >
                <Picker.Item label="-- Seleccionar empleado --" value="" />
                {employees.map((emp) => (
                  <Picker.Item key={emp.id} label={`${emp.firstName} ${emp.lastName}`} value={emp.id.toString()} />
                ))}
              </Picker>
            </View>
            {errors.employeeId && <Text style={styles.errorText}>{errors.employeeId}</Text>}

            <Text style={styles.label}>Cargo:</Text>
            <View style={[styles.pickerContainer, errors.postId && styles.inputError]}>
              <Picker
                selectedValue={form.postId}
                onValueChange={(value) => setForm({ ...form, postId: value })}
                style={styles.picker}
              >
                <Picker.Item label="-- Seleccionar cargo --" value="" />
                {positions.map((pos) => (
                  <Picker.Item key={pos.id} label={pos.namePost} value={pos.id.toString()} />
                ))}
              </Picker>
            </View>
            {errors.postId && <Text style={styles.errorText}>{errors.postId}</Text>}

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btnSmall, styles.btnAlt]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSmall} onPress={handleSave}>
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  list: { padding: 20 },
  relationCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  fieldLabel: { fontSize: 12, fontWeight: "bold", color: "#666", marginTop: 8 },
  fieldValue: { fontSize: 16, color: "#333", marginBottom: 4 },
  emptyText: { fontSize: 16, color: "#666", textAlign: "center" },
  btn: { backgroundColor: "#28a745", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6 },
  btnText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  btnSmall: { backgroundColor: "#007bff", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  btnAlt: { backgroundColor: "#dc3545" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#333" },
  pickerContainer: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 10 },
  picker: { height: 50 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 20 },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
  inputError: { borderColor: "red" },
});
