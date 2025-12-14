import React from 'react';
import { Link } from 'react-router-dom';

const Architects = () => {
    const architects = [
        {
            id: 1,
            name: "Arjun Verma",
            title: "Senior Architect",
            experience: "12 Years Exp",
            rating: 4.9,
            reviews: 124,
            image: "https://ui-avatars.com/api/?name=Arjun+Verma&background=0D9488&color=fff&size=200", // Fallback generated avatar
            specialty: "Modern Villas & Sustainable Design",
            location: "Bangalore",
            tags: ["Vaastu Expert", "Green Building", "Luxury"]
        },
        {
            id: 2,
            name: "Sara Khan",
            title: "Interior Designer",
            experience: "8 Years Exp",
            rating: 4.8,
            reviews: 98,
            image: "https://ui-avatars.com/api/?name=Sara+Khan&background=059669&color=fff&size=200",
            specialty: "Smart Homes & Minimalist Interiors",
            location: "Mumbai",
            tags: ["Interior Styling", "Space Planning", "Renovation"]
        },
        {
            id: 3,
            name: "Vikram Singh",
            title: "Structural Engineer",
            experience: "15 Years Exp",
            rating: 5.0,
            reviews: 210,
            image: "https://ui-avatars.com/api/?name=Vikram+Singh&background=374151&color=fff&size=200",
            specialty: "High-Rise Structures & Safety",
            location: "Delhi NCR",
            tags: ["Structural Safety", "Civil Engineering", "Cost Estimation"]
        },
        {
            id: 4,
            name: "Ananya Das",
            title: "Landscape Architect",
            experience: "6 Years Exp",
            rating: 4.7,
            reviews: 45,
            image: "https://ui-avatars.com/api/?name=Ananya+Das&background=D97706&color=fff&size=200",
            specialty: "Urban Gardens & Roof Terraces",
            location: "Pune",
            tags: ["Landscaping", "Outdoor Living", "Botanical Design"]
        },
        {
            id: 5,
            name: "Project Studio X",
            title: "Architecture Firm",
            experience: "20+ Years Exp",
            rating: 4.6,
            reviews: 312,
            image: "https://ui-avatars.com/api/?name=Studio+X&background=7C3AED&color=fff&size=200",
            specialty: "Commercial & Residential Complexes",
            location: "Hyderabad",
            tags: ["Turnkey Projects", "Commercial", "Large Scale"]
        }
    ];

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-stone-800">
                            Happy<span className="text-emerald-600">Nest</span>
                        </h1>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-semibold text-stone-500">
                        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
                        <Link to="/dashboard" className="text-emerald-600 hover:text-emerald-700">My Dashboard</Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase mb-2 block">Connect with Experts</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">Top Rated Architects</h2>
                    <p className="text-xl text-stone-500 max-w-2xl mx-auto font-light">
                        Collaborate with the best minds in the industry to bring your HappyNest blueprints to life.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {architects.map((arch) => (
                        <div key={arch.id} className="bg-white rounded-3xl p-6 shadow-xl shadow-stone-100 border border-stone-100 hover:-translate-y-1 hover:shadow-2xl hover:border-emerald-100 transition duration-300">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <img src={arch.image} alt={arch.name} className="w-16 h-16 rounded-full object-cover border-2 border-primary-50" />
                                    <div>
                                        <h3 className="font-bold text-lg text-stone-800">{arch.name}</h3>
                                        <p className="text-emerald-600 text-sm font-medium">{arch.title}</p>
                                    </div>
                                </div>
                                <div className="bg-emerald-50 px-2 py-1 rounded text-xs font-bold text-emerald-700 flex items-center gap-1">
                                    <span>★</span> {arch.rating}
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center text-sm text-stone-500 gap-2">
                                    <span>📍 {arch.location}</span>
                                    <span>•</span>
                                    <span>{arch.experience}</span>
                                </div>
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    Specializes in <strong>{arch.specialty}</strong>.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {arch.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">#{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-6 border-t border-stone-100">
                                <button className="flex-1 bg-stone-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-emerald-600 transition">
                                    Contact
                                </button>
                                <button className="px-4 py-2.5 bg-stone-50 text-stone-600 font-bold rounded-xl text-sm border border-stone-200 hover:bg-white hover:border-emerald-200 transition">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Architects;
