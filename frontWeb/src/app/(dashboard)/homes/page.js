import Header from "../../components/header";
import "../../../styles/dashboard.css";

export default function Dashboard() {
    return (
        <div className="container">
            <main className="main">
                <Header />

                <div className="contenedor">
                    <div className="usuario">
                        <div className="user-infos">
                            <span>Bienveid@ Carol Marentes</span>
                        </div>
                        <div className="user-role">
                            <span>Rol: Administrador de RRHH</span>

                        </div>
                    </div>

                </div>

                <div className="cards">
                    <div className="card">
                        <p>Empleados vinculados</p>
                        <h2>150</h2>
                    </div>
                    <div className="card">
                        <p>Desvinculados</p>
                        <h2>15</h2>
                    </div>
                    <div className="card">
                        <p>Permisos pendientes</p>
                        <h2>2</h2>
                    </div>
                    <div className="card">
                        <p>Asistencia hoy</p>
                        <h2>92%</h2>
                    </div>
                </div>

                <div className="buttonss">
                    <a href="../crearEmpleado">
                        <button >Crear empleado</button>
                    </a>

                    <a href="../permisos">
                        <button>Ver permisos</button>
                    </a>

                    <a href="../asistencias">
                        <button>Ver asistencias</button>
                    </a>

                    <a href="../certificados">
                        <button>Generar certificado</button>
                    </a>




                </div>
            </main>
        </div>
    );
}
