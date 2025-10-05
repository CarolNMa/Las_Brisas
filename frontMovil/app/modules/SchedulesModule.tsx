import React, { useEffect, useState, useMemo } from "react";
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
import { Picker } from "@react-native-picker/picker";
import ApiService from "../../services/api";

interface Schedule {
  id: number;
  time_start: string;
  time_end: string;
  shift: "MANANA" | "TARDE" | "NOCHE";
  overtime: string;
  dayWeek: "LUNES" | "MARTES" | "MIERCOLES" | "JUEVES" | "VIERNES" | "SABADO" | "DOMINGO";
}

const initialForm: Omit<Schedule, 'id'> = {
  time_start: "08:00",
  time_end: "12:00",
  shift: "MANANA",
  overtime: "00:00",
  dayWeek: "LUNES",
};

export default function SchedulesModule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form, setForm] = useState<Omit<Schedule, 'id'>>(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // filtros
  const [qDay, setQDay] = useState("");
  const [qShift, setQShift] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllSchedules();
      setSchedules(data.data || data);
    } catch (err) {
      console.error("Error cargando horarios:", err);
      Alert.alert("Error", "No se pudieron cargar los horarios");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return (schedules || []).filter(
      (it) =>
        (qDay ? it.dayWeek === qDay : true) &&
        (qShift ? it.shift === qShift : true)
    );
  }, [schedules, qDay, qShift]);

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Seguro que deseas eliminar este horario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await ApiService.deleteSchedule(id);
              setSchedules(schedules.filter((s) => s.id !== id));
            } catch (err) {
              console.error("Error eliminando horario:", err);
              Alert.alert("Error", "Error al eliminar horario");
            }
          },
        },
      ]
    );
  };

  const handleOpenModal = (schedule: Schedule | null = null) => {
    setEditingSchedule(schedule);
    setForm(
      schedule || {
        time_start: "08:00",
        time_end: "12:00",
        shift: "MANANA",
        overtime: "00:00",
        dayWeek: "LUNES",
      }
    );
    setErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (form.time_start >= form.time_end) {
      newErrors.time_start = "La hora de inicio debe ser menor que la hora fin.";
    }
    if (!form.dayWeek) {
      newErrors.dayWeek = "El día de la semana es obligatorio.";
    }
    if (!form.shift) {
      newErrors.shift = "El turno es obligatorio.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (editingSchedule) {
        await ApiService.updateSchedule(editingSchedule.id, form);
        setSchedules(
          schedules.map((s) =>
            s.id === editingSchedule.id ? { ...s, ...form } : s
          )
        );
      } else {
        const newSchedule = await ApiService.createSchedule(form);
        setSchedules([...schedules, newSchedule]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Error guardando horario:", err);
      Alert.alert("Error", "Error al guardar horario");
    }
  };

  if (loading) return <Text style={styles.loading}>Cargando horarios...</Text>;

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Horarios</Text>
        <TouchableOpacity style={styles.btn} onPress={() => handleOpenModal()}>
          <Text style={styles.btnText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={qDay}
            onValueChange={(value) => setQDay(value)}
            style={styles.picker}
          >
            <Picker.Item label="Todos los días" value="" />
            {[
              "LUNES",
              "MARTES",
              "MIERCOLES",
              "JUEVES",
              "VIERNES",
              "SABADO",
              "DOMINGO",
            ].map((d) => (
              <Picker.Item key={d} label={d} value={d} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={qShift}
            onValueChange={(value) => setQShift(value)}
            style={styles.picker}
          >
            <Picker.Item label="Todos los turnos" value="" />
            {["MANANA", "TARDE", "NOCHE"].map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Tabla */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleInfo}>
              <Text style={styles.fieldLabel}>Día:</Text>
              <Text style={styles.fieldValue}>{item.dayWeek}</Text>

              <Text style={styles.fieldLabel}>Inicio:</Text>
              <Text style={styles.fieldValue}>{item.time_start}</Text>

              <Text style={styles.fieldLabel}>Fin:</Text>
              <Text style={styles.fieldValue}>{item.time_end}</Text>

              <Text style={styles.fieldLabel}>Turno:</Text>
              <Text style={styles.fieldValue}>{item.shift}</Text>

              <Text style={styles.fieldLabel}>Extra:</Text>
              <Text style={styles.fieldValue}>{item.overtime}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btnSmall, styles.editBtn]}
                onPress={() => handleOpenModal(item)}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnSmall, styles.deleteBtn]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.btnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron horarios</Text>
        }
      />

      {/* Modal */}
      <Modal
        visible={modalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingSchedule ? "Editar Horario" : "Nuevo Horario"}
            </Text>

            <Text style={styles.label}>Día:</Text>
            <View style={[styles.pickerContainer, errors.dayWeek && styles.inputError]}>
              <Picker
                selectedValue={form.dayWeek}
                onValueChange={(value) => setForm({ ...form, dayWeek: value })}
                style={styles.picker}
              >
                {[
                  "LUNES",
                  "MARTES",
                  "MIERCOLES",
                  "JUEVES",
                  "VIERNES",
                  "SABADO",
                  "DOMINGO",
                ].map((d) => (
                  <Picker.Item key={d} label={d} value={d} />
                ))}
              </Picker>
            </View>
            {errors.dayWeek && <Text style={styles.errorText}>{errors.dayWeek}</Text>}

            <Text style={styles.label}>Hora inicio (HH:MM):</Text>
            <TextInput
              style={[styles.input, errors.time_start && styles.inputError]}
              value={form.time_start}
              onChangeText={(value) => setForm({ ...form, time_start: value })}
              placeholder="08:00"
            />
            {errors.time_start && <Text style={styles.errorText}>{errors.time_start}</Text>}

            <Text style={styles.label}>Hora fin (HH:MM):</Text>
            <TextInput
              style={styles.input}
              value={form.time_end}
              onChangeText={(value) => setForm({ ...form, time_end: value })}
              placeholder="12:00"
            />

            <Text style={styles.label}>Turno:</Text>
            <View style={[styles.pickerContainer, errors.shift && styles.inputError]}>
              <Picker
                selectedValue={form.shift}
                onValueChange={(value) => setForm({ ...form, shift: value })}
                style={styles.picker}
              >
                {["MANANA", "TARDE", "NOCHE"].map((s) => (
                  <Picker.Item key={s} label={s} value={s} />
                ))}
              </Picker>
            </View>
            {errors.shift && <Text style={styles.errorText}>{errors.shift}</Text>}

            <Text style={styles.label}>Horas extra (HH:MM):</Text>
            <TextInput
              style={styles.input}
              value={form.overtime}
              onChangeText={(value) => setForm({ ...form, overtime: value })}
              placeholder="00:00"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.btnSmall, styles.cancelBtn]}
                onPress={() => setModalOpen(false)}
              >
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
  container: { flex: 1, padding: 20 },
  loading: { textAlign: "center", fontSize: 16, marginTop: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#a50000" },
  btn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  filters: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: { height: 50 },
  scheduleCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  scheduleInfo: {},
  fieldLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginTop: 8,
    textTransform: "uppercase",
  },
  fieldValue: { fontSize: 16, color: "#333", marginBottom: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  btnSmall: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  editBtn: { backgroundColor: "#007bff" },
  deleteBtn: { backgroundColor: "#dc3545" },
  emptyText: { textAlign: "center", fontSize: 16, color: "#666", marginTop: 20 },
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginBottom: 10 },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: { backgroundColor: "#6c757d" },
});