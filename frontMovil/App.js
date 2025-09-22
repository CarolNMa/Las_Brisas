import React, { use, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import LoginScreen from "./screens/login";
import ForgotPasswordScreen from "./screens/forgotPass";
import PrincipalScreen from "./screens/principal";
import NewPassScreen from "./screens/newPass";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [screen, setScreen] = useState("Login");

  useEffect(() => {

    console.log("screen: ", screen);
  }, []);

  if (screen === "Login") {
    return <LoginScreen setScreen={setScreen} />;
  } else if (screen === "ForgotPassword") {
    return <ForgotPasswordScreen setScreen={setScreen} />;
  }else if(screen === "Principal"){
    return <PrincipalScreen setScreen={setScreen} />;
  }else if(screen === "Newpass"){
    return <NewPassScreen setScreen={setScreen} />;
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logo: {
    width: 180,
    height: 80,
    marginBottom: 20,
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000", // sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#000000ff",
    textDecorationLine: "underline",
  },
});
