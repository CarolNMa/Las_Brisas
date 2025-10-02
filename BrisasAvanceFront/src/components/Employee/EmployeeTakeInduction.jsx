import { useState, useEffect } from 'react';
import ApiService from '../../services/api';

export default function EmployeeTakeInduction({ inductionId, onComplete }) {
    const [induction, setInduction] = useState(null);
    const [modules, setModules] = useState([]);
    const [currentModule, setCurrentModule] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadInductionData();
    }, [inductionId]);

    const loadInductionData = async () => {
        try {
            setLoading(true);
            const [indData, modData] = await Promise.all([
                ApiService.getInductionById(inductionId),
                ApiService.getModulesByInduction(inductionId)
            ]);

            setInduction(indData.data || indData);
            setModules(modData.data || modData);
        } catch (err) {
            console.error('Error loading induction:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, answerId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    };

    const nextModule = () => {
        if (currentModule < modules.length - 1) {
            setCurrentModule(currentModule + 1);
        }
    };

    const prevModule = () => {
        if (currentModule > 0) {
            setCurrentModule(currentModule - 1);
        }
    };

    const completeInduction = async () => {
        try {
            setSubmitting(true);
            // Calculate points based on answers (simplified)
            const totalQuestions = modules.reduce((acc, mod) => acc + (mod.questions?.length || 0), 0);
            const correctAnswers = Object.keys(answers).length; // Simplified scoring
            const points = Math.round((correctAnswers / totalQuestions) * 100);

            await ApiService.completeInduction(inductionId, points);
            onComplete && onComplete(points);
        } catch (err) {
            console.error('Error completing induction:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Cargando inducción...</div>;

    const module = modules[currentModule];
    if (!module) return <div>No hay módulos disponibles</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2>{induction?.name || 'Inducción'}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Módulo {currentModule + 1} de {modules.length}</span>
                    <div>
                        <button
                            onClick={prevModule}
                            disabled={currentModule === 0}
                            style={{ marginRight: '10px' }}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={currentModule === modules.length - 1 ? completeInduction : nextModule}
                            disabled={submitting}
                        >
                            {currentModule === modules.length - 1 ? (submitting ? 'Completando...' : 'Completar Inducción') : 'Siguiente'}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>{module.name}</h3>
                {module.description && <p>{module.description}</p>}

                {module.videoUrl && (
                    <div style={{ margin: '20px 0' }}>
                        <iframe
                            width="100%"
                            height="400"
                            src={module.videoUrl.replace('watch?v=', 'embed/')}
                            title={module.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </div>

            {/* Questions would go here - simplified for now */}
            <div style={{ marginTop: '20px' }}>
                <p>Contenido del módulo completado. {currentModule === modules.length - 1 ? 'Haz clic en "Completar Inducción" para finalizar.' : 'Haz clic en "Siguiente" para continuar.'}</p>
            </div>
        </div>
    );
}