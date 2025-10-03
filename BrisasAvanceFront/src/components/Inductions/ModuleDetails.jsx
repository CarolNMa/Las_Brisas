import { useEffect, useState } from "react";
import ApiService from "../../services/api";

export default function ModuleDetail({ moduleId }) {
    const [module, setModule] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await ApiService.getModuleFull(moduleId); // GET /modules/{id}/full
                setModule(data);
            } catch (err) {
                console.error("❌ Error cargando módulo:", err);
            }
        };
        load();
    }, [moduleId]);

    if (!module) return <p>Cargando módulo...</p>;

    return (
        <div>
            <h2>{module.name}</h2>
            <p>{module.description}</p>
            <video width="400" controls src={module.videoUrl}></video>

            <h3>Preguntas</h3>
            {module.questions.map((q) => (
                <div key={q.id}>
                    <strong>{q.question}</strong>
                    <ul>
                        {q.answers.map((a) => (
                            <li key={a.id}>
                                {a.answer} {a.responseCorrect && "✅"}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
