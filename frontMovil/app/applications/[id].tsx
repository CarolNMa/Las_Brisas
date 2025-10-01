import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getEmployeePermissions } from "../../services/api";

interface Application {
    id: number;
    dateStart: string;
    dateEnd: string;
    dateCreate: string;
    reason: string;
    documentUrl: string;
    status: string;
    employeeId: number;
    applicationTypeid: number;
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


export default function EmployeeApplications() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getEmployeePermissions(id)
                .then(setApplications)
                .catch((err) => console.error("Error cargando permisos:", err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#a50000" />
                <Text>Cargando permisos...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Permisos del Empleado {id}</Text>

            {applications.length === 0 ? (
                <Text style={styles.noData}>No hay permisos registrados</Text>
            ) : (
                applications.map((app) => (
                    <View key={app.id} style={styles.card}>
                        <Text style={styles.label}>ID de Solicitud:</Text>
                        <Text style={styles.value}>{app.id}</Text>

                        <Text style={styles.label}>Fecha de Inicio:</Text>
                        <Text style={styles.value}>{formatDateTime(app.dateStart)}</Text>

                        <Text style={styles.label}>Fecha de Fin:</Text>
                        <Text style={styles.value}>{formatDateTime(app.dateEnd)}</Text>

                        <Text style={styles.label}>Fecha de Creación:</Text>
                        <Text style={styles.value}>{formatDateTime(app.dateCreate)}</Text>

                        <Text style={styles.label}>Razón:</Text>
                        <Text style={styles.value}>{app.reason}</Text>

                        <Text style={styles.label}>Estado:</Text>
                        <Text style={styles.value}>{app.status}</Text>

                        {app.documentUrl && (
                            <>
                                <Text style={styles.label}>Documento:</Text>
                                <Text style={styles.value}>{app.documentUrl}</Text>
                            </>
                        )}
                    </View>
                ))
            )}

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
    title: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
    noData: { fontSize: 16, color: "#666", textAlign: "center", marginTop: 20 },
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
        marginBottom: 15,
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
