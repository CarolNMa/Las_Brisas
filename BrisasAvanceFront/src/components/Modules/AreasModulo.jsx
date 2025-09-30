import { useState, useMemo } from 'react';
import { useSpring, useTransition, animated } from 'react-spring';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import Table from '../Comunes/tabla';
import Modal from '../Layout/Modal';
import { exportCSV } from '../Comunes/Utils/exportCSV';
import Swal from 'sweetalert2';

const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9);

export default function AreasModule({ areas, setAreas, empleados }) {
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailedOpen, setDetailedOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [minCount, setMinCount] = useState('');
  const [maxCount, setMaxCount] = useState('');

  // Calculate employee count per area
  const areasWithCount = useMemo(() => {
    return areas.map(area => ({
      ...area,
      employeeCount: empleados.filter(e => e.areaId === area.id).length
    }));
  }, [areas, empleados]);

  // Filtered areas
  const filtered = areasWithCount.filter(a =>
    (a.name && a.name.toLowerCase().includes(q.toLowerCase())) &&
    (minCount === '' || a.employeeCount >= parseInt(minCount)) &&
    (maxCount === '' || a.employeeCount <= parseInt(maxCount))
  );

  const columns = [
    { key: 'name', title: 'Nombre' },
    { key: 'description', title: 'Descripción' },
    { key: 'employeeCount', title: 'Empleados' },
  ];

  const save = () => {
    if (!editing.name) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Nombre requerido'
      });
      return;
    }
    setAreas(prev =>
      prev.some(p => p.id === editing.id)
        ? prev.map(p => (p.id === editing.id ? editing : p))
        : [...prev, editing]
    );
    toast.success(editing.isNew ? "Área creada exitosamente" : "Área actualizada exitosamente");
    setModalOpen(false);
  };

  const remove = r => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Eliminar área?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setAreas(prev => prev.filter(p => p.id !== r.id));
        toast.success("Área eliminada exitosamente");
      }
    });
  };

  const modalSpring = useSpring({
    opacity: detailedOpen ? 1 : 0,
    transform: detailedOpen ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 300, friction: 20 }
  });

  const buttonTransitions = useTransition(detailedOpen, {
    from: { opacity: 0, transform: 'translateY(20px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(20px)' },
    config: { tension: 200, friction: 15 }
  });

  const employeesInArea = selectedArea ? empleados.filter(e => e.areaId === selectedArea.id) : [];

  return (
    <div>
      <div style={styles.moduleHeader}>
        <h2>Áreas</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            placeholder="Buscar área"
            value={q}
            onChange={e => setQ(e.target.value)}
            style={styles.searchInput}
          />
          <input
            type="number"
            placeholder="Min empleados"
            value={minCount}
            onChange={e => setMinCount(e.target.value)}
            style={styles.filterInput}
          />
          <input
            type="number"
            placeholder="Max empleados"
            value={maxCount}
            onChange={e => setMaxCount(e.target.value)}
            style={styles.filterInput}
          />
          <button data-tip="Crear nueva área" onClick={() => { setEditing({ id: uid('area-'), name: '', description: '', isNew: true }); setModalOpen(true); }} style={styles.btn}>Nueva</button>
          <button data-tip="Exportar áreas a CSV" onClick={() => exportCSV('areas.csv', areas)} style={styles.btnAlt}>Exportar CSV</button>
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        onEdit={(row) => { setEditing(row); setModalOpen(true); }}
        onDelete={remove}
        onRowClick={(row) => { setSelectedArea(row); setDetailedOpen(true); }}
      />

      <Modal open={modalOpen} title={editing?.isNew ? 'Nueva área' : 'Área'} onClose={() => setModalOpen(false)}>
        {editing && (
          <div style={{ display: 'grid', gap: 8 }}>
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Nombre área" />
            <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Descripción" rows={3} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button data-tip="Guardar cambios" onClick={save} style={styles.btn}>Guardar</button>
              <button data-tip="Cancelar y cerrar" onClick={() => setModalOpen(false)} style={styles.btnAlt}>Cancelar</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={detailedOpen} title={selectedArea?.name} onClose={() => setDetailedOpen(false)} style={{ width: '90%', maxWidth: '800px' }}>
        {selectedArea && (
          <animated.div style={{ ...styles.detailedContainer, ...modalSpring }}>
            <div style={styles.detailedHeader}>
              <h2>{selectedArea.name}</h2>
              <p>{selectedArea.description}</p>
              <p><strong>Empleados:</strong> {selectedArea.employeeCount}</p>
            </div>
            <div style={styles.employeeList}>
              <h3>Empleados en esta área:</h3>
              {employeesInArea.length > 0 ? (
                <ul>
                  {employeesInArea.map(e => (
                    <li key={e.id}>{e.firstName} {e.lastName}</li>
                  ))}
                </ul>
              ) : (
                <p>No hay empleados asignados.</p>
              )}
            </div>
            {buttonTransitions((style, item) =>
              item && (
                <animated.div style={{ ...styles.modalActions, ...style }}>
                  <button data-tip="Editar área" onClick={() => { setEditing(selectedArea); setModalOpen(true); }} style={styles.btn}>Editar</button>
                  <button data-tip="Eliminar área" onClick={() => remove(selectedArea)} style={styles.btnAlt}>Eliminar</button>
                </animated.div>
              )
            )}
          </animated.div>
        )}
      </Modal>
      <Tooltip />
    </div>
  );
}

const styles = {
  moduleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  searchInput: {
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 14,
    minWidth: '150px'
  },
  filterInput: {
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 14,
    width: '120px'
  },
  btn: {
    padding: '8px 12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  btnAlt: {
    padding: '8px 12px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  detailedContainer: {
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  detailedHeader: {
    marginBottom: '20px',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    borderRadius: '10px'
  },
  employeeList: {
    marginBottom: '20px'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  }
};
