import { useMemo } from 'react';

// Layout
import Topbar from '../components/Layout/BarraSuperior';
import Sidebar from '../components/Layout/BarraLateral';
import Card from '../components/Layout/Tarjeta';

// Common
import { useLocalState } from '../components/Comunes/Hooks/UseLocalState';
import { exportCSV } from '../components/Comunes/Utils/exportCSV';

// Modules
import EmpleadosModule from '../components/Modules/EmpleadosModulo';
import AreasModule from '../components/Modules/AreasModulo';
import SimpleListModule from '../components/Modules/ListaSimpleModulo';

// Charts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// ---------------- Datos iniciales ----------------
const initialAreas = [
  { id: 'area-1', name: 'Recursos Humanos' },
  { id: 'area-2', name: 'Desarrollo' },
  { id: 'area-3', name: 'Operaciones' },
];

const initialEmpleados = [
  { id: 'emp-1', firstName: 'Karol', lastName: 'Pérez', document: '12345678', hireDate: '2024-01-01', status: 'ACTIVE', areaId: 'area-2', locationId: 'loc-1', positionId: 'pos-1' },
  { id: 'emp-2', firstName: 'Miguel', lastName: 'Gómez', document: '87654321', hireDate: '2024-02-01', status: 'ACTIVE', areaId: 'area-1', locationId: 'loc-2', positionId: 'pos-2' },
];

// (agrega aquí todos los initialXXX que ya tenías en tu código)
const initialAsistencias = [
  { id: 'asis-1', employeeId: 'emp-1', date: '2025-09-01', checkIn: '08:00', checkOut: '17:00', status: 'PRESENT' },
];

const initialApplications = [
  { id: 'app-1', employeeId: 'emp-2', typeId: 'at-1', description: 'Vacation request', status: 'PENDING', date: '2025-08-20' },
];

const initialContratos = [
  { id: 'con-1', employeeId: 'emp-2', startDate: '2024-01-01', endDate: '2025-12-31', type: 'FULL_TIME', status: 'ACTIVE', value: 5500000 },
];

const initialUsers = [
  { id: 'user-1', username: 'admin', email: 'admin@brisas.com', status: 'ACTIVE' },
  { id: 'user-2', username: 'user', email: 'user@brisas.com', status: 'ACTIVE' },
];

const initialRoles = [
  { id: 'rol-1', name: 'Admin' },
  { id: 'rol-2', name: 'Employee' },
];

const initialPermissions = [
  { id: 'perm-1', name: 'Read Users' },
  { id: 'perm-2', name: 'Write Users' },
];

const initialPositions = [
  { id: 'pos-1', name: 'Developer', description: 'Software Developer' },
  { id: 'pos-2', name: 'Manager', description: 'Project Manager' },
];

const initialLocations = [
  { id: 'loc-1', name: 'Office A', address: '123 Main St' },
  { id: 'loc-2', name: 'Office B', address: '456 Elm St' },
];

const initialApplicationTypes = [
  { id: 'at-1', name: 'Vacation' },
  { id: 'at-2', name: 'Leave' },
];

