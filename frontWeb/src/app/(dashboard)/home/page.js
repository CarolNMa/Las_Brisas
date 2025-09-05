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
                            <span>Bienveid@ Maria Pepita Canto Suarez</span>
                        </div>
                        <div className="user-role">
                            <span>Cargo: Supervisor</span>
                        </div>
                    </div>

                </div>

                <div className="cards">
                    <div className="card">

                        <h2>18</h2>
                        <p>Dias trabajados en el mes</p>
                        <div className="iconos">
                            <div className="icon-profile">
                            </div>
                        </div>

                    </div>
                    <div className="card">
                        <h2>Por renovar</h2>
                        <p> Estado de contrato</p>

                        <div className="iconos">
                            <div className="icon-document">
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h2>15 días</h2>
                        <p>Evaluación de desempeño</p>

                        <div className="iconos">
                            <div className="icon-document">
                            </div>
                        </div>
                    </div>
                   
                </div>

                <div className="buttonss">
                    <a href="../">
                        <button >Ver Perfil</button>
                    </a>

                    <a href="../permisos">
                        <button>Registrar Asistencia</button>
                    </a>

                    <a href="../asistencias">
                        <button>Solicitudes</button>
                    </a>

                    <a href="../certificados">
                        <button>Ver contrato</button>
                    </a>
                </div>
            </main>
        </div>
    );
}
