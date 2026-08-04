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
    setRequests(requests.map(req => {
      if (req.id === reqId) {
        return {
          ...req,
          repliesCount: req.repliesCount + 1,
          replies: [...req.replies, { vendorName: userName || 'تاجر', vendorPhone: userPhone, message: text }]
        };
      }
      return req;
    }));
    setReplyInput({ ...replyInput, [reqId]: '' });
  };

  if (!isRegistered) {
    return (
      <div style={{ backgroundColor: '#091122', color: '#fff', minHeight: '100vh', padding: '20px', direction: 'rtl' }}>
        <h2>Thiqua ⚡</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="الاسم" value={userName} onChange={e => setUserName(e.target.value)} style={{ width: '100%', margin: '8px 0', padding: '10px' }} />
          <input type="tel" placeholder="رقم الهاتف" value={userPhone} onChange={e => setUserPhone(e.target.value)} style={{ width: '100%', margin: '8px 0', padding: '10px' }} />
          <button type="submit" style={{ width: '100%', background: '#f59e0b', padding: '10px', fontWeight: 'bold' }}>دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#091122', color: '#fff', minHeight: '100vh', direction: 'rtl', padding: '15px', paddingBottom: '80px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <b style={{ color: '#f59e0b', fontSize: '18px' }}>Thiqua ⚡</b>
        <span>📍 {city} | 👤 {userName}</span>
      </header>

      {activeTab === 'client' && (
        <div>
          <h3>شنو كتقلب عليه؟ 🔍</h3>
          <textarea value={needText} onChange={e => setNeedText(e.target.value)} placeholder="كتب السلعة هنا..." style={{ width: '100%', padding: '10px' }} />
          <button onClick={handleSendRequest} style={{ width: '100%', background: '#f59e0b', padding: '10px', marginTop: '8px', fontWeight: 'bold' }}>إرسال الطلب</button>
          
          <h4 style={{ marginTop: '20px' }}>الطلبات:</h4>
          {requests.map(r => (
            <div key={r.id} style={{ background: '#111c35', padding: '10px', margin: '8px 0', borderRadius: '8px' }}>
              <b>{r.need}</b> ({r.category})
              {r.replies.map((rep, idx) => (
                <div key={idx} style={{ background: '#091122', padding: '5px', marginTop: '5px' }}>
                  <span>🏪 {rep.vendorName}: {rep.message}</span>
                  <a href={`https://wa.me/${formatPhone(rep.vendorPhone)}`} style={{ color: '#25D366', marginRight: '10px' }}>واتساب</a>
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
            <div key={r.id} style={{ background: '#111c35', padding: '10px', margin: '8px 0', borderRadius: '8px' }}>
              <p><b>{r.clientName}:</b> {r.need}</p>
              <input type="text" placeholder="جوابك..." value={replyInput[r.id] || ''} onChange={e => setReplyInput({ ...replyInput, [r.id]: e.target.value })} />
              <button onClick={() => handleVendorReply(r.id)} style={{ background: '#22c55e', color: '#fff', padding: '5px 10px', marginRight: '5px' }}>إرسال</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'map' && (
        <div>
          <h3>الخريطة والمحلات 🗺️</h3>
          {requests.flatMap(r => r.replies).map((rep, i) => (
            <div key={i} style={{ background: '#111c35', padding: '10px', margin: '8px 0' }}>
              <b>🏪 {rep.vendorName}</b>: {rep.message}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'profile' && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3>👤 {userName}</h3>
          <p>📞 {userPhone}</p>
          <button onClick={() => { localStorage.clear(); setIsRegistered(false); }} style={{ background: '#ef4444', color: '#fff', padding: '8px' }}>تسجيل الخروج</button>
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0d1527', display: 'flex', justifyContent: 'space-around', padding: '12px' }}>
        <button onClick={() => setActiveTab('client')} style={{ color: activeTab === 'client' ? '#f59e0b' : '#fff', background: 'none', border: 'none' }}>الزبون</button>
        <button onClick={() => setActiveTab('vendor')} style={{ color: activeTab === 'vendor' ? '#f59e0b' : '#fff', background: 'none', border: 'none' }}>التاجر</button>
        <button onClick={() => setActiveTab('map')} style={{ color: activeTab === 'map' ? '#f59e0b' : '#fff', background: 'none', border: 'none' }}>الخريطة</button>
        <button onClick={() => setActiveTab('profile')} style={{ color: activeTab === 'profile' ? '#f59e0b' : '#fff', background: 'none', border: 'none' }}>البروفايل</button>
      </nav>
    </div>
  );
        }
      
