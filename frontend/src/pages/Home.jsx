import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArchitectForm from '../components/ArchitectForm';
import { useAuth } from '../context/AuthContext';
import PlanResults from '../components/PlanResults';
import Footer from '../components/Footer';

const Home = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDoor, setShowDoor] = useState(true); // Animation State
    const { user, saveProject } = useAuth();
    const navigate = useNavigate();

    const [requestData, setRequestData] = useState(null);

    // Door Animation Effect
    useEffect(() => {
        const timer = setTimeout(() => setShowDoor(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    // Re-implementing the submit logic here to keep the main page functional
    const handleFormSubmit = async (data) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);
        setRequestData(data); // Store request data for later saving

        try {
            const payload = {
                plotSize: data.plotSize,
                floors: data.floors,
                houseType: data.houseType,
                facing: data.facing,
                budget: data.budget,
                mandatoryRooms: data.mandatoryRooms
            };

            const response = await fetch("http://localhost:8080/api/architect/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to generate plans (Status ${response.status}): ${errorText.substring(0, 100)}`);
            }

            const result = await response.json();

            // Robust parsing: result might be an object or a stringified JSON
            let finalData = result;
            if (typeof result === 'string') {
                try {
                    finalData = JSON.parse(result);
                } catch (e) {
                    console.error("Failed to parse result string:", result);
                }
            }

            if (finalData && finalData.plans) {
                setPlans(finalData.plans);
            } else {
                throw new Error("Invalid plan data received from architect engine.");
            }
        } catch (err) {
            setError(err.message);
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
            fullPlans: [selectedPlan] // Saving only the selected plan as the 'full' record
        });

        alert("Project saved to your profile!");
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans overflow-hidden">

            {/* --- DOOR OPENING ANIMATION --- */}
            {showDoor && (
                <div className="fixed inset-0 z-[100] flex pointer-events-none">
                    <div className="w-1/2 h-full bg-[#064e3b] door-left flex flex-col justify-center items-end pr-8 shadow-2xl border-r border-[#065f46]">
                        <div className="w-4 h-4 rounded-full bg-emerald-900 shadow-inner ring-1 ring-emerald-700/50"></div>
                        <div className="w-32 h-64 border-2 border-emerald-800 rounded mb-4 opacity-20 absolute top-1/4 right-10"></div>
                        <div className="w-32 h-64 border-2 border-emerald-800 rounded mb-4 opacity-20 absolute bottom-1/4 right-10"></div>
                    </div>
                    <div className="w-1/2 h-full bg-[#064e3b] door-right flex flex-col justify-center items-start pl-8 shadow-2xl border-l border-[#065f46]">
                        <div className="w-4 h-4 rounded-full bg-emerald-900 shadow-inner ring-1 ring-emerald-700/50"></div>
                        <div className="w-32 h-64 border-2 border-emerald-800 rounded mb-4 opacity-20 absolute top-1/4 left-10"></div>
                        <div className="w-32 h-64 border-2 border-emerald-800 rounded mb-4 opacity-20 absolute bottom-1/4 left-10"></div>
                    </div>
                </div>
            )}

            {/* --- MAIN CONTENT (Fades in) --- */}
            <div className={`transition-opacity duration-1000 ${showDoor ? 'opacity-0' : 'opacity-100'}`}>
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
                            {user ? (
                                <>
                                    <Link to="/architects" className="hover:text-emerald-600 transition">Find Architects</Link>
                                    <Link to="/dashboard" className="text-emerald-600 hover:text-emerald-700">My Profile</Link>
                                    <span className="text-stone-300">|</span>
                                    <span>Hi, {user.name}</span>
                                </>
                            ) : (
                                <>
                                    <Link to="/architects" className="hover:text-emerald-600 transition">Find Architects</Link>
                                    <Link to="/login" className="hover:text-emerald-600 transition">Sign In</Link>
                                    <Link to="/signup" className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-100">
                            Professional AI Architect
                        </div>
                        <h2 className="text-5xl md:text-6xl font-serif text-stone-800 mb-6">
                            Design with <span className="text-emerald-600 italic">Clarity</span>
                        </h2>
                        <p className="text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
                            Generate professional, feature-rich residential floor plans tailored to your exact plot and budget using advanced AI.
                        </p>
                    </div>

                    {!plans.length && !loading && (
                        <div className="max-w-4xl mx-auto animate-fade-in-up">
                            <ArchitectForm onSubmit={handleFormSubmit} />
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
                            <h3 className="text-xl font-medium text-stone-800">Drafting your detailed plans...</h3>
                            <p className="text-stone-400 mt-2">Checking regulations & dimensions</p>
                        </div>
                    )}

                    {plans.length > 0 && (
                        <div className="space-y-10 animate-fade-in-up">
                            <button
                                onClick={() => setPlans([])}
                                className="px-6 py-2 bg-white text-stone-500 border border-stone-200 rounded-full hover:border-emerald-500 hover:text-emerald-600 font-medium transition flex items-center gap-2 mb-4"
                            >
                                <span>←</span> New Design
                            </button>
                            <PlanResults plans={plans} onSave={handleManualSave} requestData={requestData} />
                        </div>
                    )}

                    {/* --- NEW CONTENT SECTIONS (Blogs, Reviews, FAQ) --- */}

                    {plans.length === 0 && (
                        <>
                            {/* BLOGS SECTION */}
                            <div className="mt-16 border-t border-stone-200 pt-10">
                                <div className="flex justify-between items-end mb-10">
                                    <div>
                                        <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase mb-2 block">Insights</span>
                                        <h3 className="text-3xl md:text-4xl font-serif text-stone-800">Architectural Trends</h3>
                                    </div>
                                    <a href="#" className="hidden md:block text-emerald-600 hover:text-emerald-700 font-semibold border-b border-emerald-200 hover:border-emerald-600 transition">View all articles</a>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {[
                                        { title: "Smart Living Trends: A 2024 Guide", cat: "Design", img: "/blog-vaastu.png" },
                                        { title: "Maximizing Space in 30x40 Plots", cat: "Planning", img: "/blog-space.png" },
                                        { title: "Sustainable Materials for Indian Climate", cat: "Construction", img: "/blog-eco.png" },
                                    ].map((blog, i) => (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="aspect-[4/3] rounded-2xl bg-stone-100 mb-4 overflow-hidden relative shadow-md">
                                                <img src={blog.img} alt={blog.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
                                            </div>
                                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">{blog.cat}</span>
                                            <h4 className="text-xl font-bold text-stone-800 mt-2 group-hover:text-emerald-700 transition">{blog.title}</h4>
                                            <p className="text-stone-500 mt-2 text-sm leading-relaxed">Discover expert tips and detailed guides to help you build the perfect home for your family.</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* REVIEWS SECTION */}
                            <div className="mt-32 bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-stone-200/50 border border-stone-100 relative overflow-hidden">
                                <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
                                    <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase mb-3 block">Testimonials</span>
                                    <h3 className="text-3xl md:text-4xl font-serif text-stone-800 mb-6">Loved by Homeowners</h3>
                                    <p className="text-stone-500 text-lg">Real feedback from families building with our AI-driven designs.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                    <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 items-start gap-4 hover:shadow-lg transition">
                                        <div className="flex text-emerald-500 mb-4">★★★★★</div>
                                        <p className="text-stone-700 text-lg italic mb-6">"I was struggling with how to fit a 3BHK on my small 30x40 plot. The AI's ability to optimize space while maintaining smart lifestyle features was exactly what I needed. The budget estimation was spot on too!"</p>
                                        <div className="flex items-center gap-4">
                                            <img src="/customer-rajesh.png" className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover" alt="Rajesh" />
                                            <div>
                                                <p className="font-bold text-stone-900 text-sm">Animesh Roy</p>
                                                <p className="text-xs text-stone-500">Kolkata, 3BHK Duplex Plan</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 items-start gap-4 hover:shadow-lg transition">
                                        <div className="flex text-emerald-500 mb-4">★★★★★</div>
                                        <p className="text-stone-700 text-lg italic mb-6">"Designing my dream villa felt overwhelming until I used the AI Discovery Assistant. It asked the right questions about my lifestyle and generated a stunning G+2 plan that my manual architect hadn't even thought of."</p>
                                        <div className="flex items-center gap-4">
                                            <img src="/customer-priya.png" className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover" alt="Priya" />
                                            <div>
                                                <p className="font-bold text-stone-900 text-sm">Meenakshi Iyer</p>
                                                <p className="text-xs text-stone-500">Chennai, Luxury Villa Plan</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Q&A SECTION */}
                            <div className="mt-32 max-w-4xl mx-auto pb-20">
                                <div className="text-center mb-12">
                                    <h3 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Frequently Asked Questions</h3>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { q: "Are these plans structurally engineered?", a: "Our plans are architectural concepts designed to be code-compliant. However, we recommend having a local structural engineer review them for specific soil conditions." },
                                        { q: "Can I customize the generated plans?", a: "Yes! Once you generate a plan, you can save it to your dashboard and consult with our partner architects for specific customizations." },
                                        { q: "How accurate is the cost estimation?", a: "The budget calculator uses real-time material costs in major Indian cities, offering an accuracy within 10-15% of actual market rates." },
                                        { q: "Do you provide electrical and plumbing drawings?", a: "The Premium tier includes detailed electrical, plumbing, and column layout drawings alongside the standard floor plans." }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-emerald-300 transition">
                                            <details className="group">
                                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-stone-800">
                                                    <span className="text-lg">{item.q}</span>
                                                    <span className="transition group-open:rotate-180 text-emerald-600">
                                                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                                    </span>
                                                </summary>
                                                <div className="text-stone-500 px-6 pb-6 pt-0 leading-relaxed">
                                                    {item.a}
                                                </div>
                                            </details>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </main>
                <Footer />
                {error && (
                    <div className="fixed bottom-6 right-6 bg-red-50 text-red-600 px-6 py-4 rounded-xl shadow-xl border border-red-100">
                        ⚠️ {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
