export const styles = {
    // Layout general
    page: {
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#f0f2f5",
        margin: 0,
        fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: "#111",
    },

    // Sidebar
    sidebar: {
        width: 250,
        padding: 18,
        borderRight: "1px solid #e6e9ef",
        background: "#fff",
        overflowY: "auto",
        color: "#111",
    },
    navItem: {
        padding: "12px 8px",
        borderRadius: 8,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        marginBottom: 6,
        color: "#444",
        fontWeight: 500,
        transition: "background 0.2s, color 0.2s",
    },
    navItemActive: {
        background: "#e6f4ff",
        fontWeight: 700,
        color: "#2563eb",
    },

    // Contenedor principal
    main: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        marginLeft: 250,
    },
    content: {
        padding: 20,
        flex: 1,
        overflowY: "auto",
        background: "#fafafa",
    },

    // Tarjetas
    card: {
        padding: 16,
        borderRadius: 10,
        background: "#fff",
        minWidth: 160,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        transition: "all 0.2s ease-in-out",
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 13,
        color: "#555",
        fontWeight: 600,
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 22,
        fontWeight: 700,
        color: "#111",
    },

    // Gráficas
    chartContainer: {
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        minWidth: 400,
        flex: 1,
    },

    // Botones
    btn: {
        padding: "8px 14px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 600,
        transition: "background 0.2s",
    },
    btnAlt: {
        padding: "8px 14px",
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 500,
        transition: "all 0.2s",
        color: "#111",
    },
    btnSmall: {
        padding: "6px 10px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 500,
    },

    // Tablas
    table: {
        width: "100%",
        borderCollapse: "collapse",
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    },
    th: {
        textAlign: "left",
        padding: "12px",
        background: "#f9fafb",
        borderBottom: "1px solid #e6e9ef",
        fontWeight: 600,
        fontSize: 14,
        color: "#333",
    },
    td: {
        padding: "12px",
        borderBottom: "1px solid #f0f0f0",
        fontSize: 14,
        color: "#555",
    },
    tr: {
        transition: "background 0.2s",
    },
    trHover: {
        background: "#f9f9f9",
    },

    // Modal
    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    },
    modal: {
        width: 640,
        maxWidth: "95%",
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },
};
