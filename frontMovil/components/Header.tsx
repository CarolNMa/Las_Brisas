import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface HeaderAdminProps {
    onMenuPress?: () => void;
}

export default function HeaderAdmin({ onMenuPress }: HeaderAdminProps) {
    const [username, setUsername] = useState<string | null>(null);
    useEffect(() => {
        AsyncStorage.getItem("username").then(setUsername);
    }, []);

    const handleLogout = () => {
        Alert.alert(
            "Cerrar sesión",
            "¿Estás seguro de que deseas salir?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Salir",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.multiRemove(["token", "username", "photoProfile"]);
                        router.replace("/(auth)/login");
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            {onMenuPress && (
                <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                    <Ionicons name="menu" size={24} color="#000" />
                </TouchableOpacity>
            )}
            <View style={styles.userInfo}>
                <Text style={styles.username}>{username || "Administrador"}</Text>
            </View>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    menuButton: {
        padding: 6,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000ff",
    },
    logoutButton: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: "#a50000",
    },
});
