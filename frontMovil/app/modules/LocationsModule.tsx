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

interface Location {
  id: number;
  nameLocation: string;
  address: string;
}

interface LocationFormData {
  nameLocation: string;
  address: string;
}

export default function LocationsModule() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<LocationFormData>({
    nameLocation: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("jwt_token");
      if (!token) {
        Alert.alert("Error", "Debes iniciar sesión primero");
        router.replace("/(auth)/login");
        return;
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await api.getLocations();
        setLocations(locationsData);
      } catch (error) {
        Alert.alert(
          "Error",
          "No se pudieron cargar las ubicaciones. Verifica tu conexión y permisos."
        );
      }
    };
    fetchLocations();
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ nameLocation: "", address: "" });
  }, []);

  const handleCreateLocation = useCallback(() => {
    resetForm();
    setModalVisible(true);
  }, [resetForm]);

  const handleSubmit = useCallback(async () => {
    if (!formData.nameLocation.trim() || !formData.address.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      setSubmitting(true);
      await api.createLocation({
        nameLocation: formData.nameLocation,
        address: formData.address,
      });
      Alert.alert("Éxito", "Ubicación creada correctamente");
      setModalVisible(false);
      resetForm();

      const locationsData = await api.getLocations();
      setLocations(locationsData);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
    } finally {
      setSubmitting(false);
    }
  }, [formData, resetForm]);

  const filteredLocations = locations.filter(
    (location) =>
      (location.nameLocation?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
      (location.address?.toLowerCase() || "").includes(searchText.toLowerCase())
  );

  const renderLocation = ({ item }: { item: Location }) => (
    <View style={styles.locationCard}>
      <View style={styles.locationInfo}>
        <Text style={styles.fieldLabel}>ID Ubicación:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Nombre de Ubicación:</Text>
        <Text style={styles.fieldValue}>{item.nameLocation}</Text>

        <Text style={styles.fieldLabel}>Dirección:</Text>
        <Text style={styles.fieldValue}>{item.address}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o dirección..."
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateLocation}
        >
          <Text style={styles.createButtonText}>Crear Ubicación</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLocation}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron ubicaciones</Text>
          </View>
        }
      />

      {/* Modal Crear Ubicación */}
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
              <Text style={styles.modalTitle}>Crear Ubicación</Text>

              <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
                <Text style={styles.label}>Nombre de Ubicación:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nameLocation}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, nameLocation: text }))
                  }
                  placeholder="Ingrese el nombre de la ubicación"
                  autoCapitalize="words"
                />

                <Text style={styles.label}>Dirección:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData((p) => ({ ...p, address: text }))
                  }
                  placeholder="Ingrese la dirección completa"
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
  locationCard: {
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
  locationInfo: {},
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
  cancelButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  submitButton: { backgroundColor: "#a50000" },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emptyText: { fontSize: 16, color: "#666", textAlign: "center" },
});
