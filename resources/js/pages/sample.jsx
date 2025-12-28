import React, { useState, useEffect, useRef } from "react";

// --- IMPORTS: YOUR LOCAL ASSETS ---
import soldierIdle from "../assets/Soldier-Idle.png";
import soldierAttack from "../assets/Soldier-Attack01.png";
import soldierHurt from "../assets/Soldier-Hurt.png";
import soldierDeath from "../assets/Soldier-Death.png";
import soldierWalk from "../assets/Soldier-Walk.png";

// Monster Placeholder (Replace with local if you have one)
const monsterUrl = "https://art.pixilart.com/sr2c027471901aa.png"; 

// --- GAME DATA ---
const habitsData = [
    { id: 1, name: "Push Ups", exp: 20, icon: "⚔️" },
    { id: 2, name: "Read 5 Pages", exp: 15, icon: "📖" },
    { id: 3, name: "Drink Water", exp: 10, icon: "💧" },
    { id: 4, name: "Code 30 Mins", exp: 25, icon: "💻" },
];

// --- SPRITE COMPONENT ---
const StripSprite = ({ action, images, size = 100, scale = 2.5, facingLeft = false }) => {
    const [frame, setFrame] = useState(0);

    // CONFIGURATION: Count the "bodies" in your PNGs and update maxFrames!
    const config = {
        idle:   { img: images.idle,   maxFrames: 6, speed: 150 }, 
        walk:   { img: images.walk,   maxFrames: 8, speed: 100 }, // Standard is often 8 frames
        attack: { img: images.attack, maxFrames: 6, speed: 80 }, 
        hurt:   { img: images.hurt,   maxFrames: 4, speed: 120 },
        death:  { img: images.death,  maxFrames: 4, speed: 200 },
    };

    const currentAnim = config[action] || config.idle;

    useEffect(() => {
        setFrame(0);
        const timer = setInterval(() => {
            setFrame((prev) => {
                const next = prev + 1;
                // Stop animation at the end for death, loop for others
                if (action === 'death' && next >= currentAnim.maxFrames) return prev;
                return next >= currentAnim.maxFrames ? 0 : next;
            });
        }, currentAnim.speed);
        return () => clearInterval(timer);
    }, [action, currentAnim.img]);

    const xPos = -(frame * size);

    return (
        <div
            style={{
                width: size,
                height: size,
                backgroundImage: `url(${currentAnim.img})`,
                backgroundPosition: `${xPos}px 0px`,
                backgroundRepeat: "no-repeat",
                // Handles Scale AND Left/Right flipping
                transform: `scale(${scale}) scaleX(${facingLeft ? -1 : 1})`, 
                transformOrigin: "bottom center",
                imageRendering: "pixelated",
            }}
        />
    );
};

