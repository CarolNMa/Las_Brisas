import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [contractsResponse, employeesResponse] = await Promise.all([
        api.getAllContracts(),
        api.getEmployees(),
      ]);

      const employeeMap = employeesResponse.reduce(
        (map: { [key: number]: string }, emp: any) => {
          map[emp.id] = `${emp.firstName} ${emp.lastName}`;
          return map;
        },
        {}
      );

      const transformedContracts: Contract[] = contractsResponse.map(
        (contract: any) => ({
          id: contract.id,
          fechaInicio: contract.dateStart,
          fechaFin: contract.dateEnd,
          fechaRenovacion: contract.dateUpdate,
          documentoUrl: contract.documentUrl,
          type: contract.type as "practicas" | "temporal" | "permanente",
          status: contract.status as "activo" | "expirado" | "terminado",
          employeeId: contract.employee,
          employeeName: employeeMap[contract.employee] || "Empleado desconocido",
        })
      );

      setContracts(transformedContracts);
    } catch (err) {
      console.error("Error cargando datos:", err);
      Alert.alert("Error", "Error al cargar contratos");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdf = async (documentoUrl: string) => {
    try {
      const filename = documentoUrl.split("/").pop();
      if (filename) {
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

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.employeeName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      contract.type.toLowerCase().includes(searchText.toLowerCase()) ||
      contract.status.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderContract = ({ item }: { item: Contract }) => (
    <View style={styles.contractCard}>
      <View style={styles.contractInfo}>
        <Text style={styles.fieldLabel}>ID Contrato:</Text>
        <Text style={styles.fieldValue}>{item.id}</Text>

        <Text style={styles.fieldLabel}>Fecha Inicio:</Text>
        <Text style={styles.fieldValue}>
          {new Date(item.fechaInicio).toLocaleDateString()}
        </Text>

        <Text style={styles.fieldLabel}>Fecha Fin:</Text>
        <Text style={styles.fieldValue}>
          {new Date(item.fechaFin).toLocaleDateString()}
        </Text>

        {item.fechaRenovacion && (
          <>
            <Text style={styles.fieldLabel}>Fecha Renovación:</Text>
            <Text style={styles.fieldValue}>
              {new Date(item.fechaRenovacion).toLocaleDateString()}
            </Text>
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
          {item.type === "practicas"
            ? "Prácticas"
            : item.type === "temporal"
            ? "Temporal"
            : "Permanente"}
        </Text>

        <Text style={styles.fieldLabel}>Estado:</Text>
        <Text
          style={[
            styles.status,
            item.status === "activo"
              ? styles.active
              : item.status === "expirado"
              ? styles.expired
              : styles.terminated,
          ]}
        >
          {item.status === "activo"
            ? "Activo"
            : item.status === "expirado"
            ? "Expirado"
            : "Terminado"}
        </Text>

        <Text style={styles.fieldLabel}>Empleado:</Text>
        <Text style={styles.fieldValue}>
          {item.employeeName} (ID {item.employeeId})
        </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%",
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
  headerActions: {
    padding: 20,
  },
});
