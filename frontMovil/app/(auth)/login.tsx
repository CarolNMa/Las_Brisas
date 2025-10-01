import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { authStyles } from "../../styles/authStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validate = () => {
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
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        const response = await fetch("http://172.30.7.248:8085/api/v1/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error("Credenciales inválidas");

        const data = await response.json();
        console.log("Respuesta:", data);


        await AsyncStorage.setItem("token", data.token);

        router.push("/employee");
      } catch (error: any) {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#a50000" }}>
      <StatusBar style="light" backgroundColor="#a50000" />

      <ImageBackground
        source={require("../../assets/images/fondo.png")}
        style={{ flex: 1, width: "100%", height: "100%" }}
        resizeMode="cover"
      >
        <View style={authStyles.overlay}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={authStyles.logo}
            resizeMode="contain"
          />

          <View style={authStyles.card}>
            <Text style={authStyles.label}>Correo Electrónico</Text>
            <View style={authStyles.inputContainer}>
              <Image
                source={require("../../assets/images/mail.png")}
                style={authStyles.iconImage}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={authStyles.label}>Contraseña</Text>
            <View style={authStyles.inputContainer}>
              <Image
                source={require("../../assets/images/password.png")}
                style={authStyles.iconImage}
              />
              <TextInput
                style={authStyles.input}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={authStyles.button} onPress={handleLogin}>
              <Text style={authStyles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>


          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
