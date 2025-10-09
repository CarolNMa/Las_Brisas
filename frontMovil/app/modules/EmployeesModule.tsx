import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import HeaderAdmin from "@/components/Header";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  tipoDocumento: string;
  documentNumber: string;
  birthdate: string;
  photoProfile?: string;
  gender: string;
  phone: string;
  email: string;
  civilStatus: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
  userId: number;
}

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  tipoDocumento: string;
  documentNumber: string;
  birthdate: string;
  photoProfile?: string;
  gender: string;
  phone: string;
  email: string;
  civilStatus: string;
  address: string;
  userId: number;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    tipoDocumento: "",
    documentNumber: "",
    birthdate: "",
    photoProfile: "",
    gender: "",
    phone: "",
    email: "",
    civilStatus: "",
    address: "",
    userId: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("jwt_token");
      if (!token) {
        setIsAuthenticated(false);
        Alert.alert("Error", "Debes iniciar sesión primero");
        router.replace("/(auth)/login");
        return;
      }
      setIsAuthenticated(true);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === true) {
      const fetchEmployees = async () => {
        try {
          const employeesData = await api.getEmployees();
          setEmployees(employeesData);
        } catch (error) {
          Alert.alert(
            "Error",
            "No se pudieron cargar los empleados. Verifica tu conexión y permisos."
          );
        }
      };
      fetchEmployees();
    }
  }, [isAuthenticated]);

  const resetForm = useCallback(() => {
    setFormData({
      firstName: "",
      lastName: "",
      tipoDocumento: "",
      documentNumber: "",
      birthdate: "",
      photoProfile: "",
      gender: "",
      phone: "",
      email: "",
      civilStatus: "",
      address: "",
      userId: 0,
    });
  }, []);

  const handleCreateEmployee = useCallback(() => {
    resetForm();
    setModalVisible(true);
  }, [resetForm]);

  const handleSubmit = useCallback(async () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      Alert.alert("Error", "Los campos nombre, apellido y email son obligatorios");
      return;
    }

    try {
      setSubmitting(true);
      await api.createEmployee(formData);
      Alert.alert("Éxito", "Empleado creado correctamente");
      setModalVisible(false);
      resetForm();

      const employeesData = await api.getEmployees();
      setEmployees(employeesData);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setSubmitting(false);
    }
  }, [formData, resetForm]);

  const filteredEmployees = employees.filter(
    (employee) =>
      (employee.firstName?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (employee.lastName?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (employee.email?.toLowerCase() || "").includes(searchText.toLowerCase())
  );

  const renderEmployee = ({ item }: { item: Employee }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeInfo}>
        <Text style={styles.fieldLabel}>ID Empleado:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Nombre:</Text>
        <Text style={styles.fieldValue}>{item.firstName}</Text>

        <Text style={styles.fieldLabel}>Apellido:</Text>
        <Text style={styles.fieldValue}>{item.lastName}</Text>

        <Text style={styles.fieldLabel}>Tipo Documento:</Text>
        <Text style={styles.fieldValue}>{item.tipoDocumento}</Text>

        <Text style={styles.fieldLabel}>Número Documento:</Text>
        <Text style={styles.fieldValue}>{item.documentNumber}</Text>

        <Text style={styles.fieldLabel}>Fecha Nacimiento:</Text>
        <Text style={styles.fieldValue}>{item.birthdate}</Text>

        <Text style={styles.fieldLabel}>Género:</Text>
        <Text style={styles.fieldValue}>{item.gender}</Text>

        <Text style={styles.fieldLabel}>Teléfono:</Text>
        <Text style={styles.fieldValue}>{item.phone}</Text>

        <Text style={styles.fieldLabel}>Email:</Text>
        <Text style={styles.fieldValue}>{item.email}</Text>

        <Text style={styles.fieldLabel}>Estado Civil:</Text>
        <Text style={styles.fieldValue}>{item.civilStatus}</Text>

        <Text style={styles.fieldLabel}>Dirección:</Text>
        <Text style={styles.fieldValue}>{item.address}</Text>

        <Text style={styles.fieldLabel}>ID Usuario:</Text>
        <Text style={styles.fieldValue}>{item.userId}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderAdmin />
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEmployee}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron empleados</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Lista de Empleados</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre, apellido o email..."
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateEmployee}
            >
              <Text style={styles.createButtonText}>Crear Empleado</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ width: "90%" }}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Crear Empleado</Text>

              <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
                {[
                  { label: "Nombre", key: "firstName" },
                  { label: "Apellido", key: "lastName" },
                  { label: "Tipo Documento", key: "tipoDocumento" },
                  { label: "Número Documento", key: "documentNumber" },
                  { label: "Fecha Nacimiento (YYYY-MM-DD)", key: "birthdate" },
                  { label: "Foto Perfil (URL)", key: "photoProfile" },
                  { label: "Género", key: "gender" },
                  { label: "Teléfono", key: "phone" },
                  { label: "Email", key: "email" },
                  { label: "Estado Civil", key: "civilStatus" },
                  { label: "Dirección", key: "address" },
                  { label: "ID Usuario", key: "userId" },
                ].map((field) => (
                  <View key={field.key}>
                    <Text style={styles.label}>{field.label}:</Text>
                    <TextInput
                      style={styles.input}
                      value={
                        formData[field.key as keyof EmployeeFormData]?.toString() || ""
                      }
                      onChangeText={(text) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.key]:
                            field.key === "userId" ? parseInt(text) || 0 : text,
                        }))
                      }
                      placeholder={`Ingrese ${field.label.toLowerCase()}`}
                    />
                  </View>
                ))}
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  disabled={submitting}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.submitButton,
                    submitting && { opacity: 0.7 },
                  ]}
                  onPress={handleSubmit}
                  disabled={submitting}
                >
                  <Text style={styles.submitButtonText}>
                    {submitting ? "Guardando..." : "Crear"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  header: { padding: 20, paddingBottom: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#a50000",
    textAlign: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#a50000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  employeeCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  employeeInfo: {},
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a50000",
    textAlign: "center",
    marginBottom: 20,
  },
  form: { maxHeight: 400 },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#6c757d" },
  cancelButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  submitButton: { backgroundColor: "#a50000" },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emptyText: { fontSize: 16, color: "#666", textAlign: "center" },
});
