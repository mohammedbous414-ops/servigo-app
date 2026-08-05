import React, { useState, useEffect } from 'react';
import { User, Shield, Gem, RefreshCw, Trophy, Flame, AlertTriangle, Eye, Lock, Home, Play } from 'lucide-react';

// تعريف أنواع الواجهات والمستويات
type Screen = 'welcome' | 'levels' | 'game';

interface LevelConfig {
  id: number;
  name: string;
  icon: string;
  gridSize: number;
  timeLimit: number;
  unlocked: boolean;
  guardCount: number;
  trapCount: number;
}

export default function App() {
  // إدارة الواجهات
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [playerName, setPlayerName] = useState('');
  
  // اللعبة والنتائج
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  
  // عناصر الخريطة
  const [targetPos, setTargetPos] = useState(0);
  const [guards, setGuards] = useState<number[]>([]);
  const [traps, setTraps] = useState<number[]>([]);
  const [hidingSpots, setHidingSpots] = useState<number[]>([]);
  const [playerPos, setPlayerPos] = useState(0);
  const [isHiding, setIsHiding] = useState(false);

  // حالة الجيم
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // قائمة المستويات
  const levels: LevelConfig[] = [
    { id: 1, name: 'شقة العمدة 🏠', icon: '🏠', gridSize: 4, timeLimit: 30, unlocked: true, guardCount: 1, trapCount: 1 },
    { id: 2, name: 'المتحف السرّي 🏛️', icon: '🏛️', gridSize: 5, timeLimit: 25, unlocked: true, guardCount: 3, trapCount: 2 },
    { id: 3, name: 'قصر الكونت 🏰', icon: '🏰', gridSize: 6, timeLimit: 20, unlocked: true, guardCount: 5, trapCount: 3 },
  ];

  // تشغيل الأصوات
  const playSound = (type: 'gem' | 'alarm' | 'hide' | 'click') => {
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
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'hide') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {}
  };

  // بدء المستوى
  const startLevel = (lvl: LevelConfig) => {
    setCurrentLevel(lvl);
    setTimeLeft(lvl.timeLimit);
    setGameOver(false);
    setGameWon(false);
    setIsHiding(false);
    
    const totalCells = lvl.gridSize * lvl.gridSize;
    
    // تحديد الألماس
    const target = Math.floor(Math.random() * totalCells);
    setTargetPos(target);

    // تحديد أماكن الاختباء (البيوتا/الأثاث)
    let hides: number[] = [];
    while (hides.length < 3) {
      const p = Math.floor(Math.random() * totalCells);
      if (p !== target && !hides.includes(p)) hides.push(p);
    }
    setHidingSpots(hides);

    // تحديد الحراس
    let g: number[] = [];
    while (g.length < lvl.guardCount) {
      const p = Math.floor(Math.random() * totalCells);
      if (p !== target && !hides.includes(p) && !g.includes(p)) g.push(p);
    }
    setGuards(g);

    // تحديد الفخاخ
    let t: number[] = [];
    while (t.length < lvl.trapCount) {
      const p = Math.floor(Math.random() * totalCells);
      if (p !== target && !hides.includes(p) && !g.includes(p) && !t.includes(p)) t.push(p);
    }
    setTraps(t);

    setCurrentScreen('game');
  };

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

  // الضغط على الغرف
  const handleCellClick = (index: number) => {
    if (gameOver || gameWon) return;

    setPlayerPos(index);

    // 1. إذا ضغط على مكان اختباء
    if (hidingSpots.includes(index)) {
      setIsHiding(true);
      playSound('hide');
      return;
    }

    setIsHiding(false);

    // 2. إذا ضغط على حارس أو فخ
    if (guards.includes(index) || traps.includes(index)) {
      setGameOver(true);
      playSound('alarm');
      if (score > highScore) setHighScore(score);
    } 
    // 3. إذا وصل للألماس
    else if (index === targetPos) {
      playSound('gem');
      setGameWon(true);
      const newScore = score + 10;
      setScore(newScore);
      if (newScore > highScore) setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 dir-rtl">
      
      {/* ================= 1. واجهة إدخال اسم اللاعب ================= */}
      {currentScreen === 'welcome' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xs w-full text-center shadow-2xl animate-fade-in">
          <div className="text-5xl mb-3">🥷</div>
          <h1 className="text-2xl font-black text-amber-400 mb-1">سارق الظلال</h1>
          <p className="text-slate-400 text-xs mb-6">أدخل اسمك للبدء في مهمات التخفي</p>
          
          <div className="mb-5 text-right">
            <label className="text-xs text-slate-300 font-bold mb-1 block">اسم السارق:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="مثال: البطل 007"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 pr-9 text-sm text-amber-300 focus:outline-none focus:border-amber-500"
              />
              <User size={16} className="absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <button
            onClick={() => {
              if (playerName.trim()) {
                playSound('click');
                setCurrentScreen('levels');
              }
            }}
            disabled={!playerName.trim()}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition ${
              playerName.trim()
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 active:scale-95'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            متابعة لغرفة العمليات <Play size={16} />
          </button>
        </div>
      )}

      {/* ================= 2. واجهة اختيار المستوى ================= */}
      {currentScreen === 'levels' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-xs w-full shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs text-slate-400">اللاعب الحالي:</span>
              <h2 className="text-amber-400 font-bold text-sm">🥷 {playerName}</h2>
            </div>
            <div className="text-emerald-400 font-bold text-xs flex items-center gap-1 bg-emerald-950/50 px-2 py-1 rounded-lg border border-emerald-800">
              <Gem size={14} /> {score} pts
            </div>
          </div>

          <h3 className="text-center font-extrabold text-slate-200 mb-4 text-sm">اختر الخريطة والمستوى:</h3>

          <div className="space-y-3 mb-5">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => startLevel(lvl)}
                className="w-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition p-3 rounded-xl border border-slate-700/70 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lvl.icon}</span>
                  <div className="text-right">
                    <div className="font-bold text-sm text-slate-100">{lvl.name}</div>
                    <div className="text-[10px] text-slate-400">حراس: {lvl.guardCount} | فخاخ: {lvl.trapCount}</div>
                  </div>
                </div>
                <Play size={16} className="text-amber-400" />
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentScreen('welcome')}
            className="w-full py-2 bg-slate-950 text-slate-400 hover:text-white rounded-lg text-xs font-bold"
          >
            ← تغيير اسم اللاعب
          </button>
        </div>
      )}

      {/* ================= 3. واجهة اللعب (المنزل والبيوتا) ================= */}
      {currentScreen === 'game' && currentLevel && (
        <div className="flex flex-col items-center w-full max-w-xs animate-fade-in">
          
          {/* Header */}
          <div className="flex justify-between items-center w-full mb-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-bold">🥷 {playerName}</span>
            </div>
            <div className="text-rose-400 font-bold text-sm">
              ⏱️ {timeLeft}s
            </div>
            <button
              onClick={() => setCurrentScreen('levels')}
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300"
            >
              الخريطة 🗺️
            </button>
          </div>

          {/* Map Legend */}
          <div className="flex justify-around w-full text-[10px] text-slate-400 mb-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-800">
            <span>🚪 غرفة</span>
            <span>📦 اختباء</span>
            <span>💎 الكنز</span>
            <span>👮 حارس</span>
            <span>💣 فخ</span>
          </div>

          {/* Game Board Grid */}
          <div 
            className="grid gap-2 bg-slate-900 p-3 rounded-2xl border border-slate-800 w-full aspect-square shadow-2xl relative"
            style={{ gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: currentLevel.gridSize * currentLevel.gridSize }).map((_, i) => {
              const isTarget = i === targetPos;
              const isGuard = guards.includes(i);
              const isTrap = traps.includes(i);
              const isHide = hidingSpots.includes(i);

              return (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  disabled={gameOver || gameWon}
                  className={`relative rounded-xl flex items-center justify-center text-xl shadow-inner transition border ${
                    isHide
                      ? 'bg-amber-950/40 border-amber-800/60'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700/60'
                  }`}
                >
                  {/* الألماس */}
                  {isTarget && !gameOver && !gameWon ? '💎' : null}

                  {/* مكثف اختباء (خزانة/أثاث) */}
                  {isHide && !gameOver ? '📦' : null}

                  {/* الحراس والفخاخ (تظهر عند الخسارة أو الفوز) */}
                  {isGuard && (gameOver || gameWon) ? '👮' : null}
                  {isTrap && (gameOver || gameWon) ? '💣' : null}
                </button>
              );
            })}
          </div>

          {/* Modal Game Over / Win */}
          {(gameOver || gameWon) && (
            <div className="mt-4 bg-slate-900 border border-slate-800 p-4 rounded-xl text-center w-full">
              <h2 className={`text-lg font-bold mb-1 ${gameWon ? 'text-emerald-400' : 'text-rose-500'}`}>
                {gameWon ? '🎉 نجحت المهمة وسرقتي الكنز!' : timeLeft === 0 ? '⏰ انتهى الوقت!' : '🚨 حصلك الحارس أو الفخ!'}
              </h2>
              <button
                onClick={() => startLevel(currentLevel)}
                className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
              >
                <RefreshCw size={14} /> إعادة المحاولة
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
    }
    
