import { useState, useEffect } from 'react';

const ArchitectsPage = () => {
    const [architects, setArchitects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArchitects();
    }, []);

    const fetchArchitects = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/data/architects');
            const data = await response.json();
            setArchitects(data);
        } catch (error) {
            console.error('Error fetching architects:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const numRating = parseFloat(rating);
        const fullStars = Math.floor(numRating);
        const hasHalfStar = numRating % 1 >= 0.5;

        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < fullStars ? 'text-amber-400' :
                            i === fullStars && hasHalfStar ? 'text-amber-300' :
                                'text-stone-300'
                        }`}>
                        ★
                    </span>
                ))}
                <span className="ml-2 text-sm font-bold text-stone-600">{rating}</span>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-serif text-stone-800 mb-4">Expert Architects</h1>
                <p className="text-xl text-stone-500">Connect with verified professionals for your project</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {architects.map((architect) => (
                        <div key={architect.id} className="bg-white rounded-3xl border-2 border-stone-100 overflow-hidden hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 group">
                            {/* Profile Image Placeholder */}
                            <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-20"></div>
                                <div className="relative z-10 w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center text-5xl font-bold text-emerald-600 border-4 border-white">
                                    {architect.name.charAt(0)}
                                </div>
                                <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    Verified ✓
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-stone-800 mb-1">{architect.name}</h3>
                                    <p className="text-sm text-emerald-600 font-semibold">{architect.specialty}</p>
                                </div>

                                <div className="flex items-center justify-between py-3 border-y border-stone-100">
                                    {renderStars(architect.rating)}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-stone-600">
                                        <span className="text-lg">💰</span>
                                        <span className="font-bold text-stone-800">{architect.priceRange}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-stone-600">
                                        <span className="text-lg">📞</span>
                                        <a href={`tel:${architect.contact.replace(/\s/g, '')}`} className="font-mono font-bold text-emerald-600 hover:underline">
                                            {architect.contact}
                                        </a>
                                    </div>
                                </div>

                                <p className="text-sm text-stone-500 leading-relaxed pt-3 border-t border-stone-100">
                                    {architect.bio}
                                </p>

                                <div className="pt-4">
                                    <a
                                        href={`tel:${architect.contact.replace(/\s/g, '')}`}
                                        className="block w-full text-center py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-200 group-hover:shadow-lg"
                                    >
                                        Contact Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-16 bg-stone-100 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-stone-800 mb-2">Looking for something specific?</h3>
                <p className="text-stone-600 mb-4">We can connect you with specialized architects based on your unique requirements.</p>
                <button className="px-6 py-3 bg-white text-stone-700 font-bold rounded-lg border-2 border-stone-200 hover:border-emerald-500 hover:text-emerald-600 transition">
                    Request Custom Match
                </button>
            </div>
        </div>
    );
};

export default ArchitectsPage;
