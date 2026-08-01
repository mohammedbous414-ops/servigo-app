import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Car,
  Bike,
  Truck,
  ShieldCheck,
  Star,
  Clock,
  DollarSign,
  MessageCircle,
  PhoneCall,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Gift,
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sliders,
  LocateFixed,
} from 'lucide-react';
import {
  Driver,
  DriverOffer,
  Language,
  LocationPoint,
  PromoCode,
  RideRequest,
  RideStatus,
  VehicleCategory,
} from '../types';
import { t } from '../i18n/translations';
import { POPULAR_LOCATIONS, MOROCCAN_CITIES } from '../data/mockData';
import { OpenStreetMap } from './OpenStreetMap';
import { TripLifecycleStepper } from './TripLifecycleStepper';

interface RiderAppProps {
  lang: Language;
  walletBalance: number;
  availableDrivers: Driver[];
  activeRequest: RideRequest | null;
  onRequestRide: (requestData: Omit<RideRequest, 'id' | 'createdAt' | 'status' | 'offers'>) => void;
  onAcceptOffer: (offer: DriverOffer) => void;
  onCounterOffer: (offer: DriverOffer, counterFare: number) => void;
  onCancelRequest: (requestId: string) => void;
  onCompleteRide: (requestId: string, rating: number, tipMAD: number) => void;
  onOpenChat: () => void;
  promoCodes: PromoCode[];
}

