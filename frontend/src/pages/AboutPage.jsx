const AboutPage = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-serif text-stone-800 mb-4">About HappyNest</h1>
                <p className="text-xl text-stone-500">Building Dreams with Intelligence & Precision</p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-stone-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-lg text-emerald-50 leading-relaxed">
                        To democratize professional architectural planning by leveraging AI technology,
                        making high-quality, lifestyle-optimized home designs accessible to everyone.
                    </p>
                </div>

                <div className="p-12 space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                            <span className="text-3xl">🏡</span> What We Do
                        </h3>
                        <p className="text-stone-600 leading-relaxed">
                            HappyNest is an AI-powered residential architecture platform that generates optimized,
                            budget-conscious floor plans tailored to your specific requirements. We combine smart
                            functionality with modern design aesthetics to create homes that are both functional and harmonious.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                            <div className="text-3xl mb-3">⚡</div>
                            <h4 className="font-bold text-stone-800 mb-2">Instant Generation</h4>
                            <p className="text-sm text-stone-600">Get 3 optimized plans in seconds, not weeks</p>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                            <div className="text-3xl mb-3">💰</div>
                            <h4 className="font-bold text-stone-800 mb-2">Budget Transparency</h4>
                            <p className="text-sm text-stone-600">Clear cost breakdowns for every design tier</p>
                        </div>
                        <div className="bg-violet-50 p-6 rounded-2xl border border-violet-100">
                            <div className="text-3xl mb-3">✨</div>
                            <h4 className="font-bold text-stone-800 mb-2">Smart Features</h4>
                            <p className="text-sm text-stone-600">Lifestyle-optimized for modern urban living</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-3">
                            <span className="text-3xl">👥</span> Our Team
                        </h3>
                        <p className="text-stone-600 leading-relaxed">
                            We are a passionate team of architects, engineers, and AI specialists dedicated to
                            transforming the home construction experience in India. Our platform is built on years
                            of architectural expertise combined with cutting-edge machine learning technology.
                        </p>
                    </div>

                    <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200">
                        <h3 className="text-xl font-bold text-stone-800 mb-4">Contact Us</h3>
                        <div className="space-y-2 text-stone-600">
                            <p>📧 Email: hello@happynest.ai</p>
                            <p>📞 Phone: +91 98765 43210</p>
                            <p>📍 Location: Bangalore, India</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
