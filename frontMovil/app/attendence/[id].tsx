import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getEmployeeById } from "../../services/api";

interface Employee {
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
    userId: number;
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


export default function EmployeeDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getEmployeeById(id)
                .then(setEmployee)
                .catch((err) => console.error("Error cargando empleado:", err))
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

    if (!employee) {
        return (
            <View style={styles.loading}>
                <Text>No se encontró el empleado</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Foto del perfil */}
            {employee.photoProfile ? (
                <Image source={{ uri: employee.photoProfile }} style={styles.avatar} />
            ) : (
                <Image source={require("../../assets/images/avatar.jpg")} style={styles.avatar} />
            )}

            {/* Nombre y documento */}
            <Text style={styles.name}>{employee.firstName} {employee.lastName}</Text>
            <Text style={styles.role}>{employee.tipoDocumento}: {employee.documentNumber}</Text>

            {/* Datos detallados */}
            <View style={styles.card}>
                <Text style={styles.label}>Fecha de Nacimiento:</Text>
                <Text style={styles.value}>{formatDateOnly(employee.birthdate)}</Text>

                <Text style={styles.label}>Género:</Text>
                <Text style={styles.value}>{employee.gender}</Text>

                <Text style={styles.label}>Teléfono:</Text>
                <Text style={styles.value}>{employee.phone}</Text>

                <Text style={styles.label}>Correo:</Text>
                <Text style={styles.value}>{employee.email}</Text>

                <Text style={styles.label}>Estado Civil:</Text>
                <Text style={styles.value}>{employee.civilStatus}</Text>

                <Text style={styles.label}>Dirección:</Text>
                <Text style={styles.value}>{employee.address}</Text>

                <Text style={styles.label}>Creado en:</Text>
                <Text style={styles.value}>{formatDateTime(employee.createdAt)}</Text>

                <Text style={styles.label}>Actualizado en:</Text>
                <Text style={styles.value}>{formatDateTime(employee.updatedAt)}</Text>
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
    avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
    name: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 5 },
    role: { fontSize: 16, color: "#a50000", marginBottom: 15 },
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
