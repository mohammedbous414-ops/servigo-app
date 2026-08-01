import React from 'react';
import { Shield, Smartphone, Car, LayoutDashboard, Wallet, Globe, SmartphoneNfc, Maximize2, User, Settings, History, Lock } from 'lucide-react';
import { Language, UserProfile, UserRole } from '../types';
import { t } from '../i18n/translations';

interface AppHeaderProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  lang: Language;
  onChangeLang: (lang: Language) => void;
  walletBalance: number;
  onOpenWallet: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentRole,
  onChangeRole,
  lang,
  onChangeLang,
  walletBalance,
  onOpenWallet,
  isMobileFrame,
  onToggleFrame,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenSettings,
  onOpenHistory,
}) => {
  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-[1100] px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-black text-2xl tracking-tighter">
                S
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-xl text-white tracking-tight flex items-center gap-1">
                  Servi<span className="text-indigo-500">Go</span>
                </h1>
                <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  MA 🇲🇦
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {t(lang, 'tagline')}
              </p>
            </div>
          </div>

          {/* Quick Mobile Wallet & Lang Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenWallet}
              className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{walletBalance} {t(lang, 'currency')}</span>
            </button>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => onChangeRole('rider')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              currentRole === 'rider'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{t(lang, 'riderRole')}</span>
          </button>

          <button
            onClick={() => onChangeRole('driver')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              currentRole === 'driver'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>{t(lang, 'driverRole')}</span>
          </button>

          <button
            onClick={() => onChangeRole('admin')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              currentRole === 'admin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{t(lang, 'adminRole')}</span>
          </button>

          <button
            onClick={() => onChangeRole('website')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              currentRole === 'website'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span>{t(lang, 'websiteRole')}</span>
          </button>
        </div>

        {/* Controls: Profile, History, Wallet, Settings & Frame toggle */}
        <div className="hidden md:flex items-center gap-2">
          
          {/* User Auth/Profile Button */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover border border-amber-400"
              />
              <span className="truncate max-w-[100px]">{currentUser.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>تسجيل الدخول</span>
            </button>
          )}

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            title="سجل الرحلات والفواتير"
          >
            <History className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Wallet Button */}
          <button
            onClick={onOpenWallet}
            className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-amber-400 font-black">{walletBalance} MAD</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            title="الإعدادات والشروط"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Mobile Frame Simulator Toggle */}
          <button
            onClick={onToggleFrame}
            className={`p-2 rounded-xl border transition-colors ${
              isMobileFrame
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isMobileFrame ? 'عرض ملء الشاشة' : 'محاكي هاتف ذكي'}
          >
            {isMobileFrame ? <Maximize2 className="w-4 h-4" /> : <SmartphoneNfc className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};
