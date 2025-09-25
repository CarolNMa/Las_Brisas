import { useState } from 'react';
import Table from '../Comunes/tabla';
import Modal from '../Layout/Modal';
import { exportCSV } from '../Comunes/Utils/exportCSV';
import Swal from 'sweetalert2';

const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9);

export default function SimpleListModule({ title, dataKey, items, setItems, columns, fields }) {
    const [q, setQ] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

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

            <Table columns={columns} data={filtered} onEdit={r => { setEditing(r); setModalOpen(true); }} onDelete={remove} />

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
        cursor: 'pointer',
    },
};