// ---------------- Componente principal ----------------
export default function Dashboard({ user, onLogout }) {
  // Estados persistidos en localStorage
  const [areas, setAreas] = useLocalState('brisas:areas', initialAreas);
  const [empleados, setEmpleados] = useLocalState('brisas:empleados', initialEmpleados);
  const [asistencias, setAsistencias] = useLocalState('brisas:asistencias', initialAsistencias);
  const [applications, setApplications] = useLocalState('brisas:applications', initialApplications);
  const [contratos, setContratos] = useLocalState('brisas:contratos', initialContratos);
  const [users, setUsers] = useLocalState('brisas:users', initialUsers);
  const [roles, setRoles] = useLocalState('brisas:roles', initialRoles);
  const [permissions, setPermissions] = useLocalState('brisas:permissions', initialPermissions);
  const [positions, setPositions] = useLocalState('brisas:positions', initialPositions);
  const [locations, setLocations] = useLocalState('brisas:locations', initialLocations);
  const [applicationTypes, setApplicationTypes] = useLocalState('brisas:applicationTypes', initialApplicationTypes);

  const [active, setActive] = useLocalState('brisas:active', 'dashboard');

  // Sidebar items
  const items = useMemo(() => ([
    { key: 'dashboard', label: 'Resumen', icon: '🏠' },
    { key: 'users', label: 'Usuarios', icon: '👤' },
    { key: 'roles', label: 'Roles', icon: '🔑' },
    { key: 'permissions', label: 'Permisos', icon: '🛡️' },
    { key: 'empleados', label: 'Empleados', icon: '👥' },
    { key: 'positions', label: 'Posiciones', icon: '💼' },
    { key: 'locations', label: 'Ubicaciones', icon: '📍' },
    { key: 'areas', label: 'Áreas', icon: '🏢' },
    { key: 'applications', label: 'Solicitudes', icon: '📩' },
    { key: 'applicationTypes', label: 'Tipos de Solicitud', icon: '📋' },
    { key: 'contratos', label: 'Contratos', icon: '📄' },
  ]), []);

  // Datos para las gráficas
  const employeesByArea = useMemo(() => {
    const areaCounts = areas.reduce((acc, area) => {
      acc[area.name] = empleados.filter(e => e.areaId === area.id).length;
      return acc;
    }, {});
    return Object.entries(areaCounts).map(([name, count]) => ({ name, count }));
  }, [areas, empleados]);

  const attendanceStatus = useMemo(() => {
    const statusCounts = asistencias.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }));
  }, [asistencias]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={styles.page}>
      <Sidebar items={items} active={active} onChange={setActive} />
      <div style={styles.main}>
        <Topbar title="Panel Brisas - Gestión de Talento" user={user} onLogout={onLogout} />

        <div style={styles.content}>
          {active === 'dashboard' && (
            <div>
              <h2 >Resumen general</h2>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                <Card title="👥 Empleados" value={empleados.length} />
                <Card title="👤 Usuarios" value={users.length} />
                <Card title="📩 Solicitudes" value={applications.length} />
                <Card title="📄 Contratos" value={contratos.length} />
                <Card title="🏢 Áreas" value={areas.length} />
              </div>

              <div style={{ display: 'flex', gap: 20, marginTop: 30, flexWrap: 'wrap' }}>
                <div style={styles.chartContainer}>
                  <h3>Empleados por Área</h3>
                  <BarChart width={400} height={300} data={employeesByArea}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#333", fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      tick={{ fill: "#333", fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: 6,
                      }}
                    />
                    <Legend wrapperStyle={{ color: "#333", fontWeight: 600 }} />

                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </div>

                <div style={styles.chartContainer}>
                  <h3>Estado de Asistencias</h3>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={attendanceStatus}
                      cx={200}
                      cy={150}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name || "Sin datos"} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {attendanceStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </div>

              <div style={{ marginTop: 30 }}>
                <h3>Acciones Rápidas</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => exportCSV('empleados_all.csv', empleados)} style={styles.btn}>📊 Exportar Empleados</button>
                  <button onClick={() => exportCSV('applications_all.csv', applications)} style={styles.btnAlt}>📋 Exportar Solicitudes</button>
                  <button onClick={() => setActive('empleados')} style={styles.btn}>👥 Gestionar Empleados</button>
                  <button onClick={() => setActive('applications')} style={styles.btnAlt}>📩 Ver Solicitudes</button>
                </div>
              </div>
            </div>
          )}

          {active === 'empleados' && <EmpleadosModule empleados={empleados} setEmpleados={setEmpleados} areas={areas} positions={positions} locations={locations} />}
          {active === 'areas' && (
            <SimpleListModule
              title="Áreas"
              dataKey="areas"
              items={areas}
              setItems={setAreas}
              columns={[{ key: 'name', title: 'Nombre' }]}
              fields={[{ key: 'name', title: 'Nombre' }]}
            />
          )}

          {active === 'applications' && (
            <SimpleListModule
              title="Solicitudes"
              dataKey="applications"
              items={applications}
              setItems={setApplications}
              columns={[
                { key: 'employeeId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.firstName + ' ' + empleados.find(e => e.id === v)?.lastName || v },
                { key: 'typeId', title: 'Tipo', render: v => applicationTypes.find(t => t.id === v)?.name || v },
                { key: 'status', title: 'Estado' },
                { key: 'date', title: 'Fecha' },
                { key: 'description', title: 'Descripción' },
              ]}
            />
          )}

          {active === 'contratos' && (
            <SimpleListModule
              title="Contratos"
              dataKey="contratos"
              items={contratos}
              setItems={setContratos}
              columns={[
                { key: 'employeeId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.firstName + ' ' + empleados.find(e => e.id === v)?.lastName || v },
                { key: 'startDate', title: 'Inicio' },
                { key: 'endDate', title: 'Fin' },
                { key: 'type', title: 'Tipo' },
                { key: 'status', title: 'Estado' },
                { key: 'value', title: 'Valor' },
              ]}
            />
          )}

          {active === 'users' && (
            <SimpleListModule
              title="Usuarios"
              dataKey="users"
              items={users}
              setItems={setUsers}
              columns={[{ key: 'username', title: 'Usuario' }, { key: 'email', title: 'Email' }, { key: 'status', title: 'Estado' }]}
              fields={[{ key: 'username', title: 'Usuario' }, { key: 'email', title: 'Email' }]}
            />
          )}

          {active === 'roles' && (
            <SimpleListModule
              title="Roles"
              dataKey="roles"
              items={roles}
              setItems={setRoles}
              columns={[{ key: 'name', title: 'Nombre' }]}
              fields={[{ key: 'name', title: 'Nombre' }]}
            />
          )}

          {active === 'permissions' && (
            <SimpleListModule
              title="Permisos"
              dataKey="permissions"
              items={permissions}
              setItems={setPermissions}
              columns={[{ key: 'name', title: 'Nombre' }]}
              fields={[{ key: 'name', title: 'Nombre' }]}
            />
          )}

          {active === 'positions' && (
            <SimpleListModule
              title="Posiciones"
              dataKey="positions"
              items={positions}
              setItems={setPositions}
              columns={[{ key: 'name', title: 'Nombre' }, { key: 'description', title: 'Descripción' }]}
              fields={[{ key: 'name', title: 'Nombre' }, { key: 'description', title: 'Descripción' }]}
            />
          )}

          {active === 'locations' && (
            <SimpleListModule
              title="Ubicaciones"
              dataKey="locations"
              items={locations}
              setItems={setLocations}
              columns={[{ key: 'name', title: 'Nombre' }, { key: 'address', title: 'Dirección' }]}
              fields={[{ key: 'name', title: 'Nombre' }, { key: 'address', title: 'Dirección' }]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- Estilos inline ----------------
// Estilos mejorados del Dashboard

export const styles = {
  // Layout general
  page: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    background: '#f0f2f5',
    margin: 0,
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#111',
  },

  // Sidebar
  sidebar: {
    width: 250,
    padding: 18,
    borderRight: '1px solid #e6e9ef',
    background: '#fff',
    overflowY: 'auto',
    color: '#111',
  },
  navItem: {
    padding: '12px 8px',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 6,
    color: '#444',
    fontWeight: 500,
    transition: 'background 0.2s, color 0.2s',
  },
  navItemActive: {
    background: '#e6f4ff',
    fontWeight: 700,
    color: '#2563eb',
  },

  // Contenedor principal
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: 20,
    flex: 1,
    overflowY: 'auto',
    background: '#fafafa',
  },

  // Tarjetas
  card: {
    padding: 16,
    borderRadius: 10,
    background: '#fff',
    minWidth: 160,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    transition: 'all 0.2s ease-in-out',
  },
  cardTitle: {
    fontSize: 13,
    color: '#555',
    fontWeight: 600,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 700,
    color: '#111',
  },

  // Gráficas
  chartContainer: {
    background: '#fff',
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    minWidth: 400,
    flex: 1,
  },

  // Botones
  btn: {
    padding: '8px 14px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'background 0.2s',
  },
  btnAlt: {
    padding: '8px 14px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
    color: "#111",
  },
  btnSmall: {
    padding: '6px 10px',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  },

  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    width: 640,
    maxWidth: '95%',
    background: '#fff',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
};

