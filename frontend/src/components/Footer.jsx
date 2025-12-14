import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#1c1917] text-stone-400 py-20 border-t border-stone-800 font-sans">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">

                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-900/50">
                            H
                        </div>
                        <span className="text-3xl font-bold text-white tracking-tight">
                            Happy<span className="text-emerald-500">Nest</span>
                        </span>
                    </div>
                    <p className="text-stone-500 leading-relaxed text-sm">
                        Revolutionizing architectural design with AI. We help you visualize, plan, and build your dream home with precision and ease.
                    </p>
                    <div className="flex gap-4 pt-2">
                        {['twitter', 'linkedin', 'instagram', 'facebook'].map(social => (
                            <a key={social} href="#" className="w-10 h-10 rounded-full bg-stone-800/50 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition duration-300 border border-stone-800 hover:border-emerald-500 hover:-translate-y-1">
                                <span className="capitalize text-xs">{social[0]}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
                        Discover
                        <span className="absolute -bottom-2 left-0 w-8 h-1 bg-emerald-500 rounded-full"></span>
                    </h4>
                    <ul className="space-y-4">
                        <li><Link to="/" className="hover:text-emerald-400 transition flex items-center gap-2"><span>→</span> Home</Link></li>
                        <li><Link to="/architects" className="hover:text-emerald-400 transition flex items-center gap-2"><span>→</span> Find Architects</Link></li>
                        <li><Link to="/dashboard" className="hover:text-emerald-400 transition flex items-center gap-2"><span>→</span> My Projects</Link></li>
                        <li><Link to="/blog" className="hover:text-emerald-400 transition flex items-center gap-2"><span>→</span> Design Blog</Link></li>
                    </ul>
                </div>

                {/* Support Link */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
                        Support
                        <span className="absolute -bottom-2 left-0 w-8 h-1 bg-emerald-500 rounded-full"></span>
                    </h4>
                    <ul className="space-y-4">
                        <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-2"><span>→</span> Help Center</a></li>
                        <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-2"><span>→</span> Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-2"><span>→</span> Terms of Service</a></li>
                        <li><a href="#" className="hover:text-emerald-400 transition flex items-center gap-2"><span>→</span> Contact Us</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-white font-bold text-lg mb-8 relative inline-block">
                        Stay Updated
                        <span className="absolute -bottom-2 left-0 w-8 h-1 bg-emerald-500 rounded-full"></span>
                    </h4>
                    <p className="text-stone-500 text-sm mb-6">Subscribe to get the latest architectural trends and platform updates.</p>
                    <form className="space-y-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-stone-900/50 border border-stone-800 rounded-xl px-4 py-3 text-stone-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition placeholder:text-stone-600"
                        />
                        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-900/20">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-stone-600">
                <p>&copy; {new Date().getFullYear()} HappyNest AI Technologies Pvt. Ltd. All rights reserved.</p>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-emerald-500 transition">Privacy</a>
                    <a href="#" className="hover:text-emerald-500 transition">Cookies</a>
                    <a href="#" className="hover:text-emerald-500 transition">Terms</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
