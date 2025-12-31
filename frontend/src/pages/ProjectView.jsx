import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PlanResults from '../components/PlanResults';
import Footer from '../components/Footer';

const ProjectView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);

    useEffect(() => {
        if (location.state && location.state.project) {
            setProject(location.state.project);
        } else {
            // Redirect if no project data found
            navigate('/dashboard');
        }
    }, [location, navigate]);

    if (!project) return null;

    /**
     * IMPORTANT FIX:
     * We no longer create any mock/static fallback plans.
     * We only use backend-generated fullPlans.
     * If fullPlans are missing, we show an empty array (no fake data).
     */
    const plansToDisplay = project.fullPlans || [];

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-8 h-8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-stone-800">
                            Happy<span className="text-emerald-600">Nest</span>
                        </h1>
                    </Link>
                    <Link to="/dashboard" className="text-sm font-semibold text-stone-500 hover:text-emerald-600">
                        ← Back to Profile
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h2 className="text-3xl font-serif text-stone-900">Project Details</h2>
                    <p className="text-stone-500">
                        Created on {new Date(project.date).toLocaleDateString()}
                    </p>
                </div>

                {/* This will now render ONLY real backend AI plans */}
                <PlanResults plans={plansToDisplay} />
            </main>

            <Footer />
        </div>
    );
};

export default ProjectView;
