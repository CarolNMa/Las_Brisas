import { useEffect, useState } from "react";

import Topbar from "../components/Layout/BarraSuperior";
import Sidebar from "../components/Layout/BarraLateral";
import Modal from "../components/Layout/Modal";

import DashboardSummary from "../components/Dashboard/DashboardSummary";
import DashboardModules from "../components/Dashboard/DashboardModules";

import ApiService from "../services/api";

export default function Inicio({ user, onLogout }) {
  const [areas, setAreas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [applications, setApplications] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [positions, setPositions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [applicationTypes, setApplicationTypes] = useState([]);
  const [employeePosts, setEmployeePosts] = useState([]);

  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const items = [
    { key: "dashboard", label: "Resumen", icon: "🏠" },
    { key: "users", label: "Usuarios", icon: "👤" },
    { key: "roles", label: "Roles", icon: "🔑" },
    { key: "empleados", label: "Empleados", icon: "👥" },
    { key: "positions", label: "Posiciones", icon: "💼" },
    { key: "locations", label: "Ubicaciones", icon: "📍" },
    { key: "areas", label: "Áreas", icon: "🏢" },
    { key: "applications", label: "Solicitudes", icon: "📩" },
    { key: "applicationTypes", label: "Tipos de Solicitud", icon: "📋" },
    { key: "contratos", label: "Contratos", icon: "📄" },
    { key: "employeePosts", label: "Relaciones Empleado - Cargo", icon: "👥" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        emps,
        ars,
        apps,
        cons,
        asis,
        usrs,
        rols,
        poss,
        locs,
        appTypes,
        empPosts,
      ] = await Promise.all([
        ApiService.getAllEmployees(),
        ApiService.getAllAreas(),
        ApiService.getAllApplications(),
        ApiService.getAllContracts(),
        ApiService.getAllAttendance(),
        ApiService.getAllUsers(),
        ApiService.getAllRoles(),
        ApiService.getAllPositions(),
        ApiService.getAllLocations(),
        ApiService.getAllApplicationTypes(),
        ApiService.getAllEmployeePosts(),
      ]);

      setEmpleados(emps.data || emps);
      setAreas(ars.data || ars);
      setApplications(apps.data || apps);
      setContratos(cons.data || cons);
      setAsistencias(asis.data || asis);
      setUsers(usrs.data || usrs);
      setRoles(rols.data || rols);
      setPositions(poss.data || poss);
      setLocations(locs.data || locs);
      setApplicationTypes(appTypes.data || appTypes);
      setEmployeePosts(empPosts.data || empPosts);
    } catch (err) {
      console.error("❌ Error cargando datos del dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 50 }}>Cargando...</div>;

  return (
    <div style={styles.page}>
      <Sidebar items={items} active={active} onChange={setActive} />
      <div style={styles.main}>
        <Topbar title="Panel Admin - Las Brisas" user={user} onLogout={onLogout} />

        <div style={styles.content}>
          {active === "dashboard" ? (
            <DashboardSummary
              empleados={empleados}
              users={users}
              applications={applications}
              contratos={contratos}
              areas={areas}
              asistencias={asistencias}
              setActive={setActive}
              employeePosts={employeePosts}
            />
          ) : (
            <DashboardModules
              active={active}
              empleados={empleados}
              setEmpleados={setEmpleados}
              areas={areas}
              setAreas={setAreas}
              applications={applications}
              setApplications={setApplications}
              contratos={contratos}
              setContratos={setContratos}
              users={users}
              setUsers={setUsers}
              roles={roles}
              setRoles={setRoles}
              positions={positions}
              setPositions={setPositions}
              locations={locations}
              setLocations={setLocations}
              applicationTypes={applicationTypes}
              setMapModalOpen={setMapModalOpen}
              setSelectedAddress={setSelectedAddress}
              employeePosts={employeePosts}
              setEmployeePosts={setEmployeePosts}
            />
          )}
        </div>

        <Modal
          open={mapModalOpen}
          title={`Mapa de ${selectedAddress}`}
          onClose={() => setMapModalOpen(false)}
        >
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              selectedAddress
            )}&output=embed`}
            width="100%"
            height="400"
            style={{ border: 0 }}
          ></iframe>
        </Modal>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", height: "100vh", width: "100vw", background: "#f0f2f5" },
  main: { flex: 1, display: "flex", flexDirection: "column", marginLeft: 250 },
  content: { padding: 20, flex: 1, overflowY: "auto", background: "#fafafa" },
};
