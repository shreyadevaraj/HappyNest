import { useState } from 'react';
import FloorPlanViewer from './FloorPlanViewer';

const PlanResults = ({ plans, onSave, requestData }) => {
    // ... existing state hooks ...
    const activePlanState = useState(0);
    const activePlan = activePlanState[0];
    const setActivePlan = activePlanState[1];
    const [showFloorPlan, setShowFloorPlan] = useState(false);

    // ... null check ...
    if (!plans || plans.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 text-center">
                <p className="text-red-500">Error parsing plan data.</p>
            </div>
        )
    }

    const current = plans[activePlan];

    // ... helper ...
    const parseRoomDetails = (details) => {
        if (!details) return [];
        return details.split(',').map(s => s.trim());
    };
    const roomItems = parseRoomDetails(current.rooms || current.roomDetails);

    return (
        <div className="space-y-10 animate-fade-in-up">

            {showFloorPlan && (
                <FloorPlanViewer
                    planData={current}
                    onClose={() => setShowFloorPlan(false)}
                />
            )}

            {/* Plan Navigation */}
            <div className="sticky top-24 z-20 bg-stone-50/95 backdrop-blur-sm pt-2 -mt-2 pb-4 border-b border-stone-200/50">
                <div className="max-w-7xl mx-auto flex overflow-x-auto gap-3 py-2 px-1">
                    {plans.map((p, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActivePlan(idx)}
                            className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${activePlan === idx
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20 transform -translate-y-1'
                                : 'bg-white text-stone-500 border-stone-200 hover:border-emerald-200 hover:text-emerald-600'
                                }`}
                        >
                            {p.name || (p.plan ? `Plan ${p.plan}` : `Option ${idx + 1}`)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">

                <div className="p-6 md:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-stone-100 pb-8 mb-8">
                        <div>
                            <h2 className="text-3xl font-serif text-stone-800 mb-2 leading-tight">{current.title || current.headline || current.name}</h2>
                            <p className="text-stone-500 font-medium flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
                                {current.builtUpArea} Built-up Area
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="text-right bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Estimated Budget</p>
                                <p className="text-2xl md:text-3xl font-black text-stone-800">{current.budgetEstimate}</p>
                            </div>
                            {onSave && (
                                <button
                                    onClick={() => onSave(current)}
                                    className="px-6 py-2 bg-stone-800 text-white font-bold rounded-lg hover:bg-emerald-600 transition shadow-lg flex items-center gap-2"
                                >
                                    <span>💾</span> Save This Plan
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

                        {/* Left Column: Visuals & Layout */}
                        <div className="space-y-8">
                            {/* Visual Representation Image */}
                            <div className="rounded-2xl border-8 border-white shadow-2xl overflow-hidden relative group aspect-[4/3]">
                                <img
                                    src={(() => {
                                        const img = current.image;
                                        if (!img || img === '/placeholder-house.png') return "/house_images/house_single.png";
                                        return img;
                                    })()}
                                    alt="Architectural Plan"
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <p className="text-white font-medium mb-3">AI Generated Architectural View</p>

                                    {/* View Plan Button Overlay */}
                                    <button
                                        onClick={() => setShowFloorPlan(true)}
                                        className="w-full bg-white/20 backdrop-blur-md border border-white/40 text-white font-bold py-3 rounded-lg hover:bg-white hover:text-emerald-900 transition flex items-center justify-center gap-2"
                                    >
                                        <span className="text-xl">📋</span> View Floor Plan
                                    </button>
                                </div>
                            </div>

                            {/* Mobile View Plan Button (visible if hover is tricky) */}
                            <div className="block md:hidden">
                                <button
                                    onClick={() => setShowFloorPlan(true)}
                                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                                >
                                    <span>📋</span> View Floor Plan
                                </button>
                            </div>

                            <div>
                                <h4 className="font-bold text-stone-800 mb-5 flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center text-xl">📐</span>
                                    Room Dimensions & Flow
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {roomItems.map((item, i) => (
                                        <div key={i} className="bg-stone-50 p-4 rounded-xl border border-stone-100 hover:border-violet-200 transition-colors flex items-start gap-3">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-violet-400"></div>
                                            <span className="text-sm font-medium text-stone-600 leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Analysis & Features */}
                        <div className="space-y-6">

                            {/* Analysis Cards */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-100 hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                        <span>☀️</span> Light & Ventilation
                                    </h4>
                                    <p className="text-sm text-stone-600 leading-relaxed font-medium">{current.lightVentilation || "Optimized for natural light"}</p>
                                </div>

                                <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-100 hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                                        <span>🚀</span> Project Highlights
                                    </h4>
                                    <p className="text-sm text-stone-600 leading-relaxed font-medium">{current.highlights || "Optimized for modern urban living and space efficiency."}</p>
                                </div>
                            </div>

                            {/* House Features Section */}
                            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-100 shadow-lg mt-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 z-0"></div>

                                <h4 className="font-bold text-stone-800 mb-6 flex items-center gap-2 relative z-10">
                                    <span className="text-2xl">🏠</span> House Premium Features
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded ml-auto">AI Optimized</span>
                                </h4>

                                <div className="flex flex-col gap-3 relative z-10">
                                    {current.houseFeatures ? (
                                        current.houseFeatures.map((feature, i) => (
                                            <div key={i} className="flex items-center bg-stone-50 p-4 rounded-xl border border-stone-100 hover:border-emerald-300 transition-all">
                                                <p className="text-sm font-medium text-stone-700 leading-relaxed">{feature}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-stone-500 italic">Exploring the best features for your home...</p>
                                    )}
                                </div>
                                <p className="text-[10px] text-stone-400 mt-4 text-center">
                                    *Generated based on your plot size and budget requirements.
                                </p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanResults;
