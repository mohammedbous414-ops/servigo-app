import React, { useState, useEffect } from 'react';
import { Shield, Gem, RefreshCw, Play, Eye, User, Zap, AlertTriangle } from 'lucide-react';

type Screen = 'welcome' | 'levels' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [playerName, setPlayerName] = useState('');
  
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const gridSize = 5; // خريطة 5x5 (25 غرفة/مربع)
  const [playerPos, setPlayerPos] = useState(0); // مكان اللاعب
  const [targetPos, setTargetPos] = useState(24); // مكان الكنز

  // أماكن 4 بوليسيين والاتجاه ديال الليزر ديالهم
  const [guards, setGuards] = useState<number[]>([4, 8, 16, 20]);
  const [laserZones, setLaserZones] = useState<number[]>([]); // أضواء الليزر
  const [hidingSpots, setHidingSpots] = useState<number[]>([2, 7, 12, 17, 22]); // أماكن الأثاث والمخابئ

  const [isHiding, setIsHiding] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);

  // تشغيل الأصوات
  const playSound = (type: 'gem' | 'alarm' | 'hide' | 'move') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'gem') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'alarm') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'hide') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {}
  };

  // بداية اللعبة وتوزيع الأضواء والمخابئ
  const startGame = () => {
    setPlayerPos(0);
    setTargetPos(24);
    setGameOver(false);
    setGameWon(false);
    setIsHiding(false);
    setTimeLeft(35);
    updateGuardLasers([4, 8, 16, 20]);
    setCurrentScreen('game');
  };

  // حركات الليزر والأضواء أمام البوليس
  const updateGuardLasers = (currentGuards: number[]) => {
    let lasers: number[] = [];
    currentGuards.forEach((gPos) => {
      // ضوء الليزر كيكون فـ المربعات المجاورة للبوليسي
      if (gPos + 1 < 25 && (gPos + 1) % 5 !== 0) lasers.push(gPos + 1);
      if (gPos - 1 >= 0 && gPos % 5 !== 0) lasers.push(gPos - 1);
      if (gPos + 5 < 25) lasers.push(gPos + 5);
      if (gPos - 5 >= 0) lasers.push(gPos - 5);
    });
    setLaserZones(lasers);
  };

  // حركة البوليس الدوري فـ الدار كل ثانية
  useEffect(() => {
    if (currentScreen !== 'game' || gameOver || gameWon) return;

    const interval = setInterval(() => {
      setGuards((prevGuards) => {
        const newGuards = prevGuards.map((g) => {
          const move = Math.random() > 0.5 ? 1 : -1;
          const nextPos = g + move;
          return nextPos >= 0 && nextPos < 25 ? nextPos : g;
        });
        updateGuardLasers(newGuards);

        // التحقق واش البوليسي أو الليزر كشف اللاعب (إلا ما كانش متخبي)
        if (!isHiding) {
          if (newGuards.includes(playerPos) || laserZones.includes(playerPos)) {
            setGameOver(true);
            playSound('alarm');
          }
        }
        return newGuards;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [playerPos, isHiding, laserZones, currentScreen, gameOver, gameWon]);

  // المؤقت
  useEffect(() => {
    if (currentScreen !== 'game' || gameOver || gameWon || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          playSound('alarm');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, gameWon, currentScreen]);

  // حركة اللاعب والتخبي
  const handleCellClick = (index: number) => {
    if (gameOver || gameWon) return;

    setPlayerPos(index);

    // إذا تبتي فوق أثاث/مخبأ 🛋️
    if (hidingSpots.includes(index)) {
      setIsHiding(true);
      playSound('hide');
    } else {
      setIsHiding(false);
      playSound('move');

      // إذا قستي البوليسي 👮 أو ضوء الليزر 🔴
      if (guards.includes(index) || laserZones.includes(index)) {
        setGameOver(true);
        playSound('alarm');
        return;
      }
    }

    // إذا وصلتي للكنز 💎
    if (index === targetPos) {
      playSound('gem');
      setGameWon(true);
      const newScore = score + 20;
      setScore(newScore);
      if (newScore > highScore) setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      
      {/* 1. الصفحة الرئيسية */}
      {currentScreen === 'welcome' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-xs w-full text-center shadow-2xl animate-fade-in">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-rose-500/10 border-2 border-rose-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Shield size={42} className="text-rose-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-slate-950 p-1 rounded-full border border-slate-700">
              <Zap size={18} className="text-amber-400" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-rose-500 tracking-wider mb-1 uppercase">
            SHADOW ESCAPE
          </h1>
          <p className="text-slate-400 text-xs mb-6">Évite la Police & les Lasers!</p>
          
          <div className="mb-5 text-left">
            <label className="text-xs text-slate-300 font-bold mb-1 block">Nom du Joueur:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Agent 007"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 pl-9 text-sm text-amber-300 focus:outline-none focus:border-amber-500"
              />
              <User size={16} className="absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <button
            onClick={() => {
              if (playerName.trim()) startGame();
            }}
            disabled={!playerName.trim()}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition ${
              playerName.trim()
                ? 'bg-rose-600 hover:bg-rose-700 text-white active:scale-95'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            INFILTRER LA MAISON <Play size={16} />
          </button>
        </div>
      )}

      {/* 2. واجهة اللعب والخريطة */}
      {currentScreen === 'game' && (
        <div className="flex flex-col items-center w-full max-w-xs animate-fade-in">
          
          <div className="flex justify-between items-center w-full mb-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-bold">🥷 {playerName}</span>
              {isHiding && <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">Caché 📦</span>}
            </div>
            <div className="text-rose-400 font-bold text-sm">
              ⏱️ {timeLeft}s
            </div>
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300"
            >
              Quitter 🚪
            </button>
          </div>

          {/* Dictionnaire de la carte */}
          <div className="flex justify-around w-full text-[9px] text-slate-400 mb-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span>🥷 Joueur</span>
            <span>👮 Police</span>
            <span className="text-rose-400">🔴 Laser</span>
            <span className="text-amber-400">🛋️ Meuble</span>
            <span>💎 Trésor</span>
          </div>

          {/* الخريطة 5x5 */}
          <div 
            className="grid gap-1.5 bg-slate-950 p-3 rounded-2xl border-2 border-slate-800 w-full aspect-square shadow-2xl relative"
            style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
              const isPlayer = i === playerPos;
              const isTarget = i === targetPos;
              const isGuard = guards.includes(i);
              const isLaser = laserZones.includes(i);
              const isHide = hidingSpots.includes(i);

              return (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  disabled={gameOver || gameWon}
                  className={`relative rounded-xl flex items-center justify-center text-lg shadow-inner transition duration-150 border ${
                    isLaser && !isHide
                      ? 'bg-rose-950/70 border-rose-600 animate-pulse' // ضوء الليزر الأحمر
                      : isHide
                      ? 'bg-amber-950/40 border-amber-700/60' // مكان أثاث/مخبأ
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {/* اللاعب 🥷 */}
                  {isPlayer && <span className="z-10 animate-bounce">🥷</span>}

                  {/* الأثاث/المخبأ 🛋️ */}
                  {isHide && !isPlayer && <span>🛋️</span>}

                  {/* البوليسي 👮 */}
                  {isGuard && <span className="z-10">👮</span>}

                  {/* ضوء الليزر 🔴 */}
                  {isLaser && !isGuard && !isPlayer && !isHide && <span className="text-xs">🔴</span>}

                  {/* الكنز المستهدف 💎 */}
                  {isTarget && !isPlayer && <span>💎</span>}
                </button>
              );
            })}
          </div>

          {/* Game Over / Win Modal */}
          {(gameOver || gameWon) && (
            <div className="mt-4 bg-slate-900 border border-slate-800 p-4 rounded-xl text-center w-full shadow-2xl">
              <h2 className={`text-lg font-bold mb-1 ${gameWon ? 'text-emerald-400' : 'text-rose-500'}`}>
                {gameWon ? '🎉 TRESOR VOLE! MISSION REUSSIE!' : '🚨 TOUCHÉ PAR LE LASER / POLICE! T\'ES MORT!'}
              </h2>
              <button
                onClick={startGame}
                className="mt-3 w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 shadow-lg"
              >
                <RefreshCw size={14} /> REESSAYER
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
      }

