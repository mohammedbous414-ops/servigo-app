import React, { useState } from 'react';
import {
  Car,
  CheckCircle2,
  DollarSign,
  MapPin,
  MessageCircle,
  Navigation,
  PhoneCall,
  Power,
  ShieldAlert,
  ShieldCheck,
  Star,
  Clock,
  TrendingUp,
  FileText,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { Driver, DriverOffer, Language, RideRequest } from '../types';
import { t } from '../i18n/translations';
import { OpenStreetMap } from './OpenStreetMap';
import { TripLifecycleStepper } from './TripLifecycleStepper';

interface DriverAppProps {
  lang: Language;
  currentDriver: Driver;
  onToggleOnline: () => void;
  availableRequests: RideRequest[];
  onDriverMakeOffer: (requestId: string, proposedFare: number, etaMinutes: number) => void;
  activeDriverRide: RideRequest | null;
  onUpdateDriverRideStatus: (requestId: string, nextStatus: 'en_route_pickup' | 'in_trip' | 'completed') => void;
  onOpenChat: () => void;
}

export const DriverApp: React.FC<DriverAppProps> = ({
  lang,
  currentDriver,
  onToggleOnline,
  availableRequests,
  onDriverMakeOffer,
  activeDriverRide,
  onUpdateDriverRideStatus,
  onOpenChat,
}) => {
  const [counterInputMap, setCounterInputMap] = useState<{ [requestId: string]: number }>({});
  const [etaInput, setEtaInput] = useState<number>(5);

  const getCounterPrice = (req: RideRequest) => {
    return counterInputMap[req.id] || req.proposedFare + 5;
  };

  const setCounterPrice = (requestId: string, val: number) => {
    setCounterInputMap((prev) => ({ ...prev, [requestId]: Math.max(10, val) }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* 1. ONLINE / OFFLINE DRIVER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <img
            src={currentDriver.photo}
            alt={currentDriver.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-100 text-base">{currentDriver.name}</h2>
              <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-indigo-500/30">
                <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                {currentDriver.rating}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              🚘 {currentDriver.carModel} • <span className="text-slate-200 font-bold">{currentDriver.plateNumber}</span>
            </p>
          </div>
        </div>

        {/* Status Switch Toggle Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onToggleOnline}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              currentDriver.isOnline
                ? 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-700'
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{currentDriver.isOnline ? t(lang, 'goOffline') : t(lang, 'goOnline')}</span>
          </button>
        </div>

      </div>

      {/* 2. DRIVER EARNINGS SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <DollarSign className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">{t(lang, 'todayEarnings')}</span>
            <span className="text-lg font-black text-slate-100">285 {t(lang, 'currency')}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl">
            <TrendingUp className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">{t(lang, 'tripsToday')}</span>
            <span className="text-lg font-black text-slate-100">8 رحلات</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">{t(lang, 'commissionRate')}</span>
            <span className="text-lg font-black text-cyan-400">10% صافي</span>
          </div>
        </div>

      </div>

      {/* 2.5 DRIVER KYC & DOCUMENT VERIFICATION CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-slate-100 text-sm">توثيق الوثائق ورخصة القيادة (KYC Driver Verification)</h3>
          </div>
          {currentDriver.verified ? (
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> حساب موثق ومطابق
            </span>
          ) : (
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> قيد التوثيق والمراجعة
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-slate-200 font-bold block">رخصة السياقة (Permis)</span>
                <span className="text-[10px] text-slate-400">صالحة 2029</span>
              </div>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">تم الرفع</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-200 font-bold block">البطاقة الوطنية (CIN)</span>
                <span className="text-[10px] text-slate-400">ملاحظة الهوية</span>
              </div>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">تم الرفع</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-200 font-bold block">الورقة الرمادية (Carte Grise)</span>
                <span className="text-[10px] text-slate-400">{currentDriver.plateNumber}</span>
              </div>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">معتمدة</span>
          </div>

        </div>
      </div>
      {activeDriverRide && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6 animate-panel-entry transition-all duration-300 ease-in-out">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 animate-ping"></span>
              <h3 className="font-extrabold text-slate-100 text-base">رحلة نشطة حية</h3>
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
              المبلغ: {activeDriverRide.acceptedFare || activeDriverRide.proposedFare} MAD
            </span>
          </div>

          <TripLifecycleStepper status={activeDriverRide.status} lang={lang} />

          <OpenStreetMap
            pickup={activeDriverRide.pickup}
            dropoff={activeDriverRide.dropoff}
            driver={currentDriver}
            height="220px"
          />

          {/* Passenger Info & Actions */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-slate-100 text-sm">{activeDriverRide.riderName}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                📍 {activeDriverRide.pickup.name} ➔ {activeDriverRide.dropoff.name}
              </p>
              {activeDriverRide.note && (
                <p className="text-[11px] text-cyan-400 mt-1">📝 {activeDriverRide.note}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenChat}
                className="p-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/30"
                title="دردشة"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <a
                href={`tel:${activeDriverRide.riderPhone}`}
                className="p-2.5 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700 hover:bg-slate-700 transition-colors"
                title="اتصال"
              >
                <PhoneCall className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Workflow Step Action Buttons */}
          <div className="pt-2">
            {activeDriverRide.status === 'accepted' || activeDriverRide.status === 'searching' ? (
              <button
                onClick={() => onUpdateDriverRideStatus(activeDriverRide.id, 'en_route_pickup')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 text-sm transition-all"
              >
                {t(lang, 'arrivedAtPickup')} 📍
              </button>
            ) : activeDriverRide.status === 'en_route_pickup' ? (
              <button
                onClick={() => onUpdateDriverRideStatus(activeDriverRide.id, 'in_trip')}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-violet-600/30 text-sm transition-all"
              >
                {t(lang, 'startRide')} 🚘
              </button>
            ) : (
              <button
                onClick={() => onUpdateDriverRideStatus(activeDriverRide.id, 'completed')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 text-sm transition-all"
              >
                {t(lang, 'completeRide')} ✨
              </button>
            )}
          </div>

        </div>
      )}

      {/* 4. AVAILABLE RIDE REQUESTS FEED FOR BIDDING */}
      {!activeDriverRide && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-panel-entry transition-all duration-300 ease-in-out">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
              <Navigation className="w-5 h-5 text-indigo-400" />
              <span>{t(lang, 'availableRides')}</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              {availableRequests.length} طلب قريب
            </span>
          </div>

          {!currentDriver.isOnline ? (
            <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
              <Power className="w-10 h-10 text-rose-500/50 mx-auto" />
              <p className="text-sm font-bold text-slate-300">أنت غير متصل حالياً</p>
              <p className="text-xs text-slate-500">قم ببدء الخدمة أعلاه لاستقبال طلبات الزبناء والبدء بالربح</p>
            </div>
          ) : availableRequests.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">
              <Car className="w-10 h-10 text-indigo-400/50 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-semibold">{t(lang, 'noRidesFound')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableRequests.map((req) => {
                const customFare = getCounterPrice(req);
                return (
                  <div
                    key={req.id}
                    className="bg-slate-950 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-4 hover:border-indigo-500/50 transition-all"
                  >
                    
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <span className="text-xs font-extrabold text-slate-100">{req.riderName}</span>
                        <span className="text-[10px] text-slate-400 mr-2">({req.category.toUpperCase()})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">عرض الزبون:</span>
                        <span className="text-xl font-black text-indigo-400">{req.proposedFare} {t(lang, 'currency')}</span>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-slate-200 font-medium">
                        <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 block text-[10px]">من (الانطلاق):</span>
                          <span>{req.pickup.address || req.pickup.name}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-slate-200 font-medium">
                        <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 block text-[10px]">إلى (الوجهة):</span>
                          <span>{req.dropoff.address || req.dropoff.name}</span>
                        </div>
                      </div>
                    </div>

                    {req.note && (
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs text-cyan-300">
                        💬 ملاحظة الزبون: {req.note}
                      </div>
                    )}

                    {/* Bidding Actions for Driver */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                      
                      {/* Direct Accept Passenger's Fare */}
                      <button
                        onClick={() => onDriverMakeOffer(req.id, req.proposedFare, etaInput)}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t(lang, 'acceptPassengerFare')} ({req.proposedFare} DH)</span>
                      </button>

                      {/* Counter Bidding Inputs */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-2 py-1">
                          <button
                            type="button"
                            onClick={() => setCounterPrice(req.id, customFare - 2)}
                            className="text-white font-bold px-2 text-xs"
                          >
                            -
                          </button>
                          <span className="text-xs font-black text-indigo-400 px-1">{customFare} DH</span>
                          <button
                            type="button"
                            onClick={() => setCounterPrice(req.id, customFare + 2)}
                            className="text-white font-bold px-2 text-xs"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onDriverMakeOffer(req.id, customFare, etaInput)}
                          className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                        >
                          {t(lang, 'offerNewFare')}
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
