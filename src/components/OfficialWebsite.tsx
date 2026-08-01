import React, { useState } from 'react';
import {
  Car,
  Shield,
  Smartphone,
  CheckCircle2,
  Download,
  Wallet,
  Globe,
  MapPin,
  ChevronDown,
  ArrowRight,
  UserCheck,
  Building,
  Mail,
  Phone,
  FileText,
  HelpCircle,
  Award,
  Sparkles,
  Search,
  Lock,
  Send,
  Zap
} from 'lucide-react';
import { Driver, Language } from '../types';
import { t } from '../i18n/translations';

interface OfficialWebsiteProps {
  lang: Language;
  onRegisterDriver: (driverData: Partial<Driver>) => void;
  onNavigateRole: (role: 'rider' | 'driver' | 'admin') => void;
}

export const OfficialWebsite: React.FC<OfficialWebsiteProps> = ({
  lang,
  onRegisterDriver,
  onNavigateRole,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'driver_portal' | 'download' | 'blog' | 'faq' | 'terms'>('home');

  // Driver Application Form State
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverCity, setDriverCity] = useState('الدار البيضاء');
  const [carModel, setCarModel] = useState('');
  const [carCategory, setCarCategory] = useState<'economy' | 'comfort' | 'taxi' | 'moto' | 'cargo'>('economy');
  const [cinNumber, setCinNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [cinFile, setCinFile] = useState<string | null>(null);
  const [licenseFile, setLicenseFile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Earnings Simulator State
  const [ridesPerDay, setRidesPerDay] = useState(10);
  const avgFareMAD = 45;
  const estimatedMonthlyMAD = Math.round(ridesPerDay * avgFareMAD * 26 * 0.9); // 10% commission deduction

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !driverPhone || !carModel) {
      alert('الرجاء إكمال جميع البيانات المطلوبة');
      return;
    }

    onRegisterDriver({
      name: driverName,
      phone: driverPhone,
      carModel: carModel,
      category: carCategory,
      verified: false,
      cinNumber: cinNumber || 'BH987654',
      licenseNumber: licenseNumber || '26/123456',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDriverName('');
      setDriverPhone('');
      setCarModel('');
    }, 5000);
  };

  const faqs = [
    {
      q: 'كيف يعمل تطبيق ServiGo؟',
      a: 'تطبيق ServiGo يتيح للراكب اقتراح سعر رحلته ومفاوضة السائقين بشكل مباشر وبكل شفافية دون أي خوارزميات خفية، مع دعم خيارات الدفع كاش أو عبر المحفظة الرقمية.',
    },
    {
      q: 'كيف يمكن للسائق سحب أرباحه إلى حسابه البنكي؟',
      a: 'يمكنك سحب أرباحك فوراً عبر محفظة ServiGo إلى حسابات CIH Bank, Attijariwafa Bank, البنك الشعبي أو وكالات Cash Plus و Orange Money بضغطة زر واحدة.',
    },
    {
      q: 'ما هي نسبة عمولة المنصة؟',
      a: 'تقتطع ServiGo عمولة رمزية قدرها 10% فقط من كل رحلة مكتملة، وهي الأقل في سوق النقل الذكي بالمغرب.',
    },
    {
      q: 'هل الخدمة مرخصة وآمنة بالمغرب؟',
      a: 'نعم، يخضع جميع السائقين لمراجعة دقيقة للبطاقة الوطنية (CIN)، رخصة السياقة، والورق الرمادي للمركبة لضمان أعلى مستويات الأمان والأمان.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white pb-16">
      
      {/* Sub-Header Navigation */}
      <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-[65px] z-[1000] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-4">
          <div className="flex items-center gap-1.5 sm:gap-3 text-xs font-bold whitespace-nowrap">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'home'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setActiveTab('driver_portal')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'driver_portal'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>انضم كسائق كابتن</span>
            </button>
            <button
              onClick={() => setActiveTab('download')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'download'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              تحميل التطبيق
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'blog'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الأخبار والمدونة
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'faq'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الأسئلة الشائعة
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'terms'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الشروط والأمان
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onNavigateRole('rider')}
              className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              تجربة تطبيق الراكب
            </button>
            <button
              onClick={() => onNavigateRole('driver')}
              className="bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              تجربة تطبيق السائق
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION & MAIN HOMEPAGE */}
      {activeTab === 'home' && (
        <div className="space-y-16 py-8 px-4 max-w-7xl mx-auto">
          
          {/* Main Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-8 sm:p-14 shadow-2xl text-center md:text-right flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>المنصة الوطنية الرائدة للنقل الذكي بالمغرب 🇲🇦</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                تنقّل بحرية، حدّد ثمنك بنفسك مع <span className="text-amber-400 underline decoration-indigo-500 underline-offset-8">ServiGo</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                التطبيق المغربي الأول للتنقل الذكي الذي يتيح التفاوض المباشر بين الراكب والسائق، مع دعم المحفظة الرقمية والشحن عبر CIH و Attijariwafa و Cash Plus دون عمولات مرتفعة.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center md:justify-start">
                <button
                  onClick={() => onNavigateRole('rider')}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>اطلب رحلة الآن كراكب</span>
                </button>

                <button
                  onClick={() => setActiveTab('driver_portal')}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl text-sm border border-indigo-400/30 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Car className="w-5 h-5 text-amber-400" />
                  <span>سجّل ككابتن سائق</span>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-center md:justify-start gap-6 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>أكثر من 50,000 رحلة ناجحة</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>سحب أرباح فوري 100%</span>
                </span>
              </div>
            </div>

            {/* Visual Hero Mockup Card */}
            <div className="w-full md:w-[380px] bg-slate-900/90 border border-indigo-500/40 p-6 rounded-3xl shadow-2xl space-y-4 text-right">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span>حساب الأجرة المباشر</span>
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold">
                  OpenStreetMap
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">الانطلاق:</span>
                    <span className="font-bold text-slate-200">الدار البيضاء - المعاريف</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">الوجهة:</span>
                    <span className="font-bold text-slate-200">مطار محمد الخامس الدولي</span>
                  </div>
                </div>

                <div className="bg-indigo-950/60 p-3.5 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
                  <span className="text-slate-300 font-bold">السعر التقديري الشفاف:</span>
                  <span className="text-xl font-black text-amber-400">120 - 150 DH</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateRole('rider')}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold shadow transition-all"
              >
                انطلق في تجربتك
              </button>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">لماذا يفضل المغاربة منصة ServiGo؟</h2>
              <p className="text-slate-400 text-xs sm:text-sm">مصممة خصيصاً لتلبية احتياجات السوق المغربي بكل شفافية وسرعة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-base">حرية تفاوض الأسعار</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  لا توجد خوارزميات ترفع السعر وقت الذروة. الراكب يقترح ثمنه والسائق يوافق أو يرسل عرضاً مضاداً بكل حرية.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-base">محفظة وسحب أرباح فوري</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  شحن المحفظة وسحب الأرباح مباشرة عبر حسابات البنوك المغربية CIH, Attijariwafa, Banque Populaire أو وكالات Cash Plus.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-base">أمان وتوثيق شامل</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  فحص وتدقيق وثائق الهوية الوطنية CIN ورخصة السياقة لجميع السائقين مع زر طوارئ وتتبع مباشر للرحلة.
                </p>
              </div>
            </div>
          </div>

          {/* Supported Cities */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-center">
            <h3 className="font-extrabold text-white text-lg">متواجدون في كبريات المدن المغربية</h3>
            <div className="flex flex-wrap justify-center gap-3 text-xs font-bold">
              {['الدار البيضاء', 'الرباط - سلا', 'مراكش', 'طنجة', 'أكادير', 'فاس', 'مكناس', 'وجدة'].map((city) => (
                <span key={city} className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2 rounded-2xl">
                  📍 {city}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. DRIVER REGISTRATION PORTAL */}
      {activeTab === 'driver_portal' && (
        <div className="py-8 px-4 max-w-5xl mx-auto space-y-10">
          
          <div className="text-center space-y-3">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-extrabold px-3.5 py-1 rounded-full">
              انضم لأكثر من 12,000 كابتن بالمغرب
            </span>
            <h2 className="text-3xl font-black text-white">سجل كسائق واكسب مداخيل ممتازة بشروطك</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              مع ServiGo، أنت مدير نفسك. عمولة المنصة 10% فقط، مع إمكانية سحب أرباحك فوراً إلى حسابك البنكي المغربي.
            </p>
          </div>

          {/* Earnings Calculator */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/40 p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="font-extrabold text-amber-400 text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>حاسبة الأرباح الشهرية التقديرية</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>عدد الرحلات اليومية المتوقعة:</span>
                <span className="text-amber-400 text-sm font-black">{ridesPerDay} رحلة / يوم</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                value={ridesPerDay}
                onChange={(e) => setRidesPerDay(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">الربح الصافي التقديري شهرياً:</span>
                <span className="text-2xl font-black text-emerald-400">{estimatedMonthlyMAD} DH</span>
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-900 px-3 py-1 rounded-full">
                بعد اقتطاع عمولة المنصة 10%
              </span>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <h3 className="font-extrabold text-white text-lg border-b border-slate-800 pb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <span>استمارة التسجيل الفوري للكابتن</span>
            </h3>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <h4 className="font-bold text-base">تم إرسال طلبك بنجاح إلى فريق الإدارة!</h4>
                <p className="text-xs text-slate-300">
                  سيتم مراجعة أوراقك وتفعيل حسابك خلال أقل من 24 ساعة. يمكنك الدخول للوحة التحكم لمتابعة الحالة.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDriverSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="مثال: يوسف العمراني"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">رقم الهاتف المغربي *</label>
                    <input
                      type="tel"
                      required
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      placeholder="0612345678"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">المدينة *</label>
                    <select
                      value={driverCity}
                      onChange={(e) => setDriverCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="الدار البيضاء">الدار البيضاء</option>
                      <option value="الرباط">الرباط</option>
                      <option value="مراكش">مراكش</option>
                      <option value="طنجة">طنجة</option>
                      <option value="أكادير">أكادير</option>
                      <option value="فاس">فاس</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">موديل السيارة / المركبة *</label>
                    <input
                      type="text"
                      required
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="Dacia Logan 2022"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">فئة الخدمة *</label>
                    <select
                      value={carCategory}
                      onChange={(e) => setCarCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="economy">اقتصادي (Eco)</option>
                      <option value="comfort">راحة (Comfort)</option>
                      <option value="taxi">تاكسي (Taxi)</option>
                      <option value="moto">دراجة نارية (Moto)</option>
                      <option value="cargo">حمل وسلعة (Cargo)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">رقم البطاقة الوطنية (CIN)</label>
                    <input
                      type="text"
                      value={cinNumber}
                      onChange={(e) => setCinNumber(e.target.value)}
                      placeholder="BH123456"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">رقم رخصة السياقة</label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="26/987654"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Upload Section Simulation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950 border border-dashed border-slate-700 p-4 rounded-2xl text-center space-y-2">
                    <FileText className="w-6 h-6 text-indigo-400 mx-auto" />
                    <span className="block font-bold text-slate-300">رفع صورة البطاقة الوطنية (CIN)</span>
                    <p className="text-[10px] text-slate-500">صورة واضحة للوجهين الأمامي والخلفي</p>
                    <button
                      type="button"
                      onClick={() => setCinFile('uploaded')}
                      className="bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 px-3 py-1 rounded-xl text-[11px] font-bold"
                    >
                      {cinFile ? '✓ تم رفع الصورة' : 'اختر صورة CIN'}
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-dashed border-slate-700 p-4 rounded-2xl text-center space-y-2">
                    <FileText className="w-6 h-6 text-indigo-400 mx-auto" />
                    <span className="block font-bold text-slate-300">رفع رخصة السياقة والورق الرمادي</span>
                    <p className="text-[10px] text-slate-500">Permis de conduire + Carte grise</p>
                    <button
                      type="button"
                      onClick={() => setLicenseFile('uploaded')}
                      className="bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 px-3 py-1 rounded-xl text-[11px] font-bold"
                    >
                      {licenseFile ? '✓ تم رفع الصورة' : 'اختر صورة الرخصة'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>تقديم طلب الانضمام ككابتن</span>
                </button>
              </form>
            )}
          </div>

        </div>
      )}

      {/* 3. DOWNLOAD APP SECTION */}
      {activeTab === 'download' && (
        <div className="py-12 px-4 max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-extrabold px-3.5 py-1 rounded-full">
              متوفر على كافة الأجهزة الذكية
            </span>
            <h2 className="text-3xl font-black text-white">حمل تطبيق ServiGo مجاناً الآن</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
              تجربة نقل فائقة السلاسة والأمان، متوفرة للاندرويد والايفون مباشرة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/40 transition-all">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Google Play Store</h3>
                <p className="text-[11px] text-slate-400 mt-1">تطبيق Android الرسمي</p>
              </div>
              <button
                onClick={() => alert('جاري توجيهك إلى Google Play Store...')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow"
              >
                تحميل لأجهزة أندرويد
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/40 transition-all">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 mx-auto">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Apple App Store</h3>
                <p className="text-[11px] text-slate-400 mt-1">تطبيق iOS الرسمي</p>
              </div>
              <button
                onClick={() => alert('جاري توجيهك إلى App Store...')}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-xl text-xs font-black transition-all shadow"
              >
                تحميل لأجهزة أيفون
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-indigo-500/40 transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">تحميل ملف APK المباشر</h3>
                <p className="text-[11px] text-slate-400 mt-1">نسخة أندرويد المستقلة</p>
              </div>
              <button
                onClick={() => alert('بدء تحميل ServiGo-Latest.apk')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-700"
              >
                تنزيل مباشر APK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. BLOG & NEWS */}
      {activeTab === 'blog' && (
        <div className="py-8 px-4 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white">مدونة وأخبار ServiGo المغرب</h2>
            <p className="text-slate-400 text-xs sm:text-sm">أحدث مستجدات النقل الذكي والتكنولوجيا الحضرية بالمملكة المغربية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-indigo-500/40 transition-all">
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                تكنولوجيا النقل
              </span>
              <h3 className="font-extrabold text-white text-lg">كيف تعزز الخرائط المفتوحة OpenStreetMap شفافية الأسعار للركاب؟</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تعتمد منصة ServiGo على خرائط OpenStreetMap ومحرك OSRM لتحديد أسرع المسارات وحساب المسافات بدقة دون الاعتماد على تكاليف الخرائط الباهظة...
              </p>
              <span className="text-[10px] text-slate-500 block pt-2">31 يوليوز 2026 • 4 دقائق قراءة</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-indigo-500/40 transition-all">
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                دليل السائق
              </span>
              <h3 className="font-extrabold text-white text-lg">5 نصائح ذهبية لزيادة مدخولك اليومي مع ServiGo ككابتن</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تعرف على أوقات الأوج الذكية في الدار البيضاء والرباط ومراكش وكيف تستفيد من خاصية الدفع الفوري وسحب الأرباح لمصارفك اليومية...
              </p>
              <span className="text-[10px] text-slate-500 block pt-2">28 يوليوز 2026 • 5 دقائق قراءة</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. FAQ */}
      {activeTab === 'faq' && (
        <div className="py-8 px-4 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white">الأسئلة الشائعة</h2>
            <p className="text-slate-400 text-xs sm:text-sm">إجابات فورية لأهم التساؤلات حول الخدمة والمحفظة</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-right p-4 font-bold text-slate-200 text-sm flex items-center justify-between gap-3"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaqIndex === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 border-t border-slate-800/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TERMS & SAFETY */}
      {activeTab === 'terms' && (
        <div className="py-8 px-4 max-w-4xl mx-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Lock className="w-5 h-5 text-indigo-400" />
              <span>سياسة الخصوصية وأمان البيانات في ServiGo</span>
            </h2>
            <p>
              تلتزم منصة ServiGo المغربية بحماية بيانات المستخدمين والسائقين وفق القوانين والأنظمة المعمول بها بالمملكة المغربية (CNDP).
            </p>
            <h3 className="font-bold text-white text-sm">1. جمع البيانات واستخدامها</h3>
            <p>
              تُجمع معلومات الموقع الجغرافي الدقيق لتقديم خدمة التتبع اللحظي للرحلات وحساب المسارات بدقة. لا يتم مشاركة هذه البيانات مع أي أطراف خارجية تجارية.
            </p>
            <h3 className="font-bold text-white text-sm">2. المعاملات المالية والمحفظة</h3>
            <p>
              جميع الشحنات المالية والتحويلات محمية بتشفير SSL عالي المستوى ومربوطة بشبكات البنوك المغربية CMI و CIH Bank و Attijariwafa Bank و Cash Plus.
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800 mt-16 pt-8 pb-12 px-4 max-w-7xl mx-auto text-xs text-slate-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <h4 className="font-black text-white text-base">ServiGo Morocco</h4>
            <p className="text-[11px] text-slate-400">
              المنصة الوطنية للتنقل الذكي بالمملكة المغربية. حلول نقل مبتكرة وسريعة.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 mb-2">روابط سريعة</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-400">الرئيسية</button></li>
              <li><button onClick={() => setActiveTab('driver_portal')} className="hover:text-amber-400">بوابة السائقين</button></li>
              <li><button onClick={() => setActiveTab('download')} className="hover:text-amber-400">تحميل التطبيق</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-200 mb-2">الدعم والأمان</h5>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => setActiveTab('faq')} className="hover:text-amber-400">الأسئلة الشائعة</button></li>
              <li><button onClick={() => setActiveTab('terms')} className="hover:text-amber-400">سياسة الخصوصية</button></li>
            </ul>
          </div>

          <div className="space-y-2 text-[11px]">
            <h5 className="font-bold text-slate-200">التواصل والمقر</h5>
            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Technopark Casablanca, Maroc</p>
            <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> support@servigo.ma</p>
            <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> +212 522 00 11 22</p>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-600">
          <span>© 2026 ServiGo Technologies SARL. جميع الحقوق محفوظة بالمملكة المغربية.</span>
          <span>Powered by OpenStreetMap & Firebase Firestore</span>
        </div>
      </footer>

    </div>
  );
};
