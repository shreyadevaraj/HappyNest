import { useState, useEffect } from 'react';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/data/projects');
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-serif text-stone-800 mb-4">Project History</h1>
                <p className="text-xl text-stone-500">Your architectural journey with HappyNest</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-stone-200">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-2xl font-bold text-stone-800 mb-2">No Projects Yet</h3>
                    <p className="text-stone-500 mb-6">Start by generating your first floor plan!</p>
                    <a href="/" className="inline-block px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition">
                        Create New Project
                    </a>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="bg-emerald-50 p-6 border-b border-emerald-100">
                                <h3 className="font-bold text-stone-800 text-lg mb-1">{project.selectedPlanName || 'Untitled Plan'}</h3>
                                <p className="text-sm text-stone-500">
                                    {new Date(project.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-500">Plot Size</span>
                                    <span className="font-bold text-stone-800">{project.plotSize}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-500">House Type</span>
                                    <span className="font-bold text-stone-800">{project.houseType}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-500">Budget</span>
                                    <span className="font-bold text-emerald-600">{project.budget}</span>
                                </div>
                                {project.estimatedCost && (
                                    <div className="pt-3 border-t border-stone-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-stone-500">Final Estimate</span>
                                            <span className="font-bold text-stone-800">{project.estimatedCost}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
