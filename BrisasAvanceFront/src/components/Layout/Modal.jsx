export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
        </div>
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: {
    width: 640,
    maxWidth: '95%',
    maxHeight: '90vh',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    padding: 18,
    borderRadius: 8,
    overflowY: 'auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  },
  btnSmall: { padding: '6px 8px', background: 'red', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
};
