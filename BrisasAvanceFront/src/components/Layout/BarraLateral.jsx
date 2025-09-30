export default function Sidebar({ items, active, onChange }) {
    return (
        <div className="sidebar" style={styles.sidebar}>
            <h3 style={{ margin: 0 }}>Brisas</h3>
            <nav style={{ marginTop: 12 }}>
                {items.map(i => (
                    <div
                        key={i.key}
                        onClick={() => onChange(i.key)}
                        style={{ ...styles.navItem, ...(active === i.key ? styles.navItemActive : {}) }}
                    >
                        {i.icon} <span style={{ marginLeft: 8 }}>{i.label}</span>
                    </div>
                ))}
            </nav>
        </div>
    );
}

const styles = {
    sidebar: {
        width: 250,
        padding: 18,
        borderRight: "1px solid var(--border-color)",
        background: "var(--bg-primary)",
        overflowY: "auto",
        color: "var(--text-primary)",
        position: "fixed",
        height: "100vh",
        left: 0,
        top: 0,
        zIndex: 1000,
        boxSizing: 'border-box',
    },
    navItem: {
        padding: '12px 8px',
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        marginBottom: 4,
        color: "var(--text-secondary)",
        fontWeight: 500,
        transition: 'background 0.2s, color 0.2s',
    },
    navItemActive: {
        background: "#e6f4ff",
        fontWeight: 700,
        color: "#2563eb",
    },
};
