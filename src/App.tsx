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
  replies: { vendorName: string; vendorPhone: string; message: string; lat?: number; lng?: number }[];
}

export default function App() {
  const [city, setCity] = useState<string>('بوسكورة');
  const [activeTab, setActiveTab] = useState<'client' | 'vendor' | 'map' | 'profile'>('client');
  const [selectedCategory, setSelectedCategory] = useState<string>('عام');

  // إحداثيات موقع الزبون/المستخدم
  const [userLat, setUserLat] = useState<number>(33.4489);
  const [userLng, setUserLng] = useState<number>(-7.6486);

  // بيانات المستخدم
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');

  // نص الطلب
  const [needText, setNeedText] = useState<string>('');

  // قائمة الطلبات مع المحلات والردود ومواقعهم
  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: 1,
      clientName: 'Rayan el bouhali',
      clientPhone: '0612345678',
      need: 'دواء Synthroid 50mg',
      category: 'صيدلية',
      city: 'بوسكورة',
      time: 'منذ 5 دقائق',
      repliesCount: 1,
      replies: [
        { 
          vendorName: 'صيدلية الشفاء', 
          vendorPhone: '0661223344', 
          message: 'مرحباً، الدواء متوفر بالمحل حالياً.',
          lat: 33.4510,
          lng: -7.6450
        }
      ]
    }
  ]);

  const [replyInput, setReplyInput] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    getCurrentLocation();

    const savedName = localStorage.getItem('thiqua_name');
    const savedPhone = localStorage.getItem('thiqua_phone');
    if (savedName && savedPhone) {
      setUserName(savedName);
      setUserPhone(savedPhone);
      setIsRegistered(true);
    }
  }, []);

  const getCurrentLocation = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 });
      const { latitude, longitude } = coordinates.coords;
      setUserLat(latitude);
      setUserLng(longitude);

      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`);
      const data = await response.json();
      if (data && data.address) {
        setCity(data.address.city || data.address.town || data.address.village || data.address.suburb || 'بوسكورة');
      }
    } catch (e) {
      setCity('بوسكورة');
    }
  };

  const formatWhatsAppPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '212' + cleaned.substring(1);
    }
    return cleaned;
  };

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

  const handleSendRequest = () => {
    if (!needText.trim()) return;
    const newReq: RequestItem = {
      id: Date.now(),
      clientName: userName || 'زبون',
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
    alert('تم إرسال الطلب للمحلات القريبة فـ ' + city);
  };

  const handleVendorReply = (reqId: number) => {
    const text = replyInput[reqId];
    if (!text || !text.trim()) return;

    setRequests(requests.map(req => {
      if (req.id === reqId) {
        return {
          ...req,
          repliesCount: req.repliesCount + 1,
          replies: [
            ...req.replies, 
            { 
              vendorName: userName || 'تاجر', 
              vendorPhone: userPhone, 
              message: text,
              lat: userLat + (Math.random() - 0.5) * 0.01,
              lng: userLng + (Math.random() - 0.5) * 0.01
            }
          ]
        };
      }
      return req;
    }));

    setReplyInput({ ...replyInput, [reqId]: '' });
    alert('تم إرسال ردك للزبون بنجاح وتسجيل موقعك على الخريطة!');
  };

  if (!isRegistered) {
    return (
      <div style={{ backgroundColor: '#091122', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', direction: 'rtl', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ background: '#f59e0b', display: 'inline-block', padding: '8px 20px', borderRadius: '12px', color: '#000', fontWeight: 'bold', fontSize: '22px' }}>
            Thiqua ⚡
          </div>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>مرحباً بك فـ {city} 📍</p>
        </div>

        <div style={{ background: '#111c35', padding: '20px', borderRadius: '16px', border: '1px solid #1e2942' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#fff', textAlign: 'center' }}>تسجيل الحساب المباشر 👤</h3>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1' }}>الاسم الشخصي أو اسم المحل:</label>
              <input
                type="text"
                placeholder="مثال: Rayan el bouhali"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#091122', color: '#fff', fontSize: '14px', boxSizing: 'border-box', marginTop: '4px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1' }}>رقم الواتساب للتواصل المباشر:</label>
              <input
                type="tel"
                placeholder="06XXXXXXXX"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#091122', color: '#fff', fontSize: '14px', boxSizing: 'border-box', marginTop: '4px' }}
                required
              />
            </div>
            <button
              type="submit"
              style={{ marginTop: '10px', width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#f59e0b', color: '#000', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
            >
              دخول التطبيق ➔
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#091122', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', direction: 'rtl', paddingBottom: '85px', boxSizing: 'border-box' }}>
      
      {/* 🏷️ الهيدر الفوقاني */}
      <header style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#091122' }}>
        <div style={{ background: '#f59e0b', padding: '6px 14px', borderRadius: '10px', color: '#000', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Thiqua ⚡
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ background: '#131f37', border: '1px solid #1e2d4a', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
            👤 {userName || 'زبون'}
          </div>
          <div style={{ background: '#053e2e', border: '1px solid #059669', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
            📍 {city}
          </div>
        </div>
      </header>

      {/* 📱 المحتوى الرئيسي */}
      <main style={{ padding: '0 16px' }}>

        {/* 🛒 واجهة الزبون */}
        {activeTab === 'client' && (
          <div>
            <div style={{ background: '#111c35', borderRadius: '16px', padding: '16px', border: '1px solid #1d2b49', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                شنو كتقلب عليه؟ 🔍
              </h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#8295b5' }}>كتب السلعة وسول التجار المعتمدين فـ {city} دابا.</p>

              <textarea
                rows={3}
                placeholder="مثال: دواء معين، بياسة موطور، حاجة للمنزل..."
                value={needText}
                onChange={(e) => setNeedText(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1d2b49', backgroundColor: '#091122', color: '#fff', fontSize: '13px', boxSizing: 'border-box', marginBottom: '12px', resize: 'none' }}
              />

              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto' }}>
                {['عام', 'صيدلية', 'قطع غيار', 'إلكترونيات'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: selectedCategory === cat ? '#f59e0b' : '#172440',
                      color: selectedCategory === cat ? '#000' : '#8295b5',
                      fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                      fontSize: '12px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSendRequest}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#f59e0b',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '14px',
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px' }}>🕒</span>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>الطلبات والردود</h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {requests.map((req) => (
                <div key={req.id} style={{ background: '#111c35', padding: '14px', borderRadius: '12px', border: '1px solid #1d2b49' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>{req.need}</span>
                    <span style={{ background: '#172440', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', color: '#8295b5' }}>{req.category}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>👤 {req.clientName} • {req.time}</span>
                    <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>✔</span> كاين ({req.repliesCount} محلات)
                    </div>
                  </div>

                  {req.replies.length > 0 && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #1d2b49' }}>
                      {req.replies.map((rep, idx) => (
                        <div key={idx} style={{ background: '#091122', padding: '10px', borderRadius: '8px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 'bold' }}>🏪 {rep.vendorName}: </span>
                            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>{rep.message}</span>
                          </div>
                          <a
                            href={`https://wa.me/${formatWhatsAppPhone(rep.vendorPhone)}?text=${encodeURIComponent(`السلام عليكم، شفت الرد ديالك على تضيقة في تطبيق Thiqua بخصوص: ${req.need}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ background: '#25D366', color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            💬 واتساب
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

        {/* 🏪 واجهة التاجر */}
        {activeTab === 'vendor' && (
          <div>
            <div style={{ background: '#111c35', borderRadius: '14px', padding: '14px', border: '1px solid #1d2b49', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '15px' }}>لوحة التجار فـ {city} 🏪</h3>
              <p style={{ margin: '4px 0 0 0', color: '#8295b5', fontSize: '12px' }}>شاهد طلبات الزبناء وجاوبهم "كاينا عندي".</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {requests.map((req) => (
                <div key={req.id} style={{ background: '#111c35', padding: '14px', borderRadius: '12px', border: '1px solid #1d2b49' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px' }}>👤 {req.clientName} ({req.category})</span>
                    <a
                      href={`https://wa.me/${formatWhatsAppPhone(req.clientPhone)}?text=${encodeURIComponent(`السلام عليكم، أنا تاجر فـ Thiqua بخصوص طلبك: ${req.need}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#25D366', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      💬 واتساب
                    </a>
                  </div>
                  <p style={{ margin: '0 0 10px 0', color: '#cbd5e1', fontSize: '13px', background: '#091122', padding: '8px 10px', borderRadius: '6px' }}>
                    "{req.need}"
                  </p>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="جاوب الزبون: (مثال: كاينا عندي، الثمن...)"
                      value={replyInput[req.id] || ''}
                      onChange={(e) => setReplyInput({ ...replyInput, [req.id]: e.target.value })}
                      style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #1d2b49', backgroundColor: '#091122', color: '#fff', fontSize: '12px' }}
                    />
                    <button
                      onClick={() => handleVendorReply(req.id)}
                      style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                    >
                      جاوب 👍
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🗺️ واجهة الخريطة التفاعلية */}
        {activeTab === 'map' && (
          <div>
            <div style={{ background: '#111c35', borderRadius: '14px', padding: '14px', border: '1px solid #1d2b49', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '15px' }}>خريطة المحلات المتوفرة 🗺️</h3>
              <p style={{ margin: '4px 0 0 0', color: '#8295b5', fontSize: '12px' }}>قائمة المحلات فـ {city} اللي أكدوا توفر المنتجات المطلوبة.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {requests.map(req => 
                req.replies.map((rep, idx) => (
                  <div key={idx} style={{ background: '#111c35', padding: '14px', borderRadius: '12px', border: '1px solid #1d2b49', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ background: '#f59e0b', color: '#000', borderRadius: '50%', padding: '2px 8px', fontSize: '12px', fontWeight: 'bold' }}>🏪</span>
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#fff' }}>{rep.vendorName}</h4>
                      </div>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#cbd5e1' }}>السلعة: <span style={{ color: '#f59e0b' }}>{req.need}</span></p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#8295b5' }}>💬 {rep.message}</p>
                    </div>

                    <a
                      href={`https://wa.me/${formatWhatsAppPhone(rep.vendorPhone)}?text=${encodeURIComponent(`السلام عليكم، شفت المحل ديالك فـ خريطة Thiqua بخصوص: ${req.need}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: '#25D366', color: '#fff', textDecoration: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      💬 التواصل
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ⚙️ واجهة البروفايل */}
        {activeTab === 'profile' && (
          <div style={{ background: '#111c35', padding: '20px', borderRadius: '16px', border: '1px solid #1d2b49', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>👤</div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>{userName}</h3>
            <p style={{ color: '#25D366', fontSize: '13px', margin: '4px 0', fontWeight: 'bold' }}>💬 {userPhone}</p>
            <p style={{ color: '#8295b5', fontSize: '12px' }}>📍 المدينة: {city}</p>
            <button
              onClick={() => { localStorage.clear(); setIsRegistered(false); }}
              style={{ marginTop: '12px', background: '#ef4444', co
