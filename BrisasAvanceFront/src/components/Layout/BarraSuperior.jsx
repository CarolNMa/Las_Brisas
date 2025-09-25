export default function Topbar({ title, user, onLogout }) {
  return (
    <div style={styles.topbar}>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span>Hola, {user?.username}</span>
        <div style={styles.avatar}>{user?.username?.charAt(0).toUpperCase()}</div>
        <button onClick={onLogout} style={styles.logoutBtn}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

const styles = {
  topbar: { 
    height: 64, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: '0 18px', 
    borderBottom: '1px solid #eee', 
    background: '#fff' 
},
  avatar: { 
    width: 36, 
    height: 36, 
    borderRadius: '50%', 
    background: '#111827', 
    color: '#fff', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
},
  logoutBtn: { 
    padding: '6px 12px', 
    background: '#ff4d4f', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 6, 
    cursor: 'pointer', 
    fontSize: 14 
},
};
