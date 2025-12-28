import React, { useState, useEffect } from "react";

// --- GAME DATA ---
const habitsData = [
    { id: 1, name: "Push Ups", exp: 20, icon: "⚔️" },
    { id: 2, name: "Read 5 Pages", exp: 15, icon: "📜" },
    { id: 3, name: "Drink Water", exp: 10, icon: "💧" },
    { id: 4, name: "Code 30 Mins", exp: 25, icon: "💻" },
];

const HabitBattle = () => {
    // --- STATE ---
    const [habits, setHabits] = useState(
        habitsData.map((habit) => ({ ...habit, done: false }))
    );

    const [playerHP, setPlayerHP] = useState(100);
    const [monsterHP, setMonsterHP] = useState(100);
    const [log, setLog] = useState("A wild Slime appeared!");

    // Animation States: 'idle', 'attack', 'damage'
    const [playerAnim, setPlayerAnim] = useState("idle");
    const [monsterAnim, setMonsterAnim] = useState("idle");

    // --- LOGIC ---

    const handleHabitClick = (id, exp, name) => {
        // 1. Update Habit State
        setHabits((prev) =>
            prev.map((h) => (h.id === id ? { ...h, done: true } : h))
        );

        // 2. Player Attack Animation
        setLog(`Player used ${name}!`);
        setPlayerAnim("attack");

        // 3. Calculate Damage after animation hits
        setTimeout(() => {
            setPlayerAnim("idle");
            setMonsterAnim("damage"); // Monster gets hit
            setMonsterHP((prev) => Math.max(prev - exp, 0));

            // Reset Monster to idle shortly after
            setTimeout(() => setMonsterAnim("idle"), 500);
        }, 400);
    };

    const resetGame = () => {
        setPlayerHP(100);
        setMonsterHP(100);
        setHabits(habitsData.map((h) => ({ ...h, done: false })));
        setLog("New Battle Started!");
        setPlayerAnim("idle");
        setMonsterAnim("idle");
    };

    // Monster Counter-Attack Logic
    useEffect(() => {
        if (monsterHP < 100 && monsterHP > 0 && monsterAnim === "damage") {
            const timer = setTimeout(() => {
                setMonsterAnim("attack");
                setLog("Monster attacks!");

                setTimeout(() => {
                    setPlayerAnim("damage");
                    setPlayerHP((prev) => Math.max(prev - 15, 0));
                    setTimeout(() => setPlayerAnim("idle"), 500);
                    setTimeout(() => setMonsterAnim("idle"), 500);
                }, 300);
            }, 1500); // 1.5s delay before counter attack
            return () => clearTimeout(timer);
        }
    }, [monsterHP]);

    // --- CSS STYLES (EMBEDDED) ---
    const gameStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    
    .game-container {
      font-family: 'Press Start 2P', cursive;
      image-rendering: pixelated;
    }

    /* Animations */
    @keyframes idle {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
      100% { transform: translateY(0px); }
    }
    .anim-idle { animation: idle 2s infinite ease-in-out; }

    @keyframes attack-right {
      0% { transform: translateX(0); }
      50% { transform: translateX(60px) scale(1.1); }
      100% { transform: translateX(0); }
    }
    .anim-attack { animation: attack-right 0.3s ease-in-out; }

    @keyframes attack-left {
        0% { transform: translateX(0); }
        50% { transform: translateX(-60px) scale(1.1); }
        100% { transform: translateX(0); }
      }
    .anim-attack-left { animation: attack-left 0.3s ease-in-out; }

    @keyframes damage {
      0% { transform: translateX(0); filter: brightness(1); }
      20% { transform: translateX(-5px); filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(5); }
      40% { transform: translateX(5px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
      100% { transform: translateX(0); filter: brightness(1); }
    }
    .anim-damage { animation: damage 0.4s ease-in-out; }

    /* UI Elements */
    .retro-btn {
      box-shadow: 0px 4px 0px 0px #1e3a8a; /* Dark blue shadow */
      transition: all 0.1s;
    }
    .retro-btn:active {
      transform: translateY(4px);
      box-shadow: 0px 0px 0px 0px;
    }
    .retro-btn:disabled {
        opacity: 0.5;
        box-shadow: none;
        transform: translateY(4px);
        cursor: not-allowed;
    }

    .health-bar-bg {
        background: #374151;
        border: 4px solid #1f2937;
        padding: 2px;
    }
    .hp-fill {
        height: 100%;
        transition: width 0.3s ease;
    }
  `;

    return (
        <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-4 game-container">
            {/* Inject Styles */}
            <style>{gameStyles}</style>

            <div className="max-w-2xl w-full">
                <h1 className="text-3xl text-yellow-400 text-center mb-8 uppercase tracking-widest drop-shadow-md">
                    Habit Quest
                </h1>

                {/* BATTLE SCENE */}
                <div className="relative bg-gray-700 border-4 border-gray-900 rounded-lg p-6 h-80 mb-6 flex justify-between items-end overflow-hidden shadow-2xl bg-[url('https://i.pinimg.com/originals/27/a5/9b/27a59b66c429390a614083d97d9fc830.png')] bg-cover bg-bottom">
                    {/* PLAYER */}
                    <div className="flex flex-col items-center z-10 w-32">
                        {/* Player HP */}
                        <div className="w-full h-6 health-bar-bg mb-2 relative">
                            <div
                                className="hp-fill bg-green-500"
                                style={{ width: `${playerHP}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] mb-1">HERO: {playerHP}</p>

                        {/* Player Sprite */}
                        <img
                            src="https://art.pixilart.com/017364585157159.png"
                            alt="Hero"
                            className={`w-24 h-24 object-contain transition-transform duration-75
                 ${playerAnim === "idle" ? "anim-idle" : ""}
                 ${playerAnim === "attack" ? "anim-attack" : ""}
                 ${playerAnim === "damage" ? "anim-damage" : ""}
               `}
                        />
                    </div>

                    {/* LOG MESSAGE */}
                    <div className="absolute top-4 left-0 w-full text-center">
                        <span className="bg-black/70 px-4 py-2 rounded border border-white text-xs md:text-sm">
                            {log}
                        </span>
                    </div>

                    {/* MONSTER */}
                    <div className="flex flex-col items-center z-10 w-32">
                        {/* Monster HP */}
                        <div className="w-full h-6 health-bar-bg mb-2 relative">
                            <div
                                className="hp-fill bg-red-500"
                                style={{ width: `${monsterHP}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] mb-1">SLIME: {monsterHP}</p>

                        {/* Monster Sprite */}
                        <img
                            src="https://art.pixilart.com/sr2c027471901aa.png"
                            alt="Monster"
                            className={`w-28 h-28 object-contain transition-transform duration-75
                 ${monsterAnim === "idle" ? "anim-idle" : ""}
                 ${monsterAnim === "attack" ? "anim-attack-left" : ""}
                 ${monsterAnim === "damage" ? "anim-damage" : ""}
               `}
                        />
                    </div>
                </div>

                {/* ACTION MENU */}
                <div className="bg-blue-900 border-4 border-blue-950 p-4 rounded-lg shadow-xl">
                    <div className="flex justify-between items-center mb-4 border-b-2 border-blue-800 pb-2">
                        <h3 className="text-sm text-blue-200">COMMAND MENU</h3>
                        <div className="text-xs text-blue-300">
                            TURN-BASED HABITS
                        </div>
                    </div>

                    {monsterHP === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-yellow-300 text-xl mb-4 animate-bounce">
                                VICTORY!
                            </p>
                            <button
                                onClick={resetGame}
                                className="px-6 py-3 bg-green-600 text-white border-b-4 border-green-800 rounded hover:bg-green-500 active:border-b-0 active:mt-1 retro-btn"
                            >
                                PLAY AGAIN
                            </button>
                        </div>
                    ) : playerHP === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-red-400 text-xl mb-4">
                                DEFEATED...
                            </p>
                            <button
                                onClick={resetGame}
                                className="px-6 py-3 bg-gray-600 text-white border-b-4 border-gray-800 rounded hover:bg-gray-500 active:border-b-0 active:mt-1 retro-btn"
                            >
                                TRY AGAIN
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {habits.map((habit) => (
                                <button
                                    key={habit.id}
                                    onClick={() =>
                                        handleHabitClick(
                                            habit.id,
                                            habit.exp,
                                            habit.name
                                        )
                                    }
                                    disabled={habit.done}
                                    className={`
                     w-full px-4 py-3 rounded text-left flex justify-between items-center retro-btn
                     ${
                         habit.done
                             ? "bg-gray-600 border-gray-800 text-gray-400 border-b-4"
                             : "bg-blue-500 border-blue-700 text-white border-b-4 hover:bg-blue-400"
                     }
                   `}
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{habit.icon}</span>
                                        {habit.name}
                                    </span>
                                    <span className="text-[10px] bg-black/30 px-2 py-1 rounded">
                                        {habit.done
                                            ? "DONE"
                                            : `${habit.exp} DMG`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HabitBattle;
