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

                        <h2>3570</h2>
                        <p>Empleados totales</p>
                        <div className="iconos">
                            <div className="icon-profile">
                            </div>
                        </div>

                    </div>
                    <div className="card">
                        <h2>344</h2>
                        <p>Contratos iniciados</p>

                         <div className="iconos">
                            <div className="icon-document">
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h2>210</h2>
                        <p>Empleados Desvinculados</p>

                         <div className="iconos">
                            <div className="icon-profile">
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h2>92%</h2>
                        <p>Asistencia hoy</p>

                         <div className="iconos">
                            <div className="icon-profile">
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h2>200</h2>
                        <p>Total de áreas</p>

                         <div className="iconos">
                            <div className="icon-location">
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h2>40</h2>
                        <p>Permisos Pendientes</p>

                         <div className="iconos">
                            <div className="icon-document">
                            </div>
                        </div>
                    </div>
                </div>

                <div className="buttonss">
                    <a href="../users/create-employee">
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
