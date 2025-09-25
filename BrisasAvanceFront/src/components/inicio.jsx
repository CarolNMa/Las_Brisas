import React, { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9)

const useLocalState = (key, initial) => {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch (e) {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (e) { }
  }, [key, state])
  return [state, setState]
}

const exportCSV = (filename, rows) => {
  if (!rows || rows.length === 0) return
  const keys = Object.keys(rows[0])
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}


const initialAreas = [
  { id: 'area-1', name: 'Recursos Humanos' },
  { id: 'area-2', name: 'Desarrollo' },
  { id: 'area-3', name: 'Operaciones' },
]

const initialEmpleados = [
  { id: 'emp-1', firstName: 'Karol', lastName: 'Pérez', document: '12345678', hireDate: '2024-01-01', status: 'ACTIVE', areaId: 'area-2', locationId: 'loc-1', positionId: 'pos-1' },
  { id: 'emp-2', firstName: 'Miguel', lastName: 'Gómez', document: '87654321', hireDate: '2024-02-01', status: 'ACTIVE', areaId: 'area-1', locationId: 'loc-2', positionId: 'pos-2' },
]

const initialInductionEmployees = [
  { id: 'ie-1', inductionId: 'ind-1', employeeId: 'emp-1', status: 'COMPLETED', visto: 'YES' },
]

const initialAsistencias = [
  { id: 'asis-1', employeeId: 'emp-1', date: '2025-09-01', checkIn: '08:00', checkOut: '17:00', status: 'PRESENT' },
]

const initialApplications = [
  { id: 'app-1', employeeId: 'emp-2', typeId: 'at-1', description: 'Vacation request', status: 'PENDING', date: '2025-08-20' },
]

const initialContratos = [
  { id: 'con-1', employeeId: 'emp-2', startDate: '2024-01-01', endDate: '2025-12-31', type: 'FULL_TIME', status: 'ACTIVE', value: 5500000 },
]

const initialHorarios = [
  { id: 'hor-1', name: 'Jornada diurna', startTime: '08:00', endTime: '17:00', dayWeek: 'MONDAY', shift: 'MORNING' },
]

const initialProcesos = [
  { id: 'pd-1', employeeId: 'emp-2', reason: 'Retrasos reiterados', status: 'IN_PROGRESS', date: '2025-07-01' },
]

const initialCertificados = [
  { id: 'cert-1', employeeId: 'emp-1', type: 'ATTENDANCE', issueDate: '2025-06-30', expiryDate: '2026-06-30', fileUrl: '', status: 'VALID' },
]

const initialUsers = [
  { id: 'user-1', username: 'admin', email: 'admin@brisas.com', status: 'ACTIVE' },
  { id: 'user-2', username: 'user', email: 'user@brisas.com', status: 'ACTIVE' },
]

const initialRoles = [
  { id: 'rol-1', name: 'Admin' },
  { id: 'rol-2', name: 'Employee' },
]

const initialPermissions = [
  { id: 'perm-1', name: 'Read Users' },
  { id: 'perm-2', name: 'Write Users' },
]

const initialPositions = [
  { id: 'pos-1', name: 'Developer', description: 'Software Developer' },
  { id: 'pos-2', name: 'Manager', description: 'Project Manager' },
]

const initialLocations = [
  { id: 'loc-1', name: 'Office A', address: '123 Main St' },
  { id: 'loc-2', name: 'Office B', address: '456 Elm St' },
]

const initialInductions = [
  { id: 'ind-1', name: 'General Induction', description: 'Basic training', type: 'GENERAL', status: 'ACTIVE' },
]

const initialModules = [
  { id: 'mod-1', inductionId: 'ind-1', name: 'Introduction', content: 'Welcome to the company' },
]

const initialQuestions = [
  { id: 'q-1', moduleId: 'mod-1', question: 'What is the company policy?', type: 'MULTIPLE_CHOICE' },
]

const initialAnswers = [
  { id: 'a-1', questionId: 'q-1', answer: 'Follow guidelines', isCorrect: true },
]

const initialApplicationTypes = [
  { id: 'at-1', name: 'Vacation' },
  { id: 'at-2', name: 'Leave' },
]
function Topbar({ title, user, onLogout }) {
  return (
    <div style={styles.topbar}>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>Hola, {user?.username}</span>
        <div style={styles.avatar}>{user?.username?.charAt(0).toUpperCase()}</div>
        <button onClick={onLogout} style={styles.logoutBtn}>Cerrar Sesión</button>
      </div>
    </div>
  )
}

