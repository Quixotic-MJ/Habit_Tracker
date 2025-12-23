import React from "react";
import {
    CheckCircle,
    BarChart2,
    Zap,
    Layout,
    ArrowRight,
    Menu,
} from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
            {/* Navigation */}
            <nav className="border-b border-slate-800 backdrop-blur-md fixed w-full z-50 bg-slate-900/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <CheckCircle
                                className="text-indigo-500 group-hover:text-indigo-400 transition-colors"
                                size={28}
                            />
                            <span className="font-bold text-xl tracking-tight">
                                HabitFlow
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            <NavLink href="#features">Features</NavLink>
                            <NavLink href="#how-it-works">How it Works</NavLink>
                            <NavLink href="#pricing">Pricing</NavLink>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <button className="text-slate-300 hover:text-white font-medium transition-colors">
                                Log In
                            </button>
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-lg shadow-indigo-500/20">
                                Get Started
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button className="text-slate-300 hover:text-white p-2">
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        v2.0 is now live
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-slate-400 text-transparent bg-clip-text">
                        Build habits that <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                            actually stick.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stop relying on motivation. Start relying on systems.
                        Track your daily wins, visualize your progress with
                        heatmaps, and become 1% better every day.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-200 transition-colors shadow-xl">
                            Start Tracking Free
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-full font-bold text-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                            View Demo <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Abstract App Mockup */}
                <div className="relative max-w-4xl mx-auto mt-8">
                    {/* Glow Effect behind mockup */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20"></div>

                    <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl">
                        {/* Window Controls */}
                        <div className="flex gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                        </div>

                        {/* Mockup Content */}
                        <div className="space-y-4">
                            <HabitRow
                                text="Read 20 pages"
                                streak="12"
                                completed={true}
                            />
                            <HabitRow
                                text="Drink 2L Water"
                                streak="5"
                                completed={true}
                            />
                            <HabitRow
                                text="Deep Work (2h)"
                                streak="0"
                                completed={false}
                            />
                            <HabitRow
                                text="No Sugar"
                                streak="3"
                                completed={false}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything you need to stay consistent
                        </h2>
                        <p className="text-slate-400">
                            Minimal design, maximum impact on your routine.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Layout />}
                            title="Clean Dashboard"
                            desc="A distraction-free view of your daily goals. Focus only on what matters today."
                        />
                        <FeatureCard
                            icon={<BarChart2 />}
                            title="Visual Analytics"
                            desc="See your consistency over time with beautiful heatmaps and detailed trend lines."
                        />
                        <FeatureCard
                            icon={<Zap />}
                            title="Gamified Streaks"
                            desc="Don't break the chain. Earn badges and keep your momentum alive everyday."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
                        Ready to transform your routine?
                    </h2>
                    <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                        Join 10,000+ users building better lives. No credit card
                        required.
                    </p>
                    <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg relative z-10">
                        Get Started Now
                    </button>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
                <p>
                    © {new Date().getFullYear()} HabitFlow. Built with React &
                    Tailwind.
                </p>
            </footer>
        </div>
    );
};

// --- Sub Components ---

const NavLink = ({ href, children }) => (
    <a
        href={href}
        className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
    >
        {children}
    </a>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-all hover:-translate-y-1 hover:shadow-xl group">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-100">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

const HabitRow = ({ text, streak, completed }) => (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-4">
            <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                    completed
                        ? "bg-emerald-500 border-emerald-500 text-slate-900"
                        : "border-slate-600"
                }`}
            >
                {completed && <CheckCircle size={14} strokeWidth={4} />}
            </div>
            <span
                className={`font-medium ${
                    completed ? "text-slate-300 line-through" : "text-white"
                }`}
            >
                {text}
            </span>
        </div>
        <div className="flex items-center gap-1 text-sm font-mono text-slate-500">
            <span className="text-orange-500">🔥</span>
            {streak}
        </div>
    </div>
);

export default LandingPage;
