"use client" ;

import Header from "@/app/components/header";
import UsuariosTable from "@/app/components/usuarios";


export default function Page() {
    return (

        <div className="container">
            <main className="main">
                <Header/>

                <div>
                    <UsuariosTable />
                </div>
            </main>
        </div>

    );
}
