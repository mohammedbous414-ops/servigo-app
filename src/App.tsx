/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ChatMessage,
  Driver,
  DriverOffer,
  Language,
  PromoCode,
  RideRequest,
  ToastAlert,
  UserProfile,
  UserRole,
  WalletTransaction,
  WithdrawalRequest,
} from './types';
import {
  INITIAL_DRIVERS,
  INITIAL_PROMO_CODES,
  INITIAL_RIDE_REQUESTS,
  INITIAL_TRANSACTIONS,
} from './data/mockData';
import { AppHeader } from './components/AppHeader';
import { RiderApp } from './components/RiderApp';
import { DriverApp } from './components/DriverApp';
import { AdminDashboard } from './components/AdminDashboard';
import { OfficialWebsite } from './components/OfficialWebsite';
import { WalletModal } from './components/WalletModal';
import { ChatModal } from './components/ChatModal';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { FirebaseAuthModal } from './components/FirebaseAuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { TripHistoryModal } from './components/TripHistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { LegalAndSupportModal } from './components/LegalAndSupportModal';
import { GooglePlayReleaseKitModal } from './components/GooglePlayReleaseKitModal';
import { Wifi, Battery, Signal, Bell, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [currentRole, setCurrentRole] = useState<UserRole>('rider');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // App Master States
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'usr-default',
    name: 'أمين الفاسي',
    email: 'amine.elfassi@servigo.ma',
    phone: '0661234567',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
    role: 'rider',
    authProvider: 'phone',
    isPhoneVerified: true,
    rating: 5.0,
    totalTrips: 18,
    createdAt: '2026-01-10T10:00:00Z',
  });

  // Modal States
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(false);
  const [isReleaseKitOpen, setIsReleaseKitOpen] = useState<boolean>(false);

  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [activeRequest, setActiveRequest] = useState<RideRequest | null>(INITIAL_RIDE_REQUESTS[0]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [walletBalance, setWalletBalance] = useState<number>(180);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
    {
      id: 'w-1',
      userId: 'd1',
      userName: 'يوسف العمراني (سائق)',
      userRole: 'driver',
      amountMAD: 200,
      paymentMethod: 'cih',
      accountDetails: 'RIB: 230 780 0001234567890123 45',
      status: 'pending',
      createdAt: '2026-07-31T12:00:00Z',
    },
  ]);

  // Firebase FCM Toast Notifications State
  const [toasts, setToasts] = useState<ToastAlert[]>([]);

  const triggerFcmNotification = (title: string, body: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newToast: ToastAlert = {
      id: `toast-${Date.now()}`,
      title,
      body,
      type,
      timestamp: new Date().toISOString(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 3));
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modals
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      rideId: 'ride-101',
      senderRole: 'driver',
      senderName: 'يوسف العمراني',
      text: 'مرحباً، أنا في الطريق إليك عند Twin Center',
      timestamp: new Date().toISOString(),
    },
  ]);

  // Adjust HTML Document RTL/LTR and Font according to selected language
  useEffect(() => {
    const isRtl = lang === 'ar' || lang === 'darija';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Automatically simulate incoming driver offers when a rider posts a ride
  useEffect(() => {
    if (!activeRequest || activeRequest.status !== 'searching') return;

    const timer = setTimeout(() => {
      // Driver Youssef offers counter price
      const offer1: DriverOffer = {
        id: `off-${Date.now()}-1`,
        requestId: activeRequest.id,
        driverId: 'd1',
        driverName: 'يوسف العمراني (Youssef)',
        driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        driverRating: 4.9,
        driverTrips: 342,
        carModel: 'Dacia Logan 2022',
        carColor: 'أبيض',
        plateNumber: '48210 - أ - 6',
        proposedFare: activeRequest.proposedFare,
        etaMinutes: 4,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      const offer2: DriverOffer = {
        id: `off-${Date.now()}-2`,
        requestId: activeRequest.id,
        driverId: 'd2',
        driverName: 'مهدي بنجلون (Mehdi)',
        driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        driverRating: 4.85,
        driverTrips: 215,
        carModel: 'Peugeot 208',
        carColor: 'رمادي',
        plateNumber: '19403 - ب - 6',
        proposedFare: activeRequest.proposedFare + 5,
        etaMinutes: 7,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      setActiveRequest((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'negotiating',
          offers: [offer1, offer2],
        };
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [activeRequest?.status]);

  // Rider Action: Post new ride request
  const handleRequestRide = (requestData: Omit<RideRequest, 'id' | 'createdAt' | 'status' | 'offers'>) => {
    const newRide: RideRequest = {
      ...requestData,
      id: `ride-${Date.now()}`,
      status: 'searching',
      createdAt: new Date().toISOString(),
      offers: [],
    };
    setActiveRequest(newRide);
  };

  // Rider Action: Accept Driver Offer
  const handleAcceptOffer = (offer: DriverOffer) => {
    if (!activeRequest) return;
    setActiveRequest({
      ...activeRequest,
      status: 'en_route_pickup',
      assignedDriverId: offer.driverId,
      acceptedFare: offer.proposedFare,
    });
  };

  // Rider Action: Send Counter Offer to Driver
  const handleCounterOffer = (offer: DriverOffer, counterFare: number) => {
    if (!activeRequest) return;
    setActiveRequest({
      ...activeRequest,
      offers: activeRequest.offers.map((o) =>
        o.id === offer.id ? { ...o, proposedFare: counterFare, status: 'countered' } : o
      ),
    });
  };

  // Rider Action: Cancel Request
  const handleCancelRequest = () => {
    setActiveRequest(null);
  };

  // Rider Action: Complete Ride and Submit Rating
  const handleCompleteRide = (requestId: string, rating: number, tipMAD: number) => {
    if (!activeRequest) return;
    const finalFare = (activeRequest.acceptedFare || activeRequest.proposedFare) + tipMAD;

    // Deduct from wallet if wallet payment selected
    if (activeRequest.paymentMethod === 'wallet') {
      setWalletBalance((prev) => prev - finalFare);
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          userId: 'rider-1',
          userRole: 'rider',
          amount: -finalFare,
          type: 'ride_payment',
          description: `دفع قيمة رحلة ServiGo من ${activeRequest.pickup.name} إلى ${activeRequest.dropoff.name}`,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    setActiveRequest(null);
  };

  // Driver Action: Toggle Online/Offline
  const handleToggleOnline = () => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === 'd1' ? { ...d, isOnline: !d.isOnline } : d))
    );
  };

  // Driver Action: Make counter offer or accept
  const handleDriverMakeOffer = (requestId: string, proposedFare: number, etaMinutes: number) => {
    if (!activeRequest || activeRequest.id !== requestId) return;
    const currentDriverObj = drivers.find((d) => d.id === 'd1') || drivers[0];

    const newOffer: DriverOffer = {
      id: `off-${Date.now()}`,
      requestId,
      driverId: currentDriverObj.id,
      driverName: currentDriverObj.name,
      driverPhoto: currentDriverObj.photo,
      driverRating: currentDriverObj.rating,
      driverTrips: currentDriverObj.tripsCount,
      carModel: currentDriverObj.carModel,
      carColor: currentDriverObj.carColor,
      plateNumber: currentDriverObj.plateNumber,
      proposedFare,
      etaMinutes,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setActiveRequest({
      ...activeRequest,
      offers: [...activeRequest.offers.filter((o) => o.driverId !== currentDriverObj.id), newOffer],
    });
  };

  // Driver Action: Update Trip Step Status
  const handleUpdateDriverRideStatus = (
    requestId: string,
    nextStatus: 'en_route_pickup' | 'in_trip' | 'completed'
  ) => {
    if (!activeRequest) return;
    if (nextStatus === 'completed') {
      // Driver receives payout
      const fare = activeRequest.acceptedFare || activeRequest.proposedFare;
      const netEarning = fare * 0.9; // 10% platform fee
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          userId: 'd1',
          userRole: 'driver',
          amount: netEarning,
          type: 'driver_earning',
          description: `ربح صافي من رحلة الزبون ${activeRequest.riderName} (بعد عمولة 10%)`,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      setActiveRequest(null);
    } else {
      setActiveRequest({ ...activeRequest, status: nextStatus });
    }
  };

  // Admin Actions
  const handleApproveDriver = (driverId: string) => {
    setDrivers((prev) => prev.map((d) => (d.id === driverId ? { ...d, verified: true } : d)));
  };

  const handleRejectDriver = (driverId: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
  };

  const handleAddPromoCode = (newCode: PromoCode) => {
    setPromoCodes((prev) => [newCode, ...prev]);
  };

  const handleTogglePromoCode = (codeStr: string) => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.code === codeStr ? { ...p, active: !p.active } : p))
    );
  };

  // Wallet Top-up Handler
  const handleWalletTopUp = (amountMAD: number, method: string) => {
    setWalletBalance((prev) => prev + amountMAD);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        userId: 'current-user',
        userRole: currentRole,
        amount: amountMAD,
        type: 'topup',
        description: `تعبئة رصيد المحفظة عبر (${method})`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
    triggerFcmNotification(
      'تحديث المحفظة الرقمية 💰',
      `تم شحن حسابك بنجاح بمبلغ +${amountMAD} MAD. الرصيد الجديد: ${(walletBalance + amountMAD).toFixed(2)} MAD`,
      'success'
    );
  };

  // Wallet Withdrawal Request Handler
  const handleRequestWithdrawal = (reqData: Omit<WithdrawalRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: WithdrawalRequest = {
      ...reqData,
      id: `w-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setWithdrawals((prev) => [newReq, ...prev]);
    triggerFcmNotification(
      'تم إرسال طلب السحب 📤',
      `طلب سحب ${reqData.amountMAD} MAD قيد المراجعة لدى فريق الإدارة والمالية.`,
      'info'
    );
  };

  // Admin Payout Handlers
  const handleApproveWithdrawal = (withdrawalId: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => {
        if (w.id === withdrawalId) {
          return { ...w, status: 'approved' };
        }
        return w;
      })
    );
    const targetW = withdrawals.find((w) => w.id === withdrawalId);
    if (targetW) {
      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          userId: targetW.userId,
          userRole: targetW.userRole,
          amount: -targetW.amountMAD,
          type: 'withdrawal',
          description: `سحب أرباح معتمد إلى حساب (${targetW.paymentMethod.toUpperCase()})`,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
      triggerFcmNotification(
        'تم تحويل الأرباح بنجاح ✅',
        `وافق المشرف على تحويل ${targetW.amountMAD} MAD إلى حساب السائق ${targetW.userName}`,
        'success'
      );
    }
  };

  const handleRejectWithdrawal = (withdrawalId: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'rejected' } : w))
    );
    triggerFcmNotification('تم رفض طلب السحب ⚠️', 'تم تغيير حالة الطلب إلى مرفوض من طرف المشرف', 'warning');
  };

  const handleWebsiteRegisterDriver = (driverData: Partial<Driver>) => {
    const newDriverObj: Driver = {
      id: `driver-${Date.now()}`,
      name: driverData.name || 'سائق جديد',
      phone: driverData.phone || '0600000000',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      rating: 5.0,
      tripsCount: 0,
      carModel: driverData.carModel || 'Dacia Logan 2022',
      carColor: 'رمادي',
      plateNumber: '12345 - أ - 6',
      category: driverData.category || 'economy',
      isOnline: false,
      status: 'idle',
      lat: 33.5731,
      lng: -7.5898,
      walletBalance: 0,
      verified: false,
      cinNumber: driverData.cinNumber,
      licenseNumber: driverData.licenseNumber,
    };

    setDrivers((prev) => [newDriverObj, ...prev]);
    triggerFcmNotification(
      'تسجيل سائق جديد 🚗',
      `تلقينا طلب انضمام السائق ${newDriverObj.name} عبر الموقع الرسمي. الطلب قيد المراجعة في لوحة الأدمن.`,
      'info'
    );
  };

  // Chat Send Message Handler
  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      rideId: activeRequest?.id || 'ride-101',
      senderRole: currentRole === 'driver' ? 'driver' : 'rider',
      senderName: currentRole === 'driver' ? 'يوسف (الشيفور)' : 'الزبون (أنت)',
      text,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  // Available requests for driver view
  const driverAvailableRequests = activeRequest && (activeRequest.status === 'searching' || activeRequest.status === 'negotiating')
    ? [activeRequest]
    : [];

  const currentDriverObj = drivers.find((d) => d.id === 'd1') || drivers[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen
          onFinish={() => {
            setShowSplash(false);
            setShowOnboarding(true);
          }}
        />
      )}

      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingModal
          lang={lang}
          onComplete={() => setShowOnboarding(false)}
        />
      )}

      {/* App Header Bar */}
      <AppHeader
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        lang={lang}
        onChangeLang={setLang}
        walletBalance={walletBalance}
        onOpenWallet={() => setIsWalletOpen(true)}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 p-3 sm:p-6 flex justify-center items-start">
        
        {isMobileFrame ? (
          /* Mobile Simulator Outer Frame */
          <div className="w-full max-w-[420px] bg-slate-900 border-[8px] border-slate-800 rounded-[48px] shadow-2xl overflow-hidden relative min-h-[750px] flex flex-col my-4">
            
            {/* Phone Notch & Status Bar */}
            <div className="bg-slate-950 text-slate-400 px-6 py-2.5 flex items-center justify-between text-xs border-b border-slate-800">
              <span className="font-bold text-slate-200">14:23</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5 text-emerald-400" />
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Mobile Screen Content */}
            <div className="flex-1 overflow-y-auto p-3">
              {currentRole === 'rider' && (
                <RiderApp
                  lang={lang}
                  walletBalance={walletBalance}
                  availableDrivers={drivers}
                  activeRequest={activeRequest}
                  onRequestRide={handleRequestRide}
                  onAcceptOffer={handleAcceptOffer}
                  onCounterOffer={handleCounterOffer}
                  onCancelRequest={handleCancelRequest}
                  onCompleteRide={handleCompleteRide}
                  onOpenChat={() => setIsChatOpen(true)}
                  promoCodes={promoCodes}
                />
              )}

              {currentRole === 'driver' && (
                <DriverApp
                  lang={lang}
                  currentDriver={currentDriverObj}
                  onToggleOnline={handleToggleOnline}
                  availableRequests={driverAvailableRequests}
                  onDriverMakeOffer={handleDriverMakeOffer}
                  activeDriverRide={activeRequest?.assignedDriverId === currentDriverObj.id ? activeRequest : null}
                  onUpdateDriverRideStatus={handleUpdateDriverRideStatus}
                  onOpenChat={() => setIsChatOpen(true)}
                />
              )}

              {currentRole === 'admin' && (
                <AdminDashboard
                  lang={lang}
                  drivers={drivers}
                  activeRides={activeRequest ? [activeRequest] : []}
                  promoCodes={promoCodes}
                  withdrawals={withdrawals}
                  onApproveDriver={handleApproveDriver}
                  onRejectDriver={handleRejectDriver}
                  onAddPromoCode={handleAddPromoCode}
                  onTogglePromoCode={handleTogglePromoCode}
                  onApproveWithdrawal={handleApproveWithdrawal}
                  onRejectWithdrawal={handleRejectWithdrawal}
                />
              )}

              {currentRole === 'website' && (
                <OfficialWebsite
                  lang={lang}
                  onRegisterDriver={handleWebsiteRegisterDriver}
                  onNavigateRole={(role) => setCurrentRole(role)}
                />
              )}
            </div>

            {/* Home Bar Pill */}
            <div className="py-2 bg-slate-950 flex justify-center">
              <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
            </div>

          </div>
        ) : (
          /* Full Desktop / Responsive Web Container */
          <div className="w-full">
            {currentRole === 'rider' && (
              <RiderApp
                lang={lang}
                walletBalance={walletBalance}
                availableDrivers={drivers}
                activeRequest={activeRequest}
                onRequestRide={handleRequestRide}
                onAcceptOffer={handleAcceptOffer}
                onCounterOffer={handleCounterOffer}
                onCancelRequest={handleCancelRequest}
                onCompleteRide={handleCompleteRide}
                onOpenChat={() => setIsChatOpen(true)}
                promoCodes={promoCodes}
              />
            )}

            {currentRole === 'driver' && (
              <DriverApp
                lang={lang}
                currentDriver={currentDriverObj}
                onToggleOnline={handleToggleOnline}
                availableRequests={driverAvailableRequests}
                onDriverMakeOffer={handleDriverMakeOffer}
                activeDriverRide={activeRequest?.assignedDriverId === currentDriverObj.id ? activeRequest : null}
                onUpdateDriverRideStatus={handleUpdateDriverRideStatus}
                onOpenChat={() => setIsChatOpen(true)}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard
                lang={lang}
                drivers={drivers}
                activeRides={activeRequest ? [activeRequest] : []}
                promoCodes={promoCodes}
                withdrawals={withdrawals}
                onApproveDriver={handleApproveDriver}
                onRejectDriver={handleRejectDriver}
                onAddPromoCode={handleAddPromoCode}
                onTogglePromoCode={handleTogglePromoCode}
                onApproveWithdrawal={handleApproveWithdrawal}
                onRejectWithdrawal={handleRejectWithdrawal}
              />
            )}

            {currentRole === 'website' && (
              <OfficialWebsite
                lang={lang}
                onRegisterDriver={handleWebsiteRegisterDriver}
                onNavigateRole={(role) => setCurrentRole(role)}
              />
            )}
          </div>
        )}

      </main>

      {/* FCM Live Push Toast Notifications Overlay */}
      {toasts.length > 0 && (
        <div className="fixed top-20 right-4 z-[3000] space-y-2 max-w-sm w-full pointer-events-auto">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-slate-900/95 border border-indigo-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3 animate-in fade-in slide-in-from-top duration-300"
            >
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 mt-0.5">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div className="flex-1 space-y-0.5">
                <h5 className="font-extrabold text-slate-100 text-xs flex items-center justify-between">
                  <span>{toast.title}</span>
                  <span className="text-[9px] text-slate-500 font-normal">FCM Push</span>
                </h5>
                <p className="text-xs text-slate-300 leading-snug">{toast.body}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-white p-1 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Global Modals */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        lang={lang}
        userRole={currentRole}
        balanceMAD={walletBalance}
        transactions={transactions}
        onTopUp={handleWalletTopUp}
        onRequestWithdrawal={handleRequestWithdrawal}
      />

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        lang={lang}
        currentRole={currentRole}
        counterpartName={currentRole === 'driver' ? activeRequest?.riderName || 'الزبون' : 'يوسف العمراني'}
        counterpartPhone="0661-884920"
        messages={chatMessages}
        onSendMessage={handleSendMessage}
      />

      {/* Auth Modal */}
      <FirebaseAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          triggerFcmNotification('مرحباً بعودتك! 🎉', `تم تسجيل الدخول بنجاح كـ ${user.name}`, 'success');
        }}
      />

      {/* Profile Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={currentUser}
          onSaveProfile={(updated) => {
            setCurrentUser(updated);
            triggerFcmNotification('تحديث الملف 👤', 'تم حفظ التعديلات في ملفك الشخصي بنجاح', 'success');
          }}
        />
      )}

      {/* Trip History & Invoices Modal */}
      <TripHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        rides={activeRequest ? [activeRequest] : []}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        onSelectLang={setLang}
        user={currentUser}
        onOpenLegal={() => setIsLegalOpen(true)}
        onOpenReleaseKit={() => setIsReleaseKitOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          triggerFcmNotification('تسجيل الخروج', 'تم تسجيل الخروج من حسابك بنجاح', 'info');
        }}
      />

      {/* Legal, Terms & Contact Modal */}
      <LegalAndSupportModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
      />

      {/* Google Play Release Kit Modal */}
      <GooglePlayReleaseKitModal
        isOpen={isReleaseKitOpen}
        onClose={() => setIsReleaseKitOpen(false)}
      />

    </div>
  );
}
