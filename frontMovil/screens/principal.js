import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    ImageBackground,
    Alert,
} from "react-native";

export default function PrincipalScreen({ setScreen }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const validate = () => {
        if (!name.trim()) {
            Alert.alert("Error", "El nombre es obligatorio");
            return false;
        }
        if (name.length > 100) {
            Alert.alert("Error", "El nombre no puede superar 100 caracteres");
            return false;
        }
        if (!email.trim()) {
            Alert.alert("Error", "El correo electrónico es obligatorio");
            return false;
        }
        if (email.includes(" ")) {
            Alert.alert("Error", "El correo electrónico no puede contener espacios");
            return false;
        }
        if (email.length > 100) {
            Alert.alert("Error", "El correo electrónico no puede superar 100 caracteres");
            return false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Ingresa un correo electrónico válido");
            return false;
        }

        if (!password.trim()) {
            Alert.alert("Error", "La contraseña es obligatoria");
            return false;
        }
        if (password.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
            return false;
        }
        if (password.includes(" ")) {
            Alert.alert("Error", "La contraseña no puede contener espacios");
            return false;
        }
        return true;
    }
    const handleRegister = () => {
        if (validate()) {
            Alert.alert("Registro Completado", "Debe esperar a que el admnistrador valide su cuenta luego podra iniciar sesión");
            console.log("Name:", name);
            console.log("Email:", email);
            console.log("Password:", password);
            setScreen("Login");
        }
    }
        return (
            <ImageBackground>
                source={require("../assets/fondo.png")}
            </ImageBackground>
        );
    }

    const styles = StyleSheet.create({
        background: { flex: 1, justifyContent: "center", alignItems: "center" },
        overlay: { flex: 1, alignItems: "center", justifyContent: "center", width: "100%" },
        logo: { width: 180, height: 80, marginBottom: 20 },
        card: {
            width: "85%",
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
        },
        label: { fontSize: 14, marginBottom: 5, color: "#333" },
        input: {
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 10,
            marginBottom: 15,
        },
        button: {
            backgroundColor: "#a50000",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 10,
        },
        buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
        link: { color: "#000", textDecorationLine: "underline", marginTop: 8 },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            paddingHorizontal: 10,
            marginBottom: 15,
        },
        iconImage: {
            width: 20,
            height: 20,
            marginRight: 8,
            resizeMode: "contain",
        },
        input: {
            flex: 1,
            paddingVertical: 8,
        },
        volver: {
            position: "absolute",
            top: 30,
            left: 10,
        },
        volverImage: {
            width: 20,
            height: 20,
            resizeMode: "contain",
        },

    });
