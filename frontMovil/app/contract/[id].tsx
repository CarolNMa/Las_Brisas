import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getContractById } from "../../services/api";

interface Contract {
    id: number;
    dateStart: string;
    dateEnd: string;
    dateUpdate: string;
    type: string;
    status: string;
    documentUrl: string;
    employee: number;
}
// Formatea solo fecha (ej: 26/09/2025)
function formatDateOnly(dateString: string) {
    if (!dateString) return "-";
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    } catch {
        return dateString;
    }
}

// Formatea fecha + hora (ej: 26/09/2025 14:32)
function formatDateTime(dateString: string) {
    if (!dateString) return "-";
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("es-CO", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    } catch {
        return dateString;
    }
}


export default function ContractDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [contract, setContract] = useState<Contract | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getContractById(id)
                .then(setContract)
                .catch((err) => console.error("Error cargando contrato:", err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#a50000" />
                <Text>Cargando información...</Text>
            </View>
        );
    }

    if (!contract) {
        return (
            <View style={styles.loading}>
                <Text>No se encontró el contrato</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Título */}
            <Text style={styles.title}>Detalles del Contrato</Text>
            <Text style={styles.contractId}>ID: {contract.id}</Text>

            {/* Datos detallados */}
            <View style={styles.card}>
                <Text style={styles.label}>Fecha de Inicio:</Text>
                <Text style={styles.value}>{formatDateTime(contract.dateStart)}</Text>

                <Text style={styles.label}>Fecha de Fin:</Text>
                <Text style={styles.value}>{formatDateTime(contract.dateEnd)}</Text>

                <Text style={styles.label}>Última Actualización:</Text>
                <Text style={styles.value}>{formatDateTime(contract.dateUpdate)}</Text>

                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.value}>{contract.type}</Text>

                <Text style={styles.label}>Estado:</Text>
                <Text style={styles.value}>{contract.status}</Text>

                <Text style={styles.label}>Empleado ID:</Text>
                <Text style={styles.value}>{contract.employee}</Text>

                {contract.documentUrl && (
                    <>
                        <Text style={styles.label}>Documento:</Text>
                        <Text style={styles.value}>{contract.documentUrl}</Text>
                    </>
                )}
            </View>

            {/* Botón volver */}
            <TouchableOpacity style={styles.buttonBack} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, alignItems: "center", backgroundColor: "#f8f9fa" },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 10 },
    contractId: { fontSize: 18, color: "#a50000", marginBottom: 20 },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
    },
    label: { fontSize: 14, fontWeight: "bold", color: "#444", marginTop: 10 },
    value: { fontSize: 14, color: "#555" },
    buttonBack: {
        marginTop: 15,
        backgroundColor: "#a50000",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
