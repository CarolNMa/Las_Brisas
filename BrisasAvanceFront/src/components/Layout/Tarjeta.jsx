export default function Card({ title, value, children }) {
    return (
        <div style={styles.card}>
            <div style={{ fontSize: 12, color: '#666' }}>{title}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
            {children}
        </div>
    );
}

const styles = {
    card: {
        padding: 16,
        borderRadius: 10,
        background: "#fff",
        minWidth: 160,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease-in-out",
    },
    title: { fontSize: 13, color: "#555", fontWeight: 600, marginBottom: 4 },
    value: { fontSize: 22, fontWeight: 700, color: "#111" },
};