function Sidebar({ items, active, onChange }) {
  return (
    <div style={styles.sidebar}>
      <h3 style={{ margin: 0 }}>Brisas</h3>
      <nav style={{ marginTop: 12 }}>
        {items.map(i => (
          <div key={i.key} onClick={() => onChange(i.key)} style={{ ...styles.navItem, ...(active === i.key ? styles.navItemActive : {}) }}>
            {i.icon} <span style={{ marginLeft: 8 }}>{i.label}</span>
          </div>
        ))}
      </nav>
    </div>
  )
}

function Card({ title, value, children }) {
  return (
    <div style={styles.card}>
      <div style={{ fontSize: 12, color: '#666' }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
      {children}
    </div>
  )
}

function Table({ columns, data, onEdit, onDelete, idKey = 'id' }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map(c => (
            <th key={c.key}>{c.title}</th>
          ))}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(r => (
          <tr key={r[idKey]}>
            {columns.map(c => (
              <td key={c.key}>{c.render ? c.render(r[c.key], r) : r[c.key]}</td>
            ))}
            <td>
              <button onClick={() => onEdit && onEdit(r)} style={styles.btnSmall}>Editar</button>
              <button onClick={() => onDelete && onDelete(r)} style={{ ...styles.btnSmall, marginLeft: 8, background: '#ff4d4f' }}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={styles.btnSmall}>Cerrar</button>
        </div>
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  )
}

function EmpleadosModule({ empleados, setEmpleados, areas, positions, locations }) {
  const [q, setQ] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = empleados.filter(e => (`${e.firstName} ${e.lastName}`.toLowerCase().includes(q.toLowerCase()) || e.document?.toLowerCase().includes(q.toLowerCase())))

  function openCreate() {
    setEditing({ id: uid('emp-'), firstName: '', lastName: '', document: '', hireDate: '', positionId: positions[0]?.id ?? '', areaId: areas[0]?.id ?? '', locationId: locations[0]?.id ?? '', status: 'ACTIVE' })
    setModalOpen(true)
  }

  function save() {
    if (!editing.firstName) return alert('Nombre es requerido')
    setEmpleados(prev => {
      const exists = prev.some(p => p.id === editing.id)
      if (exists) return prev.map(p => p.id === editing.id ? editing : p)
      return [...prev, editing]
    })
    setModalOpen(false)
  }

  function remove(row) {
    if (!confirm('Eliminar empleado?')) return
    setEmpleados(prev => prev.filter(p => p.id !== row.id))
  }

  return (
    <div>
      <div style={styles.moduleHeader}>
        <h2>Empleados</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Buscar empleado" value={q} onChange={e => setQ(e.target.value)} />
          <button onClick={openCreate} style={styles.btn}>Nuevo</button>
          <button onClick={() => exportCSV('empleados.csv', empleados)} style={styles.btnAlt}>Exportar CSV</button>
        </div>
      </div>

      <Table
        columns={[
          { key: 'firstName', title: 'Nombre' },
          { key: 'lastName', title: 'Apellido' },
          { key: 'document', title: 'Documento' },
          { key: 'positionId', title: 'Posición', render: (v) => positions.find(p => p.id === v)?.name || '-' },
          { key: 'areaId', title: 'Área', render: (v) => areas.find(a => a.id === v)?.name || '-' },
          { key: 'locationId', title: 'Ubicación', render: (v) => locations.find(l => l.id === v)?.name || '-' },
          { key: 'status', title: 'Estado' },
        ]}
        data={filtered}
        onEdit={(r) => { setEditing(r); setModalOpen(true) }}
        onDelete={remove}
      />

      <Modal open={modalOpen} title={editing ? (editing.id ? 'Editar empleado' : 'Nuevo empleado') : 'Empleado'} onClose={() => setModalOpen(false)}>
        {editing && (
          <div style={{ display: 'grid', gap: 8 }}>
            <input value={editing.firstName} onChange={e => setEditing({ ...editing, firstName: e.target.value })} placeholder="Nombre" />
            <input value={editing.lastName} onChange={e => setEditing({ ...editing, lastName: e.target.value })} placeholder="Apellido" />
            <input value={editing.document} onChange={e => setEditing({ ...editing, document: e.target.value })} placeholder="Documento" />
            <input type="date" value={editing.hireDate} onChange={e => setEditing({ ...editing, hireDate: e.target.value })} placeholder="Fecha de contratación" />
            <select value={editing.positionId} onChange={e => setEditing({ ...editing, positionId: e.target.value })}>
              {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={editing.areaId} onChange={e => setEditing({ ...editing, areaId: e.target.value })}>
              {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <select value={editing.locationId} onChange={e => setEditing({ ...editing, locationId: e.target.value })}>
              {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <select value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={save} style={styles.btn}>Guardar</button>
              <button onClick={() => setModalOpen(false)} style={styles.btnAlt}>Cancelar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function AreasModule({ areas, setAreas }) {
  const [q, setQ] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = areas.filter(a => a.name.toLowerCase().includes(q.toLowerCase()))

  const save = () => {
    if (!editing.name) return alert('Nombre requerido')
    setAreas(prev => prev.some(p => p.id === editing.id) ? prev.map(p => p.id === editing.id ? editing : p) : [...prev, editing])
    setModalOpen(false)
  }

  const remove = (r) => {
    if (!confirm('Eliminar área?')) return
    setAreas(prev => prev.filter(p => p.id !== r.id))
  }

  return (
    <div>
      <div style={styles.moduleHeader}>
        <h2>Áreas</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Buscar área" value={q} onChange={e => setQ(e.target.value)} />
          <button onClick={() => { setEditing({ id: uid('area-'), name: '' }); setModalOpen(true) }} style={styles.btn}>Nueva</button>
          <button onClick={() => exportCSV('areas.csv', areas)} style={styles.btnAlt}>Exportar CSV</button>
        </div>
      </div>

      <Table columns={[{ key: 'name', title: 'Nombre' }]} data={filtered} onEdit={(r) => { setEditing(r); setModalOpen(true) }} onDelete={remove} />

      <Modal open={modalOpen} title="Área" onClose={() => setModalOpen(false)}>
        {editing && (
          <div style={{ display: 'grid', gap: 8 }}>
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Nombre área" />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={save} style={styles.btn}>Guardar</button>
              <button onClick={() => setModalOpen(false)} style={styles.btnAlt}>Cancelar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function SimpleListModule({ title, dataKey, items, setItems, columns }) {
  const [q, setQ] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = items.filter(i => JSON.stringify(i).toLowerCase().includes(q.toLowerCase()))

  const openCreate = () => { setEditing({ id: uid(dataKey) }); setModalOpen(true) }
  const save = () => {
    setItems(prev => prev.some(p => p.id === editing.id) ? prev.map(p => p.id === editing.id ? editing : p) : [...prev, editing])
    setModalOpen(false)
  }
  const remove = (r) => { if (!confirm('Eliminar?')) return; setItems(prev => prev.filter(p => p.id !== r.id)) }

  return (
    <div>
      <div style={styles.moduleHeader}>
        <h2>{title}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder={`Buscar ${title}`} value={q} onChange={e => setQ(e.target.value)} />
          <button onClick={openCreate} style={styles.btn}>Nuevo</button>
          <button onClick={() => exportCSV(`${dataKey}.csv`, items)} style={styles.btnAlt}>Exportar CSV</button>
        </div>
      </div>

      <Table columns={columns} data={filtered} onEdit={(r) => { setEditing(r); setModalOpen(true) }} onDelete={remove} />

      <Modal open={modalOpen} title={title} onClose={() => setModalOpen(false)}>
        {editing && (
          <div style={{ display: 'grid', gap: 8 }}>
            {Object.keys(editing).filter(k => k !== 'id').map(k => (
              <input key={k} value={editing[k] ?? ''} onChange={e => setEditing({ ...editing, [k]: e.target.value })} placeholder={k} />
            ))}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={save} style={styles.btn}>Guardar</button>
              <button onClick={() => setModalOpen(false)} style={styles.btnAlt}>Cancelar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ---------- Main Dashboard ----------
export default function Dashboard({ user, onLogout }) {
  const [areas, setAreas] = useLocalState('brisas:areas', initialAreas)
  const [empleados, setEmpleados] = useLocalState('brisas:empleados', initialEmpleados)
  const [inductionEmployees, setInductionEmployees] = useLocalState('brisas:inductionEmployees', initialInductionEmployees)
  const [asistencias, setAsistencias] = useLocalState('brisas:asistencias', initialAsistencias)
  const [applications, setApplications] = useLocalState('brisas:applications', initialApplications)
  const [contratos, setContratos] = useLocalState('brisas:contratos', initialContratos)
  const [horarios, setHorarios] = useLocalState('brisas:horarios', initialHorarios)
  const [procesos, setProcesos] = useLocalState('brisas:procesos', initialProcesos)
  const [certificados, setCertificados] = useLocalState('brisas:certificados', initialCertificados)
  const [users, setUsers] = useLocalState('brisas:users', initialUsers)
  const [roles, setRoles] = useLocalState('brisas:roles', initialRoles)
  const [permissions, setPermissions] = useLocalState('brisas:permissions', initialPermissions)
  const [positions, setPositions] = useLocalState('brisas:positions', initialPositions)
  const [locations, setLocations] = useLocalState('brisas:locations', initialLocations)
  const [inductions, setInductions] = useLocalState('brisas:inductions', initialInductions)
  const [modules, setModules] = useLocalState('brisas:modules', initialModules)
  const [questions, setQuestions] = useLocalState('brisas:questions', initialQuestions)
  const [answers, setAnswers] = useLocalState('brisas:answers', initialAnswers)
  const [applicationTypes, setApplicationTypes] = useLocalState('brisas:applicationTypes', initialApplicationTypes)

  const items = useMemo(() => ([
    { key: 'dashboard', label: 'Resumen', icon: '🏠' },
    { key: 'users', label: 'Usuarios', icon: '👤' },
    { key: 'roles', label: 'Roles', icon: '🔑' },
    { key: 'permissions', label: 'Permisos', icon: '🛡️' },
    { key: 'empleados', label: 'Empleados', icon: '👥' },
    { key: 'positions', label: 'Posiciones', icon: '💼' },
    { key: 'locations', label: 'Ubicaciones', icon: '📍' },
    { key: 'areas', label: 'Áreas', icon: '🏢' },
    { key: 'inductions', label: 'Inducciones', icon: '🎓' },
    { key: 'modules', label: 'Módulos', icon: '📚' },
    { key: 'questions', label: 'Preguntas', icon: '❓' },
    { key: 'answers', label: 'Respuestas', icon: '✅' },
    { key: 'inductionEmployees', label: 'Inducción Empleados', icon: '👨‍🎓' },
    { key: 'asistencia', label: 'Asistencia', icon: '⏰' },
    { key: 'horarios', label: 'Horarios', icon: '🕘' },
    { key: 'applications', label: 'Solicitudes', icon: '📩' },
    { key: 'applicationTypes', label: 'Tipos de Solicitud', icon: '📋' },
    { key: 'contratos', label: 'Contratos', icon: '📄' },
    { key: 'certificados', label: 'Certificados', icon: '📜' },
    { key: 'procesos', label: 'Disciplinares', icon: '⚖️' },
  ]), [])

  const [active, setActive] = useLocalState('brisas:active', 'dashboard')

  function resetData() {
    if (!confirm('Resetear datos a los valores iniciales?')) return
    setAreas(initialAreas)
    setEmpleados(initialEmpleados)
    setInductionEmployees(initialInductionEmployees)
    setAsistencias(initialAsistencias)
    setApplications(initialApplications)
    setContratos(initialContratos)
    setHorarios(initialHorarios)
    setProcesos(initialProcesos)
    setCertificados(initialCertificados)
    setUsers(initialUsers)
    setRoles(initialRoles)
    setPermissions(initialPermissions)
    setPositions(initialPositions)
    setLocations(initialLocations)
    setInductions(initialInductions)
    setModules(initialModules)
    setQuestions(initialQuestions)
    setAnswers(initialAnswers)
    setApplicationTypes(initialApplicationTypes)
  }

  // Compute chart data
  const employeesByArea = useMemo(() => {
    const areaCounts = areas.reduce((acc, area) => {
      acc[area.name] = empleados.filter(e => e.areaId === area.id).length
      return acc
    }, {})
    return Object.entries(areaCounts).map(([name, count]) => ({ name, count }))
  }, [areas, empleados])

  const attendanceStatus = useMemo(() => {
    const statusCounts = asistencias.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1
      return acc
    }, {})
    return Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }))
  }, [asistencias])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div style={styles.page}>
      <Sidebar items={items} active={active} onChange={setActive} />
      <div style={styles.main}>
        <Topbar title="Panel Brisas - Gestión de Talento" user={user} onLogout={onLogout} />

        <div style={styles.content}>
          {active === 'dashboard' && (
            <div>
              <h2>Resumen general</h2>
              <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                <Card title="👥 Empleados" value={empleados.length} />
                <Card title="👤 Usuarios" value={users.length} />
                <Card title="📩 Solicitudes" value={applications.length} />
                <Card title="📄 Contratos" value={contratos.length} />
                <Card title="⏰ Asistencias (hoy)" value={asistencias.filter(a => a.date === new Date().toISOString().slice(0, 10)).length} />
                <Card title="🏢 Áreas" value={areas.length} />
                <Card title="💼 Posiciones" value={positions.length} />
                <Card title="📍 Ubicaciones" value={locations.length} />
              </div>

              <div style={{ display: 'flex', gap: 20, marginTop: 30, flexWrap: 'wrap' }}>
                <div style={styles.chartContainer}>
                  <h3>Empleados por Área</h3>
                  <BarChart width={400} height={300} data={employeesByArea}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                  <button onClick={() => setActive('asistencia')} style={styles.btnAlt}>⏰ Ver Asistencias</button>
                  <button onClick={resetData} style={{ ...styles.btnAlt, background: '#f3f3f3' }}>🔄 Resetear datos</button>
                </div>
              </div>
            </div>
          )}

          {active === 'empleados' && <EmpleadosModule empleados={empleados} setEmpleados={setEmpleados} areas={areas} positions={positions} locations={locations} />}
          {active === 'areas' && <AreasModule areas={areas} setAreas={setAreas} />}

          {active === 'inductionEmployees' && (
            <SimpleListModule title="Inducción Empleados" dataKey="inductionEmployees" items={inductionEmployees} setItems={setInductionEmployees} columns={[{ key: 'inductionId', title: 'Inducción', render: v => inductions.find(i => i.id === v)?.name || v }, { key: 'employeeId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.firstName + ' ' + empleados.find(e => e.id === v)?.lastName || v }, { key: 'status', title: 'Estado' }, { key: 'visto', title: 'Visto' }]} />
          )}

          {active === 'asistencia' && (
            <SimpleListModule title="Asistencias" dataKey="asistencia" items={asistencias} setItems={setAsistencias} columns={[{ key: 'employeeId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.firstName + ' ' + empleados.find(e => e.id === v)?.lastName || v }, { key: 'date', title: 'Fecha' }, { key: 'checkIn', title: 'Entrada' }, { key: 'checkOut', title: 'Salida' }, { key: 'status', title: 'Estado' }]} />
          )}

          {active === 'applications' && (
            <SimpleListModule title="Solicitudes" dataKey="applications" items={applications} setItems={setApplications} columns={[{ key: 'employeeId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.firstName + ' ' + empleados.find(e => e.id === v)?.lastName || v }, { key: 'typeId', title: 'Tipo', render: v => applicationTypes.find(t => t.id === v)?.name || v }, { key: 'status', title: 'Estado' }, { key: 'date', title: 'Fecha' }, { key: 'description', title: 'Descripción' }]} />
          )}

          {active === 'contratos' && (
            <SimpleListModule title="Contratos" dataKey="contratos" items={contratos} setItems={setContratos} columns={[{ key: 'employeeId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.firstName + ' ' + empleados.find(e => e.id === v)?.lastName || v }, { key: 'startDate', title: 'Inicio' }, { key: 'endDate', title: 'Fin' }, { key: 'type', title: 'Tipo' }, { key: 'status', title: 'Estado' }, { key: 'value', title: 'Valor' }]} />
          )}

          {active === 'horarios' && (
            <SimpleListModule title="Horarios" dataKey="horarios" items={horarios} setItems={setHorarios} columns={[{ key: 'name', title: 'Nombre' }, { key: 'startTime', title: 'Inicio' }, { key: 'endTime', title: 'Fin' }, { key: 'dayWeek', title: 'Día' }, { key: 'shift', title: 'Turno' }]} />
          )}

          {active === 'procesos' && (
            <SimpleListModule title="Procesos disciplinarios" dataKey="procesos" items={procesos} setItems={setProcesos} columns={[{ key: 'employeeId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.firstName + ' ' + empleados.find(e => e.id === v)?.lastName || v }, { key: 'reason', title: 'Motivo' }, { key: 'status', title: 'Estado' }, { key: 'date', title: 'Fecha' }]} />
          )}

          {active === 'certificados' && (
            <SimpleListModule title="Certificados" dataKey="certificados" items={certificados} setItems={setCertificados} columns={[{ key: 'employeeId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.firstName + ' ' + empleados.find(e => e.id === v)?.lastName || v }, { key: 'type', title: 'Tipo' }, { key: 'issueDate', title: 'Fecha Emisión' }, { key: 'expiryDate', title: 'Fecha Expiración' }, { key: 'status', title: 'Estado' }]} />
          )}

          {active === 'users' && <SimpleListModule title="Usuarios" dataKey="users" items={users} setItems={setUsers} columns={[{ key: 'username', title: 'Usuario' }, { key: 'email', title: 'Email' }, { key: 'status', title: 'Estado' }]} />}
          {active === 'roles' && <SimpleListModule title="Roles" dataKey="roles" items={roles} setItems={setRoles} columns={[{ key: 'name', title: 'Nombre' }]} />}
          {active === 'permissions' && <SimpleListModule title="Permisos" dataKey="permissions" items={permissions} setItems={setPermissions} columns={[{ key: 'name', title: 'Nombre' }]} />}
          {active === 'positions' && <SimpleListModule title="Posiciones" dataKey="positions" items={positions} setItems={setPositions} columns={[{ key: 'name', title: 'Nombre' }, { key: 'description', title: 'Descripción' }]} />}
          {active === 'locations' && <SimpleListModule title="Ubicaciones" dataKey="locations" items={locations} setItems={setLocations} columns={[{ key: 'name', title: 'Nombre' }, { key: 'address', title: 'Dirección' }]} />}
          {active === 'inductions' && <SimpleListModule title="Inducciones" dataKey="inductions" items={inductions} setItems={setInductions} columns={[{ key: 'name', title: 'Nombre' }, { key: 'description', title: 'Descripción' }, { key: 'type', title: 'Tipo' }, { key: 'status', title: 'Estado' }]} />}
          {active === 'modules' && <SimpleListModule title="Módulos" dataKey="modules" items={modules} setItems={setModules} columns={[{ key: 'inductionId', title: 'Inducción', render: v => inductions.find(i => i.id === v)?.name || v }, { key: 'name', title: 'Nombre' }, { key: 'content', title: 'Contenido' }]} />}
          {active === 'questions' && <SimpleListModule title="Preguntas" dataKey="questions" items={questions} setItems={setQuestions} columns={[{ key: 'moduleId', title: 'Módulo', render: v => modules.find(m => m.id === v)?.name || v }, { key: 'question', title: 'Pregunta' }, { key: 'type', title: 'Tipo' }]} />}
          {active === 'answers' && <SimpleListModule title="Respuestas" dataKey="answers" items={answers} setItems={setAnswers} columns={[{ key: 'questionId', title: 'Pregunta', render: v => questions.find(q => q.id === v)?.question || v }, { key: 'answer', title: 'Respuesta' }, { key: 'isCorrect', title: 'Correcta' }]} />}
          {active === 'applicationTypes' && <SimpleListModule title="Tipos de Solicitud" dataKey="applicationTypes" items={applicationTypes} setItems={setApplicationTypes} columns={[{ key: 'name', title: 'Nombre' }]} />}
        </div>
      </div>
    </div>
  )
}

// ---------- Styles (simple inline styles to avoid external CSS) ----------
const styles = {
  page: { display: 'flex', height: '100vh', width: '100vw', background: '#f7f8fb', margin: 0 },
  sidebar: { width: 250, padding: 18, borderRight: '1px solid #e6e9ef', background: '#fff', overflowY: 'auto' },
  navItem: { padding: '12px 8px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: 4 },
  navItemActive: { background: '#e6f4ff', fontWeight: 700 },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  topbar: { height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', borderBottom: '1px solid #eee', background: '#fff' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { padding: '6px 12px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  content: { padding: 18, flex: 1, overflowY: 'auto' },
  chartContainer: { background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', minWidth: 400, flex: 1 },
  moduleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  card: { padding: 12, borderRadius: 8, background: '#fff', minWidth: 160, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 12, background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  btn: { padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  btnAlt: { padding: '8px 12px', background: '#fff', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' },
  btnSmall: { padding: '6px 8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: { width: 640, maxWidth: '95%', background: '#fff', padding: 18, borderRadius: 8 },
}
