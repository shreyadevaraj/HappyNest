import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout, deleteProject } = useAuth();
    const navigate = useNavigate();

    // ... (rest of logic) ...

    const handleDelete = (e, projectId) => {
        e.stopPropagation(); // Prevent opening the project view
        if (window.confirm("Are you sure you want to delete this project?")) {
            deleteProject(projectId);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            {/* ... (keep header as is) ... */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">HappyNest</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-stone-600 font-medium">{user.name}</span>
                    <button onClick={() => { logout(); navigate('/login'); }} className="text-red-500 hover:text-red-600 text-sm font-medium">Logout</button>
                </div>
            </header>

            <div className="container mx-auto p-6 md:p-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-stone-800">My Projects</h1>
                    <Link to="/" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition transform hover:scale-105">
                        + New Project
                    </Link>
                </div>

                {(!user.projects || user.projects.length === 0) ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-300">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="text-xl font-bold text-stone-700 mb-2">No projects yet</h3>
                        <p className="text-stone-500 mb-6">Create your first dream home blueprint today.</p>
                        <Link to="/" className="text-emerald-600 font-bold hover:underline">Start Designing &rarr;</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.projects.map(project => (
                            <div
                                key={project.id}
                                onClick={() => navigate('/project-view', { state: { project } })}
                                className="bg-white rounded-xl shadow border border-stone-100 overflow-hidden hover:shadow-lg transition cursor-pointer group relative"
                            >
                                <div className="h-40 bg-stone-200 relative">
                                    <img src={project.image || '/placeholder-plan.png'} alt="Plan" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                        {project.type}
                                    </span>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => handleDelete(e, project.id)}
                                        className="absolute top-2 left-2 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition shadow-sm border border-stone-200"
                                        title="Delete Project"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-stone-800 mb-1 group-hover:text-emerald-700 transition">{project.type} - {project.floors}</h3>
                                    <p className="text-sm text-stone-500 mb-4">Created on {new Date(project.date).toLocaleDateString()}</p>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="bg-stone-100 px-2 py-1 rounded text-stone-600">{project.dimensions}</span>
                                        <span className="text-emerald-600 font-bold">{project.budget}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
