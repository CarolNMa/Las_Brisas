import React, { useState, useMemo, useCallback, useEffect } from "react";
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

interface User {
  idUser: number;
  username: string;
  email: string;
  password?: string;
  status?: "active" | "inactive";
  createdAt?: string;
  resetCode?: string;
  resetCodeExpire?: number; // epoch en ms
  roles?: { id: number; name: string; description: string }[];
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  roleIds: number[];
}

interface Role {
  id: number;
  name: string;
  description: string;
}

export default function UsersModule() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    password: "",
    roleIds: [],
  });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          api.getUsers(),
          api.getRoles(),
        ]);
        setUsers(usersData);
        setRoles(rolesData);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos. Verifica tu conexión y permisos.");
      }
    };
    fetchData();
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ username: "", email: "", password: "", roleIds: [] });
    setShowPass(false);
  }, []);

  const handleCreateUser = useCallback(() => {
    setEditingUser(null);
    resetForm();
    setModalVisible(true);
  }, [resetForm]);

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      roleIds: user.roles ? user.roles.map((r) => r.id) : [],
    });
    setShowPass(false);
    setModalVisible(true);
  }, []);

  const performDeleteUser = useCallback(async (id: number) => {
    try {
      await api.deleteUser(id);
      Alert.alert("Éxito", "Usuario eliminado correctamente");

      // Refresh data
      const usersData = await api.getUsers();
      setUsers(usersData);
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el usuario");
    }
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    Alert.alert(
      "Eliminar Usuario",
      `¿Estás seguro de que quieres eliminar al usuario "${user.username}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => performDeleteUser(user.idUser),
        },
      ]
    );
  }, [performDeleteUser]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = useCallback(async () => {
    const { username, email, password, roleIds } = formData;

    if (!username.trim() || !email.trim()) {
      return Alert.alert("Error", "Usuario y email son obligatorios");
    }
    if (!emailRegex.test(email)) {
      return Alert.alert("Error", "Email inválido");
    }
    // Solo exigir contraseña al crear
    if (!editingUser && (!password.trim() || password.length < 6)) {
      return Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
    }
    if (roleIds.length === 0) {
      return Alert.alert("Error", "Selecciona al menos un rol");
    }

    try {
      setSubmitting(true);

      if (!editingUser) {
        // Create user
        await api.createUser({ username, email, password });
        Alert.alert("Éxito", "Usuario creado correctamente");
      } else {
        // Update user - backend doesn't have PUT, so alert
        Alert.alert("Información", "Funcionalidad de actualización no implementada en el backend");
      }

      setModalVisible(false);
      resetForm();

      // Refresh data
      const [usersData, rolesData] = await Promise.all([
        api.getUsers(),
        api.getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (e) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setSubmitting(false);
    }
  }, [formData, editingUser, resetForm]);

  const filteredUsers = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.roles?.some((r) => r.name.toLowerCase().includes(q)) ?? false)
    );
  }, [users, searchText]);

  const renderUser = useCallback(
    ({ item }: { item: User }) => (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <Text style={styles.fieldLabel}>ID Usuario:</Text>
          <Text style={styles.fieldValue}>{item.idUser}</Text>

          <Text style={styles.fieldLabel}>Usuario:</Text>
          <Text style={styles.fieldValue}>{item.username}</Text>

          <Text style={styles.fieldLabel}>Email:</Text>
          <Text style={styles.fieldValue}>{item.email}</Text>

          <Text style={styles.fieldLabel}>Estado:</Text>
          <Text
            style={[
              styles.status,
              item.status === "active" ? styles.active : styles.inactive,
            ]}
          >
            {item.status === "active" ? "Activo" : "Inactivo"}
          </Text>

          {!!item.createdAt && (
            <>
              <Text style={styles.fieldLabel}>Fecha Creación:</Text>
              <Text style={styles.fieldValue}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </>
          )}

          {!!item.roles?.length && (
            <>
              <Text style={styles.fieldLabel}>Roles:</Text>
              <Text style={styles.fieldValue}>
                {item.roles.map((r) => r.name).join(", ")}
              </Text>
            </>
          )}

          {!!item.resetCode && (
            <>
              <Text style={styles.fieldLabel}>Código Reset:</Text>
              <Text style={styles.fieldValue}>{item.resetCode}</Text>
            </>
          )}

          {!!item.resetCodeExpire && (
            <>
              <Text style={styles.fieldLabel}>Expiración Reset:</Text>
              <Text style={styles.fieldValue}>
                {new Date(item.resetCodeExpire).toLocaleString()}
              </Text>
            </>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditUser(item)}
            accessibilityRole="button"
            accessibilityLabel={`Editar usuario ${item.username}`}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteUser(item)}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar usuario ${item.username}`}
          >
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleEditUser, handleDeleteUser]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => String(item.idUser)}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por usuario, email o rol..."
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateUser}
              accessibilityRole="button"
              accessibilityLabel="Crear Usuario"
            >
              <Text style={styles.createButtonText}>Crear Usuario</Text>
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
                {editingUser ? "Editar Usuario" : "Crear Usuario"}
              </Text>

              <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Usuario:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.username}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, username: text }))
                  }
                  placeholder="Ingrese el nombre de usuario"
                  autoCapitalize="none"
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

                <Text style={styles.label}>Contraseña:</Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    style={[styles.input, { paddingRight: 48 }]}
                    value={formData.password}
                    onChangeText={(text) =>
                      setFormData((p) => ({ ...p, password: text }))
                    }
                    placeholder={
                      editingUser
                        ? "Deja en blanco para no cambiar"
                        : "Ingrese la contraseña"
                    }
                    secureTextEntry={!showPass}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPass((v) => !v)}
                    style={{ position: "absolute", right: 12, top: 12, padding: 4 }}
                    accessibilityRole="button"
                    accessibilityLabel={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {showPass ? "🙈" : "👁️"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Roles:</Text>
                {roles.length === 0 ? (
                  <Text style={{ color: "#666", marginBottom: 8 }}>
                    No hay roles cargados.
                  </Text>
                ) : (
                  roles.map((role) => {
                    const selected = formData.roleIds.includes(role.id);
                    return (
                      <TouchableOpacity
                        key={role.id}
                        style={styles.roleOption}
                        onPress={() => {
                          const newRoleIds = selected
                            ? formData.roleIds.filter((id) => id !== role.id)
                            : [...formData.roleIds, role.id];
                          setFormData((p) => ({ ...p, roleIds: newRoleIds }));
                        }}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        accessibilityLabel={`Rol ${role.name}`}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            selected && styles.checkboxSelected,
                          ]}
                        >
                          {selected && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <View style={styles.roleInfo}>
                          <Text style={styles.roleName}>{role.name}</Text>
                          {!!role.description && (
                            <Text style={styles.roleDescription}>
                              {role.description}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
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
                  accessibilityLabel={editingUser ? "Actualizar" : "Crear"}
                >
                  <Text style={styles.submitButtonText}>
                    {submitting
                      ? "Guardando..."
                      : editingUser
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
  userCard: {
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
  userInfo: {},
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
  status: {
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  active: { backgroundColor: "#d4edda", color: "#155724" },
  inactive: { backgroundColor: "#f8d7da", color: "#721c24" },
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
  form: { maxHeight: 360 },
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
  emptyText: { fontSize: 16, color: "#666", textAlign: "center" },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: "#a50000",
    borderColor: "#a50000",
  },
  checkmark: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  roleInfo: { flex: 1 },
  roleName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  roleDescription: { fontSize: 14, color: "#666", marginTop: 2 },
});
