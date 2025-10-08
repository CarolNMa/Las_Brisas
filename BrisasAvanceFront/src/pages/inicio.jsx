import { useEffect, useState } from "react";
import { Home, User, Key, Users, Calendar, Clock, Briefcase, MapPin, Building, Mail, ClipboardList, FileText, BookOpen, PenTool } from "lucide-react";

import Topbar from "../components/Layout/BarraSuperior";
import Sidebar from "../components/Layout/BarraLateral";
import Modal from "../components/Layout/Modal";

import DashboardSummary from "../components/Dashboard/DashboardSummary";
import DashboardModules from "../components/Dashboard/DashboardModules";

import ApiService from "../services/api";

export default function Inicio({ user, onLogout }) {
  const [areas, setAreas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [shedules, setShedules] = useState([]);
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
  const [employeeLocations, setEmployeeLocations] = useState([]);
  const [employeeSchedules, setEmployeeSchedules] = useState([]);
  const [employeeAreas, setEmployeeAreas] = useState([]);

  const [inductions, setInductions] = useState([]);

  const [active, setActive] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [resumes, setResumes] = useState([]);

  const items = [
    { key: "dashboard", label: "Resumen", icon: <Home size={16} /> },
    { key: "users", label: "Usuarios", icon: <User size={16} /> },
    { key: "roles", label: "Roles", icon: <Key size={16} /> },
    { key: "empleados", label: "Empleados", icon: <Users size={16} /> },
    { key: "shedules", label: "Horarios", icon: <Calendar size={16} /> },
    { key: "attendance", label: "Asistencia", icon: <Clock size={16} /> },
    { key: "positions", label: "Cargo", icon: <Briefcase size={16} /> },
    { key: "locations", label: "Ubicaciones", icon: <MapPin size={16} /> },
    { key: "areas", label: "Áreas", icon: <Building size={16} /> },
    { key: "applications", label: "Solicitudes", icon: <Mail size={16} /> },
    { key: "applicationTypes", label: "Tipos de Solicitud", icon: <ClipboardList size={16} /> },
    { key: "resumes", label: "Hojas de Vida", icon: <FileText size={16} /> },
    { key: "contratos", label: "Contratos", icon: <FileText size={16} /> },
    { key: "employeePosts", label: "Relaciones Empleado - Cargo", icon: <Users size={16} /> },
    { key: "employeeAreas", label: "Relaciones Empleado - Área", icon: <Users size={16} /> },
    { key: "employeeLocations", label: "Relaciones Empleado - Ubicación", icon: <Users size={16} /> },
    { key: "employeeSchedules", label: "Relaciones Empleado - Horario", icon: <Users size={16} /> },
    { key: "inductions", label: "Formación", icon: <BookOpen size={16} /> },
    { key: "assignInductions", label: "Asignar Formaciones", icon: <PenTool size={16} /> },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        emps,
        sheds,
        ars,
        apps,
        cons,
        asis,
        usrs,
        rols,
        poss,
        locs,
        appTypes,
        resumes,
        empPosts,
        empAreas,
        empLocations,
        empSchedules,
        inds,
      ] = await Promise.all([
        ApiService.getAllEmployees(),
        ApiService.getAllSchedules(),
        ApiService.getAllAreas(),
        ApiService.getAllApplications(),
        ApiService.getAllContracts(),
        ApiService.getAllAttendance(),
        ApiService.getAllUsers(),
        ApiService.getAllRoles(),
        ApiService.getAllPositions(),
        ApiService.getAllLocations(),
        ApiService.getAllApplicationTypes(),
        ApiService.getAllResumes(),
        ApiService.getAllEmployeePosts(),
        ApiService.getAllEmployeeAreas(),
        ApiService.getAllEmployeeLocations(),
        ApiService.getAllEmployeeSchedules(),
        ApiService.getAllInductions(),
      ]);

      setEmpleados(emps.data || emps);
      setShedules(sheds.data || sheds);
      setAsistencias(asis.data || asis);
      setAreas(ars.data || ars);
      setApplications(apps.data || apps);
      setContratos(cons.data || cons);
      setAsistencias(asis.data || asis);
      setUsers(usrs.data || usrs);
      setRoles(rols.data || rols);
      setPositions(poss.data || poss);
      setLocations(locs.data || locs);
      setApplicationTypes(appTypes.data || appTypes);
      setResumes(resumes.data || resumes);
      setEmployeePosts(empPosts.data || empPosts);
      setEmployeeAreas(empAreas.data || empAreas);
      setEmployeeLocations(empLocations.data || empLocations);
      setEmployeeSchedules(empSchedules.data || empSchedules);
      setInductions(inds.data || inds);
    } catch (err) {
      console.error("Error cargando datos del dashboard:", err);
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
              shedules={shedules}
              setShedules={setShedules}
              asistencias={asistencias} 
              setAsistencias={setAsistencias}
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
              setApplicationTypes={setApplicationTypes}
              setMapModalOpen={setMapModalOpen}
              setSelectedAddress={setSelectedAddress}
              employeePosts={employeePosts}
              setEmployeePosts={setEmployeePosts}
              employeeAreas={employeeAreas}
              setEmployeeAreas={setEmployeeAreas}
              employeeLocations={employeeLocations}
              setEmployeeLocations={setEmployeeLocations}
              employeeSchedules={employeeSchedules}
              setEmployeeSchedules={setEmployeeSchedules}
              inductions={inductions}
              setInductions={setInductions}
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
