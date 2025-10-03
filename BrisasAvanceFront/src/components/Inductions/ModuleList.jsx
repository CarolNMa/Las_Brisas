import { useEffect, useState } from "react";
import ApiService from "../../services/api";

export default function ModuleList({ induction, onSelectModule }) {
    const [modules, setModules] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await ApiService.getModulesByInduction(induction.id);
                setModules(data);
            } catch (err) {
                console.error("❌ Error cargando módulos:", err);
            }
        };
        load();
    }, [induction]);

    return (
        <div>
            <h2>📂 Módulos de {induction.name}</h2>
            {modules.length === 0 ? (
                <p>No hay módulos</p>
            ) : (
                <ul>
                    {modules.map((m) => (
                        <li key={m.id}>
                            {m.name} - {m.description}
                            <button onClick={() => onSelectModule(m)}>🔎 Ver Detalle</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
