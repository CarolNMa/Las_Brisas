import React, { useEffect, useMemo, useState } from 'react'

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
  { id: 'area-1', nombre: 'Recursos Humanos' },
  { id: 'area-2', nombre: 'Desarrollo' },
  { id: 'area-3', nombre: 'Operaciones' },
]

const initialEmpleados = [
  { id: 'emp-1', nombre: 'Karol', apellido: 'Pérez', cargo: 'Desarrolladora', areaId: 'area-2', estado: 'Activo' },
  { id: 'emp-2', nombre: 'Miguel', apellido: 'Gómez', cargo: 'Analista', areaId: 'area-1', estado: 'Activo' },
]

const initialInducciones = [
  { id: 'ind-1', empleadoId: 'emp-1', fecha: '2025-07-10', completada: true },
]

const initialAsistencias = [
  { id: 'asis-1', empleadoId: 'emp-1', fecha: '2025-09-01', entrada: '08:00', salida: '17:00' },
]

const initialSolicitudes = [
  { id: 'sol-1', empleadoId: 'emp-2', tipo: 'Vacaciones', estado: 'Pendiente', fecha: '2025-08-20' },
]

const initialContratos = [
  { id: 'con-1', empleadoId: 'emp-2', inicio: '2024-01-01', fin: '2025-12-31', tipo: 'Término fijo', valor: 5500000 },
]

const initialHorarios = [
  { id: 'hor-1', nombre: 'Jornada diurna', inicio: '08:00', fin: '17:00' },
]

const initialProcesos = [
  { id: 'pd-1', empleadoId: 'emp-2', motivo: 'Retrasos reiterados', estado: 'En proceso', fecha: '2025-07-01' },
]

const initialCertificados = [
  { id: 'cert-1', empleadoId: 'emp-1', tipo: 'Asistencia', fecha: '2025-06-30', url: '' },
]

