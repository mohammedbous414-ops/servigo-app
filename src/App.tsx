import React, { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

interface RequestItem {
  id: number;
  clientName: string;
  clientPhone: string;
  need: string;
  category: string;
  city: string;
  time: string;
  repliesCount: number;
  replies: { vendorName: string; vendorPhone: string; message: string }[];
}

export default function App() {
  const [city, setCity] = useState<string>('جاري تحديد موقعك...');
  const [activeTab, setActiveTab] = useState<'client' | 'vendor' | 'profile'>('client');
  const [selectedCategory, setSelectedCategory] = useState<string>('عام');

  // بيانات المستخدم (الاسم ورقم الهاتف)
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');

  // نص الطلب الجديد للزبون
  const [needText, setNeedText] = useState<string>('');

  // قائمة الطلبات التفاعلية
  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: 1,
      clientName: 'أحمد',
      clientPhone: '0612345678',
      need: 'دواء Synthroid 50mg',
      category: 'صيدلية',
      city: 'بوسكورة',
      time: 'منذ 5 دقائق',
      repliesCount: 1,
      replies: [
        { vendorName: 'صيدلية الشفاء', vendorPhone: '0661223344', message: 'مرحباً، الدواء متوفر بالمحل حالياً.' }
      ]
    }
  ]);

  // مدخلات رد التاجر
  const [replyInput, setReplyInput] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    // 1. تحديد موقع الـ GPS تلقائياً
    getCurrentLocation();

    // 2. التحقق من وجود حساب مسجل سابقاً في الهاتف
    const savedName = localStorage.getItem('thiqua_name');
    const savedPhone = localStorage.getItem('thiqua_phone');
    if (savedName && savedPhone) {
      setUserName(savedName);
      setUserPhone(savedPhone);
      setIsRegistered(true);
    }
  }, []);

  // دالة تحديد الموقع عبر Geolocation
  const getCurrentLocation = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 });
      const { latitude, longitude } = coordinates.coords;
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`);
      const data = await response.json();
      if (data && data.address) {
        setCity(data.address.city || data.address.town || data.address.village || data.address.suburb || 'بوسكورة');
      } else {
        setCity('بوسكورة');
      }
    } catch (e) {
      setCity('بوسكورة');
    }
  };

  // حفظ الاسم ورقم الهاتف أول مرة
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      alert('يرجى كتابة الاسم ورقم الهاتف للتواصل');
      return;
    }
    localStorage.setItem('thiqua_name', userName);
    localStorage.setItem('thiqua_phone', userPhone);
    setIsRegistered(true);
  };

  // إرسال طلب جديد من الزبون
  const handleSendRequest = () => {
    if (!needText.trim()) return;
    const newReq: RequestItem = {
      id: Date.now(),
      clientName: userName,
      clientPhone: userPhone,
      need: needText,
      category: selectedCategory,
      city: city,
      time: 'الآن',
      repliesCount: 0,
      replies: []
    };
    setRequests([newReq, ...requests]);
    setNeedText('');
    alert('تم إرسال الطلب للمحلات والتجار القريبين منك فـ ' + city);
  };

  // إرسال رد "كاينا عندي" من التاجر
  const handleVendorReply = (reqId: number) => {
    const text = replyInput[reqId];
    if (!text || !text.trim()) return;

    setRequests(requests.map(req => {
      if (req.id === reqId) {
        return {
          ...req,
          repliesCount: req.repliesCount + 1,
          replies: [...req.replies, { vendorName: userName, vendorPhone: userPhone, message: text }]
        };
      }
      return req;
    }));

    setReplyInput({ ...replyInput, [reqId]: '' });
    alert('تم إرسال ردك للزبون بنجاح!');
  };

  // 1️⃣ شاشة الدخول الأولى (تسجيل الاسم ورقم الهاتف)
  if (!isRegistered) {
    return (
      <div style={{ backgroundColor: '#0b1329', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', direction: 'rtl', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ background: '#f59e0b', display: 'inline-block', padding: '8px 24px', borderRadius: '14px', color: '#000', fontWeight: 'bold', fontSize: '28px', marginBottom: '10px' }}>
            ⚡ Thiqua
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>مرحباً بك فـ {city} 📍</p>
        </div>

        <div style={{ background: '#131d38', padding: '20px', borderRadius: '16px', border: '1px solid #1e2942' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#fff', textAlign: 'center' }}>تسجيل الحساب المباشر 👤</h3>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1' }}>الاسم الشخصي أو اسم المحل:</label>
              <input
                type="text"
                placeholder="مثال: يوسف البوهالي"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0b132b', color: '#fff', fontSize: '14px', boxSizing: 'border-box', marginTop: '4px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1' }}>رقم الهاتف للتواصل المباشر:</label>
              <input
                type="tel"
                placeholder="06XXXXXXXX"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0b132b', color: '#fff', fontSize: '14px', boxSizing: 'border-box', marginTop: '4px' }}
                required
              />
            </div>
            <button
              type="submit"
              style={{ marginTop: '10px', width: '100%', padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#f59e0b', color: '#000', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
            >
              دخول التطبيق ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2️⃣ الواجهة الرئيسية للتطبيق
  return (
    <div style={{ backgroundColor: '#0b1329', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', direction: 'rtl', paddingBottom: '70px', boxSizing: 'border-box' }}>
      
      {/* 🏷️ الهيدر الفوقاني المطابق للصورة بـ ⚡ Thiqua */}
      <header style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0b1329' }}>
        
        {/* اللوغو الأصلي مع البرق ⚡ */}
        <div style={{ background: '#f59e0b', padding: '6px 16px', borderRadius: '12px', color: '#000', fontWeight: 'bold', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>⚡</span> Thiqua
        </div>

        {/* معلومات المستخدم والمدينة من ה-GPS */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '6px 10px', borderRadius: '20px', fontSize: '12px', color: '#94a3b8' }}>
            👤 {userName}
          </div>
          <div style={{ background: '#064e3b', border: '1px solid #10b981', padding: '6px 10px', borderRadius: '20px', fontSize: '12px', color: '#34d399' }}>
            📍 {city}
          </div>
        </div>
      </header>

      {/* 📱 المحتوى الرئيسي */}
      <main style={{ padding: '0 15px' }}>

        {/* 🛒 1. واجهة الزبون */}
        {activeTab === 'client' && (
          <div>
            {/* بطاقة نشر الطلب */}
            <div style={{ background: '#131d38', borderRadius: '16px', padding: '20px', border: '1px solid #1e2942', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#fff' }}>شنو كتقلب عليه؟ 🔍</h3>
              <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#94a3b8' }}>كتب السلعة وسول التجار المعتمدين فـ {city} دابا.</p>

              <textarea
                rows={3}
                placeholder="مثال: دواء معين، بياسة موطور، حاجة للمنزل..."
                value={needText}
                onChange={(e) => setNeedText(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', backgroundColor: '#0b132b', color: '#fff', fontSize: '14px', boxSizing: 'border-box', marginBottom: '15px', resize: 'none' }}
              />

              {/* أزرار التصنيفات التفاعلية */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto' }}>
                {['عام', 'صيدلية', 'قطع غيار', 'إلكترونيات'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: selectedCategory === cat ? '#f59e0b' : '#1e293b',
                      color: selectedCategory === cat ? '#000' : '#94a3b8',
                      fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* زر إرسال الطلب بالبرق ⚡ */}
              <button
                onClick={handleSendRequest}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#f59e0b',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>⚡</span> إرسال الطلب للمحلات القريبة
              </button>
            </div>

            {/* قسم الطلبات والردود الحية */}
            <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#cbd5e1' }}>⏱️ الطلبات والردود</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {requests.map((req) => (
                <div key={req.id} style={{ background: '#131d38', padding: '15px', borderRadius: '12px', border: '1px solid #1e2942' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{req.need}</span>
                    <span style={{ background: '#1e293b', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', color: '#94a3b8' }}>{req.category}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>👤 {req.clientName} • {req.time}</span>
                    <div style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 'bold' }}>
                      ✔ كاين ({req.repliesCount} محلات)
                    </div>
                  </div>

                  {/* قائمة ردود التجار */}
                  {req.replies.length > 0 && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #1e293b' }}>
                      {req.replies.map((rep, idx) => (
                        <div key={idx} style={{ background: '#0b132b', padding: '8px 12px', borderRadius: '8px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 'bold' }}>🏪 {rep.vendorName}: </span>
                            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{rep.message}</span>
                          </div>
                          <a href={`tel:${rep.vendorPhone}`} style={{ background: '#22c55e', color: '#fff', textDecoration: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                            📞 اتصل
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🏪 2. واجهة التاجر */}
        {activeTab === 'vendor' && (
          <div>
            <div style={{ background: '#131d38', borderRadius: '16px', padding: '15px', border: '1px solid #1e2942', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '16px' }}>لوحة التجار فـ {city} 🏪</h3>
              <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>شاهد طلبات الزبناء وجاوبهم "كاينا عندي".</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {requests.map((req) => (
                <div key={req.id} style={{ background: '#131d38', padding: '15px', borderRadius: '12px', border: '1px solid #1e2942' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>👤 {req.clientName} ({req.category})</span>
                    <a href={`tel:${req.clientPhone}`} style={{ color: '#22c55e', fontSize: '12px', textDecoration: 'none' }}>📞 {req.clientPhone}</a>
                  </div>
                  <p style={{ margin: '0 0 10px 0', color: '#cbd5e1', fontSize: '14px', background: '#0b132b', padding: '10px', borderRadius: '8px' }}>
                    "{req.need}"
                  </p>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="جاوب الزبون: (مثال: كاينا عندي، الثمن...)"
                      value={replyInput[req.id] || ''}
                      onChange={(e) => setReplyInput({ ...replyInput, [req.id]: e.target.value })}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0b132b', color: '#fff', fontSize: '12px' }}
                    />
                    <button
                      onClick={() => handleVendorReply(req.id)}
                      style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                    >
                      قول ليه: كاينا 👍
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ⚙️ 3. واجهة البروفايل */}
        {activeTab === 'profile' && (
          <div style={{ background: '#131d38', padding: '20px', borderRadius: '16px', border: '1px solid #1e2942', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👤</div>
            <h3 style={{ margin: 0, color: '#fff' }}>{userName}</h3>
            <p style={{ color: '#22c55e', fontSize: '14px', margin: '5px 0' }}>📱 {userPhone}</p>
            <p style={{ color: '#94a3b8', fontSize: '12px' }}>📍 المدينة الحالية: {city}</p>
            <button
              onClick={() => { localStorage.clear(); setIsRegistered(false); }}
              style={{ marginTop: '15px', background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
            >
              تغير الاسم أو الرقم
            </button>
          </div>
        )}

      </main>

      {/* 🧭 شريط التنقل السفلي الأصلي (Bottom Navigation Bar) */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#0b1329',
        borderTop: '1px solid #1e2942',
        display: 'flex',
        justify: 'space-around',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div
          onClick={() => setActiveTab('client')}
          style={{ cursor: 'pointer', textAlign: 'center', color: activeTab === 'client' ? '#f59e0b' : '#64748b' }}
        >
          <div style={{ fontSize: '18px' }}>👤</div>
          <div style={{ fontSize: '11px', fontWeight: activeTab === 'client' ? 'bold' : 'normal' }}>الزبون</div>
        </div>

        <div
          onClick={() => setActiveTab('vendor')}
          style={{ cursor: 'pointer', textAlign: 'center', color: activeTab === 'vendor' ? '#f59e0b' : '#64748b' }}
        >
          <div style={{ fontSize: '18px' }}>🏪</div>
          <div style={{ fontSize: '11px', fontWeight: activeTab === 'vendor' ? 'bold' : 'normal' }}>التاجر</div>
        </div>

        <div
          onClick={() => setActiveTab('profile')}
          style={{ cursor: 'pointer', textAlign: 'center', color: activeTab === 'profile' ? '#f59e0b' : '#64748b' }}
        >
          <div style={{ fontSize: '18px' }}>⚙️</div>
          <div style={{ fontSize: '11px', fontWeight: activeTab === 'profile' ? 'bold' : 'normal' }}>البروفايل</div>
        </div>
      </nav>

    </div>
  );
}
