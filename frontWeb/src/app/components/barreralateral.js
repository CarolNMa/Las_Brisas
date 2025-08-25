import Link from "next/link";
import "../styles/barra.css";

export default function Sidebar() {
    return (
        <div className="sidebar-content">
            <div className="userBox">
                <div className="avatar"></div>
                <div className="user-info">
                    <span>Carol Marentes</span>
                </div>

            </div>

            <nav className="nav">
                <Link href="">Inicio</Link>
                <Link href="/induccion">Inducción</Link>
                <Link href="../usuarios">Empleados</Link>
                <Link href="/organizacion">Organización</Link>
                <Link href="/procesos">Procesos</Link>
            </nav>
        </div>
    );
}
