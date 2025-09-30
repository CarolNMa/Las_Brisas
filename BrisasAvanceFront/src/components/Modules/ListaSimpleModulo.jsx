
import { useState } from 'react';
import Modal from '../Layout/Modal';
import Table from '../Comunes/tabla';
import { exportCSV } from '../Comunes/Utils/exportCSV';
import Swal from 'sweetalert2';
import { useSpring, animated, useTransition } from 'react-spring';

const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9);

export default function SimpleListModule({ title, dataKey, items, setItems, columns, fields }) {
    const [q, setQ] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [viewing, setViewing] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const filtered = items.filter(i => JSON.stringify(i).toLowerCase().includes(q.toLowerCase()));

    const openCreate = () => {
        const fieldList = fields || columns;
        const initial = { id: uid(dataKey), isNew: true };
        fieldList.forEach(c => initial[c.key] = '');
        setEditing(initial);
        setModalOpen(true);
    };

    const save = () => {
        setItems(prev =>
            prev.some(p => p.id === editing.id)
                ? prev.map(p => (p.id === editing.id ? editing : p))
                : [...prev, editing]
        );
        setModalOpen(false);
    };

    const remove = r => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Eliminar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setItems(prev => prev.filter(p => p.id !== r.id));
            }
        });
    };


    const viewTransitions = useTransition(viewModalOpen, {
        from: { opacity: 0, transform: 'translateY(-20px)' },
        enter: { opacity: 1, transform: 'translateY(0)' },
        leave: { opacity: 0, transform: 'translateY(-20px)' },
    });

    return (
        <div>
            <div style={styles.moduleHeader}>
                <h2>{title}</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input placeholder={`Buscar ${title}`} value={q} onChange={e => setQ(e.target.value)} style={styles.searchInput} />
                    <button onClick={openCreate} style={styles.btn}>Nuevo</button>
                    <button onClick={() => exportCSV(`${dataKey}.csv`, items)} style={styles.btnAlt}>Exportar CSV</button>
                </div>
            </div>

            <Table
                columns={columns}
                data={filtered}
                onEdit={(row) => { setEditing(row); setModalOpen(true); }}
                onDelete={remove}
                onRowClick={(row) => { setViewing(row); setViewModalOpen(true); }}
            />

            <Modal open={modalOpen} title={editing?.isNew ? `Nuevo ${title.toLowerCase()}` : title} onClose={() => setModalOpen(false)}>
                {editing && (
                    <div style={{ display: 'grid', gap: 8 }}>
                        {(fields || columns).map(c => (
                            <input key={c.key} value={editing[c.key] ?? ''} onChange={e => setEditing({ ...editing, [c.key]: e.target.value })} placeholder={c.title || c.key} />
                        ))}
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={save} style={styles.btn}>Guardar</button>
                            <button onClick={() => setModalOpen(false)} style={styles.btnAlt}>Cancelar</button>
                        </div>
                    </div>
                )}
            </Modal>

            {viewTransitions((style, item) => item && (
                <animated.div style={{ ...styles.modalOverlay, ...style }} onClick={() => setViewModalOpen(false)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>{`Detalles de ${title.toLowerCase()}`}</h3>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            {viewing && (
                                <div style={{ display: 'grid', gap: 8 }}>
                                    {columns.map(c => (
                                        <div key={c.key}>
                                            <strong>{c.title || c.key}:</strong> {viewing[c.key]}
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => { setEditing(viewing); setViewModalOpen(false); setModalOpen(true); }} style={styles.btn}>Editar</button>
                                        <button onClick={() => setViewModalOpen(false)} style={styles.btnAlt}>Cerrar</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </animated.div>
            ))}
        </div>
    );
}

const styles = {
    moduleHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
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
        cursor: 'pointer',
    },
    btnAlt: {
        padding: '8px 12px',
        background: '#ff0101ff',
        color: '#fff',
        border: '1px solid #ddd',
        borderRadius: 6,
        cursor: 'pointer',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        maxWidth: 500,
        width: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    },

};
