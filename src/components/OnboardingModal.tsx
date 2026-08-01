import React, { useState } from 'react';
import { Car, MapPin, Wallet, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Shield } from 'lucide-react';
import { Language } from '../types';

interface OnboardingModalProps {
  lang: Language;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ lang, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Car className="w-12 h-12 text-amber-400" />,
      badge: 'المرونة والتفاوض',
      title: 'حدّد سعر رحلتك بكل حرية',
      description: 'اختر الوجهة، اقترح السعر الذي يناسبك، وتفاوض مباشرة مع السائقين القريبين منك بدون خوارزميات ترفع الأسعار.',
      color: 'from-amber-500/20 to-indigo-900/30',
    },
    {
      icon: <MapPin className="w-12 h-12 text-indigo-400" />,
      badge: 'تتبع مباشر على الخريطة',
      title: 'خريطة OpenStreetMap التفاعلية',
      description: 'شاهد موقع السائق، المسار الأسرع، والوقت المتوقع للوصول (ETA) في الوقت الفعلي مع زر طوارئ وتتبع آمن.',
      color: 'from-indigo-500/20 to-purple-900/30',
    },
    {
      icon: <Wallet className="w-12 h-12 text-emerald-400" />,
      badge: 'المحفظة الرقمية والبنوك المغربية',
      title: 'دفع وشحن وسحب فوري',
      description: 'ادفع كاش أو استخدم محفظة ServiGo مع شحن وسحب سريع عبر CIH, Attijariwafa, Bank Populaire و Cash Plus.',
      color: 'from-emerald-500/20 to-slate-900/40',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[4500] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-8 flex flex-col justify-between min-h-[480px]">
        
        {/* Top Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-white text-base">ServiGo</span>
            <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
              دليل البداية
            </span>
          </div>
          <button
            onClick={onComplete}
            className="text-xs text-slate-400 hover:text-white transition-colors font-bold px-3 py-1 bg-slate-950 rounded-xl border border-slate-800"
          >
            تخطي
          </button>
        </div>

        {/* Slide Content */}
        <div className="space-y-6 text-center py-4">
          <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${slides[currentSlide].color} border border-slate-700/60 p-1 flex items-center justify-center shadow-xl`}>
            {slides[currentSlide].icon}
          </div>

          <div className="space-y-3">
            <span className="inline-block bg-slate-950 text-indigo-400 border border-indigo-500/30 text-[11px] font-extrabold px-3 py-1 rounded-full">
              {slides[currentSlide].badge}
            </span>
            <h2 className="text-2xl font-black text-white">{slides[currentSlide].title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed px-2">
              {slides[currentSlide].description}
            </p>
          </div>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="space-y-4">
          {/* Pagination Indicators */}
          <div className="flex justify-center items-center gap-2">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{currentSlide === slides.length - 1 ? 'ابدأ الآن في ServiGo' : 'التالي'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
