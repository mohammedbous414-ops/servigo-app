import React, { useState, useEffect } from 'react';
import { Shield, Gem, RefreshCw, Trophy } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gridSize, setGridSize] = useState(4);
  const [targetIndex, setTargetIndex] = useState(0);
  const [guards, setGuards] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const startNewGame = () => {
    setScore(0);
    setGameOver(false);
    setTimeLeft(30);
    spawnItems();
  };

  const spawnItems = () => {
    const totalCells = gridSize * gridSize;
    const newTarget = Math.floor(Math.random() * totalCells);
    let newGuards: number[] = [];
    
    const guardCount = Math.min(Math.floor(score / 5) + 1, totalCells - 2);
    
    while (newGuards.length < guardCount) {
      const randomPos = Math.floor(Math.random() * totalCells);
      if (randomPos !== newTarget && !newGuards.includes(randomPos)) {
        newGuards.push(randomPos);
      }
    }

    setTargetIndex(newTarget);
    setGuards(newGuards);
  };

  useEffect(() => {
    if (gameOver || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const handleCellClick = (index: number) => {
    if (gameOver) return;

    if (guards.includes(index)) {
      setGameOver(true);
      if (score > highScore) setHighScore(score);
    } else if (index === targetIndex) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) setHighScore(newScore);
      spawnItems();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 dir-rtl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-2">
          🥷 سارق الظلال
        </h1>
        <p className="text-slate-400 text-sm">سرق الألماس وتهرّب من الحراس قبل ما يسالي الوقت!</p>
      </div>

      <div className="flex justify-between w-full max-w-xs mb-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1 text-emerald-400">
          <Gem size={18} />
          <span className="font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-1 text-amber-400">
          <Trophy size={18} />
          <span className="font-bold">{highScore}</span>
        </div>
        <div className="font-bold text-rose-400">
          ⏱️ {timeLeft}s
        </div>
      </div>

      <div 
        className="grid gap-2 bg-slate-900 p-3 rounded-2xl border border-slate-800 max-w-xs w-full aspect-square"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            disabled={gameOver}
            className="bg-slate-800 hover:bg-slate-700 active:scale-95 transition rounded-xl flex items-center justify-center text-2xl shadow-inner border border-slate-700/50"
          >
            {i === targetIndex && !gameOver ? '💎' : null}
            {guards.includes(i) && gameOver ? '👮' : null}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="mt-6 bg-slate-900 border border-slate-800 p-4 rounded-xl text-center max-w-xs w-full">
          <h2 className="text-xl font-bold text-rose-500 mb-1">
            {timeLeft === 0 ? '⏰ سالا الوقت!' : '🚨 حصلك الحارس!'}
          </h2>
          <p className="text-slate-300 text-sm mb-4">جمعتي: <span className="text-amber-400 font-bold">{score}</span> ألماس</p>
          <button
            onClick={startNewGame}
            className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> العب من جديد
          </button>
        </div>
      )}
    </div>
  );
}
