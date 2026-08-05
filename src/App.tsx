import React, { useState, useEffect, useRef } from 'react';
import { Shield, Play, User, RefreshCw, Eye, Lock } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'game'>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Canvas Game Engine References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (screen !== 'game' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game Variables
    let animationFrameId: number;
    let player = { x: 50, y: 350, radius: 12, speed: 3, isHiding: false };
    let target = { x: 330, y: 50, radius: 10 };
    let joystick = { active: false, startX: 0, startY: 0, moveX: 0, moveY: 0 };

    // 3 Guards moving around rooms
    let guards = [
      { x: 150, y: 100, vx: 2, vy: 0, radius: 12, visionRadius: 60 },
      { x: 250, y: 250, vx: 0, vy: 2, radius: 12, visionRadius: 60 },
      { x: 100, y: 200, vx: 1.5, vy: -1.5, radius: 12, visionRadius: 60 },
    ];

    // Furniture / Hiding Furniture (Tables, Sofas, Beds)
    let furniture = [
      { x: 120, y: 140, w: 50, h: 30, label: '🛏️' },
      { x: 220, y: 80, w: 40, h: 40, label: '🛋️' },
      { x: 80, y: 260, w: 60, h: 35, label: '📦' },
      { x: 240, y: 300, w: 45, h: 45, label: '🗄️' },
    ];

    // House Walls (Layout)
    let walls = [
      { x: 0, y: 0, w: 400, h: 10 }, // Top Wall
      { x: 0, y: 390, w: 400, h: 10 }, // Bottom Wall
      { x: 0, y: 0, w: 10, h: 400 }, // Left Wall
      { x: 390, y: 0, w: 10, h: 400 }, // Right Wall
      { x: 180, y: 0, w: 10, h: 280 }, // Internal Wall 1
      { x: 0, y: 220, w: 120, h: 10 }, // Internal Wall 2
    ];

    // Touch & Control Handlers
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      joystick.active = true;
      joystick.startX = touch.clientX - rect.left;
      joystick.startY = touch.clientY - rect.top;
      joystick.moveX = 0;
      joystick.moveY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!joystick.active) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const dx = touch.clientX - rect.left - joystick.startX;
      const dy = touch.clientY - rect.top - joystick.startY;
      const dist = Math.hypot(dx, dy);
      const maxDist = 40;
      
      const angle = Math.atan2(dy, dx);
      const speedMult = Math.min(dist, maxDist) / maxDist;
      
      joystick.moveX = Math.cos(angle) * player.speed * speedMult;
      joystick.moveY = Math.sin(angle) * player.speed * speedMult;
    };

    const handleTouchEnd = () => {
      joystick.active = false;
      joystick.moveX = 0;
      joystick.moveY = 0;
    };

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // Main Game Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw House Floor & Rooms
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Entry Door (Doorway)
      ctx.fillStyle = '#10b981';
      ctx.fillRect(40, 390, 40, 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText('ENTRY 🚪', 35, 385);

      // 2. Draw Furniture & Check Hiding
      player.isHiding = false;
      furniture.forEach((item) => {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.fillRect(item.x, item.y, item.w, item.h);
        ctx.strokeRect(item.x, item.y, item.w, item.h);
        ctx.fillText(item.label, item.x + item.w / 4, item.y + item.h / 1.5);

        // Check if player inside furniture
        if (
          player.x > item.x &&
          player.x < item.x + item.w &&
          player.y > item.y &&
          player.y < item.y + item.h
        ) {
          player.isHiding = true;
        }
      });

      // 3. Draw Walls
      ctx.fillStyle = '#334155';
      walls.forEach((w) => ctx.fillRect(w.x, w.y, w.w, w.h));

      // 4. Update & Draw Target (Treasure)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('💎', target.x - 6, target.y + 4);

      // 5. Update & Draw Guards with Vision Cones
      guards.forEach((g) => {
        g.x += g.vx;
        g.y += g.vy;

        // Bounce guards on walls
        if (g.x <= 20 || g.x >= 370) g.vx *= -1;
        if (g.y <= 20 || g.y >= 370) g.vy *= -1;

        // Draw Police Cone of Light
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.visionRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw Guard 👮
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillText('👮', g.x - 6, g.y + 4);

        // Check Detection (If player not hiding)
        if (!player.isHiding) {
          const distToGuard = Math.hypot(player.x - g.x, player.y - g.y);
          if (distToGuard < g.visionRadius) {
            setGameOver(true);
          }
        }
      });

      // 6. Move Player via Joystick
      player.x += joystick.moveX;
      player.y += joystick.moveY;

      // Keep Player Inside Canvas
      player.x = Math.max(15, Math.min(385, player.x));
      player.y = Math.max(15, Math.min(385, player.y));

      // Draw Player 🥷
      ctx.fillStyle = player.isHiding ? '#10b981' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(player.isHiding ? '📦' : '🥷', player.x - 6, player.y + 4);

      // Check Win Condition
      const distToTarget = Math.hypot(player.x - target.x, player.y - target.y);
      if (distToTarget < 20) {
        setGameWon(true);
      }

      // Draw Joystick Overlay
      if (joystick.active) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(joystick.startX, joystick.startY, 40, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(
          joystick.startX + joystick.moveX * 8,
          joystick.startY + joystick.moveY * 8,
          15,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      if (!gameOver && !gameWon) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [screen, gameOver, gameWon]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 select-none">
      
      {/* 1. WELCOME SCREEN WITH NEW ROYAL BLUE LOGO */}
      {screen === 'welcome' && (
        <div className="bg-slate-900 border border-blue-900/50 p-6 rounded-3xl max-w-xs w-full text-center shadow-2xl">
          
          {/* LOGO BLUE EDITION */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-blue-600/10 border-2 border-blue-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform -rotate-3">
              <Shield size={50} className="text-blue-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-slate-950 p-1.5 rounded-full border border-blue-400">
              <Eye size={20} className="text-blue-400" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-blue-500 tracking-wider mb-1 uppercase">
            SHADOW ESCAPE
          </h1>
          <p className="text-slate-400 text-xs mb-6">Infiltration & Tactical Stealth</p>
          
          <div className="mb-5 text-left">
            <label className="text-xs text-slate-300 font-bold mb-1 block">Nom de l'Agent:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Agent Shadow"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-950 border border-blue-800/60 rounded-xl py-2.5 px-3 pl-9 text-sm text-blue-300 focus:outline-none focus:border-blue-500"
              />
              <User size={16} className="absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <button
            onClick={() => {
              if (playerName.trim()) {
                setGameOver(false);
                setGameWon(false);
                setScreen('game');
              }
            }}
            disabled={!playerName.trim()}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition ${
              playerName.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-blue-600/30'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            JOUER <Play size={16} />
          </button>
        </div>
      )}

      {/* 2. REALISTIC TOP-DOWN GAME SCREEN */}
      {screen === 'game' && (
        <div className="flex flex-col items-center w-full max-w-xs">
          
          <div className="flex justify-between items-center w-full mb-2 bg-slate-900 p-2.5 rounded-xl border border-blue-900/40">
            <span className="text-xs text-blue-400 font-bold">🥷 {playerName}</span>
            <span className="text-[10px] text-slate-400">Toucher l'écran pour diriger</span>
            <button
              onClick={() => setScreen('welcome')}
              className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300"
            >
              Quitter
            </button>
          </div>

          {/* GAME CANVAS (400x400) */}
          <div className="relative border-2 border-blue-600/40 rounded-2xl overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={400} height={400} className="block touch-none" />
          </div>

          {/* GAME OVER / WIN MODAL */}
          {(gameOver || gameWon) && (
            <div className="mt-3 bg-slate-900 border border-slate-800 p-4 rounded-xl text-center w-full">
              <h2 className={`text-base font-bold mb-1 ${gameWon ? 'text-emerald-400' : 'text-rose-500'}`}>
                {gameWon ? '🎉 MISSION REUSSIE! TRESOR VOLE!' : '🚨 LA POLICE T\'A ATTRAPÉ!'}
              </h2>
              <button
                onClick={() => {
                  setGameOver(false);
                  setGameWon(false);
                }}
                className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"
              >
                <RefreshCw size={14} /> Recommencer
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
                                       }

