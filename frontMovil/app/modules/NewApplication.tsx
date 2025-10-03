import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ApiService from "../../services/api";

interface ApplicationType {
  id: number;
  name: string;
  required: boolean;
}

export default function NewApplication({ navigation }: any) {
  const [form, setForm] = useState({
    applicationTypeId: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [applicationTypes, setApplicationTypes] = useState<ApplicationType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const data = await ApiService.getAllApplicationTypes();
      setApplicationTypes(data);
    } catch (err) {
      console.error("Error cargando tipos de solicitud:", err);
      Alert.alert("Error", "Error al cargar tipos de solicitud");
    } finally {
      setLoadingTypes(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.applicationTypeId) {
      newErrors.applicationTypeId = "Debe seleccionar un tipo de solicitud.";
    }

    if (!form.description || form.description.trim().length < 10) {
      newErrors.description = "La descripción es obligatoria y debe tener al menos 10 caracteres.";
    }

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.startDate = "La fecha de inicio no puede ser anterior a hoy.";
      }

      if (end <= start) {
        newErrors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Por favor, corrige los errores en el formulario.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("applicationTypeid", form.applicationTypeId);
      formData.append("reason", form.description);
      if (form.startDate) formData.append("dateStart", `${form.startDate}T00:00:00`);
      if (form.endDate) formData.append("dateEnd", `${form.endDate}T00:00:00`);

      await ApiService.createApplication(formData);

      Alert.alert("Éxito", "Solicitud enviada correctamente", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error("Error creando solicitud:", err);
      Alert.alert("Error", "Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nueva Solicitud</Text>

      <View style={styles.form}>
        {/* Tipo */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de Solicitud</Text>
          {loadingTypes ? (
            <ActivityIndicator size="small" color="#a50000" />
          ) : (
            <View style={[styles.pickerContainer, errors.applicationTypeId && styles.errorBorder]}>
              <Picker
                selectedValue={form.applicationTypeId}
                onValueChange={(value) => handleChange("applicationTypeId", value)}
                style={styles.picker}
              >
                <Picker.Item label="-- Seleccionar --" value="" />
                {applicationTypes.map((type) => (
                  <Picker.Item key={type.id} label={type.name} value={type.id.toString()} />
                ))}
              </Picker>
            </View>
          )}
          {errors.applicationTypeId && <Text style={styles.errorText}>{errors.applicationTypeId}</Text>}
        </View>

        {/* Descripción */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.errorBorder]}
            value={form.description}
            onChangeText={(value) => handleChange("description", value)}
            placeholder="Describe el motivo de tu solicitud..."
            multiline
            numberOfLines={4}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Fechas */}
        <View style={styles.formRow}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Fecha Inicio</Text>
            <TextInput
              style={[styles.input, errors.startDate && styles.errorBorder]}
              value={form.startDate}
              onChangeText={(value) => handleChange("startDate", value)}
              placeholder="YYYY-MM-DD"
            />
            {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Fecha Fin</Text>
            <TextInput
              style={[styles.input, errors.endDate && styles.errorBorder]}
              value={form.endDate}
              onChangeText={(value) => handleChange("endDate", value)}
              placeholder="YYYY-MM-DD"
            />
            {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enviar Solicitud</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 20,
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  errorBorder: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#dc3545",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});