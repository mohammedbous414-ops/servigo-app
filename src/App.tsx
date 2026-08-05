import React, { useState, useEffect, useRef } from 'react';
import { Play, User, RefreshCw, Lock } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'game'>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (screen !== 'game' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    let player = { x: 50, y: 350, r: 14, speed: 3, isHiding: false };

    let humans = [
      { x: 120, y: 100, vx: 1.5, vy: 0, color: '#ef4444', skin: '#fca5a5', role: 'Garde 👮' },
      { x: 280, y: 200, vx: 0, vy: 1.8, color: '#a855f7', skin: '#fde047', role: 'Habitant 👤' },
      { x: 100, y: 220, vx: 1.2, vy: -1.2, color: '#ef4444', skin: '#fca5a5', role: 'Garde 👮' },
    ];

    let furniture = [
      { x: 80, y: 60, w: 70, h: 45, color: '#854d0e', name: 'Lit 🛏️' },
      { x: 240, y: 60, w: 60, h: 40, color: '#1e3a8a', name: 'Canapé 🛋️' },
      { x: 50, y: 220, w: 55, h: 45, color: '#065f46', name: 'Armoire 🗄️' },
      { x: 250, y: 270, w: 65, h: 45, color: '#78350f', name: 'Table 🪵' },
    ];

    let rooms = [
      { x: 10, y: 10, w: 185, h: 185, bg: '#1e1b4b', border: '#4338ca', name: 'Chambre 🛏️' },
      { x: 205, y: 10, w: 185, h: 185, bg: '#064e3b', border: '#059669', name: 'Salon 🛋️' },
      { x: 10, y: 205, w: 185, h: 185, bg: '#451a03', border: '#d97706', name: 'Bureau 💼' },
      { x: 205, y: 205, w: 185, h: 185, bg: '#312e81', border: '#6366f1', name: 'Cuisine 🍳' },
    ];

    let joystick = { active: false, startX: 0, startY: 0, moveX: 0, moveY: 0 };

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

    const drawPerson = (x: number, y: number, bodyColor: string, skinColor: string, label: string) => {
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(x, y - 3, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText(label, x - 12, y - 15);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rooms.forEach((r) => {
        ctx.fillStyle = r.bg;
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = r.border;
        ctx.lineWidth = 3;
        ctx.strokeRect(r.x, r.y, r.w, r.h);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(r.name, r.x + 10, r.y + 22);
      });

      ctx.fillStyle = '#10b981';
      ctx.fillRect(35, 385, 50, 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('PORTE 🚪', 35, 380);

      player.isHiding = false;
      furniture.forEach((f) => {
        ctx.fillStyle = f.color;
        ctx.fillRect(f.x, f.y, f.w, f.h);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(f.x, f.y, f.w, f.h);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.fillText(f.name, f.x + 6, f.y + f.h / 1.5);

        if (
          player.x > f.x &&
          player.x < f.x + f.w &&
          player.y > f.y &&
          player.y < f.y + f.h
        ) {
          player.isHiding = true;
        }
      });

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(330, 50, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('💎 TRESO', 305, 75);

      humans.forEach((h) => {
        h.x += h.vx;
        h.y += h.vy;

        if (h.x <= 25 || h.x >= 375) h.vx *= -1;
        if (h.y <= 25 || h.y >= 375) h.vy *= -1;

        ctx.fillStyle = h.color === '#ef4444' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(168, 85, 247, 0.2)';
        ctx.beginPath();
        ctx.arc(h.x, h.y, 60, 0, Math.PI * 2);
        ctx.fill();

        drawPerson(h.x, h.y, h.color, h.skin, h.role);

        if (!player.isHiding) {
          const dist = Math.hypot(player.x - h.x, player.y - h.y);
          if (dist < 60) {
            setGameOver(true);
          }
        }
      });

      player.x += joystick.moveX;
      player.y += joystick.moveY;
      player.x = Math.max(20, Math.min(380, player.x));
      player.y = Math.max(20, Math.min(380, player.y));

      if (!player.isHiding) {
        drawPerson(player.x, player.y, '#2563eb', '#fed7aa', '🥷 Vous');
      } else {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('📦 Caché !', player.x - 20, player.y + 4);
      }

      if (Math.hypot(player.x - 330, player.y - 50) < 20) {
        setGameWon(true);
      }

      if (joystick.active) {
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(joystick.startX, joystick.startY, 40, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(
          joystick.startX + joystick.moveX * 7,
          joystick.startY + joystick.moveY * 7,
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
      
      {/* 1. WELCOME SCREEN WITH HIGH-END CUSTOM VECTOR LOGO */}
      {screen === 'welcome' && (
        <div className="bg-slate-900 border border-blue-900/60 p-6 rounded-3xl max-w-xs w-full text-center shadow-2xl relative overflow-hidden">
          
          {/* BACKGROUND GLOW EFFECT */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* HIGH-END CUSTOM SHADOW ESCAPE EMBLEM (VECTOR LOGO) */}
          <div className="relative mx-auto w-28 h-28 mb-4 flex items-center justify-center">
            
            {/* Outer Hexagon Shield with Blue Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-blue-700 to-slate-950 rounded-3xl rotate-45 border-2 border-blue-400/80 shadow-[0_0_25px_rgba(37,99,235,0.6)]"></div>
            
            {/* Inner Dark Core */}
            <div className="absolute inset-1.5 bg-slate-950 rounded-2xl rotate-45 flex items-center justify-center border border-blue-500/40"></div>

            {/* Ninja Mask & Eyes Graphic (CSS Stylized) */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {/* Ninja Head Hood */}
              <div className="w-14 h-10 bg-gradient-to-b from-blue-600 to-slate-900 rounded-t-full relative flex items-center justify-center border-t border-blue-300">
                {/* Glowing Blue Eyes visor */}
                <div className="w-10 h-3 bg-slate-950 rounded-full border border-blue-400 flex items-center justify-around px-1 shadow-inner">
                  <div className="w-2 h-1 bg-cyan-300 rounded-full shadow-[0_0_8px_#22d3ee]"></div>
                  <div className="w-2 h-1 bg-cyan-300 rounded-full shadow-[0_0_8px_#22d3ee]"></div>
                </div>
              </div>
              {/* Mask Lower Face */}
              <div className="w-12 h-5 bg-slate-900 rounded-b-lg border-b border-blue-500/50 mt-0.5"></div>
            </div>

          </div>

          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-blue-500 tracking-wider mb-1 uppercase drop-shadow">
            SHADOW ESCAPE
          </h1>
          <p className="text-blue-300/70 text-[11px] font-semibold tracking-widest mb-6 uppercase">
            Jeu d'Infiltration Tactique
          </p>
          
          <div className="mb-5 text-left">
            <label className="text-xs text-slate-300 font-bold mb-1 block">Nom de l'Agent:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Agent Shadow"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-950 border border-blue-800/80 rounded-xl py-2.5 px-3 pl-9 text-sm text-blue-300 focus:outline-none focus:border-blue-500 shadow-inner"
              />
              <User size={16} className="absolute left-3 top-3 text-blue-500" />
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
            className={`w-full py-3.5 rounded-xl font-extrabold tracking-wide flex items-center justify-center gap-2 shadow-xl transition-all duration-200 ${
              playerName.trim()
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white active:scale-95 shadow-blue-600/40 border border-blue-400/30'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            INFILTRER LA MAISON <Play size={18} />
          </button>
        </div>
      )}

      {/* 2. GAME SCREEN */}
      {screen === 'game' && (
        <div className="flex flex-col items-center w-full max-w-xs">
          <div className="flex justify-between items-center w-full mb-2 bg-slate-900 p-2.5 rounded-xl border border-blue-900/40">
            <span className="text-xs text-blue-400 font-bold">🥷 {playerName}</span>
            <span className="text-[10px] text-slate-400">Glisser pour déplacer</span>
            <button
              onClick={() => setScreen('welcome')}
              className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 hover:bg-slate-700"
            >
              Quitter
            </button>
          </div>

          <div className="relative border-2 border-blue-600/40 rounded-2xl overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={400} height={400} className="block touch-none" />
          </div>

          {(gameOver || gameWon) && (
            <div className="mt-3 bg-slate-900 border border-slate-800 p-4 rounded-xl text-center w-full shadow-2xl">
              <h2 className={`text-base font-bold mb-1 ${gameWon ? 'text-emerald-400' : 'text-rose-500'}`}>
                {gameWon ? '🎉 MISSION REUSSIE! TRESOR VOLE!' : '🚨 ATTRAPÉ PAR LES HABITANTS / POLICE!'}
              </h2>
              <button
                onClick={() => {
                  setGameOver(false);
                  setGameWon(false);
                }}
                className="mt-2 w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-lg"
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
                
