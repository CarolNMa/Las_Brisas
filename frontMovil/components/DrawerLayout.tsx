import React, { useState, useRef, ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Home, User, Key, Users, Calendar, Clock, Briefcase, MapPin, Building, Mail, ClipboardList, FileText } from "lucide-react-native";

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = 250;

interface DrawerLayoutProps {
  children: ReactNode;
  currentModule?: string;
}

const items = [
  { key: "dashboard", label: "Dashboard", icon: <Home size={16} /> },
  { key: "users", label: "Usuarios", icon: <User size={16} /> },
  { key: "roles", label: "Roles", icon: <Key size={16} /> },
  { key: "empleados", label: "Empleados", icon: <Users size={16} /> },
  { key: "positions", label: "Posiciones", icon: <Briefcase size={16} /> },
  { key: "locations", label: "Ubicaciones", icon: <MapPin size={16} /> },
  { key: "areas", label: "Áreas", icon: <Building size={16} /> },
  { key: "applications", label: "Solicitudes", icon: <Mail size={16} /> },
  { key: "applicationTypes", label: "Tipos de Solicitud", icon: <ClipboardList size={16} /> },
  { key: "contratos", label: "Contratos", icon: <FileText size={16} /> },
  { key: "attendance", label: "Asistencia", icon: <Clock size={16} /> },
  { key: "schedules", label: "Horarios", icon: <Calendar size={16} /> },
  { key: "employeePosts", label: "Relaciones Empleado - Cargo", icon: <Users size={16} /> },
];

export default function DrawerLayout({ children, currentModule = "dashboard" }: DrawerLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -DRAWER_WIDTH : 0;
    Animated.timing(drawerAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleModulePress = (moduleKey: string) => {
    if (moduleKey === "dashboard") {
      router.replace("/dashboard");
    } else {
      router.replace(`/modules/${moduleKey}`);
    }
    toggleDrawer();
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove(["jwt_token", "username", "photoProfile"]);
            router.replace("/(auth)/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
        <View style={styles.drawerContent}>
          <Text style={styles.drawerTitle}>Las Brisas</Text>
          <View style={styles.drawerContentScroll}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.drawerItem,
                  currentModule === item.key && styles.activeDrawerItem
                ]}
                onPress={() => handleModulePress(item.key)}
              >
                <View style={styles.drawerIcon}>{item.icon}</View>
                <Text style={[
                  styles.drawerText,
                  currentModule === item.key && styles.activeDrawerText
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.View>

      {isDrawerOpen && (
        <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />
      )}

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.headerText}>
              {items.find(item => item.key === currentModule)?.label || "Las Brisas"}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    elevation: 5,
    boxShadow: '2px 0px 5px rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a50000',
    marginBottom: 20,
    textAlign: 'center',
  },
  drawerContentScroll: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  activeDrawerItem: {
    backgroundColor: '#a50000',
  },
  drawerIcon: {
    marginRight: 15,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  activeDrawerText: {
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  },
  menuButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a50000',
  },
  logoutButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#a50000",
  },
  content: {
    flex: 1,
  },
});