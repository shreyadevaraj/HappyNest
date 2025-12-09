import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ArchitectForm from './components/ArchitectForm';
import PlanResults from './components/PlanResults';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ArchitectsPage from './pages/ArchitectsPage';

function App() {
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDoor, setShowDoor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDoor(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async (formData) => {
    setLoading(true);
    setError(null);
    setPlans(null);

    try {
      const response = await fetch('http://localhost:8080/api/architect/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }

      const rawText = await response.text();
      let jsonStr = rawText;
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }

      const data = JSON.parse(jsonStr);
      setPlans(data);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again or check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-stone-50 font-sans text-stone-700 relative overflow-x-hidden">

        {/* Door Opening Animation Overlay */}
        {showDoor && (
          <div className="fixed inset-0 z-[100] flex pointer-events-none">
            <div className="w-1/2 h-full door-left flex flex-col justify-center items-end pr-8 shadow-2xl">
              <div className="w-4 h-4 rounded-full bg-emerald-900 shadow-inner"></div>
              <div className="w-32 h-64 border-2 border-emerald-700 rounded mb-4 opacity-30 absolute top-1/4 right-10"></div>
              <div className="w-32 h-64 border-2 border-emerald-700 rounded mb-4 opacity-30 absolute bottom-1/4 right-10"></div>
            </div>

            <div className="w-1/2 h-full door-right flex flex-col justify-center items-start pl-8 shadow-2xl">
              <div className="w-4 h-4 rounded-full bg-emerald-900 shadow-inner"></div>
              <div className="w-32 h-64 border-2 border-emerald-700 rounded mb-4 opacity-30 absolute top-1/4 left-10"></div>
              <div className="w-32 h-64 border-2 border-emerald-700 rounded mb-4 opacity-30 absolute bottom-1/4 left-10"></div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`transition-opacity duration-1000 ${showDoor ? 'opacity-0' : 'opacity-100 reveal-text'}`}>
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
              <nav className="hidden md:flex gap-6 text-sm font-semibold text-stone-500">
                <Link to="/projects" className="hover:text-emerald-600 transition">Projects</Link>
                <Link to="/architects" className="hover:text-emerald-600 transition">Architects</Link>
                <Link to="/about" className="hover:text-emerald-600 transition">About</Link>
              </nav>
            </div>
          </header>

          <Routes>
            <Route path="/" element={
              <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-100">
                    Professional AI Architect
                  </div>
                  <h2 className="text-5xl md:text-6xl font-serif text-stone-800 mb-6">
                    Design with <span className="text-emerald-600 italic">Clarity</span>
                  </h2>
                  <p className="text-xl text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
                    Generate professional, Vaastu-compliant residential floor plans tailored to your exact plot and budget using advanced AI.
                  </p>
                </div>

                {!plans && !loading && (
                  <div className="max-w-4xl mx-auto">
                    <ArchitectForm onSubmit={handleGenerate} />
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
                    <h3 className="text-xl font-medium text-stone-800">Drafting your detailed plans...</h3>
                    <p className="text-stone-400 mt-2">Checking regulations & dimensions</p>
                  </div>
                )}

                {error && (
                  <div className="max-w-2xl mx-auto p-6 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
                    {error}
                  </div>
                )}

                {plans && (
                  <div className="space-y-10 animate-fade-in-up">
                    <button
                      onClick={() => setPlans(null)}
                      className="px-6 py-2 bg-white text-stone-500 border border-stone-200 rounded-full hover:border-emerald-500 hover:text-emerald-600 font-medium transition flex items-center gap-2"
                    >
                      <span>←</span> New Project
                    </button>
                    <PlanResults data={plans} />
                  </div>
                )}
              </main>
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/architects" element={<ArchitectsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
