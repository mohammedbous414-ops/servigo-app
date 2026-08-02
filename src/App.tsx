import React, { useState, useEffect } from 'react';
import { Search, MapPin, Send, CheckCircle2, Clock, Phone, MessageSquare, Store, User, PlusCircle, X, Check, Settings, LogOut, Edit3 } from 'lucide-react';

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
  lat?: number;
  lng?: number;
  responses: StoreResponse[];
}

export default function App() {
  // التبويبات: 'client' (الزبون) | 'merchant' (التاجر) | 'profile' (الملف الشخصي)
  const [activeTab, setActiveTab] = useState<'client' | 'merchant' | 'profile'>('client');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('عام');
  const [selectedReq, setSelectedReq] = useState<RequestItem | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('بوسكورة • الموقع الفعلي 📍');

  // بيانات البروفايل (تعديل من واجهة المستخدم)
  const [profileName, setProfileName] = useState('محمد البوسكوري');
  const [profilePhone, setProfilePhone] = useState('0600112233');
  const [profileCity, setProfileCity] = useState('بوسكورة، الدار البيضاء');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // الطلبات مخزنة محلياً وتتحدث فورياً
  const [requests, setRequests] = useState<RequestItem[]>(() => {
    const saved = localStorage.getItem('kayn_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { 
        id: 1, 
        item: "دواء Synthroid 50mg", 
        status: "كاين (3 محلات)", 
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

  // نموذج التاجر
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
          storeName: profileName,
          distance: "قريب منك (300m)",
          address: profileCity,
          phone: profilePhone,
          whatsapp: "212" + profilePhone.replace(/^0/, ''),
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24" dir="rtl">
      
      {/* Header / الهيدر العلوي */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 p-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-xl text-xl tracking-wider shadow-lg shadow-amber-500/20">
            كِايْنْ؟
          </div>
          <span className="text-[11px] text-slate-400 font-medium">الشفافية الفورية</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <MapPin className="w-3.5 h-3.5" />
          <span>{locationStatus}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* --- 1. وضع الزبون --- */}
        {activeTab === 'client' && (
          <div className="space-y-6 animate-fadeIn">
            <section className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <h2 className="text-lg font-bold text-slate-100 mb-1">شنو كتقلب عليه ودكّاتي؟ 🔍</h2>
              <p className="text-xs text-slate-400 mb-4">كتب السلعة ولا الدواء، والبرنامج غيسول المحلات القريبة فـ بوسكورة فـ الحين.</p>

              <form onSubmit={handleSendRequest} className="space-y-3">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="مثال: دواء معين، قطعة غيار سيارة، أداة منزلية..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none h-24"
                />

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

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  الطلبات النشطة والردود
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
          </div>
        )}

        {/* --- 2. وضع التاجر --- */}
        {activeTab === 'merchant' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h2 className="text-base font-bold text-slate-100 mb-1">لوحة تحكم التاجر 🏪</h2>
              <p className="text-xs text-slate-400">هاد الطلبات كيوصلوك من الزبائن فـ بوسكورة. جاوبهم بضغطة زر لزيادة مبيعاتك.</p>
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
                        placeholder="ملاحظات (متوفر حالياً...)"
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
          </div>
        )}

        {/* --- 3. صفحة الملف الشخصي (Profile) --- */}
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-fadeIn">
            {/* بطاقة البروفايل الرئيسية */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-3">
              <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto text-amber-400 text-2xl font-black shadow-lg shadow-amber-500/10">
                {profileName.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">{profileName}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{profilePhone} • 📍 {profileCity}</p>
              </div>
              <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] px-3 py-1 rounded-full font-medium">
                🏪 حساب تاجر / زبون نشط
              </span>
            </div>

            {/* تعديل معلومات الحساب */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5 text-amber-500" /> معلومات الحساب والمحل
                </h3>
                <button 
                  onClick={() => {
                    if (isEditingProfile) {
                      alert('تم حفظ المعلومات بنجاح! ✅');
                    }
                    setIsEditingProfile(!isEditingProfile);
                  }}
                  className="text-xs text-amber-400 font-bold hover:underline"
                >
                  {isEditingProfile ? 'حفظ التعديلات' : 'تعديل البروفايل'}
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">الاسم / اسم المحل التجاري</label>
                  <input 
                    type="text" 
                    value={profileName} 
                    disabled={!isEditingProfile}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 disabled:opacity-60 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">رقم الهاتف / الواتساب</label>
                  <input 
                    type="text" 
                    value={profilePhone} 
                    disabled={!isEditingProfile}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 disabled:opacity-60 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">المنطقة (مثال: بوسكورة)</label>
                  <input 
                    type="text" 
                    value={profileCity} 
                    disabled={!isEditingProfile}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 disabled:opacity-60 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* إعدادات إضافية */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
              <button 
                onClick={() => alert('الإصدار 1.0.0 - تطبيق كاين؟ للبوسكورة')}
                className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl transition-all text-right flex items-center justify-between"
              >
                <span>حول التطبيق والإصدار</span>
                <span className="text-amber-400">ℹ️</span>
              </button>
              <button 
                onClick={() => alert('تم تسجيل الخروج بنجاح')}
                className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold py-2.5 px-4 rounded-xl transition-all text-right flex items-center justify-between"
              >
                <span>تسجيل الخروج</span>
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* --- شريط التنقل السفلي (Bottom Navigation) --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-2 z-40 max-w-md mx-auto flex justify-around items-center">
        <button
          onClick={() => setActiveTab('client')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            activeTab === 'client' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">الزبون</span>
        </button>

        <button
          onClick={() => setActiveTab('merchant')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            activeTab === 'merchant' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px]">التاجر</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
            activeTab === 'profile' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">البروفايل</span>
        </button>
      </nav>

      {/* نافذة عرض تفاصيل المحلات المجيبة (Popup Modal) */}
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
                  <p className="text-sm text-slate-400 font-medium">جاري البحث ومراسلة المحلات القريبة فـ بوسكورة...</p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold text-slate-400">
                    المحلات المتوفرة عندهم السلعة ({selectedReq.responses.length}):
                  </p>
                  {selectedReq.responses.map((res) => (
                    <div key={res.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm">{res.storeName}</h4>
                          <p
