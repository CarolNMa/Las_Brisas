import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import DrawerLayout from "@/components/DrawerLayout";

// Import module components
import UsersModule from "./UsersModule";
import RolesModule from "./RolesModule";
import EmployeesModule from "./EmployeesModule";
import PositionsModule from "./PositionsModule";
import LocationsModule from "./LocationsModule";
import AreasModule from "./AreasModule";
import ApplicationsModule from "./ApplicationsModule";
import ApplicationTypesModule from "./ApplicationTypesModule";
import ContractsModule from "./ContractsModule";
import AttendanceModule from "./AttendanceModule";
import SchedulesModule from "./SchedulesModule";
import EmployeePostsModule from "./EmployeePostModule";
import InductionsModule from "./InductionsModule";
import AssignInductionsModule from "./AssignInductionsModule";
import TrainingsModule from "./TrainingsModule";

const moduleTitles: { [key: string]: string } = {
  users: "Usuarios",
  roles: "Roles",
  empleados: "Empleados",
  positions: "Posiciones",
  locations: "Ubicaciones",
  areas: "Áreas",
  applications: "Solicitudes",
  applicationTypes: "Tipos de Solicitud",
  contratos: "Contratos",
  attendance: "Asistencia",
  schedules: "Horarios",
  employeePosts: "Relaciones Empleado - Cargo",
  inductions: "Inducciones",
  assignInductions: "Asignar Inducciones",
  trainings: "Capacitaciones",
};

export default function ModuleScreen() {
  const { module } = useLocalSearchParams<{ module: string }>();

  const renderModule = () => {
    switch (module) {
      case "users":
        return <UsersModule />;
      case "roles":
        return <RolesModule />;
      case "empleados":
        return <EmployeesModule />;
      case "positions":
        return <PositionsModule />;
      case "locations":
        return <LocationsModule />;
      case "areas":
        return <AreasModule />;
      case "applications":
        return <ApplicationsModule />;
      case "applicationTypes":
        return <ApplicationTypesModule />;
      case "contratos":
        return <ContractsModule />;
      case "attendance":
        return <AttendanceModule />;
      case "schedules":
        return <SchedulesModule />;
      case "employeePosts":
        return <EmployeePostsModule />;
      case "inductions":
        return <InductionsModule />;
      case "assignInductions":
        return <AssignInductionsModule />;
      case "trainings":
        return <TrainingsModule />;
      default:
        return (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Módulo no encontrado</Text>
          </View>
        );
    }
  };

  return (
    <DrawerLayout currentModule={module}>
      <View style={styles.content}>
        {renderModule()}
      </View>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 20 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
  },
});