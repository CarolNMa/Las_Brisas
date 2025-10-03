import { useState } from "react";
import InductionList from "../Inductions/InductionList";
import ModuleList from "../Inductions/ModuleList";
import ModuleDetail from "../Inductions/ModuleDetail";

export default function InductionsModule() {
    const [view, setView] = useState("inductions");
    const [selectedInduction, setSelectedInduction] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);

    const goBack = () => {
        if (view === "modules") {
            setSelectedInduction(null);
            setView("inductions");
        } else if (view === "moduleDetail") {
            setSelectedModule(null);
            setView("modules");
        }
    };

    return (
        <div>
            <h2>📚 Gestión de Inducciones</h2>
            {view !== "inductions" && <button onClick={goBack}>⬅️ Volver</button>}

            {view === "inductions" && (
                <InductionList
                    onSelect={(induction) => {
                        setSelectedInduction(induction);
                        setView("modules");
                    }}
                />
            )}

            {view === "modules" && selectedInduction && (
                <ModuleList
                    induction={selectedInduction}
                    onSelectModule={(module) => {
                        setSelectedModule(module);
                        setView("moduleDetail");
                    }}
                />
            )}

            {view === "moduleDetail" && selectedModule && (
                <ModuleDetail moduleId={selectedModule.id} />
            )}
        </div>
    );
}
