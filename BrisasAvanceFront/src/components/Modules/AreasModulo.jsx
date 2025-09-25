import { useState } from 'react';
import Table from '../Comunes/tabla';
import Modal from '../Layout/Modal';
import { exportCSV } from '../Comunes/Utils/exportCSV';

const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9);

export default function AreasModule({ areas, setAreas }) {
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = areas.filter(a => a.name && a.name.toLowerCase().includes(q.toLowerCase()));

  const save = () => {
    if (!editing.name) return alert('Nombre requerido');
    setAreas(prev =>
      prev.some(p => p.id === editing.id)
        ? prev.map(p => (p.id === editing.id ? editing : p))
        : [...prev, editing]
    );
    setModalOpen(false);
  };

  const remove = r => {
    if (!confirm('Eliminar área?')) return;
    setAreas(prev => prev.filter(p => p.id !== r.id));
  };

  return (
    <div>
      <div style={styles.moduleHeader}>
        <h2>Áreas</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Buscar área" value={q} onChange={e => setQ(e.target.value)} style={styles.searchInput} />
          <button onClick={() => { setEditing({ id: uid('area-'), name: '' }); setModalOpen(true); }} style={styles.btn}>Nueva</button>
          <button onClick={() => exportCSV('areas.csv', areas)} style={styles.btnAlt}>Exportar CSV</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No hay áreas disponibles</p>
      ) : (
        <Table columns={[{ key: 'name', title: 'Nombre' }]} data={filtered} onEdit={r => { setEditing(r); setModalOpen(true); }} onDelete={remove} />
      )}

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
  );
}

const styles = {
  moduleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchInput: {
    background: '#fff',
    color: '#000',
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 14,
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
