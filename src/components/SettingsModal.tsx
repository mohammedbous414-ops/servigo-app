import React from 'react';
import { Settings, Globe, Moon, Bell, Navigation, ShieldCheck, FileText, Smartphone, LogOut, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language, UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  user?: UserProfile | null;
  onOpenLegal: () => void;
  onOpenReleaseKit: () => void;
  onLogout: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectLang,
  user,
  onOpenLegal,
  onOpenReleaseKit,
  onLogout,
}) => {
  const [darkMode, setDarkMode] = React.useState(true);
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [highAccuracyGps, setHighAccuracyGps] = React.useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Settings className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-black text-white">إعدادات التطبيق</h2>
        </div>

        {/* Language Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>لغة التطبيق (Language)</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <button
              onClick={() => onSelectLang('ar')}
              className={`py-2 rounded-xl transition-all border ${
                lang === 'ar' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              العربية (المغرب)
            </button>
            <button
              onClick={() => onSelectLang('darija')}
              className={`py-2 rounded-xl transition-all border ${
                lang === 'darija' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              الدارجة المغربية 🇲🇦
            </button>
            <button
              onClick={() => onSelectLang('fr')}
              className={`py-2 rounded-xl transition-all border ${
                lang === 'fr' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Français
            </button>
            <button
              onClick={() => onSelectLang('en')}
              className={`py-2 rounded-xl transition-all border ${
                lang === 'en' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* System Preferences Toggles */}
        <div className="space-y-3 border-t border-slate-800 pt-3 text-xs">
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-slate-200">الوضع الليلي (Dark Mode)</span>
            </div>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-slate-200">إشعارات Firebase Push Notifications</span>
            </div>
            <input
              type="checkbox"
              checked={pushEnabled}
              onChange={(e) => setPushEnabled(e.target.checked)}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200">دقة GPS العالية (OpenStreetMap Live)</span>
            </div>
            <input
              type="checkbox"
              checked={highAccuracyGps}
              onChange={(e) => setHighAccuracyGps(e.target.checked)}
              className="accent-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* Shortcuts Section */}
        <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenLegal();
            }}
            className="w-full bg-slate-950 hover:bg-slate-800 text-slate-200 p-3 rounded-2xl border border-slate-800 flex items-center justify-between font-bold"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>الشروط، الخصوصية والدعم الفني</span>
            </span>
            <span>←</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenReleaseKit();
            }}
            className="w-full bg-gradient-to-r from-indigo-900/60 to-slate-900 border border-indigo-500/40 hover:border-indigo-400 text-amber-300 p-3 rounded-2xl flex items-center justify-between font-bold"
          >
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>دليل حزمة النشر Google Play AAB Kit</span>
            </span>
            <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">جاهز 100%</span>
          </button>
        </div>

        {/* Logout */}
        {user && (
          <div className="border-t border-slate-800 pt-3">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج من الحساب</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
