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

interface Position {
  id: number;
  namePost: string;
  description: string;
  jobFunction: string;
  requirements: string;
}

interface PositionFormData {
  namePost: string;
  description: string;
  jobFunction: string;
  requirements: string;
}

export default function PositionsModule() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<PositionFormData>({
    namePost: "",
    description: "",
    jobFunction: "",
    requirements: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 🔐 Verificación de autenticación
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

  // 🔄 Cargar posiciones
  useEffect(() => {
    if (isAuthenticated === true) {
      const fetchPositions = async () => {
        try {
          const positionsData = await api.getPositions();
          setPositions(positionsData);
        } catch (error) {
          Alert.alert(
            "Error",
            "No se pudieron cargar las posiciones. Verifica tu conexión y permisos."
          );
        }
      };
      fetchPositions();
    }
  }, [isAuthenticated]);

  const resetForm = useCallback(() => {
    setFormData({
      namePost: "",
      description: "",
      jobFunction: "",
      requirements: "",
    });
  }, []);

  const handleCreatePosition = useCallback(() => {
    resetForm();
    setModalVisible(true);
  }, [resetForm]);

  const handleSubmit = useCallback(async () => {
    if (!formData.namePost.trim() || !formData.description.trim()) {
      Alert.alert("Error", "Los campos nombre y descripción son obligatorios");
      return;
    }

    try {
      setSubmitting(true);
      await api.createPosition(formData);
      Alert.alert("Éxito", "Posición creada correctamente");
      setModalVisible(false);
      resetForm();

      const positionsData = await api.getPositions();
      setPositions(positionsData);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setSubmitting(false);
    }
  }, [formData, resetForm]);

  const filteredPositions = positions.filter(
    (position) =>
      (position.namePost?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (position.description?.toLowerCase() || "").includes(searchText.toLowerCase())
  );

  const renderPosition = ({ item }: { item: Position }) => (
    <View style={styles.positionCard}>
      <View style={styles.positionInfo}>
        <Text style={styles.fieldLabel}>ID Posición:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Nombre del Cargo:</Text>
        <Text style={styles.fieldValue}>{item.namePost}</Text>

        <Text style={styles.fieldLabel}>Descripción:</Text>
        <Text style={styles.fieldValue}>{item.description}</Text>

        <Text style={styles.fieldLabel}>Función del Trabajo:</Text>
        <Text style={styles.fieldValue}>{item.jobFunction}</Text>

        <Text style={styles.fieldLabel}>Requisitos:</Text>
        <Text style={styles.fieldValue}>{item.requirements}</Text>
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
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePosition}
        >
          <Text style={styles.createButtonText}>Crear Posición</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPositions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPosition}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron posiciones</Text>
          </View>
        }
      />

      {/* Modal para crear posición */}
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
              <Text style={styles.modalTitle}>Crear Posición</Text>

              <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Nombre del Cargo:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.namePost}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, namePost: text }))
                  }
                  placeholder="Ingrese el nombre del cargo"
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, description: text }))
                  }
                  placeholder="Ingrese la descripción del cargo"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />

                <Text style={styles.label}>Función del Trabajo:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.jobFunction}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, jobFunction: text }))
                  }
                  placeholder="Describa las funciones del cargo"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Text style={styles.label}>Requisitos:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.requirements}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, requirements: text }))
                  }
                  placeholder="Ingrese los requisitos del cargo"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
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
  positionCard: {
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
  positionInfo: {},
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
