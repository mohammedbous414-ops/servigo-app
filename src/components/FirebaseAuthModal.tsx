import React, { useState } from 'react';
import { Phone, Mail, Lock, ShieldCheck, CheckCircle2, User, KeyRound, Sparkles, X, ArrowRight } from 'lucide-react';
import { AuthModalMode, UserProfile, UserRole } from '../types';

interface FirebaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const FirebaseAuthModal: React.FC<FirebaseAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<AuthModalMode>('login');
  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'google'>('phone');
  
  // Phone OTP state
  const [phone, setPhone] = useState('0612345678');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Email state
  const [email, setEmail] = useState('user@servigo.ma');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('أمين الفاسي');
  const [role, setRole] = useState<UserRole>('rider');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) {
      setError('الرجاء إدخال رقم هاتف مغربي صحيح (مثال: 0612345678)');
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtpCode('123456'); // Pre-fill test OTP code
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456') {
      setError('كود التحقق خاطئ. جرب الكود الافتراضي: 123456');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name || 'مستخدم ServiGo',
        email: `${phone}@servigo.ma`,
        phone: phone,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        role: role,
        authProvider: 'phone',
        isPhoneVerified: true,
        rating: 5.0,
        totalTrips: 14,
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(user);
      onClose();
    }, 800);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name || 'مستخدم جديد',
        email: email,
        phone: '0661234567',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        role: role,
        authProvider: 'email',
        isPhoneVerified: true,
        rating: 5.0,
        totalTrips: 2,
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(user);
      onClose();
    }, 900);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: UserProfile = {
        id: `usr-google-${Date.now()}`,
        name: 'ياسين المراكشي',
        email: 'yassine.marrakchi@gmail.com',
        phone: '0678901234',
        photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250',
        role: 'rider',
        authProvider: 'google',
        isPhoneVerified: true,
        rating: 4.9,
        totalTrips: 28,
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(user);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Firebase Auth Safe OTP 🇲🇦</span>
          </div>
          <h2 className="text-2xl font-black text-white">تسجيل الدخول / حساب جديد</h2>
          <p className="text-xs text-slate-400">سجّل دخولك الآن للوصول إلى محفظتك والرحلات الحية</p>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => { setAuthMethod('phone'); setError(null); }}
            className={`py-2 rounded-xl transition-all ${
              authMethod === 'phone' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            رقم الهاتف (OTP)
          </button>
          <button
            onClick={() => { setAuthMethod('email'); setError(null); }}
            className={`py-2 rounded-xl transition-all ${
              authMethod === 'email' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            البريد الإلكتروني
          </button>
          <button
            onClick={handleGoogleAuth}
            className="py-2 rounded-xl transition-all text-amber-400 hover:bg-slate-900 flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl text-center font-bold">
            {error}
          </div>
        )}

        {/* PHONE OTP AUTH FLOW */}
        {authMethod === 'phone' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">رقم الهاتف المغربي (+212)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0612345678"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl pr-9 pl-3 py-2.5 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">سيصلك رمز تحقق مكون من 6 أرقام عبر SMS</span>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300 mb-1">نوع الحساب</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('rider')}
                      className={`py-2 rounded-xl font-bold transition-all border ${
                        role === 'rider'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      راكب (Rider)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('driver')}
                      className={`py-2 rounded-xl font-bold transition-all border ${
                        role === 'driver'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      سائق (Driver)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  {loading ? 'جاري إرسال الرمز...' : 'إرسال رمز التحقق SMS 📲'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400 block">تم إرسال الرمز إلى:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{phone}</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">أدخل رمز التحقق (OTP)</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-slate-950 border border-slate-700 text-amber-400 font-mono text-center tracking-widest font-black text-lg rounded-xl py-2 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-400 mt-1 block text-center">الكود التجريبي الافتراضي: 123456</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all"
                >
                  {loading ? 'جاري التحقق...' : 'تأكيد الرمز والدخول 🚀'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* EMAIL & PASSWORD AUTH FLOW */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">الاسم الكامل</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl pr-9 pl-3 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl pr-9 pl-3 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl pr-9 pl-3 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              {loading ? 'جاري المعالجة...' : 'تسجيل الدخول بالبريد'}
            </button>
          </form>
        )}

        <div className="text-center border-t border-slate-800 pt-3">
          <p className="text-[10px] text-slate-500">
            بتسجيل الدخول أنت توافق على <span className="text-indigo-400 underline">شروط استخدام ServiGo</span> و <span className="text-indigo-400 underline">سياسة الخصوصية CNDP</span>.
          </p>
        </div>

      </div>
    </div>
  );
};
