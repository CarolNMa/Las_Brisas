import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
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


export default function MyApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const data = await ApiService.getMyApplications();
            setApplications(data);
        } catch (err) {
            console.error("Error cargando solicitudes:", err);
        } finally {
            setLoading(false);
        }
    };

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
            <Text style={styles.title}>Mis Solicitudes</Text>

            {applications.length === 0 ? (
                <Text style={styles.noData}>No hay solicitudes registradas</Text>
            ) : (
                applications.map((app) => (
                    <View key={app.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.applicationType}>
                                {app.applicationTypeName || `Tipo ${app.applicationTypeId}`}
                            </Text>
                            <Text style={[styles.status,
                                app.status === "Aprobado" ? styles.approved :
                                app.status === "Rechazado" ? styles.rejected : styles.pending
                            ]}>
                                {app.status}
                            </Text>
                        </View>

                        <Text style={styles.label}>Fecha de Creación:</Text>
                        <Text style={styles.value}>{formatDateTime(app.dateCreate)}</Text>

                        {app.dateStart && (
                            <>
                                <Text style={styles.label}>Fecha de Inicio:</Text>
                                <Text style={styles.value}>{formatDateOnly(app.dateStart)}</Text>
                            </>
                        )}

                        {app.dateEnd && (
                            <>
                                <Text style={styles.label}>Fecha de Fin:</Text>
                                <Text style={styles.value}>{formatDateOnly(app.dateEnd)}</Text>
                            </>
                        )}

                        <Text style={styles.label}>Razón:</Text>
                        <Text style={styles.value}>{app.reason}</Text>

                        {app.documentUrl && (
                            <>
                                <Text style={styles.label}>Documento:</Text>
                                <Text style={styles.value}>{app.documentUrl}</Text>
                            </>
                        )}
                    </View>
                ))
            )}

            {/* Botón nueva solicitud */}
            <TouchableOpacity style={styles.buttonNew} onPress={() => router.push("/modules/NewApplication")}>
                <Text style={styles.buttonText}>Nueva Solicitud</Text>
            </TouchableOpacity>

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
    cardHeader: {
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
    status: {
        fontSize: 12,
        fontWeight: "bold",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        alignSelf: "flex-start",
    },
    approved: { backgroundColor: "#d4edda", color: "#155724" },
    rejected: { backgroundColor: "#f8d7da", color: "#721c24" },
    pending: { backgroundColor: "#fff3cd", color: "#856404" },
    label: { fontSize: 14, fontWeight: "bold", color: "#444", marginTop: 10 },
    value: { fontSize: 14, color: "#555" },
    buttonNew: {
        marginTop: 15,
        backgroundColor: "#28a745",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonBack: {
        marginTop: 15,
        backgroundColor: "#a50000",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
