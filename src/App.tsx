import React, { useState, useEffect } from 'react';
import { Search, MapPin, Send, CheckCircle2, Clock, Phone, MessageSquare, Store, User, PlusCircle, X, Check } from 'lucide-react';

interface StoreResponse {
  id: number;
  storeName: string;
  distance: string;
  address: string;
  phone: string;
  whatsapp: string;
  price?: string;
  notes?: string;
}

interface RequestItem {
  id: number;
  item: string;
  status: string;
  time: string;
  category: string;
  responses: StoreResponse[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'client' | 'merchant'>('client');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('عام');
  const [selectedReq, setSelectedReq] = useState<RequestItem | null>(null);

  // تخزين الطلبات باش تيبقىو فالتطبيق
  const [requests, setRequests] = useState<RequestItem[]>([
    { 
      id: 1, 
      item: "دواء Synthroid 50mg", 
      status: "كاين (3 محلات)", 
      time: "منذ 5 دقائق", 
      category: "صيدلية",
      responses: [
        { id: 101, storeName: "صيدلية ابن سينا", distance: "400 متر", address: "شارع الحسن الثاني، بوسكورة", phone: "0522123456", whatsapp: "212600000000", price: "48 درهم", notes: "متوفر علبتين فقط" },
        { id: 102, storeName: "صيدلية الأمل", distance: "1.2 كلم", address: "حي الازدهار، بوسكورة", phone: "0522987654", whatsapp: "212611111111", price: "48 درهم" }
      ]
    },
    { 
      id: 2, 
      item: "مكثف مكيف سيارة Golf 7 موديل 2016", 
      status: "في انتظار الردود...", 
      time: "منذ 12 دقيقة", 
      category: "قطع غيار",
      responses: []
    },
  ]);

  // نموذج إضافة رد من طرف التاجر
  const [merchantPrice, setMerchantPrice] = useState('');
  const [merchantNotes, setMerchantNotes] = useState('');

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newReq: RequestItem = {
      id: Date.now(),
      item: query,
      status: "جاري البحث عند المحلات القريبة...",
      time: "الآن",
      category: category,
      responses: []
    };

    setRequests([newReq, ...requests]);
    setQuery('');
  };

  const handleMerchantRespond = (reqId: number) => {
    setRequests(requests.map(req => {
      if (req.id === reqId) {
        const newResponse: StoreResponse = {
          id: Date.now(),
          storeName: "محلي التجاري (بوسكورة)",
          distance: "قريب منك",
          address: "شارع الرئيسية، بوسكورة",
          phone: "0600000000",
          whatsapp: "212600000000",
          price: merchantPrice ? `${merchantPrice} درهم` : 'الثمن حسب المعاينة',
          notes: merchantNotes || 'مرحبًا بك، السلعة متوفرة حالياً.'
        };
        return {
          ...req,
          status: `كاين (${req.responses.length + 1} محلات)`,
          responses: [newResponse, ...req.responses]
        };
      }
      return req;
    }));

    setMerchantPrice('');
    setMerchantNotes('');
    alert('تم إرسال الرد بنجاح للزبون! ✅');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20" dir="rtl">
      {/* Header / الهيدر */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 p-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-xl text-xl tracking-wider shadow-lg shadow-amber-500/20">
            كِايْنْ؟
          </div>
          <span className="text-[11px] text-slate-400 font-medium">شبكة التوفر الفوري</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <MapPin className="w-3.5 h-3.5" />
          <span>بوسكورة</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* التبديل بين وضع الزبون ووضع التاجر */}
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex gap-1">
          <button
            onClick={() => setActiveTab('client')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'client'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>وضع الزبون (كنقلب)</span>
          </button>
          <button
            onClick={() => setActiveTab('merchant')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'merchant'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>وضع التاجر (عندي السلعة)</span>
          </button>
        </div>

        {activeTab === 'client' ? (
          <>
            {/* بطاقة إرسال الطلب */}
            <section className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <h2 className="text-lg font-bold text-slate-100 mb-1">شنو كتقلب عليه ودكّاتي؟ 🔍</h2>
              <p className="text-xs text-slate-400 mb-4">كتب السلعة ولا الدواء، والبرنامج غيسول المحلات القريبة منك فـ الحين.</p>

              <form onSubmit={handleSendRequest} className="space-y-3">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="مثال: كنقلب على زيت موتور 5w30 ولا بياسة تليفون..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none h-24"
                />

                {/* الفئات */}
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

            {/* قائمة الطلبات */}
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
                  <div 
                    key={req.id} 
                    onClick={() => setSelectedReq(req)}
                    className="bg-slate-900 border border-slate-800/80 hover:border-amber-500/50 rounded-xl p-3.5 space-y-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
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
          </>
        ) : (
          /* وضع التاجر: مشاهدة طلبات الزبائن والرد عليها */
          <section className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h2 className="text-base font-bold text-slate-100 mb-1">لوحة تحكم التاجر 🏪</h2>
              <p className="text-xs text-slate-400">هاد الطلبات كيوصلوك من الزبائن فـ منطقتك (بوسكورة)، جاوبهم بسرعة لزيادة مبيعاتك.</p>
            </div>

            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        {req.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100 mt-1">{req.item}</h3>
                    </div>
                    <span className="text-[10px] text-slate-500">{req.time}</span>
                  </div>

                  {/* نموذج الرد السريع للتاجر */}
                  <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-2.5">
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> عندك هاد السلعة؟ جاوب الزبون دابا:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="الثمن (مثال: 50 درهم)"
                        value={merchantPrice}
                        onChange={(e) => setMerchantPrice(e.target.value)}
                        className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="ملاحظات (متوفر، كاين علبتين...)"
                        value={merchantNotes}
                        onChange={(e) => setMerchantNotes(e.target.value)}
                        className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      onClick={() => handleMerchantRespond(req.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>إرسال "كاين عندي!" للزبون</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* النافذة المنبثقة لتفاصيل المحلات (للزبون) */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden">
            
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0">
              <div>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md font-medium">
                  {selectedReq.category}
                </span>
                <h3 className="text-base font-bold text-slate-100 mt-1">{selectedReq.item}</h3>
              </div>
              <button 
                onClick={() => setSelectedReq(null)}
                className="p-2 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {selectedReq.responses.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <Clock className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
                  <p className="text-sm text-slate-400 font-medium">جاري البحث ومراسلة المحلات القريبة...</p>
                  <p className="text-xs text-slate-600">يمكنك تجربة "وضع التاجر" في الأعلى لتجربة الرد بنفسك!</p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-slate-400">
                    المحلات اللي متوفرة عندهم السلعة ({selectedReq.responses.length}):
                  </p>
                  {selectedReq.responses.map((res) => (
                    <div key={res.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm">{res.storeName}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-amber-500" />
                            {res.address} • <span className="text-amber-400">{res.distance}</span>
                          </p>
                        </div>
                        {res.price && (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs px-2.5 py-1 rounded-lg">
                            {res.price}
                          </span>
                        )}
                      </div>

                      {res.notes && (
                        <p className="text-xs bg-slate-900 p-2 rounded-lg text-slate-300 border border-slate-800/50">
                          💬 {res.notes}
                        </p>
                      )}

                      <div className="flex gap-2 pt-1">
                        <a
                          href={`https://wa.me/${res.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                        <a
                          href={`tel:${res.phone}`}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>اتصال</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
          }
          