// --- MAIN COMPONENT ---
const HabitBattle = () => {
    // Game State
    const [habits, setHabits] = useState(habitsData.map(h => ({ ...h, done: false })));
    const [playerHP, setPlayerHP] = useState(100);
    const [monsterHP, setMonsterHP] = useState(100);
    const [log, setLog] = useState("Use Arrow Keys to Move!");
    
    // Movement & Animation State
    const [playerAction, setPlayerAction] = useState("idle");
    const [monsterAction, setMonsterAction] = useState("idle");
    const [pos, setPos] = useState({ x: 100, y: 200 }); // Starting Position
    const [facingLeft, setFacingLeft] = useState(false);
    
    // Input Ref
    const keys = useRef({});

    // Asset Map
    const playerImages = {
        idle: soldierIdle,
        walk: soldierWalk,    // <--- Added Walk Image
        attack: soldierAttack,
        hurt: soldierHurt,
        death: soldierDeath,
    };

    // --- MOVEMENT LOOP ---
    useEffect(() => {
        const handleKeyDown = (e) => { keys.current[e.key] = true; };
        const handleKeyUp = (e) => { keys.current[e.key] = false; };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        const loop = setInterval(() => {
            // Lock movement if attacking, hurt, or dead
            if (['attack', 'hurt', 'death'].includes(playerAction)) return;

            let moving = false;
            setPos((prev) => {
                let newX = prev.x;
                let newY = prev.y;
                const speed = 4;

                if (keys.current["ArrowUp"] || keys.current["w"]) { newY -= speed; moving = true; }
                if (keys.current["ArrowDown"] || keys.current["s"]) { newY += speed; moving = true; }
                if (keys.current["ArrowLeft"] || keys.current["a"]) { 
                    newX -= speed; moving = true; setFacingLeft(true); 
                }
                if (keys.current["ArrowRight"] || keys.current["d"]) { 
                    newX += speed; moving = true; setFacingLeft(false); 
                }

                // Boundaries (Adjust these to fit your big character in the box)
                // Since the character is BIG, we need more padding on the edges
                newY = Math.max(100, Math.min(newY, 280)); 
                newX = Math.max(50, Math.min(newX, 550)); 

                return { x: newX, y: newY };
            });

            // Trigger Walk Animation
            if (moving) {
                setPlayerAction("walk");
            } else {
                setPlayerAction((prev) => (prev === "walk" ? "idle" : prev));
            }

        }, 16); // ~60 FPS

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            clearInterval(loop);
        };
    }, [playerAction]);

    // --- BATTLE LOGIC ---
    const handleHabitClick = (id, exp, name) => {
        if (playerAction !== 'idle' && playerAction !== 'walk') return;

        setHabits(prev => prev.map(h => (h.id === id ? { ...h, done: true } : h)));
        setLog(`Player used ${name}!`);
        setPlayerAction("attack");

        setTimeout(() => {
            setPlayerAction("idle");
            setMonsterAction("hurt");
            setMonsterHP(prev => Math.max(prev - exp, 0));

            setTimeout(() => {
                if (monsterHP - exp > 0) setMonsterAction("idle");
                else { setMonsterAction("death"); setLog("Victory!"); }
            }, 500);
        }, 600);
    };

    const resetGame = () => {
        setPlayerHP(100);
        setMonsterHP(100);
        setHabits(habitsData.map(h => ({ ...h, done: false })));
        setLog("New Battle Started!");
        setPlayerAction("idle");
        setMonsterAction("idle");
    };

    // Monster AI
    useEffect(() => {
        if (monsterHP < 100 && monsterHP > 0 && monsterAction === "hurt") {
            const timer = setTimeout(() => {
                setMonsterAction("attack");
                setLog("Monster attacks!");
                
                setTimeout(() => {
                    setPlayerAction("hurt");
                    setPlayerHP(prev => Math.max(prev - 15, 0));
                    setTimeout(() => {
                        setPlayerAction("idle");
                        setMonsterAction("idle");
                    }, 500);
                }, 400);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [monsterHP, monsterAction]);

    // --- CSS STYLES ---
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .crt::before {
            content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                        linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 50; background-size: 100% 2px, 3px 100%; pointer-events: none;
        }
        .pixel-font { font-family: 'Press Start 2P', cursive; }
        .btn-retro {
            background-color: #2563EB; border-bottom: 4px solid #1E40AF; position: relative;
        }
        .btn-retro:active { border-bottom: 0px; top: 4px; }
        .btn-retro:disabled { background-color: #4B5563; border-bottom: 4px solid #1F2937; top: 4px; }
    `;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 pixel-font select-none">
            <style>{styles}</style>

            <div className="max-w-3xl w-full">
                <h1 className="text-3xl text-center mb-6 text-yellow-400 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                    HABIT QUEST
                </h1>

                <div className="relative bg-gray-800 border-8 border-gray-600 rounded-lg p-2 shadow-2xl">
                    <div className="relative bg-gray-700 h-80 w-full overflow-hidden border-4 border-black crt bg-[url('https://i.pinimg.com/originals/27/a5/9b/27a59b66c429390a614083d97d9fc830.png')] bg-cover bg-bottom">
                        
                        {/* HEALTH BARS */}
                        <div className="absolute top-2 left-2 right-2 flex justify-between z-20 px-4">
                             <div className="flex flex-col w-32">
                                <span className="text-[10px] text-yellow-300 mb-1">PLAYER LVL.1</span>
                                <div className="h-4 bg-gray-900 border-2 border-white">
                                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${playerHP}%` }}></div>
                                </div>
                             </div>
                             <div className="flex flex-col w-32 items-end">
                                <span className="text-[10px] text-red-300 mb-1">SLIME BOSS</span>
                                <div className="h-4 bg-gray-900 border-2 border-white w-full">
                                    <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${monsterHP}%` }}></div>
                                </div>
                             </div>
                        </div>

                        {/* --- PLAYER CHARACTER --- */}
                        <div 
                            className="absolute z-10 transition-transform duration-75"
                            style={{ 
                                left: pos.x, 
                                top: pos.y,
                                transform: 'translate(-50%, -100%)' 
                            }} 
                        >
                            {/* 1. WRAPPER to push feet down */}
                            <div style={{ transform: 'translateY(30px)' }}> 
                                <StripSprite 
                                    action={playerAction} 
                                    images={playerImages} 
                                    size={100} 
                                    scale={5} // <--- BIG SCALE
                                    facingLeft={facingLeft}
                                />
                            </div>

                            {/* 2. SHADOW (Scaled & Centered) */}
                            <div 
                                className="absolute bg-black/40 rounded-[50%] blur-[4px]"
                                style={{
                                    width: '40px',
                                    height: '8px',
                                    bottom: '0px',
                                    left: '50%',
                                    transform: `translateX(-50%) scale(5)`, // Scale matches Hero
                                    zIndex: -1
                                }}
                            ></div>
                        </div>

                        {/* MONSTER */}
                        <div className="absolute right-10 bottom-16 z-10 flex flex-col items-center">
                            <img 
                                src={monsterUrl} 
                                alt="Monster"
                                className={`w-32 h-32 object-contain pixelated transition-opacity duration-100 ${monsterAction === 'hurt' ? 'opacity-50' : 'opacity-100'}`}
                            />
                             <div className="w-20 h-4 bg-black/40 rounded-[50%] mt-[-10px] blur-[4px]"></div>
                        </div>
                        
                        <div className="absolute bottom-4 left-0 w-full text-center z-30">
                            <span className="bg-black/70 text-white px-3 py-1 rounded border border-white/30 text-xs">
                                {log}
                            </span>
                        </div>

                    </div>
                </div>

                {/* CONTROLS */}
                <div className="mt-6 bg-gray-800 p-4 rounded border-4 border-gray-700">
                    <h3 className="text-sm text-blue-300 mb-3 border-b border-gray-600 pb-1">BATTLE COMMANDS</h3>
                    {monsterHP === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-green-400 mb-2">QUEST COMPLETE!</p>
                            <button onClick={resetGame} className="px-4 py-2 bg-green-600 text-white rounded btn-retro w-full">NEW QUEST</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {habits.map((habit) => (
                                <button
                                    key={habit.id}
                                    onClick={() => handleHabitClick(habit.id, habit.exp, habit.name)}
                                    disabled={habit.done || playerHP === 0}
                                    className="px-3 py-3 text-left flex justify-between items-center rounded text-xs md:text-sm btn-retro text-white transition-all"
                                >
                                    <span className="flex items-center gap-2"><span>{habit.icon}</span> {habit.name}</span>
                                    <span className="bg-black/30 px-1 rounded text-[10px]">{habit.done ? "DONE" : `${habit.exp} DMG`}</span>
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