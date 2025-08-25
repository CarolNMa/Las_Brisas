import Header from "../components/header";
import UsuariosTable from "../components/usuarios";

export default function Page() {
    return (

        <div className="container">
            <main className="main">
                <Header />

                <div>
                    <UsuariosTable />
                </div>
            </main>
        </div>

    );
}
