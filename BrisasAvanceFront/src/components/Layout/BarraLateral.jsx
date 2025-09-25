export default function Sidebar({ items, active, onChange }) {
    return (
        <div style={styles.sidebar}>
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
        borderRight: "1px solid #e6e9ef",
        background: "#fff",
        overflowY: "auto",
        color: "#111",
    },
    navItem: {
        padding: '12px 8px',
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        marginBottom: 4
    },
    navItemActive: {
        background: "#e6f4ff",
        fontWeight: 700,
        color: "#2563eb",
    },

};
