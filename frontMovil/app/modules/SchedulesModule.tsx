import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import ApiService from "../../services/api";

interface Schedule {
  id: number;
  time_start: string;
  time_end: string;
  shift: "MANANA" | "TARDE" | "NOCHE";
  overtime: string;
  dayWeek: "LUNES" | "MARTES" | "MIERCOLES" | "JUEVES" | "VIERNES" | "SABADO" | "DOMINGO";
}

export default function SchedulesModule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllSchedules();
      setSchedules(data.data || data);
    } catch (error) {
      console.error("Error loading schedules:", error);
      Alert.alert("Error", "No se pudieron cargar los horarios. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSchedules = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return schedules;
    return schedules.filter(schedule =>
      schedule.dayWeek.toLowerCase().includes(q) ||
      schedule.shift.toLowerCase().includes(q) ||
      schedule.time_start.includes(q) ||
      schedule.time_end.includes(q)
    );
  }, [schedules, searchText]);

  const renderSchedule = ({ item }: { item: Schedule }) => (
    <View style={styles.scheduleCard}>
      <View style={styles.scheduleInfo}>
        <Text style={styles.fieldLabel}>ID Horario:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Día de la Semana:</Text>
        <Text style={styles.fieldValue}>{item.dayWeek}</Text>

        <Text style={styles.fieldLabel}>Hora Inicio:</Text>
        <Text style={styles.fieldValue}>{item.time_start}</Text>

        <Text style={styles.fieldLabel}>Hora Fin:</Text>
        <Text style={styles.fieldValue}>{item.time_end}</Text>

        <Text style={styles.fieldLabel}>Turno:</Text>
        <Text style={styles.fieldValue}>{item.shift}</Text>

        <Text style={styles.fieldLabel}>Horas Extra:</Text>
        <Text style={styles.fieldValue}>{item.overtime}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando horarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredSchedules}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderSchedule}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron horarios</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por día, turno o hora..."
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        }
        initialNumToRender={10}
        windowSize={10}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 20 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  list: { padding: 20 },
  scheduleCard: {
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
  scheduleInfo: {},
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
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});