export const RiderApp: React.FC<RiderAppProps> = ({
  lang,
  walletBalance,
  availableDrivers,
  activeRequest,
  onRequestRide,
  onAcceptOffer,
  onCounterOffer,
  onCancelRequest,
  onCompleteRide,
  onOpenChat,
  promoCodes,
}) => {
  // Form State
  const [selectedCity, setSelectedCity] = useState(MOROCCAN_CITIES[0]);
  const [pickup, setPickup] = useState<LocationPoint>(POPULAR_LOCATIONS[0]);
  const [dropoff, setDropoff] = useState<LocationPoint>(POPULAR_LOCATIONS[1]);
  const [category, setCategory] = useState<VehicleCategory>('economy');
  const [proposedFare, setProposedFare] = useState<number>(25);
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'wallet'>('cash');
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Counter Offer Modal State
  const [counterModalOffer, setCounterModalOffer] = useState<DriverOffer | null>(null);
  const [counterFareInput, setCounterFareInput] = useState<number>(25);

  // Rating Modal State
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [selectedTip, setSelectedTip] = useState<number>(0);

  // Animated Driver GPS position simulation for active ride
  const [animDriverPos, setAnimDriverPos] = useState<{ lat: number; lng: number } | null>(null);

  // Handle promo code application
  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoCodeInput.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code === code && p.active);
    if (found) {
      setAppliedPromo(found);
      setPromoError(null);
    } else {
      setPromoError('كود الخصم غير صحيح أو غير فعال');
    }
  };

  // Calculate discount MAD
  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const rawDiscount = (proposedFare * appliedPromo.discountPercent) / 100;
    return Math.min(rawDiscount, appliedPromo.maxMAD);
  };

  const finalFare = Math.max(10, Math.round(proposedFare - calculateDiscount()));

  // Form Submit: Request Ride
  const handleSubmitRideRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'wallet' && walletBalance < finalFare) {
      alert('رصيد المحفظة غير كافٍ. يرجى الشحن أولاً أو تغيير طريقة الدفع إلى كاش.');
      return;
    }

    onRequestRide({
      riderName: 'الزبون (أنت)',
      riderPhone: '0612-998877',
      pickup,
      dropoff,
      category,
      proposedFare: finalFare,
      estimatedDistanceKm: 4.2,
      estimatedDurationMin: 14,
      note,
      paymentMethod,
      promoCodeApplied: appliedPromo?.code,
      discountMAD: calculateDiscount(),
    });
  };

  // Driver animated position effect during trip
  useEffect(() => {
    if (!activeRequest || !activeRequest.assignedDriverId) {
      setAnimDriverPos(null);
      return;
    }

    const driver = availableDrivers.find((d) => d.id === activeRequest.assignedDriverId);
    if (!driver) return;

    let progress = 0;
    const startLat = activeRequest.status === 'en_route_pickup' ? driver.lat : activeRequest.pickup.lat;
    const startLng = activeRequest.status === 'en_route_pickup' ? driver.lng : activeRequest.pickup.lng;
    const endLat = activeRequest.status === 'en_route_pickup' ? activeRequest.pickup.lat : activeRequest.dropoff.lat;
    const endLng = activeRequest.status === 'en_route_pickup' ? activeRequest.pickup.lng : activeRequest.dropoff.lng;

    const interval = setInterval(() => {
      progress += 0.05;
      if (progress >= 1) progress = 1;

      const currentLat = startLat + (endLat - startLat) * progress;
      const currentLng = startLng + (endLng - startLng) * progress;

      setAnimDriverPos({ lat: currentLat, lng: currentLng });

      if (progress >= 1) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRequest, availableDrivers]);

  // Find assigned driver object
  const assignedDriverObj = activeRequest?.assignedDriverId
    ? availableDrivers.find((d) => d.id === activeRequest.assignedDriverId)
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* 1. MAP VIEW CONTAINER */}
      <div className="space-y-2">
        <OpenStreetMap
          pickup={pickup}
          dropoff={dropoff}
          driver={assignedDriverObj}
          driverAnimPos={animDriverPos}
          nearbyDrivers={availableDrivers.filter((d) => d.isOnline && d.status === 'idle')}
          interactiveSelect={!activeRequest}
          onSelectCoordinates={(lat, lng, address) => {
            if (!dropoff) {
              setDropoff({ name: address || 'موقع بالخريطة', address: address || '', city: selectedCity, lat, lng });
            } else {
              setPickup({ name: address || 'موقع بالخريطة', address: address || '', city: selectedCity, lat, lng });
            }
          }}
          height="280px"
        />
      </div>

      {/* 2. NO ACTIVE REQUEST: BOOKING CONSOLE */}
      {!activeRequest && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6 animate-panel-entry transition-all duration-300 ease-in-out">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-indigo-400" />
              <span>{t(lang, 'whereTo')}</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">سعر عادل مع مفاوضة مباشرة</span>
          </div>

          <form onSubmit={handleSubmitRideRequest} className="space-y-6">
            
            {/* Pickup & Dropoff Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pickup */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{t(lang, 'pickupLocation')} (نقطة الركوب)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setPickup({
                              name: 'موقعي الحالي (GPS Live)',
                              address: 'تم التحديد بالـ GPS',
                              city: selectedCity,
                              lat: pos.coords.latitude,
                              lng: pos.coords.longitude,
                            });
                          },
                          () => {
                            setPickup({
                              name: 'موقعي الحالي (المعاريف)',
                              address: 'شارع المسيرة، المعاريف',
                              city: 'الدار البيضاء',
                              lat: 33.5889,
                              lng: -7.6322,
                            });
                          }
                        );
                      }
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-colors"
                  >
                    <LocateFixed className="w-3.5 h-3.5" />
                    <span>موقعي الحالي GPS</span>
                  </button>
                </div>
                <div className="relative">
                  <select
                    value={pickup.name}
                    onChange={(e) => {
                      const loc = POPULAR_LOCATIONS.find((p) => p.name === e.target.value);
                      if (loc) setPickup(loc);
                    }}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    {POPULAR_LOCATIONS.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name} - {loc.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dropoff */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{t(lang, 'dropoffLocation')}</span>
                </label>
                <div className="relative">
                  <select
                    value={dropoff.name}
                    onChange={(e) => {
                      const loc = POPULAR_LOCATIONS.find((p) => p.name === e.target.value);
                      if (loc) setDropoff(loc);
                    }}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
                  >
                    {POPULAR_LOCATIONS.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name} - {loc.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* Vehicle Categories Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Car className="w-4 h-4 text-indigo-400" />
                <span>{t(lang, 'chooseVehicle')}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                
                {/* Economy */}
                <button
                  type="button"
                  onClick={() => { setCategory('economy'); setProposedFare(25); }}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    category === 'economy'
                      ? 'bg-indigo-600/15 border-indigo-500 text-slate-100 shadow-lg shadow-indigo-600/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Car className="w-5 h-5 text-indigo-400 mb-1" />
                  <div>
                    <p className="text-xs font-bold text-slate-100">{t(lang, 'economyName')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">~20-30 DH</p>
                  </div>
                </button>

                {/* Comfort */}
                <button
                  type="button"
                  onClick={() => { setCategory('comfort'); setProposedFare(40); }}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    category === 'comfort'
                      ? 'bg-indigo-600/15 border-indigo-500 text-slate-100 shadow-lg shadow-indigo-600/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-violet-400 mb-1" />
                  <div>
                    <p className="text-xs font-bold text-slate-100">{t(lang, 'comfortName')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">~35-55 DH</p>
                  </div>
                </button>

                {/* Taxi */}
                <button
                  type="button"
                  onClick={() => { setCategory('taxi'); setProposedFare(20); }}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    category === 'taxi'
                      ? 'bg-indigo-600/15 border-indigo-500 text-slate-100 shadow-lg shadow-indigo-600/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Car className="w-5 h-5 text-amber-400 mb-1" />
                  <div>
                    <p className="text-xs font-bold text-slate-100">{t(lang, 'taxiName')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">~15-25 DH</p>
                  </div>
                </button>

                {/* Moto */}
                <button
                  type="button"
                  onClick={() => { setCategory('moto'); setProposedFare(15); }}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                    category === 'moto'
                      ? 'bg-indigo-600/15 border-indigo-500 text-slate-100 shadow-lg shadow-indigo-600/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Bike className="w-5 h-5 text-cyan-400 mb-1" />
                  <div>
                    <p className="text-xs font-bold text-slate-100">{t(lang, 'motoName')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">~10-20 DH</p>
                  </div>
                </button>

                {/* Cargo */}
                <button
                  type="button"
                  onClick={() => { setCategory('cargo'); setProposedFare(60); }}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between col-span-2 sm:col-span-1 ${
                    category === 'cargo'
                      ? 'bg-indigo-600/15 border-indigo-500 text-slate-100 shadow-lg shadow-indigo-600/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Truck className="w-5 h-5 text-indigo-400 mb-1" />
                  <div>
                    <p className="text-xs font-bold text-slate-100">{t(lang, 'cargoName')}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">~50-100 DH</p>
                  </div>
                </button>

              </div>
            </div>

            {/* Fare Bidding Slider & Controls */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-200 block">
                    {t(lang, 'yourOffer')}
                  </label>
                  <p className="text-[11px] text-slate-400">اقترح السعر المناسب لك، ويمكن للسائق القبول أو الرد</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-400">{proposedFare}</span>
                  <span className="text-xs text-slate-300 font-bold mr-1">{t(lang, 'currency')}</span>
                </div>
              </div>

              {/* Slider & Quick +/- buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setProposedFare((prev) => Math.max(10, prev - 5))}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center transition-colors"
                >
                  -5
                </button>

                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={proposedFare}
                  onChange={(e) => setProposedFare(Number(e.target.value))}
                  className="flex-1 accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => setProposedFare((prev) => prev + 5)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center transition-colors"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Promo Code & Payment Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Promo Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Gift className="w-4 h-4 text-indigo-400" />
                  <span>{t(lang, 'applyPromo')}</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder={t(lang, 'enterCode')}
                    className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors"
                  >
                    {t(lang, 'applyBtn')}
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-[11px] text-indigo-400 font-medium">
                    ✨ تم خصم {calculateDiscount()} {t(lang, 'currency')} (كود: {appliedPromo.code})
                  </p>
                )}
                {promoError && <p className="text-[11px] text-rose-400 font-medium">{promoError}</p>}
              </div>

              {/* Payment Method Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                  <span>{t(lang, 'paymentMethod')}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    💵 {t(lang, 'cash')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'wallet'
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    💳 {t(lang, 'walletPay')} ({walletBalance} DH)
                  </button>
                </div>
              </div>

            </div>

            {/* Note for driver */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">{t(lang, 'tripNote')}</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t(lang, 'notePlaceholder')}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit Request Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/30 text-base transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>{t(lang, 'requestRideBtn')}</span>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-xs font-extrabold">
                {finalFare} {t(lang, 'currency')}
              </span>
            </button>

          </form>
        </div>
      )}

      {/* 3. ACTIVE REQUEST: BIDDING & LIVE OFFERS CONSOLE */}
      {activeRequest && (activeRequest.status === 'searching' || activeRequest.status === 'negotiating') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6 animate-panel-entry transition-all duration-300 ease-in-out">
          
          {/* Header Radar pulsing status */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 animate-ping absolute"></div>
                <div className="w-10 h-10 rounded-full bg-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-lg relative z-10">
                  <Clock className="w-5 h-5 animate-spin text-indigo-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-100">
                  {t(lang, 'searchingDrivers')}
                </h3>
                <p className="text-xs text-slate-400">
                  عروض السائقين تظهر مباشرة هنا
                </p>
              </div>
            </div>

            <button
              onClick={() => onCancelRequest(activeRequest.id)}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-xl transition-colors"
            >
              {t(lang, 'cancelRide')}
            </button>
          </div>

          {/* Ride Details Summary */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">الانطلاق:</span>
              <span className="font-bold text-slate-200">{activeRequest.pickup.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block">الوجهة:</span>
              <span className="font-bold text-slate-200">{activeRequest.dropoff.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block">عرضك الأصلي:</span>
              <span className="font-extrabold text-indigo-400">{activeRequest.proposedFare} {t(lang, 'currency')}</span>
            </div>
          </div>

          {/* Incoming Driver Offers List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {t(lang, 'incomingOffers')} ({activeRequest.offers.length})
            </h4>

            {activeRequest.offers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800">
                <Clock className="w-8 h-8 text-indigo-400/60 mx-auto mb-2 animate-pulse" />
                <p className="text-xs font-semibold">{t(lang, 'noOffersYet')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeRequest.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-slate-950 border border-slate-800 p-4 rounded-2xl hover:border-indigo-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={offer.driverPhoto}
                        alt={offer.driverName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-slate-100 text-sm">{offer.driverName}</h5>
                          <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-indigo-400 text-indigo-400" />
                            {offer.driverRating} ({offer.driverTrips})
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          🚘 {offer.carModel} • <span className="text-slate-300">{offer.carColor}</span>
                        </p>
                        <p className="text-[11px] text-cyan-400 mt-0.5 font-medium">
                          ⏱️ الوصول خلال ~{offer.etaMinutes} دقائق
                        </p>
                      </div>
                    </div>

                    {/* Fare & Decision Actions */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-right">
                        <span className="text-2xl font-black text-indigo-400">{offer.proposedFare}</span>
                        <span className="text-xs font-bold text-slate-300 mr-1">{t(lang, 'currency')}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Accept Offer */}
                        <button
                          onClick={() => onAcceptOffer(offer)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{t(lang, 'acceptOffer')}</span>
                        </button>

                        {/* Counter Offer Modal Opener */}
                        <button
                          onClick={() => {
                            setCounterModalOffer(offer);
                            setCounterFareInput(offer.proposedFare - 3);
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          {t(lang, 'counterOffer')}
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. ACTIVE RIDE IN-PROGRESS VIEW */}
      {activeRequest &&
        (activeRequest.status === 'accepted' ||
          activeRequest.status === 'en_route_pickup' ||
          activeRequest.status === 'in_trip') && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6 animate-panel-entry transition-all duration-300 ease-in-out">
            
            {/* Ride Status Banner */}
            <div className="bg-gradient-to-r from-indigo-950/80 to-violet-950/80 border border-indigo-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                  <Car className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-100 text-base">
                    {activeRequest.status === 'accepted' || activeRequest.status === 'en_route_pickup'
                      ? t(lang, 'driverEnRoute')
                      : t(lang, 'tripInProgress')}
                  </h3>
                  <p className="text-xs text-indigo-300 font-medium">
                    {activeRequest.status === 'en_route_pickup' ? 'الكابتن يصل خلال ~3 دقائق' : 'في الطريق للوجهة'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-black text-indigo-400">{activeRequest.acceptedFare || activeRequest.proposedFare}</span>
                <span className="text-xs font-bold text-slate-300 mr-1">{t(lang, 'currency')}</span>
              </div>
            </div>

            {/* Visual Lifecycle Stepper Component */}
            <TripLifecycleStepper status={activeRequest.status} lang={lang} />

            {/* Driver Profile Card */}
            {assignedDriverObj && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={assignedDriverObj.photo}
                    alt={assignedDriverObj.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-100 text-base">{assignedDriverObj.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      🚘 {assignedDriverObj.carModel} • <span className="text-slate-200 font-semibold">{assignedDriverObj.plateNumber}</span>
                    </p>
                    <p className="text-[11px] text-amber-400 font-bold mt-1 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{assignedDriverObj.rating} • {assignedDriverObj.tripsCount} رحلة ناجحة</span>
                    </p>
                  </div>
                </div>

                {/* Communication & Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={onOpenChat}
                    className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t(lang, 'chatWithDriver')}</span>
                  </button>

                  <a
                    href={`tel:${assignedDriverObj.phone}`}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-indigo-400" />
                  </a>
                </div>
              </div>
            )}

            {/* Ride Trip Completion Button for Simulation */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => alert('رابط المشاركة المباشر: https://servigo.ma/track/ride-101')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>مشاركة تفاصيل الرحلة للأقارب</span>
              </button>

              <button
                onClick={() => setShowRatingModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-indigo-600/30 transition-all"
              >
                إنهاء الرحلة واستلام الخدمة 🎉
              </button>
            </div>

          </div>
        )}

      {/* COUNTER OFFER MODAL */}
      {counterModalOffer && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-slate-100 text-base">{t(lang, 'counterOffer')}</h3>
            <p className="text-xs text-slate-400">
              تقديم سعر جديد للكابتن {counterModalOffer.driverName}
            </p>

            <div className="flex items-center justify-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <button
                onClick={() => setCounterFareInput((prev) => Math.max(10, prev - 2))}
                className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold"
              >
                -2
              </button>
              <span className="text-3xl font-black text-indigo-400">{counterFareInput} MAD</span>
              <button
                onClick={() => setCounterFareInput((prev) => prev + 2)}
                className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold"
              >
                +2
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCounterModalOffer(null)}
                className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  onCounterOffer(counterModalOffer, counterFareInput);
                  setCounterModalOffer(null);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-black shadow-md shadow-indigo-600/30"
              >
                {t(lang, 'sendCounter')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RATING & REVIEW MODAL */}
      {showRatingModal && activeRequest && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-6 shadow-2xl text-center">
            
            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-500/30">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-100 text-xl">{t(lang, 'tripCompleted')}</h3>
              <p className="text-xs text-slate-400 mt-1">{t(lang, 'howWasTrip')}</p>
            </div>

            {/* Stars Picker */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingStars(star)}
                  className="p-2 transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= ratingStars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Tip Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">{t(lang, 'addTip')}</label>
              <div className="flex gap-2 justify-center">
                {[0, 5, 10, 20].map((tip) => (
                  <button
                    key={tip}
                    onClick={() => setSelectedTip(tip)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedTip === tip
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {tip === 0 ? 'بدون' : `+${tip} DH`}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setShowRatingModal(false);
                onCompleteRide(activeRequest.id, ratingStars, selectedTip);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl text-sm shadow-lg shadow-indigo-600/30 transition-all"
            >
              {t(lang, 'submitRating')}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
