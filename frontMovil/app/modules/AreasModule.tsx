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

interface Area {
  id: number;
  name: string;
  description: string;
}

interface AreaFormData {
  id?: number;
  name: string;
  description: string;
}

export default function AreasModule() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState<AreaFormData>({
    name: "",
    description: "",
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
      const fetchAreas = async () => {
        try {
          const areasData = await api.getAreas();
          setAreas(areasData);
        } catch (error) {
          Alert.alert("Error", "No se pudieron cargar las áreas. Verifica tu conexión y permisos.");
        }
      };
      fetchAreas();
    }
  }, [isAuthenticated]);

  const resetForm = useCallback(() => {
    setFormData({ name: "", description: "" });
  }, []);

  const handleCreateArea = useCallback(() => {
    setEditingArea(null);
    resetForm();
    setModalVisible(true);
  }, [resetForm]);

  const handleEditArea = useCallback((area: Area) => {
    setEditingArea(area);
    setFormData({ id: area.id, name: area.name, description: area.description });
    setModalVisible(true);
  }, []);

  const handleDeleteArea = useCallback((area: Area) => {
    Alert.alert(
      "Eliminar Área",
      `¿Estás seguro de que quieres eliminar el área "${area.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => performDeleteArea(area.id),
        },
      ]
    );
  }, []);

  const performDeleteArea = useCallback(async (id: number) => {
    try {
      await api.deleteArea(id);
      Alert.alert("Éxito", "Área eliminada correctamente");

      // Refresh data
      const areasData = await api.getAreas();
      setAreas(areasData);
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el área");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      setSubmitting(true);

      if (!editingArea) {
        // Create area
        await api.createArea({ name: formData.name, description: formData.description });
        Alert.alert("Éxito", "Área creada correctamente");
      } else {
        // Update area - backend doesn't have PUT, so alert
        Alert.alert("Información", "Funcionalidad de actualización no implementada en el backend");
      }

      setModalVisible(false);
      resetForm();

      // Refresh data
      const areasData = await api.getAreas();
      setAreas(areasData);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setSubmitting(false);
    }
  }, [formData, editingArea, resetForm]);

  const filteredAreas = areas.filter(area =>
    (area.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (area.description?.toLowerCase() || '').includes(searchText.toLowerCase())
  );

  const renderArea = useCallback(
    ({ item }: { item: Area }) => (
      <View style={styles.areaCard}>
        <View style={styles.areaInfo}>
          <Text style={styles.fieldLabel}>ID Área:</Text>
          <Text style={styles.fieldValue}>{item.id}</Text>

          <Text style={styles.fieldLabel}>Nombre del Área:</Text>
          <Text style={styles.fieldValue}>{item.name || 'Sin nombre'}</Text>

          <Text style={styles.fieldLabel}>Descripción:</Text>
          <Text style={styles.fieldValue}>{item.description || 'Sin descripción'}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditArea(item)}
            accessibilityRole="button"
            accessibilityLabel={`Editar área ${item.name}`}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteArea(item)}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar área ${item.name}`}
          >
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [handleEditArea, handleDeleteArea]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAreas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArea}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron áreas</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o descripción..."
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateArea}
              accessibilityRole="button"
              accessibilityLabel="Crear Área"
            >
              <Text style={styles.createButtonText}>Crear Área</Text>
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
                {editingArea ? "Editar Área" : "Crear Área"}
              </Text>

              <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, name: text }))
                  }
                  placeholder="Ingrese el nombre del área"
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, description: text }))
                  }
                  placeholder="Ingrese la descripción del área"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
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
                  accessibilityLabel={editingArea ? "Actualizar" : "Crear"}
                >
                  <Text style={styles.submitButtonText}>
                    {submitting
                      ? "Guardando..."
                      : editingArea
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
  areaCard: {
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
  areaInfo: {},
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
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

