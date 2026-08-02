import React, { useState, useEffect } from 'react';
import { MapPin, Send, CheckCircle2, Clock, Phone, MessageSquare, Store, User, PlusCircle, X, Check, Settings, LogOut, Edit3 } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'client' | 'merchant' | 'profile'>('client');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('عام');
  const [selectedReq, setSelectedReq] = useState<RequestItem | null>(null);

  const [profileName, setProfileName] = useState('محمد البوسكوري');
  const [profilePhone, setProfilePhone] = useState('0600112233');
  const [profileCity, setProfileCity] = useState('بوسكورة، الدار البيضاء');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [merchantPrice, setMerchantPrice] = useState('');
  const [merchantNotes, setMerchantNotes] = useState('');

  const [requests, setRequests] = useState<RequestItem[]>(() => {
    const saved = localStorage.getItem('kayn_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { 
        id: 1, 
        item: "دواء Synthroid 50mg", 
        status: "كاين (1 محلات)", 
        time: "منذ 5 دقائق", 
        category: "صيدلية",
        responses: [
          { id: 101, storeName: "صيدلية ابن سينا", distance: "400 متر", address: "شارع الحسن الثاني، بوسكورة", phone: "0522123456", whatsapp: "212600000000", price: "48 درهم", notes: "متوفر علبتين فقط" }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('kayn_requests', JSON.stringify(requests));
  }, [requests]);

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newReq: RequestItem = {
      id: Date.now(),
      item: query,
      status: "جاري البحث...",
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
          storeName: profileName,
          distance: "قريب منك (300m)",
          address: profileCity,
          phone: profilePhone,
          whatsapp: "212" + profilePhone.replace(/^0/, ''),
          price: merchantPrice ? `${merchantPrice} درهم` : 'الثمن حسب المعاينة',
          notes: merchantNotes || 'متوفر حالياً.'
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
    alert('تم إرسال الرد بنجاح! ✅');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24" dir="rtl">
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-xl text-xl">كِايْنْ؟</div>
          <span className="text-xs text-slate-400">الشفافية الفورية</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <MapPin className="w-3.5 h-3.5" />
          <span>بوسكورة 📍</span>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {activeTab === 'client' && (
          <div className="space-y-6">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <h2 className="text-base font-bold mb-1">شنو كتقلب عليه؟ 🔍</h2>
              <p className="text-xs text-slate-400 mb-3">كتب السلعة وسول المحلات القريبة فـ بوسكورة فـ الحين.</p>
              <form onSubmit={handleSendRequest} className="space-y-3">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="مثال: دواء، قطعة غيار..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500 resize-none h-20"
                />
                <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                  {['عام', 'صيدلية', 'قطع غيار', 'إلكترونيات'].map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg border whitespace-nowrap ${category === cat ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                  <Send className="w-4 h-4" />
                  <span>سول المحلات دابا</span>
                </button>
              </form>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" /> الطلبات والردود
              </h3>
              <div className="space-y-2">
                {requests.map((req) => (
                  <div key={req.id} onClick={() => setSelectedReq(req)} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold">{req.item}</p>
                      <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded">{req.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50">
                      <span className="text-slate-500">{req.time}</span>
                      <span className="text-amber-400 font-medium flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{req.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'merchant' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h2 className="text-base font-bold mb-1">لوحة التاجر 🏪</h2>
              <p className="text-xs text-slate-400">جاوب زبناء بوسكورة بضغطة زر.</p>
            </div>
            {requests.map((req) => (
              <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">{req.category}</span>
                    <h3 className="text-sm font-bold mt-1">{req.item}</h3>
                  </div>
                  <span className="text-[10px] text-slate-500">{req.time}</span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex gap-2">
                    <input type="text" placeholder="الثمن (درهم)" value={merchantPrice} onChange={(e) => setMerchantPrice(e.target.value)} className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none" />
                    <input type="text" placeholder="ملاحظات" value={merchantNotes} onChange={(e) => setMerchantNotes(e.target.value)} className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 focus:outline-none" />
                  </div>
                  <button onClick={() => handleMerchantRespond(req.id)} className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>إرسال "كاين عندي!"</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-2">
              <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto text-amber-400 text-xl font-bold">
                {profileName.charAt(0)}
              </div>
              <h2 className="text-base font-bold">{profileName}</h2>
              <p className="text-xs text-slate-400">{profilePhone} • 📍 {profileCity}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold flex items-center gap-1"><Edit3 className="w-3.5 h-3.5 text-amber-500" /> تعديل الملف الشخصي</h3>
                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-xs text-amber-400 font-bold">
                  {isEditingProfile ? 'حفظ' : 'تعديل'}
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <input type="text" value={profileName} disabled={!isEditingProfile} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 disabled:opacity-50" />
                <input type="text" value={profilePhone} disabled={!isEditingProfile} onChange={(e) => setProfilePhone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 disabled:opacity-50" />
                <input type="text" value={profileCity} disabled={!isEditingProfile} onChange={(e) => setProfileCity(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 disabled:opacity-50" />
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-2 z-40 max-w-md mx-auto flex justify-around">
        <button onClick={() => setActiveTab('client')} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'client' ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
          <User className="w-5 h-5" />الزبون
        </button>
        <button onClick={() => setActiveTab('merchant')} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'merchant' ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
          <Store className="w-5 h-5" />التاجر
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 text-[10px] ${activeTab === 'profile' ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
          <Settings className="w-5 h-5" />البروفايل
        </button>
      </nav>

      {selectedReq && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold">{selectedReq.item}</h3>
              <button onClick={() => setSelectedReq(null)} className="p-1 text-slate-400 bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 overflow-y-auto space-y-3">
              {selectedReq.responses.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">جاري انتظار ردود المحلات...</p>
              ) : (
                selectedReq.responses.map((res) => (
                  <div key={res.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm">{res.storeName}</h4>
                        <p className="text-xs text-slate-400">{res.address} • {res.distance}</p>
                      </div>
                      {res.price && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 rounded">{res.price}</span>}
                    </div>
                    {res.notes && <p className="text-xs text-slate-300">💬 {res.notes}</p>}
                    <div className="flex gap-2 pt-1">
                      <a href={`https://wa.me/${res.whatsapp}`} target="_blank" rel="noreferrer" className="flex-1 bg-emerald-600 text-white font-bold text-xs py-1.5 rounded text-center">واتساب</a>
                      <a href={`tel:${res.phone}`} className="flex-1 bg-slate-800 text-slate-200 font-bold text-xs py-1.5 rounded text-center border border-slate-700">اتصال</a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
      }
                             
