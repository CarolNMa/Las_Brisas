import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import ApiService from "../../services/api";

interface Application {
  id: number;
  dateStart: string;
  dateEnd: string;
  dateCreate: string;
  reason: string;
  documentUrl: string;
  status: string;
  employeeId: number;
  applicationTypeId: number;
  applicationTypeName?: string;

  employee?: {
    id: number;
    firstName: string;
    lastName: string;
    tipoDocumento: string;
    documentNumber: string;
    birthdate: string;
    photoProfile?: string;
    gender: string;
    phone: string;
    email: string;
    civilStatus: string;
    address: string;
    createdAt: string;
    updatedAt: string;
  };
  applicationType?: {
    id: number;
    name: string;
    required: boolean;
  };
}

export default function ApplicationsModule() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [applicationTypes, setApplicationTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsData, employeesData, typesData] = await Promise.all([
        ApiService.getAllApplications(),
        ApiService.getEmployees(),
        ApiService.getAllApplicationTypes()
      ]);
      setApplications(appsData);
      setEmployees(employeesData);
      setApplicationTypes(typesData);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };


  const filteredApplications = applications.filter(application => {
    const employee = employees.find(e => e.id === application.employeeId);
    const appType = applicationTypes.find(t => t.id === application.applicationTypeId);

    return (
      (employee?.firstName?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (employee?.lastName?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      application.reason.toLowerCase().includes(searchText.toLowerCase()) ||
      application.status.toLowerCase().includes(searchText.toLowerCase()) ||
      (application.applicationTypeName?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (appType?.name?.toLowerCase().includes(searchText.toLowerCase()) ?? false)
    );
  });

  const handleApprove = async (id: number) => {
    try {
      await ApiService.approveApplication(id, true);
      Alert.alert("Éxito", "Solicitud aprobada");
      loadData();
    } catch (error) {
      Alert.alert("Error", "No se pudo aprobar la solicitud");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await ApiService.approveApplication(id, false);
      Alert.alert("Éxito", "Solicitud rechazada");
      loadData();
    } catch (error) {
      Alert.alert("Error", "No se pudo rechazar la solicitud");
    }
  };

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderApplication = ({ item }: { item: Application }) => {
    const employee = employees.find(e => e.id === item.employeeId);
    const appType = applicationTypes.find(t => t.id === item.applicationTypeId);

    return (
      <TouchableOpacity
        style={styles.applicationCard}
        onPress={() => {
          setSelectedApplication(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.applicationHeader}>
          <Text style={styles.applicationType}>
            {item.applicationTypeName || appType?.name || `Tipo ${item.applicationTypeId}`}
          </Text>
          <Text style={[styles.status,
            item.status === "Aprobado" ? styles.approved :
            item.status === "Rechazado" ? styles.rejected : styles.pending
          ]}>
            {item.status}
          </Text>
        </View>

        <View style={styles.applicationInfo}>
          <Text style={styles.fieldLabel}>Fecha de Creación:</Text>
          <Text style={styles.fieldValue}>{new Date(item.dateCreate).toLocaleString()}</Text>

          <Text style={styles.fieldLabel}>Empleado:</Text>
          <Text style={styles.fieldValue}>
            {employee?.firstName} {employee?.lastName}
          </Text>

          <Text style={styles.fieldLabel}>Motivo:</Text>
          <Text style={styles.fieldValue} numberOfLines={2}>{item.reason}</Text>
        </View>

        {/* Admin actions */}
        {item.status === "Pendiente" && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprove(item.id)}
            >
              <Text style={styles.actionButtonText}>Aprobar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleReject(item.id)}
            >
              <Text style={styles.actionButtonText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderDetailedView = () => {
    if (!selectedApplication) return null;

    const employee = employees.find(e => e.id === selectedApplication.employeeId);
    const appType = applicationTypes.find(t => t.id === selectedApplication.applicationTypeId);

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles de Solicitud</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Información General</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID:</Text>
              <Text style={styles.detailValue}>{selectedApplication.id}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estado:</Text>
              <Text style={[styles.detailValue, styles.status,
                selectedApplication.status === "Aprobado" ? styles.approved :
                selectedApplication.status === "Rechazado" ? styles.rejected : styles.pending
              ]}>
                {selectedApplication.status}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tipo de Solicitud:</Text>
              <Text style={styles.detailValue}>
                {selectedApplication.applicationTypeName || appType?.name} ({appType?.required ? 'Obligatorio' : 'Opcional'})
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha de Creación:</Text>
              <Text style={styles.detailValue}>{new Date(selectedApplication.dateCreate).toLocaleString()}</Text>
            </View>

            {selectedApplication.dateStart && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fecha de Inicio:</Text>
                <Text style={styles.detailValue}>{new Date(selectedApplication.dateStart).toLocaleDateString()}</Text>
              </View>
            )}

            {selectedApplication.dateEnd && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fecha de Fin:</Text>
                <Text style={styles.detailValue}>{new Date(selectedApplication.dateEnd).toLocaleDateString()}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Motivo:</Text>
              <Text style={styles.detailValue}>{selectedApplication.reason}</Text>
            </View>

            {selectedApplication.documentUrl && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Documento:</Text>
                <Text style={styles.detailValue}>{selectedApplication.documentUrl}</Text>
              </View>
            )}
          </View>

          {employee && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Información del Empleado</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID Empleado:</Text>
                <Text style={styles.detailValue}>{employee.id}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nombre Completo:</Text>
                <Text style={styles.detailValue}>
                  {employee.firstName} {employee.lastName}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tipo Documento:</Text>
                <Text style={styles.detailValue}>{employee.tipoDocumento}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Número Documento:</Text>
                <Text style={styles.detailValue}>{employee.documentNumber}</Text>
              </View>

              {employee.birthdate && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fecha de Nacimiento:</Text>
                  <Text style={styles.detailValue}>{new Date(employee.birthdate).toLocaleDateString()}</Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Género:</Text>
                <Text style={styles.detailValue}>{employee.gender}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Teléfono:</Text>
                <Text style={styles.detailValue}>{employee.phone}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{employee.email}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estado Civil:</Text>
                <Text style={styles.detailValue}>{employee.civilStatus}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dirección:</Text>
                <Text style={styles.detailValue}>{employee.address}</Text>
              </View>

              {employee.photoProfile && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Foto de Perfil:</Text>
                  <Text style={styles.detailValue}>{employee.photoProfile}</Text>
                </View>
              )}

              {employee.createdAt && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fecha de Creación:</Text>
                  <Text style={styles.detailValue}>{new Date(employee.createdAt).toLocaleString()}</Text>
                </View>
              )}

              {employee.updatedAt && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Última Actualización:</Text>
                  <Text style={styles.detailValue}>{new Date(employee.updatedAt).toLocaleString()}</Text>
                </View>
              )}
            </View>
          )}

          {/* Admin actions */}
          {selectedApplication.status === "Pendiente" && (
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.approveButton]}
                onPress={() => {
                  handleApprove(selectedApplication.id);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.actionButtonText}>Aprobar Solicitud</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalActionButton, styles.rejectButton]}
                onPress={() => {
                  handleReject(selectedApplication.id);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.actionButtonText}>Rechazar Solicitud</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#a50000" />
        <Text>Cargando solicitudes...</Text>
      </View>
    );
  }

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

      {renderDetailedView()}
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
  applicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 10,
  },
  applicationType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
    borderRadius: 8,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#2894a7ff",
  },
  rejectButton: {
    backgroundColor: "#dc3545",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  detailSection: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
    gap: 15,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
});

