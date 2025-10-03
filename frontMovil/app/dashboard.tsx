import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DrawerLayout from "@/components/DrawerLayout";

export default function Dashboard() {
  const [summaryData, setSummaryData] = useState({
    empleados: 0,
    contratos: 0,
    solicitudes: 0,
    areas: 0,
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        setIsAuthenticated(false);
        Alert.alert("Error", "Debes iniciar sesión primero");
        router.replace("/(auth)/login");
        return;
      }
      setIsAuthenticated(true);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === true) {
      fetchSummaryData();
    }
  }, [isAuthenticated]);

  const fetchSummaryData = async () => {
    try {
      // For now, hardcoded, but can fetch from API
      setSummaryData({
        empleados: 150,
        contratos: 45,
        solicitudes: 12,
        areas: 8,
      });
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };


  return (
    <DrawerLayout currentModule="dashboard">
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Panel Administrativo</Text>
        <Text style={styles.subtitle}>Las Brisas</Text>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>👥</Text>
              <Text style={styles.summaryNumber}>{summaryData.empleados}</Text>
              <Text style={styles.summaryLabel}>Empleados</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>📄</Text>
              <Text style={styles.summaryNumber}>{summaryData.contratos}</Text>
              <Text style={styles.summaryLabel}>Contratos</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>📩</Text>
              <Text style={styles.summaryNumber}>{summaryData.solicitudes}</Text>
              <Text style={styles.summaryLabel}>Solicitudes</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryIcon}>🏢</Text>
              <Text style={styles.summaryNumber}>{summaryData.areas}</Text>
              <Text style={styles.summaryLabel}>Áreas</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a50000",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  summaryContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    width: "48%",
    alignItems: "center",
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
  summaryIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a50000",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});