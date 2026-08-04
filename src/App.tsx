import React, { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

export default function App() {
  const [city, setCity] = useState<string>('جاري تحديد مدينتك...');
  const [loading, setLoading] = useState<boolean>(true);
  
  // المراحل: 1 = GPS | 2 = اختيار نوع الحساب | 3 = إدخال المعلومات | 4 = الرئيسية
  const [step, setStep] = useState<number>(1); 

  // بيانات التسجيل
  const [userType, setUserType] = useState<'client' | 'vendor' | null>(null); // زبون أو تاجر
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>(''); // للتاجر فقط
  const [businessCategory, setBusinessCategory] = useState<string>('خدمات العامة'); // للتاجر فقط

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      const { latitude, longitude } = coordinates.coords;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`
      );
      const data = await response.json();

      if (data && data.address) {
        const detectedCity =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.state ||
          'مدينة غير معروفة';

        setCity(detectedCity);
      } else {
        setCity('المغرب');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setCity('الدار البيضاء');
    } finally {
      setLoading(false);
    }
  };

  const selectUserType = (type: 'client' | 'vendor') => {
    setUserType(type);
    setStep(3); // الانتقال لإدخال البيانات
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('يرجى ملء كافة البيانات المطلوبة');
      return;
    }
    if (userType === 'vendor' && !businessName) {
      alert('يرجى إدخال اسم المحل أو الخدمة');
      return;
    }
    setStep(4); // الانتقال للصفحة الرئيسية
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center', direction: 'rtl', minHeight: '100vh', backgroundColor: '#0f172a', color: '#ffffff' }}>
      {/* الهيدر */}
      <header style={{ background: '#1e293b', color: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '25px' }}>
        <h1 style={{ margin: 0, color: '#f59e0b', fontSize: '28px' }}>كِايْنْ؟</h1>
        <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#cbd5e1' }}>
          📍 مدينتك الحالية: <strong style={{ color: '#f59e0b' }}>{city}</strong>
        </p>
      </header>

      {/* 📍 المرحلة 1: تحديد GPS */}
      {step === 1 && (
        <main>
          {loading ? (
            <p style={{ color: '#f59e0b', fontSize: '18px' }}>⏳ جاري تحديد موقعك عبر الـ GPS...</p>
          ) : (
            <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
              <h3 style={{ color: '#ffffff', fontSize: '20px', marginTop: 0 }}>مرحباً بك في {city}! 👋</h3>
              <p style={{ color: '#94a3b8', fontSize: '15px' }}>
                تم تحديد موقعك بنجاح. اضغط على الزر للاختيار بين حساب زبون أو تاجر.
              </p>
              
              <button
                onClick={() => setStep(2)}
                style={{
                  marginTop: '15px',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#f59e0b',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                تأكيد المدينة والمتابعة ➔
              </button>
            </div>
          )}
        </main>
      )}

      {/* 👥 المرحلة 2: اختيار نوع الحساب (زبون ولا تاجر) */}
      {step === 2 && (
        <main>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '20px', marginTop: 0 }}>كيف تريد استخدام التطبيق؟ 🤔</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
              اختر نوع الحساب ليناسب احتياجاتك في مدينة <strong>{city}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* بطاقة زبون */}
              <div 
                onClick={() => selectUserType('client')}
                style={{
                  padding: '18px',
                  background: '#0f172a',
                  borderRadius: '10px',
                  border: '2px solid #3b82f6',
                  cursor: 'pointer',
                  textAlign: 'right'
                }}
              >
                <h4 style={{ margin: 0, color: '#3b82f6', fontSize: '18px' }}>🛒 أنا زبون (مشتري)</h4>
                <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
                  أبحث عن منتجات، سلع، أو خدمات وحرفيين بالقرب مني في {city}.
                </p>
              </div>

              {/* بطاقة تاجر / حرفي */}
              <div 
                onClick={() => selectUserType('vendor')}
                style={{
                  padding: '18px',
                  background: '#0f172a',
                  borderRadius: '10px',
                  border: '2px solid #f59e0b',
                  cursor: 'pointer',
                  textAlign: 'right'
                }}
              >
                <h4 style={{ margin: 0, color: '#f59e0b', fontSize: '18px' }}>🏪 أنا تاجر / مقدم خدمة</h4>
                <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
                  أريد عرض منتجاتي، محلي، أو خدماتي للزبناء في مدينة {city}.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* 📝 المرحلة 3: استمارة التسجيل حسب نوع الحساب */}
      {step === 3 && (
        <main>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ color: '#f59e0b', fontSize: '20px', marginTop: 0 }}>
              {userType === 'client' ? 'بيانات الزبون 👤' : 'بيانات التاجر / الخدمة 🏪'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* الاسم */}
              <div style={{ textAlign: 'right' }}>
                <label style={{ fontSize: '14px', color: '#cbd5e1', display: 'block', marginBottom: '5px' }}>الاسم الكامل:</label>
                <input
                  type="text"
                  placeholder="مثال: محمد العلوي"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              {/* الهاتف */}
              <div style={{ textAlign: 'right' }}>
                <label style={{ fontSize: '14px', color: '#cbd5e1', display: 'block', marginBottom: '5px' }}>رقم الهاتف:</label>
                <input
                  type="tel"
                  placeholder="06XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              {/* حقول خاصة بالتاجر */}
              {userType === 'vendor' && (
                <>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontSize: '14px', color: '#cbd5e1', display: 'block', marginBottom: '5px' }}>اسم المحل / الخدمة:</label>
                    <input
                      type="text"
                      placeholder="مثال: متجر الأمل / السباكة السريعة"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontSize: '14px', color: '#cbd5e1', display: 'block', marginBottom: '5px' }}>مجال النشاط:</label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '15px', boxSizing: 'border-box' }}
                    >
                      <option value="مواد غذائية وحوانيت">مواد غذائية وحوانيت</option>
                      <option value="خدمات وصيانة (كهرباء/سباكة)">خدمات وصيانة (كهرباء/سباكة...)</option>
                      <option value="ملابس وموضة">ملابس وموضة</option>
                      <option value="مطاعم ومأكولات">مطاعم ومأكولات</option>
                      <option value="أخرى">نشاط آخر</option>
                    </select>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '12px', backgroundColor: '#f59e0b', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
                >
                  دخول التطبيق 🚀
                </button>
              </div>

            </form>
          </div>
        </main>
      )}

      {/* 🎉 المرحلة 4: الشاشة الرئيسية بعد الدخول */}
      {step === 4 && (
        <main>
          <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #22c55e' }}>
            <h2 style={{ color: '#22c55e', fontSize: '22px', marginTop: 0 }}>مرحباً بك، {fullName}! 🎉</h2>
            
            <p style={{ color: '#94a3b8', fontSize: '15px' }}>
              نوع الحساب: <strong style={{ color: userType === 'vendor' ? '#f59e0b' : '#3b82f6' }}>
                {userType === 'vendor' ? `تاجر (${businessName})` : 'زبون'}
              </strong>
            </p>

            <div style={{ marginTop: '20px', padding: '15px', background: '#0f172a', borderRadius: '8px', textAlign: 'right' }}>
              {userType === 'client' ? (
                <div>
                  <h4 style={{ color: '#3b82f6', margin: '0 0 10px 0' }}>🔍 ماذا تبحث عنه في {city}؟</h4>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>قائمة المنتجات والخدمات المتوفرة بالقرب منك في {city} ستظهر هنا.</p>
                </div>
              ) : (
                <div>
                  <h4 style={{ color: '#f59e0b', margin: '0 0 10px 0' }}>لوحة تحكم التاجر 🏪</h4>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>مرحباً بك في متجرك "{businessName}". هنا يمكنك إضافة عروضك وخدماتك لسكان {city}.</p>
                  <button style={{ marginTop: '12px', padding: '10px 15px', backgroundColor: '#22c55e', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold' }}>
                    + إضافة منتج / خدمة جديدة
                  </button>
                </div>
              )}
            </div>

          </div>
        </main>
      )}
    </div>
  );
                }
                              
