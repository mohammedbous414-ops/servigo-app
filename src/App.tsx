import React, { useState } from 'react';
import { Search, MapPin, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('عام');
  const [requests, setRequests] = useState([
    { id: 1, item: "دواء Synthroid 50mg", status: "كاين (3 محلات)", time: "منذ 5 دقائق", category: "صيدلية" },
    { id: 2, item: "مكثف مكيف سيارة Golf 7 موديل 2016", status: "في انتظار الردود...", time: "منذ 12 دقيقة", category: "قطع غيار" },
  ]);

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newReq = {
      id: Date.now(),
      item: query,
      status: "جاري البحث عند المحلات القريبة...",
      time: "الآن",
      category: category
    };

    setRequests([newReq, ...requests]);
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans" dir="rtl">
      {/* Header / الهيدر */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-xl text-xl tracking-wider shadow-lg shadow-amber-500/20">
            كِايْنْ؟
          </div>
          <span className="text-xs text-slate-400 font-medium">شبكة التوفر الفوري</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <MapPin className="w-3.5 h-3.5" />
          <span>الدار البيضاء • بوسكورة</span>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* بطاقة إرسال الطلب / Hero Request Box */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <h2 className="text-lg font-bold text-slate-100 mb-1">شنو كتقلب عليه ودكّاتي؟ 🔍</h2>
          <p className="text-xs text-slate-400 mb-4">كتب السلعة ولا الدواء ولا البياسَة، والبرنامج غيسول المحلات القريبة منك فـ الحين.</p>

          <form onSubmit={handleSendRequest} className="space-y-3">
            <div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="مثال: كنقلب على زيت موتور 5w30 ولا بياسة تليفون Samsung S21 Ultra..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none h-24"
              />
            </div>

            {/* الفئات / Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              {['عام', 'صيدلية', 'قطع غيار', 'إلكترونيات', 'مواد البناء'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>سول المحلات القريبة فـ الحين</span>
            </button>
          </form>
        </section>

        {/* الطلبات الأخيرة والردود / Live Requests History */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              الطلبات ديالك والردود
            </h3>
            <span className="text-xs text-slate-500">{requests.length} طلبات</span>
          </div>

          <div className="space-y-2.5">
            {requests.map((req) => (
              <div key={req.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-semibold text-slate-100">{req.item}</p>
                  <span className="text-[10px] bg-slate-800 text-amber-400 border border-slate-700 px-2 py-0.5 rounded-md">
                    {req.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
                  <span className="text-slate-500">{req.time}</span>
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>{req.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
