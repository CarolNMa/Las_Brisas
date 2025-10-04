import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../services/api";

interface Contract {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  fechaRenovacion?: string;
  documentoUrl?: string;
  type: "practicas" | "temporal" | "permanente";
  status: "activo" | "expirado" | "terminado";
  employeeId: number;
  employeeName: string;
}

export default function ContractsModule() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState({
    employee: "",
    dateStart: "",
    dateEnd: "",
    type: "practicas",
    status: "activo",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfUri, setPdfUri] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch contracts and employees
      const [contractsResponse, employeesResponse] = await Promise.all([
        api.getAllContracts(),
        api.getEmployees(),
      ]);

      setEmployees(employeesResponse);

      // Create employee name map
      const employeeMap = employeesResponse.reduce((map: { [key: number]: string }, emp: any) => {
        map[emp.id] = `${emp.firstName} ${emp.lastName}`;
        return map;
      }, {});

      // Transform contract data to match interface
      const transformedContracts: Contract[] = contractsResponse.map((contract: any) => ({
        id: contract.id,
        fechaInicio: contract.dateStart,
        fechaFin: contract.dateEnd,
        fechaRenovacion: contract.dateUpdate,
        documentoUrl: contract.documentUrl,
        type: contract.type as "practicas" | "temporal" | "permanente",
        status: contract.status as "activo" | "expirado" | "terminado",
        employeeId: contract.employee,
        employeeName: employeeMap[contract.employee] || "Empleado desconocido",
      }));

      setContracts(transformedContracts);
    } catch (err) {
      console.error("Error cargando datos:", err);
      Alert.alert("Error", "Error al cargar contratos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Seguro que deseas eliminar este contrato?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deleteContract(id);
              setContracts(contracts.filter((c) => c.id !== id));
            } catch (err) {
              console.error("Error eliminando contrato:", err);
              Alert.alert("Error", "Error al eliminar contrato");
            }
          },
        },
      ]
    );
  };

  const handleOpenModal = (contract: Contract | null = null) => {
    setEditingContract(contract);
    setForm(
      contract
        ? {
            employee: contract.employeeId.toString(),
            dateStart: contract.fechaInicio,
            dateEnd: contract.fechaFin,
            type: contract.type,
            status: contract.status,
          }
        : { employee: "", dateStart: "", dateEnd: "", type: "practicas", status: "activo" }
    );
    setErrors({});
    setModalVisible(true);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.employee || isNaN(parseInt(form.employee, 10))) {
      newErrors.employee = "Debe seleccionar un empleado válido.";
    }

    if (!form.dateStart) {
      newErrors.dateStart = "La fecha de inicio es obligatoria.";
    }

    if (!form.dateEnd) {
      newErrors.dateEnd = "La fecha de fin es obligatoria.";
    }

    if (form.dateStart && form.dateEnd && new Date(form.dateStart) >= new Date(form.dateEnd)) {
      newErrors.dateEnd = "La fecha de fin debe ser posterior a la fecha de inicio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const contractData = {
        employee: parseInt(form.employee, 10),
        dateStart: form.dateStart,
        dateEnd: form.dateEnd,
        type: form.type as "practicas" | "temporal" | "permanente",
        status: form.status as "activo" | "expirado" | "terminado",
      };

      if (editingContract) {
        await api.updateContract(editingContract.id, contractData);
        setContracts(contracts.map((c) =>
          c.id === editingContract.id ? { ...c, fechaInicio: contractData.dateStart, fechaFin: contractData.dateEnd, type: contractData.type, status: contractData.status, employeeId: contractData.employee } : c
        ));
      } else {
        await api.createContract(new FormData()); // For now, create without document
        await loadData(); // Reload to get the new contract
      }
      setModalVisible(false);
    } catch (err) {
      console.error("Error guardando contrato:", err);
      Alert.alert("Error", "Error al guardar contrato");
    }
  };

  const handleViewPdf = async (documentoUrl: string) => {
    try {
      // Extract filename from URL
      const filename = documentoUrl.split('/').pop();
      if (filename) {
        // For mobile, we'll open the PDF in the device's default viewer
        const pdfUrl = `http://localhost:8085/api/v1/contracts/download/${filename}`;
        const supported = await Linking.canOpenURL(pdfUrl);

        if (supported) {
          await Linking.openURL(pdfUrl);
        } else {
          Alert.alert("Error", "No se puede abrir el documento PDF");
        }
      }
    } catch (err) {
      console.error("Error abriendo PDF:", err);
      Alert.alert("Error", "Error al abrir el documento PDF");
    }
  };

  const filteredContracts = contracts.filter(contract =>
    contract.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
    contract.type.toLowerCase().includes(searchText.toLowerCase()) ||
    contract.status.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderContract = ({ item }: { item: Contract }) => (
    <View style={styles.contractCard}>
      <View style={styles.contractInfo}>
        <Text style={styles.fieldLabel}>ID Contrato:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Fecha Inicio:</Text>
        <Text style={styles.fieldValue}>{new Date(item.fechaInicio).toLocaleDateString()}</Text>

        <Text style={styles.fieldLabel}>Fecha Fin:</Text>
        <Text style={styles.fieldValue}>{new Date(item.fechaFin).toLocaleDateString()}</Text>

        {item.fechaRenovacion && (
          <>
            <Text style={styles.fieldLabel}>Fecha Renovación:</Text>
            <Text style={styles.fieldValue}>{new Date(item.fechaRenovacion).toLocaleDateString()}</Text>
          </>
        )}

        {item.documentoUrl && (
          <>
            <Text style={styles.fieldLabel}>Documento:</Text>
            <TouchableOpacity onPress={() => handleViewPdf(item.documentoUrl!)}>
              <Text style={[styles.fieldValue, styles.link]}>Ver PDF</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.fieldLabel}>Tipo:</Text>
        <Text style={styles.fieldValue}>
          {item.type === "practicas" ? "Prácticas" :
           item.type === "temporal" ? "Temporal" : "Permanente"}
        </Text>

        <Text style={styles.fieldLabel}>Estado:</Text>
        <Text style={[styles.status,
          item.status === "activo" ? styles.active :
          item.status === "expirado" ? styles.expired : styles.terminated
        ]}>
          {item.status === "activo" ? "Activo" :
           item.status === "expirado" ? "Expirado" : "Terminado"}
        </Text>

        <Text style={styles.fieldLabel}>ID Empleado:</Text>
        <Text style={styles.fieldValue}>{item.employeeId}</Text>

        <Text style={styles.fieldLabel}>Nombre Empleado:</Text>
        <Text style={styles.fieldValue}>{item.employeeName}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnSmall} onPress={() => handleOpenModal(item)}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btnSmall, styles.btnAlt]} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando contratos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerActions}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por empleado, tipo o estado..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.btn} onPress={() => handleOpenModal()}>
          <Text style={styles.btnText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredContracts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderContract}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No se encontraron contratos</Text>
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
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingContract ? "Editar Contrato" : "Nuevo Contrato"}
            </Text>

            <Text style={styles.label}>Empleado:</Text>
            <View style={[styles.pickerContainer, errors.employee && styles.inputError]}>
              <Picker
                selectedValue={form.employee}
                onValueChange={(value) => setForm({ ...form, employee: value })}
                style={styles.picker}
              >
                <Picker.Item label="-- Selecciona un empleado --" value="" />
                {employees.map((emp) => (
                  <Picker.Item key={emp.id} label={`${emp.firstName} ${emp.lastName}`} value={emp.id.toString()} />
                ))}
              </Picker>
            </View>
            {errors.employee && <Text style={styles.errorText}>{errors.employee}</Text>}

            <Text style={styles.label}>Fecha Inicio:</Text>
            <TextInput
              style={[styles.input, errors.dateStart && styles.inputError]}
              placeholder="YYYY-MM-DD"
              value={form.dateStart}
              onChangeText={(text) => setForm({ ...form, dateStart: text })}
            />
            {errors.dateStart && <Text style={styles.errorText}>{errors.dateStart}</Text>}

            <Text style={styles.label}>Fecha Fin:</Text>
            <TextInput
              style={[styles.input, errors.dateEnd && styles.inputError]}
              placeholder="YYYY-MM-DD"
              value={form.dateEnd}
              onChangeText={(text) => setForm({ ...form, dateEnd: text })}
            />
            {errors.dateEnd && <Text style={styles.errorText}>{errors.dateEnd}</Text>}

            <Text style={styles.label}>Tipo:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.type}
                onValueChange={(value) => setForm({ ...form, type: value })}
                style={styles.picker}
              >
                <Picker.Item label="Prácticas" value="practicas" />
                <Picker.Item label="Temporal" value="temporal" />
                <Picker.Item label="Permanente" value="permanente" />
              </Picker>
            </View>

            <Text style={styles.label}>Estado:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={form.status}
                onValueChange={(value) => setForm({ ...form, status: value })}
                style={styles.picker}
              >
                <Picker.Item label="Activo" value="activo" />
                <Picker.Item label="Expirado" value="expirado" />
                <Picker.Item label="Terminado" value="terminado" />
              </Picker>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btnSmall, styles.btnAlt]} onPress={() => setModalVisible(false)}>
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
  contractCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
  contractInfo: {},
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
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
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
  expired: { backgroundColor: "#fff3cd", color: "#856404" },
  terminated: { backgroundColor: "#f8d7da", color: "#721c24" },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnSmall: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 70,
    alignItems: "center",
  },
  btnAlt: {
    backgroundColor: "#dc3545",
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  btn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
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
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
});

