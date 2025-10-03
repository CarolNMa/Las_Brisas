import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EmployeePostModule() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Módulo de Relaciones Empleado - Cargo</Text>
      <Text style={styles.description}>
        Aquí se gestionarán las relaciones empleado-cargo del sistema.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#a50000", marginBottom: 20 },
  description: { fontSize: 16, color: "#666", textAlign: "center" },
});

