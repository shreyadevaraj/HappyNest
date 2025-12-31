import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ArchitectForm = ({ onSubmit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        plotSize: '',
        floors: '1',
        floorConfigs: ['3 BHK Comfort'], // Array storing type for each floor
        facing: 'North',
        budget: '',
        mandatoryRooms: '',
    });

    const getFloorCount = (floorVal) => {
        return parseInt(floorVal) || 1;
    };

    const handleFloorChange = (e) => {
        const val = e.target.value;
        const count = getFloorCount(val);
        const newConfigs = [...formData.floorConfigs];

        if (count > newConfigs.length) {
            for (let i = newConfigs.length; i < count; i++) {
                newConfigs.push('2 BHK Standard');
            }
        } else {
            newConfigs.splice(count);
        }

        setFormData({ ...formData, floors: val, floorConfigs: newConfigs });
    };

    const handleFloorConfigChange = (index, value) => {
        const newConfigs = [...formData.floorConfigs];
        newConfigs[index] = value;
        setFormData({ ...formData, floorConfigs: newConfigs });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Consolidate floor configs into a descriptive houseType string for the backend
        const consolidatedHouseType = formData.floorConfigs
            .map((type, i) => `Floor ${i + 1}: ${type}`)
            .join(', ');

        onSubmit({
            ...formData,
            houseType: consolidatedHouseType
        });
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-stone-200 border border-stone-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2 opacity-50"></div>

            <div className="p-8 md:p-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-8 border-b border-stone-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-3xl md:text-4xl font-serif text-stone-800">Project Requirements</h3>
                            <p className="text-stone-500 text-sm mt-1">Tell us about your plot to generate the perfect plan</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate('/discovery')}
                        className="px-6 py-3 bg-violet-50 text-violet-700 font-bold rounded-xl border border-violet-100 hover:bg-violet-100 transition flex items-center gap-2 group"
                    >
                        <span className="text-lg">✨</span>
                        Not sure? Let AI Help
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="col-span-1 space-y-2 group">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 group-focus-within:text-emerald-600 transition-colors">Plot Size (ft)</label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                name="plotSize"
                                placeholder="e.g. 40x60"
                                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-stone-800 font-medium placeholder-stone-400"
                                value={formData.plotSize}
                                onChange={handleChange}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 0 0 2 3.5V5c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V3.5A1.5 1.5 0 0 0 16.5 2h-13ZM2 6.5v10A1.5 1.5 0 0 0 3.5 18h13a1.5 1.5 0 0 0 1.5-1.5v-10H2Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 space-y-2 group">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 group-focus-within:text-emerald-600 transition-colors">Budget (INR)</label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                name="budget"
                                placeholder="e.g. 70 Lakhs"
                                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-stone-800 font-medium placeholder-stone-400"
                                value={formData.budget}
                                onChange={handleChange}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-600 font-serif font-bold">₹</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Number of Floors</label>
                        <div className="relative">
                            <select
                                name="floors"
                                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-stone-800 font-medium appearance-none cursor-pointer"
                                value={formData.floors}
                                onChange={handleFloorChange}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 md:col-span-2 bg-stone-50 p-6 rounded-2xl border border-stone-200">
                        <h4 className="text-sm font-bold text-stone-700 mb-2">Configure House Type per Floor</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.floorConfigs.map((config, index) => (
                                <div key={index} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                        Floor {index + 1}
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl focus:border-emerald-500 transition-all outline-none text-sm text-stone-800 font-semibold appearance-none cursor-pointer"
                                            value={config}
                                            onChange={(e) => handleFloorConfigChange(index, e.target.value)}
                                        >
                                            <option>1 BHK Compact</option>
                                            <option>2 BHK Standard</option>
                                            <option>3 BHK Comfort</option>
                                            <option>4 BHK Luxury</option>
                                            <option>Villa Estate</option>
                                            <option>Open Terrace / Garden</option>
                                            <option>Office / Commercial Space</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Facing Direction</label>
                        <div className="grid grid-cols-4 gap-4 p-1.5 bg-stone-100 rounded-xl border border-stone-200">
                            {['North', 'South', 'East', 'West'].map((dir) => (
                                <button
                                    key={dir}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, facing: dir })}
                                    className={`py-3 rounded-lg text-sm font-bold transition-all relative overflow-hidden ${formData.facing === dir
                                        ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-stone-200'
                                        : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
                                        }`}
                                >
                                    {formData.facing === dir && (
                                        <span className="absolute left-0 top-0 h-full w-1 bg-emerald-500"></span>
                                    )}
                                    {dir}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-stone-400 group-focus-within:text-emerald-600 transition-colors">Project Features & Custom Needs</label>
                        <textarea
                            name="mandatoryRooms"
                            rows="3"
                            placeholder="Describe any specific needs (e.g., 'Large open kitchen with island', 'Prayer room in NE corner', 'Home office')"
                            className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-stone-800 font-medium placeholder-stone-400 resize-none"
                            value={formData.mandatoryRooms}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button
                            type="submit"
                            className="w-full py-5 bg-gradient-to-r from-stone-900 to-stone-800 text-white font-bold text-lg rounded-xl hover:from-emerald-700 hover:to-emerald-600 transform hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-stone-900/10 hover:shadow-emerald-900/20 active:translate-y-0 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <span>Generate My Blueprints</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArchitectForm;
