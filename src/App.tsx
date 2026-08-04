import React, { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { RequestItem } from './types';

export default function App() {
  const [city, setCity] = useState<string>('بوسكورة');
  const [activeTab, setActiveTab] = useState<'client' | 'vendor' | 'map' | 'profile'>('client');
  const [selectedCategory, setSelectedCategory] = useState<string>('عام');

  const [userLat, setUserLat] = useState<number>(33.4489);
  const [userLng, setUserLng] = useState<number>(-7.6486);

  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');

  const [needText, setNeedText] = useState<string>('');
  const [replyInput, setReplyInput] = useState<{ [key: number]: string }>({});

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
        },
        { 
          vendorName: 'صيدلية الرحمة', 
          vendorPhone: '0661998877', 
          message: 'متوفر أيضاً بخصم 5%',
          lat: 33.4460,
          lng: -7.6510
        }
      ]
    }
  ]);

  useEffect(() => {
    const savedName = localStorage.getItem('thiqua_name');
    const savedPhone = localStorage.getItem('thiqua_phone');
    if (savedName && savedPhone) {
      setUserName(savedName);
      setUserPhone(savedPhone);
      setIsRegistered(true);
    }
    Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 }).then(coords => {
      setUserLat(coords.coords.latitude);
      setUserLng(coords.coords.longitude);
    }).catch(() => {});
  }, []);

  const formatPhone = (phone: string) => {
    let c = phone.replace(/\D/g, '');
    return c.startsWith('0') ? '212' + c.substring(1) : c;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) return;
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
  };

  const handleVendorReply = (reqId: number) => {
    const text = replyInput[reqId];
    if (!text || !text.trim()) return;
    // إضافة موقع الجغرافي للتاجر قريب من موقع المستخدم
    const randomLatOffset = (Math.random() - 0.5) * 0.01;
    const randomLngOffset = (Math.random() - 0.5) * 0.01;

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
              lat: userLat + randomLatOffset, 
              lng: userLng + randomLngOffset 
            }
          ]
        };
      }
      return req;
    }));
    setReplyInput({ ...replyInput, [reqId]: '' });
  };

  // تجميع كل ردود التجار لمشاهدة مواقهم فـ الخريطة
  const allVendorReplies = requests.flatMap(r => r.replies);

  // إعداد خريطة Leaflet بالـ HTML المباشر
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
        .client-pin { background: #3b82f6; border: 2px solid white; border-radius: 50%; width: 15px; height: 15px; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${userLat}, ${userLng}], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        // موقع الزبون
        L.marker([${userLat}, ${userLng}]).addTo(map)
          .bindPopup("<b>📍 موقعك الحالي (الزبون)</b>").openPopup();

        // مواقف التجار
        ${allVendorReplies.map(v => `
          L.marker([${v.lat || userLat + 0.003}, ${v.lng || userLng + 0.003}]).addTo(map)
            .bindPopup("<b>🏪 ${v.vendorName}</b><br>${v.message}<br><a href='https://wa.me/${formatPhone(v.vendorPhone)}'>تواصل واتساب</a>");
        `).join('\n')}
      </script>
    </body>
    </html>
  `;

  if (!isRegistered) {
    return (
      <div style={{ backgroundColor: '#091122', color: '#fff', minHeight: '100vh', padding: '20px', direction: 'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ textAlign: 'center', color: '#f59e0b' }}>Thiqua ⚡</h2>
        <form onSubmit={handleRegister} style={{ background: '#111c35', padding: '20px', borderRadius: '12px' }}>
          <label>الاسم:</label>
          <input type="text" placeholder="الاسم" value={userName} onChange={e => setUserName(e.target.value)} style={{ width: '100%', margin: '8px 0 15px 0', padding: '10px', borderRadius: '6px', border: '1px solid #1e293b', background: '#091122', color: '#fff' }} />
          <label>رقم الهاتف:</label>
          <input type="tel" placeholder="06XXXXXXXX" value={userPhone} onChange={e => setUserPhone(e.target.value)} style={{ width: '100%', margin: '8px 0 15px 0', padding: '10px', borderRadius: '6px', border: '1px solid #1e293b', background: '#091122', color: '#fff' }} />
          <button type="submit" style={{ width: '100%', background: '#f59e0b', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>دخول التطبيق</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#091122', color: '#fff', minHeight: '100vh', direction: 'rtl', padding: '15px', paddingBottom: '80px', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <b style={{ color: '#f59e0b', fontSize: '18px' }}>Thiqua ⚡</b>
        <span style={{ fontSize: '13px', background: '#111c35', padding: '4px 10px', borderRadius: '15px' }}>📍 {city} | 👤 {userName}</span>
      </header>

      {activeTab === 'client' && (
        <div>
          <h3>شنو كتقلب عليه؟ 🔍</h3>
          <textarea value={needText} onChange={e => setNeedText(e.target.value)} placeholder="كتب السلعة هنا..." style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#111c35', color: '#fff', border: '1px solid #1d2b49', resize: 'none' }} rows={3} />
          
          <div style={{ display: 'flex', gap: '5px', margin: '10px 0' }}>
            {['عام', 'صيدلية', 'قطع غيار', 'إلكترونيات'].map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: selectedCategory === cat ? '#f59e0b' : '#111c35', color: selectedCategory === cat ? '#000' : '#8295b5', fontWeight: 'bold', fontSize: '11px' }}>
                {cat}
              </button>
            ))}
          </div>

          <button onClick={handleSendRequest} style={{ width: '100%', background: '#f59e0b', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', color: '#000', cursor: 'pointer' }}>إرسال الطلب</button>
          
          <h4 style={{ marginTop: '20px', color: '#cbd5e1' }}>الطلبات الحالية:</h4>
          {requests.map(r => (
            <div key={r.id} style={{ background: '#111c35', padding: '12px', margin: '8px 0', borderRadius: '10px', border: '1px solid #1d2b49' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b style={{ color: '#fff' }}>{r.need}</b>
                <span style={{ background: '#172440', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: '#8295b5' }}>{r.category}</span>
              </div>
              {r.replies.map((rep, idx) => (
                <div key={idx} style={{ background: '#091122', padding: '8px', marginTop: '8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px' }}>🏪 <b style={{ color: '#f59e0b' }}>{rep.vendorName}:</b> {rep.message}</span>
                  <a href={`https://wa.me/${formatPhone(rep.vendorPhone)}?text=${encodeURIComponent(`السلام عليكم، شفت الرد ديالك بخصوص: ${r.need}`)}`} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: '#fff', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>واتساب</a>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'vendor' && (
        <div>
          <h3>لوحة التجار 🏪</h3>
          {requests.map(r => (
            <div key={r.id} style={{ background: '#111c35', padding: '12px', margin: '8px 0', borderRadius: '10px', border: '1px solid #1d2b49' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>👤 <b style={{ color: '#f59e0b' }}>{r.clientName}:</b> "{r.need}"</p>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input type="text" placeholder="جوابك..." value={replyInput[r.id] || ''} onChange={e => setReplyInput({ ...replyInput, [r.id]: e.target.value })} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #1d2b49', background: '#091122', color: '#fff', fontSize: '12px' }} />
                <button onClick={() => handleVendorReply(r.id)} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>إرسال</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'map' && (
        <div>
          <h3>الخريطة التفاعلية 🗺️</h3>
          <p style={{ fontSize: '12px', color: '#8295b5' }}>📍 موقعك ومواقع التجار المتوفرين:</p>
          
          <div style={{ width: '100%', height: '320px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1d2b49', marginBottom: '15px' }}>
            <iframe
              title="Interactive Map"
              width="100%"
              height="100%"
              frameBorder="0"
              srcDoc={mapHtml}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {allVendorReplies.map((rep, i) => (
              <div key={i} style={{ background: '#111c35', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b style={{ color: '#f59e0b', fontSize: '13px' }}>🏪 {rep.vendorName}</b>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#cbd5e1' }}>{rep.message}</p>
                </div>
                <a href={`https://wa.me/${formatPhone(rep.vendorPhone)}`} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: '#fff', padding: '6px 10px', borderRadius: '6px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>تواصل</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div style={{ textAlign: 'center', padding: '20px', background: '#111c35', borderRadius: '12px' }}>
          <div style={{ fontSize: '40px' }}>👤</div>
          <h3>{userName}</h3>
          <p style={{ color: '#25D366', fontWeight: 'bold' }}>💬 {userPhone}</p>
          <p style={{ color: '#8295b5' }}>📍 {city}</p>
          <button onClick={() => { localStorage.clear(); setIsRegistered(false); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', marginTop: '10px', cursor: 'pointer' }}>تسجيل الخروج</button>
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px', background: '#0d1527', borderTop: '1px solid #1d2b49', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000 }}>
        <button onClick={() => setActiveTab('client')} style={{ color: activeTab === 'client' ? '#f59e0b' : '#64748b', background: 'none', border: 'none', fontSize: '12px' }}>👤 الزبون</button>
        <button onClick={() => setActiveTab('vendor')} style={{ color: activeTab === 'vendor' ? '#f59e0b' : '#64748b', background: 'none', border: 'none', fontSize: '12px' }}>🏪 التاجر</button>
        <button onClick={() => setActiveTab('map')} style={{ color: activeTab === 'map' ? '#f59e0b' : '#64748b', background: 'none', border: 'none', fontSize: '12px' }}>🗺️ الخريطة</button>
        <button onClick={() => setActiveTab('profile')} style={{ color: activeTab === 'profile' ? '#f59e0b' : '#64748b', background: 'none', border: 'none', fontSize: '12px' }}>⚙️ البروفايل</button>
      </nav>
    </div>
  );
                                    }
                                   
