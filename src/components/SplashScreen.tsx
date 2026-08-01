import React, { useEffect, useState } from 'react';
import { Car, Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFinish(), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950 flex flex-col items-center justify-between p-8 text-white select-none">
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center max-w-sm">
        
        {/* Animated Icon Container */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-600 to-amber-500 p-0.5 shadow-2xl shadow-indigo-500/30 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Car className="w-12 h-12 text-amber-400" />
            </div>
          </div>
          <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-lg">
            <Sparkles className="w-4 h-4" />
          </span>
        </div>

        {/* Branding Titles */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100 flex items-center justify-center gap-2">
            <span>ServiGo</span>
            <span className="text-amber-400 text-sm font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
              🇲🇦 Morocco
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            تطبيق النقل الذكي والأول للتفاوض المباشر بالمغرب
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 sm:w-64 space-y-2 pt-6">
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-150 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>جاري المزامنة...</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>نسخة معتمدة ومحميّة 100% v2.4.0</span>
        </div>
        <p className="text-[10px] text-slate-600">© 2026 ServiGo Technologies SARL. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  );
};
