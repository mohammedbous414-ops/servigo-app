import React, { useState, useEffect, useRef } from 'react';
import { Play, User, RefreshCw, Shield } from 'lucide-react';

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

    // Player State (Walking or Driving)
    let player = {
      x: 50,
      y: 350,
      speed: 3,
      inCar: false,
      carIndex: -1
    };

    // City Cars (GTA Style)
    let cars = [
      { x: 120, y: 340, w: 35, h: 20, color: '#2563eb', label: '🏎️' },
      { x: 220, y: 180, w: 35, h: 20, color: '#16a34a', label: '🚗' },
    ];

    // Police Patrol Vehicles
    let police = [
      { x: 200, y: 50, vx: 2, vy: 0, w: 35, h: 20, color: '#dc2626' },
      { x: 50, y: 150, vx: 0, vy: 2, w: 35, h: 20, color: '#dc2626' },
    ];

    // City Buildings & Houses
    let buildings = [
      { x: 10, y: 10, w: 160, h: 140, color: '#1e293b', label: 'Banque 🏦' },
      { x: 230, y: 10, w: 160, h: 140, color: '#334155', label: 'Maison 🏠' },
      { x: 10, y: 220, w: 160, h: 100, color: '#0f172a', label: 'Safehouse 🚪' },
    ];

    // Joystick Input
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
      const currentSpeed = player.inCar ? player.speed * 1.8 : player.speed;

      joystick.moveX = Math.cos(angle) * currentSpeed * speedMult;
      joystick.moveY = Math.sin(angle) * currentSpeed * speedMult;
    };

    const handleTouchEnd = () => {
      joystick.active = false;
      joystick.moveX = 0;
      joystick.moveY = 0;
    };

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Asphalt Streets (Roads)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road Lines
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(195, 0);
      ctx.lineTo(195, 400);
      ctx.moveTo(0, 195);
      ctx.lineTo(400, 195);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Draw City Buildings
      buildings.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px sans-serif';
        ctx.fillText(b.label, b.x + 10, b.y + 25);
      });

      // 3. Draw Parked Cars
      cars.forEach((c, idx) => {
        if (!player.inCar || player.carIndex !== idx) {
          ctx.fillStyle = c.color;
          ctx.fillRect(c.x, c.y, c.w, c.h);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(c.label, c.x + 8, c.y + 14);

          // Enter Car Action
          const dist = Math.hypot(player.x - (c.x + 15), player.y - (c.y + 10));
          if (dist < 25 && !player.inCar) {
            ctx.fillStyle = '#10b981';
            ctx.fillText('Monter 🚗', c.x - 5, c.y - 5);
          }
        }
      });

      // 4. Update & Draw Police Cars
      police.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 10 || p.x >= 355) p.vx *= -1;
        if (p.y <= 10 || p.y >= 370) p.vy *= -1;

        // Police Siren Light Effect
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.beginPath();
        ctx.arc(p.x + 17, p.y + 10, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.fillText('🚔 POLICE', p.x + 2, p.y + 14);

        // Catch Player Collision
        const distToPlayer = Math.hypot(player.x - (p.x + 17), player.y - (p.y + 10));
        if (distToPlayer < 35 && !player.inCar) {
          setGameOver(true);
        }
      });

      // 5. Update & Draw Player
      player.x += joystick.moveX;
      player.y += joystick.moveY;
      player.x = Math.max(15, Math.min(385, player.x));
      player.y = Math.max(15, Math.min(385, player.y));

      // Check if Player gets into a car
      cars.forEach((c, idx) => {
        const dist = Math.hypot(player.x - (c.x + 15), player.y - (c.y + 10));
        if (dist < 15 && !player.inCar) {
          player.inCar = true;
          player.carIndex = idx;
        }
      });

      if (player.inCar) {
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(player.x - 17, player.y - 10, 35, 20);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('🏎️ VIP', player.x - 12, player.y + 4);
      } else {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(player.x, player.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText('🥷', player.x - 6, player.y + 4);
      }

      // Safehouse Win Condition
      if (player.x < 150 && player.y > 220 && player.y < 320) {
        setGameWon(true);
      }

      // Draw Joystick Overlay
      if (joystick.active) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(joystick.startX, joystick.startY, 40, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(
          joystick.startX + joystick.moveX * 6,
          joystick.startY + joystick.moveY * 6,
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
      {screen === 'welcome' && (
        <div className="bg-slate-900 border border-blue-900/60 p-6 rounded-3xl max-w-xs w-full text-center shadow-2xl relative overflow-hidden">
          <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center bg-blue-600/10 border-2 border-blue-500 rounded-3xl transform -rotate-3">
            <Shield size={48} className="text-blue-500" />
          </div>

          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 tracking-wider mb-1 uppercase">
            SHADOW CITY GTA
          </h1>
          <p className="text-blue-300/70 text-[11px] font-semibold tracking-widest mb-6 uppercase">
            Open World City & Chase
          </p>

          <div className="mb-5 text-left">
            <label className="text-xs text-slate-300 font-bold mb-1 block">Nom du Joueur:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Rayan"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-950 border border-blue-800/80 rounded-xl py-2.5 px-3 pl-9 text-sm text-blue-300 focus:outline-none focus:border-blue-500"
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
            className="w-full py-3.5 rounded-xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 text-white shadow-xl"
          >
            ENTRER DANS LA VILLE <Play size={18} className="inline ml-1" />
          </button>
        </div>
      )}

      {screen === 'game' && (
        <div className="flex flex-col items-center w-full max-w-xs">
          <div className="flex justify-between items-center w-full mb-2 bg-slate-900 p-2.5 rounded-xl border border-blue-900/40">
            <span className="text-xs text-blue-400 font-bold">🥷 {playerName}</span>
            <span className="text-[10px] text-slate-400">Glisser pour conduire/marcher</span>
            <button
              onClick={() => setScreen('welcome')}
              className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300"
            >
              Quitter
            </button>
          </div>

          <div className="relative border-2 border-blue-600/40 rounded-2xl overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width={400} height={400} className="block touch-none" />
          </div>

          {(gameOver || gameWon) && (
            <div className="mt-3 bg-slate-900 border border-slate-800 p-4 rounded-xl text-center w-full">
              <h2 className={`text-base font-bold mb-1 ${gameWon ? 'text-emerald-400' : 'text-rose-500'}`}>
                {gameWon ? '🎉 ARHIVÉ AU SAFEHOUSE!' : '🚨 ARRETÉ PAR LA POLICE!'}
              </h2>
              <button
                onClick={() => {
                  setGameOver(false);
                  setGameWon(false);
                }}
                className="mt-2 w-full py-2 bg-blue-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"
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
          