function Topbar({ title }) {
  return (
    <div style={styles.topbar}>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={styles.avatar}>K</div>
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

function EmpleadosModule({ empleados, setEmpleados, areas }) {
  const [q, setQ] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const filtered = empleados.filter(e => (`${e.nombre} ${e.apellido}`.toLowerCase().includes(q.toLowerCase()) || e.cargo?.toLowerCase().includes(q.toLowerCase())))

  function openCreate() {
    setEditing({ id: uid('emp-'), nombre: '', apellido: '', cargo: '', areaId: areas[0]?.id ?? '', estado: 'Activo' })
    setModalOpen(true)
  }

  function save() {
    if (!editing.nombre) return alert('Nombre es requerido')
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
          { key: 'nombre', title: 'Nombre' },
          { key: 'apellido', title: 'Apellido' },
          { key: 'cargo', title: 'Cargo' },
          { key: 'areaId', title: 'Área', render: (v) => areas.find(a => a.id === v)?.nombre || '-' },
          { key: 'estado', title: 'Estado' },
        ]}
        data={filtered}
        onEdit={(r) => { setEditing(r); setModalOpen(true) }}
        onDelete={remove}
      />

      <Modal open={modalOpen} title={editing ? (editing.id ? 'Editar empleado' : 'Nuevo empleado') : 'Empleado'} onClose={() => setModalOpen(false)}>
        {editing && (
          <div style={{ display: 'grid', gap: 8 }}>
            <input value={editing.nombre} onChange={e => setEditing({ ...editing, nombre: e.target.value })} placeholder="Nombre" />
            <input value={editing.apellido} onChange={e => setEditing({ ...editing, apellido: e.target.value })} placeholder="Apellido" />
            <input value={editing.cargo} onChange={e => setEditing({ ...editing, cargo: e.target.value })} placeholder="Cargo" />
            <select value={editing.areaId} onChange={e => setEditing({ ...editing, areaId: e.target.value })}>
              {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            <select value={editing.estado} onChange={e => setEditing({ ...editing, estado: e.target.value })}>
              <option>Activo</option>
              <option>Inactivo</option>
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

  const filtered = areas.filter(a => a.nombre.toLowerCase().includes(q.toLowerCase()))

  const save = () => {
    if (!editing.nombre) return alert('Nombre requerido')
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
          <button onClick={() => { setEditing({ id: uid('area-'), nombre: '' }); setModalOpen(true) }} style={styles.btn}>Nueva</button>
          <button onClick={() => exportCSV('areas.csv', areas)} style={styles.btnAlt}>Exportar CSV</button>
        </div>
      </div>

      <Table columns={[{ key: 'nombre', title: 'Nombre' }]} data={filtered} onEdit={(r) => { setEditing(r); setModalOpen(true) }} onDelete={remove} />

      <Modal open={modalOpen} title="Área" onClose={() => setModalOpen(false)}>
        {editing && (
          <div style={{ display: 'grid', gap: 8 }}>
            <input value={editing.nombre} onChange={e => setEditing({ ...editing, nombre: e.target.value })} placeholder="Nombre área" />
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
export default function Dashboard() {
  const [areas, setAreas] = useLocalState('brisas:areas', initialAreas)
  const [empleados, setEmpleados] = useLocalState('brisas:empleados', initialEmpleados)
  const [inducciones, setInducciones] = useLocalState('brisas:inducciones', initialInducciones)
  const [asistencias, setAsistencias] = useLocalState('brisas:asistencias', initialAsistencias)
  const [solicitudes, setSolicitudes] = useLocalState('brisas:solicitudes', initialSolicitudes)
  const [contratos, setContratos] = useLocalState('brisas:contratos', initialContratos)
  const [horarios, setHorarios] = useLocalState('brisas:horarios', initialHorarios)
  const [procesos, setProcesos] = useLocalState('brisas:procesos', initialProcesos)
  const [certificados, setCertificados] = useLocalState('brisas:certificados', initialCertificados)

  const items = useMemo(() => ([
    { key: 'dashboard', label: 'Resumen', icon: '🏠' },
    { key: 'empleados', label: 'Empleados', icon: '👥' },
    { key: 'induccion', label: 'Inducción', icon: '🎓' },
    { key: 'asistencia', label: 'Asistencia', icon: '⏰' },
    { key: 'solicitudes', label: 'Solicitudes', icon: '📩' },
    { key: 'contratos', label: 'Contratos', icon: '📄' },
    { key: 'areas', label: 'Áreas', icon: '🏢' },
    { key: 'horarios', label: 'Horarios', icon: '🕘' },
    { key: 'procesos', label: 'Disciplinares', icon: '⚖️' },
    { key: 'certificados', label: 'Certificados', icon: '📜' },
  ]), [])

  const [active, setActive] = useLocalState('brisas:active', 'dashboard')

  function resetData() {
    if (!confirm('Resetear datos a los valores iniciales?')) return
    setAreas(initialAreas)
    setEmpleados(initialEmpleados)
    setInducciones(initialInducciones)
    setAsistencias(initialAsistencias)
    setSolicitudes(initialSolicitudes)
    setContratos(initialContratos)
    setHorarios(initialHorarios)
    setProcesos(initialProcesos)
    setCertificados(initialCertificados)
  }

  return (
    <div style={styles.page}>
      <Sidebar items={items} active={active} onChange={setActive} />
      <div style={styles.main}>
        <Topbar title="Panel Brisas - Gestión de Talento" />

        <div style={styles.content}>
          {active === 'dashboard' && (
            <div>
              <h2>Resumen general</h2>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <Card title="Empleados" value={empleados.length} />
                <Card title="Solicitudes" value={solicitudes.length} />
                <Card title="Contratos" value={contratos.length} />
                <Card title="Asistencias (hoy)" value={asistencias.filter(a => a.fecha === new Date().toISOString().slice(0, 10)).length} />
              </div>

              <div style={{ marginTop: 18 }}>
                <h3>Acciones</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => exportCSV('empleados_all.csv', empleados)} style={styles.btn}>Exportar Empleados</button>
                  <button onClick={() => exportCSV('solicitudes_all.csv', solicitudes)} style={styles.btnAlt}>Exportar Solicitudes</button>
                  <button onClick={resetData} style={{ ...styles.btnAlt, background: '#f3f3f3' }}>Resetear datos</button>
                </div>
              </div>
            </div>
          )}

          {active === 'empleados' && <EmpleadosModule empleados={empleados} setEmpleados={setEmpleados} areas={areas} />}
          {active === 'areas' && <AreasModule areas={areas} setAreas={setAreas} />}

          {active === 'induccion' && (
            <SimpleListModule title="Inducciones" dataKey="induccion" items={inducciones} setItems={setInducciones} columns={[{ key: 'empleadoId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.nombre || v }, { key: 'fecha', title: 'Fecha' }, { key: 'completada', title: 'Completada' }]} />
          )}

          {active === 'asistencia' && (
            <SimpleListModule title="Asistencias" dataKey="asistencia" items={asistencias} setItems={setAsistencias} columns={[{ key: 'empleadoId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.nombre || v }, { key: 'fecha', title: 'Fecha' }, { key: 'entrada', title: 'Entrada' }, { key: 'salida', title: 'Salida' }]} />
          )}

          {active === 'solicitudes' && (
            <SimpleListModule title="Solicitudes" dataKey="solicitudes" items={solicitudes} setItems={setSolicitudes} columns={[{ key: 'empleadoId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.nombre || v }, { key: 'tipo', title: 'Tipo' }, { key: 'estado', title: 'Estado' }, { key: 'fecha', title: 'Fecha' }]} />
          )}

          {active === 'contratos' && (
            <SimpleListModule title="Contratos" dataKey="contratos" items={contratos} setItems={setContratos} columns={[{ key: 'empleadoId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.nombre || v }, { key: 'inicio', title: 'Inicio' }, { key: 'fin', title: 'Fin' }, { key: 'tipo', title: 'Tipo' }, { key: 'valor', title: 'Valor' }]} />
          )}

          {active === 'horarios' && (
            <SimpleListModule title="Horarios" dataKey="horarios" items={horarios} setItems={setHorarios} columns={[{ key: 'nombre', title: 'Nombre' }, { key: 'inicio', title: 'Inicio' }, { key: 'fin', title: 'Fin' }]} />
          )}

          {active === 'procesos' && (
            <SimpleListModule title="Procesos disciplinarios" dataKey="procesos" items={procesos} setItems={setProcesos} columns={[{ key: 'empleadoId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.nombre || v }, { key: 'motivo', title: 'Motivo' }, { key: 'estado', title: 'Estado' }]} />
          )}

          {active === 'certificados' && (
            <SimpleListModule title="Certificados" dataKey="certificados" items={certificados} setItems={setCertificados} columns={[{ key: 'empleadoId', title: 'Empleado', render: v => empleados.find(e => e.id === v)?.nombre || v }, { key: 'tipo', title: 'Tipo' }, { key: 'fecha', title: 'Fecha' }]} />
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- Styles (simple inline styles to avoid external CSS) ----------
const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f7f8fb' },
  sidebar: { width: 220, padding: 18, borderRight: '1px solid #e6e9ef', background: '#fff' },
  navItem: { padding: '10px 8px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' },
  navItemActive: { background: '#e6f4ff', fontWeight: 700 },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  topbar: { height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', borderBottom: '1px solid #eee', background: '#fff' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#111827', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 18 },
  moduleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  card: { padding: 12, borderRadius: 8, background: '#fff', minWidth: 160, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 12, background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  btn: { padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  btnAlt: { padding: '8px 12px', background: '#fff', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer' },
  btnSmall: { padding: '6px 8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: { width: 640, maxWidth: '95%', background: '#fff', padding: 18, borderRadius: 8 },
}
