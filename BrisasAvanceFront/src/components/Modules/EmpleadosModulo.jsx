import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import Table from '../Comunes/tabla';
import Modal from '../Layout/Modal';
import { exportCSV } from '../Comunes/Utils/exportCSV';
import Swal from 'sweetalert2';
import { Document, Page, pdfjs } from 'react-pdf';

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  const [detailedEmployee, setDetailedEmployee] = useState(null);
  const [detailedOpen, setDetailedOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [filterArea, setFilterArea] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = empleados.filter(e =>
    (`${e.firstName} ${e.lastName}`.toLowerCase().includes(q.toLowerCase()) ||
      e.document?.toLowerCase().includes(q.toLowerCase())) &&
    (filterArea === '' || e.areaId === filterArea) &&
    (filterPosition === '' || e.positionId === filterPosition) &&
    (filterStatus === '' || e.status === filterStatus)
  );

  const columns = [
    { key: 'firstName', title: 'Nombre' },
    { key: 'lastName', title: 'Apellido' },
    { key: 'document', title: 'Documento' },
    { key: 'positionId', title: 'Posición', render: (val) => positions.find(p => p.id === val)?.name || '-' },
    { key: 'areaId', title: 'Área', render: (val) => areas.find(a => a.id === val)?.name || '-' },
    { key: 'status', title: 'Estado' },
  ];

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
      photo: '',
      phone: '',
      email: '',
      skills: '',
      experience: '',
      achievements: '',
      resumeUrl: '',
      isNew: true,
    });
    setModalOpen(true);
  }

  function save() {
    if (!editing.firstName) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Nombre es requerido'
      });
      return;
    }
    setEmpleados(prev => {
      const exists = prev.some(p => p.id === editing.id);
      if (exists) return prev.map(p => (p.id === editing.id ? editing : p));
      return [...prev, editing];
    });
    toast.success(editing.isNew ? "Empleado creado exitosamente" : "Empleado actualizado exitosamente");
    setModalOpen(false);
  }

  function remove(row) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Eliminar empleado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setEmpleados(prev => prev.filter(p => p.id !== row.id));
        toast.success("Empleado eliminado exitosamente");
      }
    });
  }

  const modalSpring = useSpring({ opacity: detailedOpen ? 1 : 0, transform: detailedOpen ? 'scale(1)' : 'scale(0.8)', config: { tension: 300, friction: 20 } });

  return (
    <div>
      <div style={styles.moduleHeader}>
        <h2>Empleados</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Buscar empleado"
            value={q}
            onChange={e => setQ(e.target.value)}
            style={styles.searchInput}
          />
          <button data-tip="Crear nuevo empleado" onClick={openCreate} style={styles.btn}>Nuevo</button>
          <button data-tip="Exportar empleados a CSV" onClick={() => exportCSV('empleados.csv', empleados)} style={styles.btnAlt}>Exportar CSV</button>
        </div>
      </div>

      <div style={styles.filters}>
        <select value={filterArea} onChange={e => setFilterArea(e.target.value)} style={styles.select}>
          <option value="">Todas las Áreas</option>
          {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select value={filterPosition} onChange={e => setFilterPosition(e.target.value)} style={styles.select}>
          <option value="">Todas las Posiciones</option>
          {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={styles.select}>
          <option value="">Todos los Estados</option>
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
        </select>
      </div>

      <Table
        columns={columns}
        data={filtered}
        onEdit={(row) => { setEditing(row); setModalOpen(true); }}
        onDelete={remove}
        onRowClick={(row) => { setDetailedEmployee(row); setDetailedOpen(true); }}
      />

      <Modal open={modalOpen} title={editing?.isNew ? 'Nuevo empleado' : 'Empleado'} onClose={() => setModalOpen(false)}>
        {editing && (
          <div style={{ display: 'grid', gap: 8 }}>
            <input value={editing.firstName} onChange={e => setEditing({ ...editing, firstName: e.target.value })} placeholder="Nombre" />
            <input value={editing.lastName} onChange={e => setEditing({ ...editing, lastName: e.target.value })} placeholder="Apellido" />
            <input value={editing.document} onChange={e => setEditing({ ...editing, document: e.target.value })} placeholder="Documento" />
            <input type="date" value={editing.hireDate} onChange={e => setEditing({ ...editing, hireDate: e.target.value })} />
            <input value={editing.photo} onChange={e => setEditing({ ...editing, photo: e.target.value })} placeholder="Foto URL" />
            <input value={editing.phone} onChange={e => setEditing({ ...editing, phone: e.target.value })} placeholder="Teléfono" />
            <input value={editing.email} onChange={e => setEditing({ ...editing, email: e.target.value })} placeholder="Email" />
            <textarea value={editing.skills} onChange={e => setEditing({ ...editing, skills: e.target.value })} placeholder="Habilidades" />
            <textarea value={editing.experience} onChange={e => setEditing({ ...editing, experience: e.target.value })} placeholder="Experiencia" />
            <textarea value={editing.achievements} onChange={e => setEditing({ ...editing, achievements: e.target.value })} placeholder="Logros" />
            <input value={editing.resumeUrl} onChange={e => setEditing({ ...editing, resumeUrl: e.target.value })} placeholder="CV URL" />
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
              <button data-tip="Guardar cambios" onClick={save} style={styles.btn}>Guardar</button>
              <button data-tip="Cancelar y cerrar" onClick={() => setModalOpen(false)} style={styles.btnAlt}>Cancelar</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={detailedOpen} title={`${detailedEmployee?.firstName} ${detailedEmployee?.lastName}`} onClose={() => setDetailedOpen(false)} style={{ width: '90%', maxWidth: '800px' }}>
        {detailedEmployee && (
          <animated.div style={{ ...styles.detailedContainer, ...modalSpring }}>
            <div style={styles.modalActions}>
              <button data-tip="Editar empleado" onClick={() => { setEditing(detailedEmployee); setModalOpen(true); }} style={styles.btn}>Editar</button>
              <button data-tip="Eliminar empleado" onClick={() => remove(detailedEmployee)} style={styles.btnAlt}>Eliminar</button>
            </div>
            <div style={styles.detailedHeader}>
              <img src={detailedEmployee.photo || '/assets/img/profile.png'} alt={`${detailedEmployee.firstName} ${detailedEmployee.lastName}`} style={styles.detailedImg} />
              <div style={styles.detailedInfo}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 10px 0' }}>{detailedEmployee.firstName} {detailedEmployee.lastName}</h2>
                <p><strong>Posición:</strong> {positions.find(p => p.id === detailedEmployee.positionId)?.name || '-'}</p>
                <p><strong>Área:</strong> {areas.find(a => a.id === detailedEmployee.areaId)?.name || '-'}</p>
                <p><strong>Ubicación:</strong> {locations.find(l => l.id === detailedEmployee.locationId)?.name || '-'}</p>
                <p><strong>Estado:</strong> {detailedEmployee.status}</p>
              </div>
            </div>
            <div style={styles.detailedSections}>
              <div style={styles.section}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 10px 0' }}>Información de Contacto</h3>
                <p><strong>Teléfono:</strong> {detailedEmployee.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {detailedEmployee.email || 'N/A'}</p>
              </div>
              <div style={styles.section}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 10px 0' }}>Habilidades</h3>
                <p>{detailedEmployee.skills || 'N/A'}</p>
              </div>
              <div style={styles.section}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 10px 0' }}>Experiencia</h3>
                <p>{detailedEmployee.experience || 'N/A'}</p>
              </div>
              <div style={styles.section}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 10px 0' }}>Logros</h3>
                <p>{detailedEmployee.achievements || 'N/A'}</p>
              </div>
            </div>
            {detailedEmployee.resumeUrl && (
              <div style={styles.pdfSection}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 10px 0' }}>CV / Resume</h3>
                <div style={styles.pdfViewer}>
                  <Document
                    file={detailedEmployee.resumeUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                  </Document>
                </div>
              </div>
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
    marginBottom: '20px'
  },
  searchInput: {
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 14,
  },
  btn: {
    padding: '8px 12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  btnAlt: {
    padding: '8px 12px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  select: {
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 14,
  },
  detailedContainer: {
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginBottom: '20px'
  },
  detailedHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '20px',
    background: '#f8f9fa',
    color: '#333',
    borderRadius: '10px',
    border: '1px solid #dee2e6',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  detailedImg: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginRight: '20px',
    objectFit: 'cover',
    border: '3px solid #fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  detailedInfo: {
    flex: 1
  },
  detailedSections: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  section: {
    background: '#fff',
    color: 'var(--text-primary)',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  pdfSection: {
    marginTop: '20px'
  },
  pdfViewer: {
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '10px',
    maxHeight: '400px',
    overflowY: 'auto'
  }
};

