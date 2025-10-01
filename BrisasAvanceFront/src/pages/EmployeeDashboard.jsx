import { useState, useEffect } from 'react';

import Topbar from '../components/Layout/BarraSuperior';
import Sidebar from '../components/Layout/BarraLateral';
import Card from '../components/Layout/Tarjeta';

import EmployeeProfile from '../components/Employee/EmployeeProfile';
import EmployeeContract from '../components/Employee/EmployeeContract';
import EmployeeResume from '../components/Employee/EmployeeResume';
import EmployeeApplications from '../components/Employee/EmployeeApplications';
import EmployeeInductions from '../components/Employee/EmployeeInductions';
import EmployeeAttendance from '../components/Employee/EmployeeAttendance';

export default function EmployeeDashboard({ user, onLogout }) {
  const [active, setActive] = useState('profile');
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const items = [
    { key: 'profile', label: 'Mi Perfil', icon: '👤' },
    { key: 'contract', label: 'Mi Contrato', icon: '📄' },
    { key: 'resume', label: 'Hoja de Vida', icon: '📋' },
    { key: 'applications', label: 'Mis Solicitudes', icon: '📩' },
    { key: 'inductions', label: 'Inducciones', icon: '🎓' },
    { key: 'attendance', label: 'Mi Asistencia', icon: '⏰' },
  ];

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);

      setEmployeeData({
        id: 1,
        firstName: 'Juan',
        lastName: 'Pérez',
        document: '12345678',
        email: user.email,
        hireDate: '2024-01-01',
        status: 'ACTIVE'
      });
    } catch (error) {
      console.error('Error loading employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;
    }

    switch (active) {
      case 'profile':
        return <EmployeeProfile employee={employeeData} />;
      case 'contract':
        return <EmployeeContract employeeId={employeeData.id} />;
      case 'resume':
        return <EmployeeResume employeeId={employeeData.id} />;
      case 'applications':
        return <EmployeeApplications employeeId={employeeData.id} />;
      case 'inductions':
        return <EmployeeInductions employeeId={employeeData.id} />;
      case 'attendance':
        return <EmployeeAttendance employeeId={employeeData.id} />;
      default:
        return <EmployeeProfile employee={employeeData} />;
    }
  };

  return (
    <div style={styles.page}>
      <Sidebar items={items} active={active} onChange={setActive} />
      <div style={styles.main}>
        <Topbar title="Panel de Empleado - Las Brisas" user={user} onLogout={onLogout} />
        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    background: '#f0f2f5',
    margin: 0,
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#111',
  },
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
};