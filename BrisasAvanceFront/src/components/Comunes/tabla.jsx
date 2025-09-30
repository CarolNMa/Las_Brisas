export default function Table({ columns, data, onEdit, onDelete, onRowClick, idKey = 'id' }) {
  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
      <thead>
        <tr>
          {columns.map(c => <th key={c.key}>{c.title}</th>)}
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(r => (
          <tr key={r[idKey]} onClick={() => onRowClick && onRowClick(r)} style={onRowClick ? { cursor: 'pointer' } : {}}>
            {columns.map(c => (
              <td key={c.key}>{c.render ? c.render(r[c.key], r) : r[c.key]}</td>
            ))}
            <td onClick={(e) => e.stopPropagation()}>
              <button onClick={() => onEdit && onEdit(r)} style={styles.btnSmall}>Editar</button>
              <button onClick={() => onDelete && onDelete(r)} style={{ ...styles.btnSmall, marginLeft: 8, background: '#ff4d4f' }}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 12, background: 'var(--bg-primary)', color: 'var(--text-primary)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  tableContainer: { overflowX: 'auto' },
  btnSmall: { padding: '6px 8px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', minHeight: 44 },
};
