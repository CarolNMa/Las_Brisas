import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
  Modal,
  Switch,
  ActivityIndicator,
} from "react-native";
import ApiService from "../../services/api";

interface ApplicationType {
  id: number;
  name: string;
  required: boolean;
}

export default function ApplicationTypesModule() {
  const [applicationTypes, setApplicationTypes] = useState<ApplicationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name: "", required: false });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllApplicationTypes();

      if (Array.isArray(data)) {
        const cleanData = data.map((item) => ({
          id: item?.id ?? 0,
          name: item?.name ?? "Sin nombre",
          required: !!item?.required,
        }));
        setApplicationTypes(cleanData);
      } else {
        console.error("Respuesta inesperada del backend:", data);
        setApplicationTypes([]);
      }
    } catch (err) {
      console.error("Error cargando tipos de solicitud:", err);
      Alert.alert("Error", "Error al cargar los tipos de solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name || form.name.trim().length < 3) {
      newErrors.name = "El nombre es obligatorio y debe tener al menos 3 caracteres.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const newType = await ApiService.createApplicationType(form);
      setApplicationTypes((prev) => [...prev, newType]);
      setModalVisible(false);
      setForm({ name: "", required: false });
      Alert.alert("Éxito", "Tipo de solicitud creado correctamente");
    } catch (err) {
      console.error("Error guardando tipo:", err);
      Alert.alert("Error", "Error al guardar tipo de solicitud");
    }
  };

  const filteredApplicationTypes = applicationTypes.filter((type) =>
    (type?.name?.toLowerCase() || "").includes(searchText.toLowerCase())
  );

  const renderApplicationType = ({ item }: { item: ApplicationType }) => (
    <View style={styles.applicationTypeCard}>
      <View style={styles.applicationTypeInfo}>
        <Text style={styles.fieldLabel}>Nombre:</Text>
        <Text style={styles.fieldValue}>{item.name || "Sin nombre"}</Text>

        <Text style={styles.fieldLabel}>Requiere Documento:</Text>
        <Text style={[styles.required, item.required ? styles.yes : styles.no]}>
          {item.required ? "Sí" : "No"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#a50000" />
        <Text style={{ marginTop: 10 }}>Cargando tipos de solicitud...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerActions}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
          <Text style={styles.btnText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredApplicationTypes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderApplicationType}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron tipos de solicitud</Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Tipo de Solicitud</Text>

            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Nombre"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Requiere documento adjunto</Text>
              <Switch
                value={form.required}
                onValueChange={(value) => setForm({ ...form, required: value })}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.btnSmall, styles.btnAlt]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSmall} onPress={handleSave}>
                <Text style={styles.btnText}>Guardar</Text>
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
  },
  btn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  list: { padding: 20 },
  applicationTypeCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  applicationTypeInfo: { marginBottom: 10 },
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
  required: {
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  yes: { backgroundColor: "#d4edda", color: "#155724" },
  no: { backgroundColor: "#f8d7da", color: "#721c24" },
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: { fontSize: 16, marginRight: 10 },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  btnSmall: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 70,
    alignItems: "center",
  },
  btnAlt: { backgroundColor: "#6c757d" },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
