import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

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

      // Mock data showing all backend fields
      const mockContracts: Contract[] = [
        {
          id: 1,
          fechaInicio: "2024-01-15",
          fechaFin: "2024-12-15",
          fechaRenovacion: "2024-12-01",
          documentoUrl: "/contracts/contrato_juan.pdf",
          type: "permanente",
          status: "activo",
          employeeId: 1,
          employeeName: "Juan García",
        },
        {
          id: 2,
          fechaInicio: "2024-03-01",
          fechaFin: "2024-08-31",
          documentoUrl: "/contracts/contrato_maria.pdf",
          type: "temporal",
          status: "activo",
          employeeId: 2,
          employeeName: "María Rodríguez",
        },
        {
          id: 3,
          fechaInicio: "2024-06-01",
          fechaFin: "2024-11-30",
          documentoUrl: "/contracts/contrato_carlos.pdf",
          type: "practicas",
          status: "activo",
          employeeId: 3,
          employeeName: "Carlos Martínez",
        },
        {
          id: 4,
          fechaInicio: "2023-01-01",
          fechaFin: "2023-12-31",
          documentoUrl: "/contracts/contrato_antiguo.pdf",
          type: "permanente",
          status: "terminado",
          employeeId: 4,
          employeeName: "Ana López",
        },
      ];

      setContracts(mockContracts);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
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
            <Text style={styles.fieldLabel}>Documento URL:</Text>
            <Text style={styles.fieldValue}>{item.documentoUrl}</Text>
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
      <View style={styles.header}>
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
});

