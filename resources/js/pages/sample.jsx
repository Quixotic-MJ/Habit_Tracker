import React, { useState, useEffect, useRef } from "react";
import {
    Eye,
    Flame,
    Shield,
    Users,
    Scroll,
    Moon,
    Plus,
    Swords,
    Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 1. AUDIO ENGINE
// ==========================================
const useAudio = () => {
    const activateSound = useRef(
        new Audio(
            "https://cdn.freesound.org/previews/536/536108_1669230-lq.mp3"
        )
    ); // Sharp energy
    const crowSound = useRef(
        new Audio(
            "https://cdn.freesound.org/previews/316/316920_4901579-lq.mp3"
        )
    ); // Crows
    const ambience = useRef(
        new Audio(
            "https://cdn.freesound.org/previews/262/262267_4008779-lq.mp3"
        )
    ); // Deep Drone

    const playActivate = () => {
        activateSound.current.volume = 0.3;
        activateSound.current.currentTime = 0;
        activateSound.current.play().catch(() => {});
    };

    const playGenjutsu = () => {
        crowSound.current.volume = 0.4;
        crowSound.current.currentTime = 0;
        crowSound.current.play().catch(() => {});

        ambience.current.volume = 0.5;
        ambience.current.play().catch(() => {});
        // Fade out ambience after 3s
        setTimeout(() => {
            ambience.current.pause();
            ambience.current.currentTime = 0;
        }, 3500);
    };

    return { playActivate, playGenjutsu };
};

// ==========================================
// 2. VISUAL EFFECTS COMPONENTS
// ==========================================

// Grain Overlay for Cinematic Feel
const GrainOverlay = () => (
    <div
        className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] mix-blend-overlay"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
    ></div>
);

const InfiniteTsukuyomiBg = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-[40] pointer-events-none overflow-hidden"
        >
            {/* Red Sky Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-600/40 via-red-900/60 to-black mix-blend-hard-light"></div>

            {/* The Moon */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: -50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="absolute top-16 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-red-600 shadow-[0_0_150px_rgba(255,0,0,0.8)] flex items-center justify-center mix-blend-screen"
            >
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full opacity-50 animate-pulse-slow"
                >
                    {/* Ripples */}
                    {[48, 35, 20].map((r) => (
                        <circle
                            key={r}
                            cx="50"
                            cy="50"
                            r={r}
                            fill="none"
                            stroke="black"
                            strokeWidth="0.5"
                        />
                    ))}
                    <circle cx="50" cy="50" r="5" fill="black" />
                    {/* Tomoe Pattern */}
                    {[0, 120, 240].map((deg, i) => (
                        <g key={i} transform={`rotate(${deg} 50 50)`}>
                            <circle cx="50" cy="15" r="3" fill="black" />
                            <circle cx="50" cy="30" r="3" fill="black" />
                            <circle cx="50" cy="42" r="3" fill="black" />
                        </g>
                    ))}
                </svg>
            </motion.div>

            {/* Global Red Overlay Tint */}
            <div className="absolute inset-0 bg-red-500/20 mix-blend-color-dodge"></div>
        </motion.div>
    );
};

