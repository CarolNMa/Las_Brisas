import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

interface Application {
  id: number;
  dateStart: string;
  dateEnd: string;
  dateCreate: string;
  reason: string;
  documentUrl: string;
  status: "Pendiente" | "Aprobado" | "Rechazado";
  employeeId: number;
  employeeName: string;
  applicationTypeId: number;
  applicationTypeName: string;
}

export default function ApplicationsModule() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      dateStart: "2024-06-01",
      dateEnd: "2024-06-05",
      dateCreate: "2024-05-28T10:30:00Z",
      reason: "Vacaciones familiares",
      documentUrl: "/applications/vacaciones_juan.pdf",
      status: "Aprobado",
      employeeId: 1,
      employeeName: "Juan García",
      applicationTypeId: 1,
      applicationTypeName: "Vacaciones",
    },
    {
      id: 2,
      dateStart: "2024-07-15",
      dateEnd: "2024-07-16",
      dateCreate: "2024-07-10T14:20:00Z",
      reason: "Cita médica",
      documentUrl: "/applications/cita_medica_maria.pdf",
      status: "Pendiente",
      employeeId: 2,
      employeeName: "María Rodríguez",
      applicationTypeId: 2,
      applicationTypeName: "Permiso Médico",
    },
    {
      id: 3,
      dateStart: "2024-08-01",
      dateEnd: "2024-08-31",
      dateCreate: "2024-07-25T09:15:00Z",
      reason: "Licencia de maternidad",
      documentUrl: "/applications/maternidad_ana.pdf",
      status: "Aprobado",
      employeeId: 4,
      employeeName: "Ana López",
      applicationTypeId: 3,
      applicationTypeName: "Licencia de Maternidad",
    },
    {
      id: 4,
      dateStart: "2024-09-10",
      dateEnd: "2024-09-12",
      dateCreate: "2024-09-05T16:45:00Z",
      reason: "Capacitación externa",
      documentUrl: "/applications/capacitacion_carlos.pdf",
      status: "Rechazado",
      employeeId: 3,
      employeeName: "Carlos Martínez",
      applicationTypeId: 4,
      applicationTypeName: "Permiso de Capacitación",
    },
  ]);
  const [searchText, setSearchText] = useState("");

  const filteredApplications = applications.filter(application =>
    application.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
    application.reason.toLowerCase().includes(searchText.toLowerCase()) ||
    application.status.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderApplication = ({ item }: { item: Application }) => (
    <View style={styles.applicationCard}>
      <View style={styles.applicationInfo}>
        <Text style={styles.fieldLabel}>ID Solicitud:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Fecha Inicio:</Text>
        <Text style={styles.fieldValue}>{new Date(item.dateStart).toLocaleDateString()}</Text>

        <Text style={styles.fieldLabel}>Fecha Fin:</Text>
        <Text style={styles.fieldValue}>{new Date(item.dateEnd).toLocaleDateString()}</Text>

        <Text style={styles.fieldLabel}>Fecha Creación:</Text>
        <Text style={styles.fieldValue}>{new Date(item.dateCreate).toLocaleString()}</Text>

        <Text style={styles.fieldLabel}>Motivo:</Text>
        <Text style={styles.fieldValue}>{item.reason}</Text>

        <Text style={styles.fieldLabel}>Documento URL:</Text>
        <Text style={styles.fieldValue}>{item.documentUrl}</Text>

        <Text style={styles.fieldLabel}>Estado:</Text>
        <Text style={[styles.status,
          item.status === "Aprobado" ? styles.approved :
          item.status === "Rechazado" ? styles.rejected : styles.pending
        ]}>
          {item.status}
        </Text>

        <Text style={styles.fieldLabel}>ID Empleado:</Text>
        <Text style={styles.fieldValue}>{item.employeeId}</Text>

        <Text style={styles.fieldLabel}>Nombre Empleado:</Text>
        <Text style={styles.fieldValue}>{item.employeeName}</Text>

        <Text style={styles.fieldLabel}>ID Tipo Solicitud:</Text>
        <Text style={styles.fieldValue}>{item.applicationTypeId}</Text>

        <Text style={styles.fieldLabel}>Tipo Solicitud:</Text>
        <Text style={styles.fieldValue}>{item.applicationTypeName}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por empleado, motivo o estado..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredApplications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderApplication}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron solicitudes</Text>
          </View>
        }
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
  applicationCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  applicationInfo: {},
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
  approved: { backgroundColor: "#d4edda", color: "#155724" },
  rejected: { backgroundColor: "#f8d7da", color: "#721c24" },
  pending: { backgroundColor: "#fff3cd", color: "#856404" },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

