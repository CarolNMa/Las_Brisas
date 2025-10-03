import React, { useState, useEffect } from "react";
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
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

interface Role {
  id: number;
  name: string;
  description: string;
}

interface RoleFormData {
  id?: number;
  name: string;
  description: string;
}

export default function RolesModule() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    description: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        Alert.alert("Error", "Debes iniciar sesión primero");
        router.replace("/(auth)/login");
        return;
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await api.getRoles();
        setRoles(rolesData);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los roles. Verifica tu conexión y permisos.");
      }
    };
    fetchRoles();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", description: "" });
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setFormData({ name: "", description: "" });
    setModalVisible(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({ id: role.id, name: role.name, description: role.description });
    setModalVisible(true);
  };

  const handleDeleteRole = (role: Role) => {
    Alert.alert(
      "Eliminar Rol",
      `¿Estás seguro de que quieres eliminar el rol "${role.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => performDeleteRole(role.id),
        },
      ]
    );
  };

  const performDeleteRole = async (id: number) => {
    try {
      await api.deleteRole(id);
      Alert.alert("Éxito", "Rol eliminado correctamente");

      // Refresh data
      const rolesData = await api.getRoles();
      setRoles(rolesData);
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el rol");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      if (!editingRole) {
        // Create role
        await api.createRole({ name: formData.name, description: formData.description });
        Alert.alert("Éxito", "Rol creado correctamente");
      } else {
        // Update role - backend doesn't have PUT, so alert
        Alert.alert("Información", "Funcionalidad de actualización no implementada en el backend");
      }

      setModalVisible(false);
      resetForm();

      // Refresh data
      const rolesData = await api.getRoles();
      setRoles(rolesData);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchText.toLowerCase()) ||
    role.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderRole = ({ item }: { item: Role }) => (
    <View style={styles.roleCard}>
      <View style={styles.roleInfo}>
        <Text style={styles.fieldLabel}>ID Rol:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Nombre:</Text>
        <Text style={styles.fieldValue}>{item.name}</Text>

        <Text style={styles.fieldLabel}>Descripción:</Text>
        <Text style={styles.fieldValue}>{item.description}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditRole(item)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteRole(item)}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o descripción..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreateRole}>
          <Text style={styles.createButtonText}>Crear Rol</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRoles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRole}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron roles</Text>
          </View>
        }
      />

      {/* Modal para Crear/Editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingRole ? "Editar Rol" : "Crear Rol"}
            </Text>

            <ScrollView style={styles.form}>
              <Text style={styles.label}>Nombre:</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Ingrese el nombre del rol"
              />

              <Text style={styles.label}>Descripción:</Text>
              <TextInput
                style={styles.input}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Ingrese la descripción del rol"
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {editingRole ? "Actualizar" : "Crear"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 20, flexDirection: "row", alignItems: "center", gap: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  createButton: {
    backgroundColor: "#a50000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  list: { padding: 20 },
  roleCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleInfo: {},
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
  editButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  deleteButton: { backgroundColor: "#dc3545" },
  deleteButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
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
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a50000",
    textAlign: "center",
    marginBottom: 20,
  },
  form: { maxHeight: 300 },
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
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});


