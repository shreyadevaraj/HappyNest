import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PlanResults from '../components/PlanResults';
import Footer from '../components/Footer';

const DiscoveryPage = () => {
    const { user, saveProject } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState([]);
    const [error, setError] = useState(null);
    const [requestData, setRequestData] = useState(null);

    const [formData, setFormData] = useState({
        plotSize: '',
        budget: '',
        dreamDescription: '',
        familyMembers: '',
        lifestyle: '',
        preferredStyle: 'Modern',
        floors: '1',
        facing: 'East'
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        // Prepare data for the existing generate API
        const finalData = {
            plotSize: formData.plotSize,
            budget: formData.budget,
            floors: formData.floors,
            houseType: formData.familyMembers.includes('5') ? '4 BHK Luxury' : '3 BHK Comfort',
            facing: formData.facing,
            mandatoryRooms: `${formData.dreamDescription}. Lifestyle: ${formData.lifestyle}. Style: ${formData.preferredStyle}`
        };

        setRequestData(finalData);

        try {
            const response = await fetch("http://localhost:8080/api/architect/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            });
            if (!response.ok) throw new Error("Failed to generate plans");

            const result = await response.json();
            setPlans(result.plans);
            setStep(6); // Success step
        } catch (err) {
            setError(err.message);
            setStep(5); // Stay on summary/error
        } finally {
            setLoading(false);
        }
    };

    const handleManualSave = (selectedPlan) => {
        if (!requestData) return;

        saveProject({
            type: requestData.houseType,
            floors: requestData.floors,
            dimensions: requestData.plotSize,
            budget: requestData.budget,
            image: selectedPlan.image,
            fullPlans: [selectedPlan]
        });

        alert("Project saved to your profile!");
        navigate('/dashboard');
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <h2 className="text-4xl font-serif text-stone-800 mb-4">Let's start with the basics</h2>
                            <p className="text-stone-500">We need these to ensure your design is realistic and buildable.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Plot Dimensions (ft)</label>
                                <input
                                    name="plotSize"
                                    value={formData.plotSize}
                                    onChange={handleChange}
                                    placeholder="e.g. 30x40"
                                    className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Total Budget (INR)</label>
                                <input
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="e.g. 60 Lakhs"
                                    className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none shadow-sm"
                                />
                            </div>
                        </div>
                        <button
                            disabled={!formData.plotSize || !formData.budget}
                            onClick={handleNext}
                            className="w-full py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <h2 className="text-4xl font-serif text-stone-800 mb-4">Describe your dream</h2>
                            <p className="text-stone-500">Close your eyes. What do you see when you walk in?</p>
                        </div>
                        <textarea
                            name="dreamDescription"
                            value={formData.dreamDescription}
                            onChange={handleChange}
                            rows="5"
                            placeholder="e.g. A bright, airy home with a double-height ceiling in the living room, a small library nook, and a kitchen that overlooks a backyard garden..."
                            className="w-full px-6 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none shadow-sm resize-none"
                        ></textarea>
                        <div className="flex gap-4">
                            <button onClick={handleBack} className="px-8 py-5 border border-stone-200 rounded-2xl font-bold text-stone-600 hover:bg-stone-50 transition-all">Back</button>
                            <button
                                disabled={!formData.dreamDescription}
                                onClick={handleNext}
                                className="flex-1 py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50"
                            >
                                That's it
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <h2 className="text-4xl font-serif text-stone-800 mb-4">Who are we building for?</h2>
                            <p className="text-stone-500">This helps us allocate room sizes and privacy levels.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['2-3 People', '4 People', '5+ People', 'Multi-gen'].map(val => (
                                <button
                                    key={val}
                                    onClick={() => { setFormData({ ...formData, familyMembers: val }); handleNext(); }}
                                    className={`p-6 border-2 rounded-2xl transition-all font-bold ${formData.familyMembers === val ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-stone-100 hover:border-emerald-200 text-stone-600'}`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleBack} className="w-full py-4 text-stone-400 font-medium hover:text-stone-600 transition-all">Go Back</button>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <h2 className="text-4xl font-serif text-stone-800 mb-4">Tell us about your lifestyle</h2>
                            <p className="text-stone-500">Do you host parties? Work from home? Love cooking?</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'entertainer', label: 'The Entertainer', sub: 'Large living area & open kitchen' },
                                { id: 'wfh', label: 'The Professional', sub: 'Dedicated quiet office space' },
                                { id: 'minimalist', label: 'The Minimalist', sub: 'Clean lines, hidden storage' },
                                { id: 'cozy', label: 'The Cozy Homebody', sub: 'Nooks, warm lighting, comfort' }
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => { setFormData({ ...formData, lifestyle: item.label }); handleNext(); }}
                                    className={`p-6 border-2 rounded-2xl text-left transition-all ${formData.lifestyle === item.label ? 'border-emerald-500 bg-emerald-50' : 'border-stone-100 hover:border-emerald-200'}`}
                                >
                                    <p className={`font-bold ${formData.lifestyle === item.label ? 'text-emerald-700' : 'text-stone-800'}`}>{item.label}</p>
                                    <p className="text-xs text-stone-400 mt-1">{item.sub}</p>
                                </button>
                            ))}
                        </div>
                        <button onClick={handleBack} className="w-full py-4 text-stone-400 font-medium hover:text-stone-600 transition-all">Go Back</button>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center">
                            <h2 className="text-4xl font-serif text-stone-800 mb-4">Ready to create?</h2>
                            <p className="text-stone-500">Here's what our AI has understood so far.</p>
                        </div>
                        <div className="bg-stone-50 rounded-3xl p-8 space-y-4 border border-stone-100">
                            <div className="flex justify-between py-2 border-b border-stone-200">
                                <span className="text-stone-400">Dimensions</span>
                                <span className="font-bold text-stone-800">{formData.plotSize} ft</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-stone-200">
                                <span className="text-stone-400">Budget</span>
                                <span className="font-bold text-stone-800">₹ {formData.budget}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-stone-200">
                                <span className="text-stone-400">Family</span>
                                <span className="font-bold text-stone-800">{formData.familyMembers}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-stone-400">Style Profile</span>
                                <span className="font-bold text-stone-800">{formData.lifestyle}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium border border-red-100 italic">
                                "{error}" - Let's try once more.
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="px-8 py-5 border border-stone-200 rounded-2xl font-bold text-stone-600 hover:bg-stone-50 transition-all">Start Over</button>
                            <button
                                onClick={handleFormSubmit}
                                disabled={loading}
                                className="flex-1 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>AI is Thinking...</span>
                                    </>
                                ) : (
                                    <span>Generate My Dream Plan</span>
                                )}
                            </button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-10 animate-fade-in-up">
                        <div className="text-center">
                            <h2 className="text-4xl font-serif text-stone-800 mb-2">Magic happens.</h2>
                            <p className="text-stone-500">We've generated 3 unique realities for your dream home.</p>
                        </div>
                        <PlanResults plans={plans} onSave={handleManualSave} requestData={requestData} />
                        <div className="pt-10 flex justify-center">
                            <button
                                onClick={() => setStep(1)}
                                className="px-8 py-3 bg-white text-stone-500 border border-stone-200 rounded-full hover:border-emerald-500 hover:text-emerald-600 font-medium transition"
                            >
                                Start New Discovery
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
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
                    <Link to="/" className="text-sm font-bold text-stone-400 hover:text-stone-800 transition">Exit Assistant</Link>
                </div>
            </header>

            <main className={`mx-auto px-6 py-12 md:py-24 transition-all duration-700 ${step === 6 ? 'max-w-7xl' : 'max-w-4xl'}`}>
                {step < 6 && (
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Discovery Phase</span>
                            <span className="text-xs font-bold text-stone-400">Step {step} of 5</span>
                        </div>
                        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                                style={{ width: `${(step / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <div className={step === 6 ? "" : "bg-white rounded-[3rem] shadow-2xl shadow-stone-200 border border-stone-100 p-8 md:p-16 relative overflow-hidden"}>
                    {/* Background decoration */}
                    {step < 6 && (
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2 opacity-30"></div>
                    )}

                    <div className="relative z-10">
                        {renderStep()}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DiscoveryPage;