const CrowGenjutsu = () => {
    const crows = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * window.innerWidth * 1.5,
        y: (Math.random() - 0.5) * window.innerHeight * 1.5,
        scale: 0.5 + Math.random() * 1.5,
        delay: Math.random() * 0.5,
        duration: 1 + Math.random(),
        rotate: (Math.random() - 0.5) * 45,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
            {crows.map((crow) => (
                <motion.svg
                    key={crow.id}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="absolute w-12 h-12 drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                    style={{ fill: "black" }}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                        x: crow.x,
                        y: crow.y,
                        opacity: [0, 1, 0],
                        scale: crow.scale,
                        rotate: crow.rotate,
                    }}
                    transition={{
                        duration: crow.duration,
                        ease: "easeOut",
                        delay: crow.delay,
                    }}
                >
                    <path d="M21.41 11.58l-9-5c-1 2-2 3-4 3l-6-3c2 2 4 4 6 5l-2 3h3l4-3 3 3 2-1-3-4 6 2z" />
                </motion.svg>
            ))}
        </div>
    );
};

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const SharinganEye = ({ dayNum, isDone, onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.15, zIndex: 20 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-full aspect-square flex items-center justify-center group"
        >
            {isDone ? (
                <motion.svg
                    viewBox="0 0 100 100"
                    className="w-full h-full drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]"
                    initial={{ rotate: 0, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 720, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                >
                    {/* Mangekyou Style Pattern */}
                    <circle
                        cx="50"
                        cy="50"
                        r="48"
                        fill="#7f1d1d"
                        stroke="#ef4444"
                        strokeWidth="2"
                    />
                    <path
                        d="M50 50 L50 10 L65 35 Z"
                        fill="black"
                        transform="rotate(0 50 50)"
                    />
                    <path
                        d="M50 50 L50 10 L65 35 Z"
                        fill="black"
                        transform="rotate(120 50 50)"
                    />
                    <path
                        d="M50 50 L50 10 L65 35 Z"
                        fill="black"
                        transform="rotate(240 50 50)"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="12"
                        fill="none"
                        stroke="black"
                        strokeWidth="3"
                    />
                    <circle cx="50" cy="50" r="5" fill="#ef4444" />
                </motion.svg>
            ) : (
                <motion.div
                    className="w-full h-full rounded-sm bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-red-600/60 group-hover:bg-red-950/20 transition-all duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <span className="text-sm sm:text-lg text-neutral-600 font-bold group-hover:text-red-500 transition-colors font-mono">
                        {dayNum}
                    </span>
                </motion.div>
            )}
        </motion.button>
    );
};

const SharinganWidget = ({ title, initialData, onInteraction }) => {
    const [completedDays, setCompletedDays] = useState(initialData);
    const { playActivate } = useAudio();

    const daysInMonth = 31;
    const firstDaySpan = 2;

    const toggleDay = (day) => {
        let isNowDone = false;
        if (completedDays.includes(day)) {
            setCompletedDays(completedDays.filter((d) => d !== day));
        } else {
            setCompletedDays([...completedDays, day]);
            isNowDone = true;
        }

        // Play sound immediately on click
        playActivate();

        // Trigger Genjutsu if completing a task
        if (isNowDone) {
            onInteraction();
        }
    };

    return (
        <div className="relative rounded-sm border border-red-900/20 bg-black/40 backdrop-blur-sm p-6 flex flex-col overflow-hidden group hover:border-red-600/40 transition-all shadow-lg hover:shadow-red-900/10">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-lg font-black text-red-50 tracking-[0.2em] uppercase flex items-center gap-3 drop-shadow-md">
                        <Scroll size={18} className="text-red-600" /> {title}
                    </h3>
                    <div className="h-0.5 w-12 bg-red-800 mt-2 group-hover:w-full transition-all duration-700"></div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-xs text-red-500/80 font-bold uppercase tracking-widest">
                        <Moon size={10} /> Phase 12
                    </div>
                    <div className="text-[10px] text-neutral-600 font-mono mt-1">
                        RANK: S
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-3 relative z-10">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div
                        key={i}
                        className="text-[10px] text-center text-red-900/70 font-black"
                    >
                        {d}
                    </div>
                ))}

                {Array.from({ length: firstDaySpan }).map((_, i) => (
                    <div key={`e-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => (
                    <SharinganEye
                        key={i + 1}
                        dayNum={i + 1}
                        isDone={completedDays.includes(i + 1)}
                        onClick={() => toggleDay(i + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

// ==========================================
// 4. MAIN DASHBOARD LAYOUT
// ==========================================
const ItachiDashboard = () => {
    const [genjutsuActive, setGenjutsuActive] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const { playGenjutsu } = useAudio();

    const triggerGenjutsu = () => {
        setToastMessage("TSUKUYOMI ACTIVE");
        playGenjutsu(); // Trigger audio
        setGenjutsuActive(true); // Trigger Visuals

        setTimeout(() => {
            setToastMessage(null);
            setGenjutsuActive(false);
        }, 3500);
    };

    const [userStats] = useState({ level: 99, xp: 4500, nextLevelXp: 5000 });
    const habits = [
        {
            id: 1,
            title: "Train Sharingan",
            data: [1, 2, 3, 5, 6, 8, 9, 10, 12, 15, 16, 17, 20, 21],
        },
        { id: 2, title: "Anbu Missions", data: [5, 6, 12, 13, 19, 20, 21] },
        {
            id: 3,
            title: "Chakra Control",
            data: [1, 2, 3, 4, 5, 6, 7, 15, 16, 17, 18],
        },
        {
            id: 4,
            title: "Cardio (Run)",
            data: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21],
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-red-50 font-mono flex flex-col md:flex-row relative overflow-hidden selection:bg-red-900 selection:text-white">
            <GrainOverlay />

            {/* EFFECT: INFINITE TSUKUYOMI + CROWS */}
            <AnimatePresence>
                {genjutsuActive && (
                    <>
                        <InfiniteTsukuyomiBg key="bg" />
                        <CrowGenjutsu key="crows" />
                    </>
                )}
            </AnimatePresence>

            {/* EFFECT: TOAST NOTIFICATION */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="fixed bottom-10 right-4 md:right-10 z-[200] bg-black/90 text-red-500 px-8 py-4 border-l-4 border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.4)] backdrop-blur-md"
                    >
                        <div className="flex items-center gap-4">
                            <Eye size={24} className="animate-pulse" />
                            <span className="font-black tracking-[0.3em] text-lg">
                                {toastMessage}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SIDEBAR: BINGO BOOK STYLE */}
            <aside className="w-full md:w-80 bg-neutral-950/90 border-r border-red-900/20 p-8 flex flex-col gap-10 relative z-10">
                {/* Profile */}
                <div className="text-center group relative">
                    <div className="absolute inset-0 bg-red-600/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative inline-block cursor-pointer"
                    >
                        <div className="w-28 h-28 border-[3px] border-neutral-800 p-1 bg-black relative">
                            {/* Corner Marks */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-600"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-600"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-600"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-600"></div>

                            <div className="w-full h-full bg-neutral-900 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                <span className="text-5xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                    🌑
                                </span>
                            </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-900 text-white text-[10px] font-bold px-3 py-1 border border-red-500 tracking-widest uppercase shadow-lg">
                            Rogue
                        </div>
                    </motion.div>
                    <h2 className="mt-6 text-xl font-black text-white tracking-[0.2em] uppercase">
                        UCHIHA
                    </h2>

                    <div className="mt-4 w-full bg-neutral-900 h-2 overflow-hidden border border-red-900/30">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${
                                    (userStats.xp / userStats.nextLevelXp) * 100
                                }%`,
                            }}
                            className="bg-red-700 h-full shadow-[0_0_15px_red]"
                        ></motion.div>
                    </div>
                    <div className="flex justify-between text-[10px] text-red-500/50 mt-1 font-bold">
                        <span>CHAKRA</span>
                        <span>{userStats.level}/100</span>
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="space-y-4">
                    <div className="bg-black/40 p-4 border-l-2 border-red-800 hover:bg-red-900/10 transition-colors">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                                <Shield size={12} /> Defense
                            </span>
                            <span className="text-white font-bold text-sm">
                                ACTIVE
                            </span>
                        </div>
                    </div>
                    <div className="bg-black/40 p-4 border-l-2 border-neutral-700 hover:bg-red-900/10 transition-colors">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                <Swords size={12} /> Offense
                            </span>
                            <span className="text-neutral-400 font-bold text-sm">
                                READY
                            </span>
                        </div>
                    </div>
                    <div className="bg-black/40 p-4 border-l-2 border-neutral-700 hover:bg-red-900/10 transition-colors">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={12} /> Stamina
                            </span>
                            <span className="text-neutral-400 font-bold text-sm">
                                85%
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-grow p-4 sm:p-10 overflow-y-auto relative z-10">
                <header className="flex justify-between items-end mb-12 border-b-2 border-red-900/20 pb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-[0.15em] drop-shadow-lg">
                            AKATSUKI <span className="text-red-600">OS</span>
                        </h1>
                        <p className="text-red-600/60 text-xs mt-2 uppercase font-bold tracking-[0.3em]">
                            System Status: Online /// Target Acquired
                        </p>
                    </div>
                    <button className="hidden md:flex bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/30 px-6 py-3 font-bold text-xs transition-all items-center gap-3 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] tracking-widest uppercase">
                        <Plus size={14} /> New Mission
                    </button>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {habits.map((habit) => (
                        <SharinganWidget
                            key={habit.id}
                            title={habit.title}
                            initialData={habit.data}
                            onInteraction={triggerGenjutsu}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ItachiDashboard;
