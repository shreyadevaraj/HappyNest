import { useState } from 'react';

const ArchitectForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        plotSize: '',
        floors: 'G+1',
        houseType: '3BHK',
        facing: 'North',
        budget: '',
        mandatoryRooms: '',
        vaastu: 'Strict compliance',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="bg-stone-50 p-8 border-b border-stone-100 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-stone-800">Project Requirements</h3>
                    <p className="text-stone-500 text-sm mt-1">Please provide accurate plot details for best results</p>
                </div>
                <div className="hidden md:block text-4xl opacity-20">📐</div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">Plot Size (ft)</label>
                    <input
                        required
                        type="text"
                        name="plotSize"
                        placeholder="e.g. 40x60"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none text-stone-700"
                        value={formData.plotSize}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">Budget (INR)</label>
                    <input
                        required
                        type="text"
                        name="budget"
                        placeholder="e.g. 70 Lakhs"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none text-stone-700"
                        value={formData.budget}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">Floors</label>
                    <select
                        name="floors"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none text-stone-700 appearance-none mobile-select-icon"
                        value={formData.floors}
                        onChange={handleChange}
                    >
                        <option>Single Floor</option>
                        <option>G+1</option>
                        <option>G+2</option>
                        <option>Duplex</option>
                        <option>Triplex</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">House Type</label>
                    <select
                        name="houseType"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none text-stone-700 appearance-none mobile-select-icon"
                        value={formData.houseType}
                        onChange={handleChange}
                    >
                        <option>1BHK</option>
                        <option>2BHK</option>
                        <option>3BHK</option>
                        <option>4BHK+</option>
                        <option>Villa</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">Facing Direction</label>
                    <div className="grid grid-cols-4 gap-4">
                        {['North', 'South', 'East', 'West'].map((dir) => (
                            <button
                                key={dir}
                                type="button"
                                onClick={() => setFormData({ ...formData, facing: dir })}
                                className={`py-3 rounded-lg text-sm font-medium transition-all ${formData.facing === dir
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                        : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-400'
                                    }`}
                            >
                                {dir}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">Vaastu Compliance</label>
                    <select
                        name="vaastu"
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none text-stone-700 appearance-none mobile-select-icon"
                        value={formData.vaastu}
                        onChange={handleChange}
                    >
                        <option>Strict (100%)</option>
                        <option>Moderate</option>
                        <option>None</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">Special Requirements</label>
                    <textarea
                        name="mandatoryRooms"
                        rows="3"
                        placeholder="e.g. Need a large library, servant quarters, and a double-car garage."
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition outline-none text-stone-700"
                        value={formData.mandatoryRooms}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="md:col-span-2 pt-4 border-t border-stone-100 flex justify-end">
                    <button
                        type="submit"
                        className="px-10 py-4 bg-stone-800 text-white font-bold rounded-lg hover:bg-stone-700 transform hover:-translate-y-0.5 transition shadow-lg shadow-stone-300"
                    >
                        Generate Blueprints
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ArchitectForm;
