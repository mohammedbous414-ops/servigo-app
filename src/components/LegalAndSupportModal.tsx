import React, { useState } from 'react';
import { Shield, FileText, HelpCircle, Mail, Phone, MapPin, Send, CheckCircle2, X } from 'lucide-react';

interface LegalAndSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalAndSupportModal: React.FC<LegalAndSupportModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'privacy' | 'terms' | 'about' | 'contact'>('privacy');

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMsg('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setTab('privacy')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              tab === 'privacy' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            سياسة الخصوصية
          </button>
          <button
            onClick={() => setTab('terms')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              tab === 'terms' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            شروط الاستخدام
          </button>
          <button
            onClick={() => setTab('about')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              tab === 'about' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            من نحن
          </button>
          <button
            onClick={() => setTab('contact')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              tab === 'contact' ? 'bg-amber-500 text-slate-950 font-black' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            اتصل بنا والمساعدة
          </button>
        </div>

        {/* Content Section */}
        <div className="text-xs text-slate-300 space-y-4 leading-relaxed">
          {tab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>سياسة الخصوصية وحماية البيانات الشخصية (ملاءمة CNDP بالمغرب)</span>
              </h3>
              <p>
                تلتزم منصة ServiGo لحلول النقل الذكي بحماية خصوصية مستخدميها وركابها وسائقيها وفق مقتضيات القانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي بالمملكة المغربية.
              </p>
              <h4 className="font-bold text-white text-sm">1. البيانات التي نجمعها:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>معلومات الحساب: الاسم الكامل، رقم الهاتف المغربي، البريد الإلكتروني وصورة الملف.</li>
                <li>الموقع الجغرافي اللحظي (GPS): لتحديد نقطة الانطلاق والوجهة وعرض السائق القريب منك.</li>
                <li>وثائق الهوية للسائقين: CIN ورخصة السياقة والورق الرمادي لغرض التوثيق والأمان فقط.</li>
              </ul>
              <h4 className="font-bold text-white text-sm">2. أمان المعاملات المالية:</h4>
              <p className="text-slate-400">
                جميع بيانات المحفظة والشحنات مشفرة بأحدث بروتوكولات الأمان ومتوافقة مع شبكات CMI و CIH و Attijariwafa Bank.
              </p>
            </div>
          )}

          {tab === 'terms' && (
            <div className="space-y-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>شروط الاستخدام وأحكام رحلات ServiGo</span>
              </h3>
              <p>
                باستخدامك لتطبيق ServiGo، فأنت تقر بالالتزام بقواعد الشفافية والاحترام المتبادل بين الركاب والكباتن.
              </p>
              <h4 className="font-bold text-white text-sm">1. نظام تفاوض الأسعار:</h4>
              <p className="text-slate-400">
                السعر المقترح من الراكب يعتبر عرضاً أوليًا، وللسائق الحق الكامل في قبوله أو التنازل أو تقديم عرض مضاد. العقد ينعقد بموافقة الطرفين.
              </p>
              <h4 className="font-bold text-white text-sm">2. عمولة المنصة للسائقين:</h4>
              <p className="text-slate-400">
                تقتطع المنصة عمولة ثابتة قدرها 10% فقط من الأجرة المتفق عليها، وتُخصم تلقائياً من المحفظة الرقمية.
              </p>
            </div>
          )}

          {tab === 'about' && (
            <div className="space-y-3">
              <h3 className="text-base font-black text-white text-lg">عن تطبيق ServiGo Morocco</h3>
              <p>
                ServiGo هي منصة تنقل مغربية 100% تم تطويرها لتوفير بديل عادل وشفاف وسريع في سوق النقل الذكي. نحن نؤمن بأن كل راكب وسائق يستحقان حرية الاتفاق المباشر دون احتكار أو خوارزميات مضاعفة للأسعار.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xl font-black text-amber-400 block">+50,000</span>
                  <span className="text-[10px] text-slate-400">رحلة ناجحة في المغرب</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-xl font-black text-emerald-400 block">+12,000</span>
                  <span className="text-[10px] text-slate-400">كابتن سائق موثق</span>
                </div>
              </div>
            </div>
          )}

          {tab === 'contact' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <span>مركز الدعم الفني والتواصل المباشر</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="text-slate-500 block">الهاتف:</span>
                    <span className="font-bold text-slate-200">+212 522 00 11 22</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-slate-500 block">البريد:</span>
                    <span className="font-bold text-slate-200">support@servigo.ma</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-slate-500 block">المقر:</span>
                    <span className="font-bold text-slate-200">Technopark Casablanca</span>
                  </div>
                </div>
              </div>

              {sent ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 mx-auto" />
                  <span className="font-bold block">تم إرسال رسالتك بنجاح!</span>
                  <p className="text-[11px] text-slate-300">سيتواصل معك فريق خدمة العملاء خلال أقل من ساعتين.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="الاسم الكامل"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="البريد الإلكتروني"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="اكتب استفسارك أو مشكلتك هنا..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال الرسالة إلى الدعم</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
