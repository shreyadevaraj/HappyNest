import { useState } from 'react';

const VirtualTour = ({ interiors, onClose }) => {
    const [currentRoom, setCurrentRoom] = useState(0);
    const rooms = interiors || [];

    if (rooms.length === 0) return null;

    const handleNext = () => {
        setCurrentRoom((prev) => (prev + 1) % rooms.length);
    };

    const handlePrev = () => {
        setCurrentRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4">
            {/* Header / Close */}
            <div className="absolute top-6 right-6 z-10">
                <button
                    onClick={onClose}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all backdrop-blur-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="absolute top-6 left-6 z-10 text-white">
                <h3 className="text-2xl font-bold tracking-tight">Virtual Experience</h3>
                <p className="text-white/70 text-sm">Walkthrough Mode • {rooms[currentRoom].name}</p>
            </div>

            {/* Main Viewer */}
            <div className="relative w-full max-w-7xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">

                {interiors.map((room, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentRoom ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover animate-pan-slow"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                    </div>
                ))}

                {/* Navigation Arrows */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                {/* Room Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                    {rooms.map((room, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentRoom(idx)}
                            className={`group flex flex-col items-center gap-2 transition-all ${idx === currentRoom ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-80'}`}
                        >
                            <div className={`w-16 h-10 rounded border overflow-hidden ${idx === currentRoom ? 'border-emerald-500 shadow-emerald-500/50 shadow-lg' : 'border-white/30'}`}>
                                <img src={room.image} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-white tracking-wider">{room.name}</span>
                        </button>
                    ))}
                </div>

            </div>

            <style>{`
                @keyframes pan-slow {
                    0% { transform: scale(1.0); }
                    100% { transform: scale(1.1); }
                }
                .animate-pan-slow {
                    animation: pan-slow 20s ease-in-out infinite alternate;
                }
            `}</style>
        </div>
    );
};

export default VirtualTour;
