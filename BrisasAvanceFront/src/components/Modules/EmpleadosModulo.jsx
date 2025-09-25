import { useState } from 'react';
import Table from '../Comunes/tabla';
import Modal from '../Layout/Modal';
import { exportCSV } from '../Comunes/Utils/exportCSV';

const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9);

export default function EmpleadosModule({ 
    empleados, 
    setEmpleados, 
    areas, 
    positions, 
    locations
 }) {
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = empleados.filter(e =>
    (`${e.firstName} ${e.lastName}`.toLowerCase().includes(q.toLowerCase()) ||
      e.document?.toLowerCase().includes(q.toLowerCase()))
  );

  function openCreate() {
    setEditing({
      id: uid('emp-'),
      firstName: '',
      lastName: '',
      document: '',
      hireDate: '',
      positionId: positions[0]?.id ?? '',
      areaId: areas[0]?.id ?? '',
      locationId: locations[0]?.id ?? '',
      status: 'ACTIVE',
    });
    setModalOpen(true);
  }

  function save() {
    if (!editing.firstName) return alert('Nombre es requerido');
    setEmpleados(prev => {
      const exists = prev.some(p => p.id === editing.id);
      if (exists) return prev.map(p => (p.id === editing.id ? editing : p));
      return [...prev, editing];
    });
    setModalOpen(false);
  }

  function remove(row) {
    if (!confirm('Eliminar empleado?')) return;
    setEmpleados(prev => prev.filter(p => p.id !== row.id));
  }

  return (
    <div>
      <div style={styles.moduleHeader}>
        <h2>Empleados</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Buscar empleado"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button onClick={openCreate} style={styles.btn}>Nuevo</button>
          <button onClick={() => exportCSV('empleados.csv', empleados)} style={styles.btnAlt}>Exportar CSV</button>
        </div>
      </div>

      <Table
        columns={[
          { key: 'firstName', title: 'Nombre' },
          { key: 'lastName', title: 'Apellido' },
          { key: 'document', title: 'Documento' },
          { key: 'positionId', title: 'Posición', render: v => positions.find(p => p.id === v)?.name || '-' },
          { key: 'areaId', title: 'Área', render: v => areas.find(a => a.id === v)?.name || '-' },
          { key: 'locationId', title: 'Ubicación', render: v => locations.find(l => l.id === v)?.name || '-' },
          { key: 'status', title: 'Estado' },
        ]}
        data={filtered}
        onEdit={r => { setEditing(r); setModalOpen(true); }}
        onDelete={remove}
      />

      <Modal open={modalOpen} title={editing ? 'Empleado' : 'Nuevo empleado'} onClose={() => setModalOpen(false)}>
        {editing && (
          <div style={{ display: 'grid', gap: 8 }}>
            <input value={editing.firstName} onChange={e => setEditing({ ...editing, firstName: e.target.value })} placeholder="Nombre" />
            <input value={editing.lastName} onChange={e => setEditing({ ...editing, lastName: e.target.value })} placeholder="Apellido" />
            <input value={editing.document} onChange={e => setEditing({ ...editing, document: e.target.value })} placeholder="Documento" />
            <input type="date" value={editing.hireDate} onChange={e => setEditing({ ...editing, hireDate: e.target.value })} />
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
  );
}

const styles = {
  moduleHeader: { 
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'center' 
},
  btn: { 
    padding: '8px 12px', 
    background: '#2563eb', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 6, 
    cursor: 'pointer' 
},
  btnAlt: {
    padding: '8px 12px', 
    background: '#ff0101ff', 
    border: '1px solid #ddd', 
    borderRadius: 6, 
    cursor: 'pointer' 
},
};
