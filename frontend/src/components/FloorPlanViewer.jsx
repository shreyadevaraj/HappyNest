import { useState } from 'react';
import html2canvas from 'html2canvas';

const FloorPlanViewer = ({ planData, onClose }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const element = document.getElementById('floor-plan-content');
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const link = document.createElement('a');
            link.download = `${planData.title || planData.name}-floor-plan.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download plan. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-6 flex justify-between items-center rounded-t-3xl">
                    <div>
                        <h2 className="text-3xl font-bold mb-1">{planData.title || planData.name} - Floor Plan</h2>
                        <p className="text-emerald-100 text-sm">Detailed architectural visualization</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-2xl"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div id="floor-plan-content" className="p-8 md:p-12 bg-white">

                    {/* Plan Header Info */}
                    <div className="mb-8 text-center">
                        <h3 className="text-2xl font-serif text-stone-800 mb-2">{planData.title || planData.headline}</h3>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-600">
                            <span className="bg-emerald-50 px-4 py-2 rounded-full font-medium">
                                📐 {planData.builtUpArea}
                            </span>
                            <span className="bg-amber-50 px-4 py-2 rounded-full font-medium">
                                💰 {planData.budgetEstimate}
                            </span>
                        </div>
                    </div>

                    {/* Side by Side: Floor Plan & Building Image */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Floor Plan Image */}
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">📋</span>
                                Floor Plan Layout
                            </h4>
                            <div className="rounded-2xl border-4 border-stone-200 overflow-hidden shadow-lg bg-white">
                                <img
                                    src={planData.floorPlanImage || planData.image}
                                    alt="Floor Plan"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>

                        {/* Building Exterior Image */}
                        <div className="space-y-4">
                            <h4 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                                <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">🏠</span>
                                Building Exterior view
                            </h4>
                            <div className="rounded-2xl border-4 border-stone-200 overflow-hidden shadow-lg bg-stone-50">
                                <img
                                    src={planData.image}
                                    alt="Building Exterior"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Room Details */}
                    <div className="mb-8">
                        <h4 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                            <span className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">📐</span>
                            Room Dimensions & Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(planData.rooms || planData.roomDetails)?.split(',').map((item, i) => (
                                <div key={i} className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-violet-400"></div>
                                    <span className="text-sm font-medium text-stone-700">{item.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                            <h5 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                                <span>☀️</span> Light & Ventilation
                            </h5>
                            <p className="text-sm text-stone-700 leading-relaxed">{planData.lightVentilation || "Optimized for natural light"}</p>
                        </div>

                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
                            <h5 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                <span>🚀</span> Project Highlights
                            </h5>
                            <p className="text-sm text-stone-700 leading-relaxed">{planData.highlights || "Optimized for modern urban living and space efficiency."}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-stone-50 px-8 py-6 border-t border-stone-200 rounded-b-3xl flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <p className="text-sm text-stone-600 text-center sm:text-left">
                        💡 Click "Download Plan" to save this floor plan as an image
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => alert("Basic customization tool launching soon! For deep customization, save this plan and consult our pro architects.")}
                            className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition shadow-sm flex items-center gap-2"
                        >
                            <span>✏️</span> Customize
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-stone-200 text-stone-700 font-bold rounded-xl hover:bg-stone-300 transition"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDownloading ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <span>📥</span>
                                    Download Plan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FloorPlanViewer;
