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

export default function ForgotPasswordScreen({ setScreen }) {
  const [email, setEmail] = useState("");

  const validate = () => {
    if (!email.trim()) {
      Alert.alert("Error", "El correo es obligatorio");
      return false;
    }
    if (email.includes(" ")) {
      Alert.alert("Error", "El correo no puede contener espacios");
      return false;
    }
    if (email.length > 100) {
      Alert.alert("Error", "El correo no puede superar 100 caracteres");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Ingresa un correo válido");
      return false;
    }
    return true;
  }

  const handleRegister = () => {
    if (validate()) {
      Alert.alert("Éxito", "Se ha enviado el correo de verificación");
      setScreen("Newpass");
    }
  };
  return (
    <ImageBackground
      source={require("../assets/fondo.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>

        <View style={styles.volver}>
          <TouchableOpacity
            style={styles.volver}
            onPress={() => setScreen("Login")}
          >
            <Image
              source={require("../assets/devolver.png")}
              style={styles.volverImage}
            />
          </TouchableOpacity>
        </View>

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.card}>

          <Text style={styles.rcontraseña}>Recupera tu contraseña</Text>
          <Text style={styles.tverificar}>Ingrese el correo registrado para enviarle un código de verficación</Text>

          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.inputContainer}>
            <Image source={require("../assets/mail.png")} style={styles.iconImage} />
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              required
              maxLength={100}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Enviar Código</Text>
          </TouchableOpacity>

        </View>
      </View>
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
  rcontraseña: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  tverificar: {
    fontSize: 14,
    marginBottom: 20,
    color: "#666",
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

});
