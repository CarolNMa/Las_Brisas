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
  id?: number;
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
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
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
      const token = await AsyncStorage.getItem('jwt_token');
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
          Alert.alert("Error", "No se pudieron cargar los empleados. Verifica tu conexión y permisos.");
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
    setEditingEmployee(null);
    resetForm();
    setModalVisible(true);
  }, [resetForm]);

  const handleEditEmployee = useCallback((employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      tipoDocumento: employee.tipoDocumento,
      documentNumber: employee.documentNumber,
      birthdate: employee.birthdate,
      photoProfile: employee.photoProfile || "",
      gender: employee.gender,
      phone: employee.phone,
      email: employee.email,
      civilStatus: employee.civilStatus,
      address: employee.address,
      userId: employee.userId,
    });
    setModalVisible(true);
  }, []);

  const handleDeleteEmployee = useCallback((employee: Employee) => {
    Alert.alert(
      "Eliminar Empleado",
      `¿Estás seguro de que quieres eliminar al empleado "${employee.firstName} ${employee.lastName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => performDeleteEmployee(employee.id),
        },
      ]
    );
  }, []);

  const performDeleteEmployee = useCallback(async (id: number) => {
    try {
      await api.deleteEmployee(id);
      Alert.alert("Éxito", "Empleado eliminado correctamente");

      // Refresh data
      const employeesData = await api.getEmployees();
      setEmployees(employeesData);
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el empleado");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      Alert.alert("Error", "Los campos nombre, apellido y email son obligatorios");
      return;
    }

    try {
      setSubmitting(true);

      if (!editingEmployee) {
        // Create employee
        await api.createEmployee(formData);
        Alert.alert("Éxito", "Empleado creado correctamente");
      } else {
        // Update employee
        await api.updateEmployee(editingEmployee.id, formData);
        Alert.alert("Éxito", "Empleado actualizado correctamente");
      }

      setModalVisible(false);
      resetForm();

      // Refresh data
      const employeesData = await api.getEmployees();
      setEmployees(employeesData);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setSubmitting(false);
    }
  }, [formData, editingEmployee, resetForm]);

  const filteredEmployees = employees.filter(employee =>
    (employee.firstName?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (employee.lastName?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (employee.email?.toLowerCase() || '').includes(searchText.toLowerCase())
  );

  const renderEmployee = useCallback(
    ({ item }: { item: Employee }) => (
      <View style={styles.employeeCard}>
        <View style={styles.employeeInfo}>
          <Text style={styles.fieldLabel}>ID Empleado:</Text>
          <Text style={styles.fieldValue}>{item.id}</Text>

          <Text style={styles.fieldLabel}>Nombre:</Text>
          <Text style={styles.fieldValue}>{item.firstName || 'Sin nombre'}</Text>

          <Text style={styles.fieldLabel}>Apellido:</Text>
          <Text style={styles.fieldValue}>{item.lastName || 'Sin apellido'}</Text>

          <Text style={styles.fieldLabel}>Tipo Documento:</Text>
          <Text style={styles.fieldValue}>{item.tipoDocumento || 'Sin tipo'}</Text>

          <Text style={styles.fieldLabel}>Número Documento:</Text>
          <Text style={styles.fieldValue}>{item.documentNumber || 'Sin número'}</Text>

          <Text style={styles.fieldLabel}>Fecha Nacimiento:</Text>
          <Text style={styles.fieldValue}>{item.birthdate || 'Sin fecha'}</Text>

          <Text style={styles.fieldLabel}>Género:</Text>
          <Text style={styles.fieldValue}>{item.gender || 'Sin género'}</Text>

          <Text style={styles.fieldLabel}>Teléfono:</Text>
          <Text style={styles.fieldValue}>{item.phone || 'Sin teléfono'}</Text>

          <Text style={styles.fieldLabel}>Email:</Text>
          <Text style={styles.fieldValue}>{item.email || 'Sin email'}</Text>

          <Text style={styles.fieldLabel}>Estado Civil:</Text>
          <Text style={styles.fieldValue}>{item.civilStatus || 'Sin estado'}</Text>

          <Text style={styles.fieldLabel}>Dirección:</Text>
          <Text style={styles.fieldValue}>{item.address || 'Sin dirección'}</Text>

          <Text style={styles.fieldLabel}>ID Usuario:</Text>
          <Text style={styles.fieldValue}>{item.userId}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditEmployee(item)}
            accessibilityRole="button"
            accessibilityLabel={`Editar empleado ${item.firstName} ${item.lastName}`}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteEmployee(item)}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar empleado ${item.firstName} ${item.lastName}`}
          >
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleEditEmployee, handleDeleteEmployee]
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
              accessibilityRole="button"
              accessibilityLabel="Crear Empleado"
            >
              <Text style={styles.createButtonText}>Crear Empleado</Text>
            </TouchableOpacity>
          </View>
        }
        initialNumToRender={10}
        windowSize={10}
        removeClippedSubviews
      />

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
              <Text style={styles.modalTitle}>
                {editingEmployee ? "Editar Empleado" : "Crear Empleado"}
              </Text>

              <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.firstName}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, firstName: text }))
                  }
                  placeholder="Ingrese el nombre"
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Apellido:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.lastName}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, lastName: text }))
                  }
                  placeholder="Ingrese el apellido"
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Tipo Documento:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.tipoDocumento}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, tipoDocumento: text }))
                  }
                  placeholder="CC, TI, CE, etc."
                  autoCapitalize="characters"
                />

                <Text style={styles.label}>Número Documento:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.documentNumber}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, documentNumber: text }))
                  }
                  placeholder="Ingrese el número de documento"
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Fecha Nacimiento (YYYY-MM-DD):</Text>
                <TextInput
                  style={styles.input}
                  value={formData.birthdate}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, birthdate: text }))
                  }
                  placeholder="1990-01-01"
                />

                <Text style={styles.label}>Foto Perfil (URL):</Text>
                <TextInput
                  style={styles.input}
                  value={formData.photoProfile}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, photoProfile: text }))
                  }
                  placeholder="URL de la foto de perfil"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Género:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.gender}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, gender: text }))
                  }
                  placeholder="Masculino, Femenino, Otro"
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Teléfono:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, phone: text }))
                  }
                  placeholder="Ingrese el teléfono"
                  keyboardType="phone-pad"
                />

                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, email: text }))
                  }
                  placeholder="Ingrese el email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Estado Civil:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.civilStatus}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, civilStatus: text }))
                  }
                  placeholder="Soltero, Casado, etc."
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Dirección:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, address: text }))
                  }
                  placeholder="Ingrese la dirección"
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />

                <Text style={styles.label}>ID Usuario:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.userId.toString()}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, userId: parseInt(text) || 0 }))
                  }
                  placeholder="ID del usuario asociado"
                  keyboardType="numeric"
                />
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  disabled={submitting}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar"
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
                  accessibilityRole="button"
                  accessibilityLabel={editingEmployee ? "Actualizar" : "Crear"}
                >
                  <Text style={styles.submitButtonText}>
                    {submitting
                      ? "Guardando..."
                      : editingEmployee
                      ? "Actualizar"
                      : "Crear"}
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
    textAlign: "center"
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  editButton: { backgroundColor: "#007bff" },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  deleteButton: { backgroundColor: "#dc3545" },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
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
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  submitButton: { backgroundColor: "#a50000" },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});