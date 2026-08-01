import React, { useState } from 'react';
import { History, FileText, Star, MapPin, Calendar, CreditCard, Download, CheckCircle2, X, Sparkles, Building2, User } from 'lucide-react';
import { RideRequest, TripReceipt } from '../types';

interface TripHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rides: RideRequest[];
}

export const TripHistoryModal: React.FC<TripHistoryModalProps> = ({
  isOpen,
  onClose,
  rides,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<TripReceipt | null>(null);
  const [ratingRideId, setRatingRideId] = useState<string | null>(null);
  const [stars, setStars] = useState(5);
  const [feedbackTags, setFeedbackTags] = useState<string[]>(['قيادة آمنة']);
  const [ratedRides, setRatedRides] = useState<Record<string, { stars: number; tags: string[] }>>({});

  if (!isOpen) return null;

  // Mock initial completed history if rides array is empty
  const historyList: RideRequest[] = rides.length > 0 ? rides : [
    {
      id: 'ride-hist-1',
      riderName: 'أمين الفاسي',
      riderPhone: '0612345678',
      pickup: { address: 'الدار البيضاء - المعاريف', city: 'الدار البيضاء', lat: 33.58, lng: -7.63 },
      dropoff: { address: 'مطار محمد الخامس الدولي', city: 'الدار البيضاء', lat: 33.36, lng: -7.58 },
      category: 'economy',
      proposedFare: 140,
      acceptedFare: 140,
      estimatedDistanceKm: 28.5,
      estimatedDurationMin: 32,
      paymentMethod: 'wallet',
      status: 'completed',
      createdAt: '2026-07-30T14:30:00Z',
      offers: [],
    },
    {
      id: 'ride-hist-2',
      riderName: 'أمين الفاسي',
      riderPhone: '0612345678',
      pickup: { address: 'شارع الزرقطوني', city: 'الدار البيضاء', lat: 33.59, lng: -7.62 },
      dropoff: { address: 'موروكو مول Morocco Mall', city: 'الدار البيضاء', lat: 33.57, lng: -7.69 },
      category: 'comfort',
      proposedFare: 50,
      acceptedFare: 50,
      estimatedDistanceKm: 9.2,
      estimatedDurationMin: 18,
      paymentMethod: 'cash',
      status: 'completed',
      createdAt: '2026-07-28T09:15:00Z',
      offers: [],
    },
  ];

  const handleOpenReceipt = (ride: RideRequest) => {
    const fare = ride.acceptedFare || ride.proposedFare;
    const tva = Math.round(fare * 0.14);
    const receipt: TripReceipt = {
      id: `INV-${ride.id.slice(-6).toUpperCase()}`,
      rideId: ride.id,
      date: new Date(ride.createdAt).toLocaleString('ar-MA'),
      riderName: ride.riderName,
      driverName: 'يوسف العمراني (كابتن)',
      pickupAddress: ride.pickup.address,
      dropoffAddress: ride.dropoff.address,
      baseFareMAD: fare - tva,
      distanceKm: ride.estimatedDistanceKm || 12,
      durationMin: ride.estimatedDurationMin || 20,
      discountMAD: ride.discountMAD || 0,
      finalFareMAD: fare,
      paymentMethod: ride.paymentMethod,
      driverCar: 'Dacia Logan 2022',
      plateNumber: '12345 - أ - 6',
      tvaMAD: tva,
    };
    setSelectedReceipt(receipt);
  };

  const handleToggleTag = (tag: string) => {
    if (feedbackTags.includes(tag)) {
      setFeedbackTags(feedbackTags.filter((t) => t !== tag));
    } else {
      setFeedbackTags([...feedbackTags, tag]);
    }
  };

  const handleSubmitRating = () => {
    if (ratingRideId) {
      setRatedRides({
        ...ratedRides,
        [ratingRideId]: { stars, tags: feedbackTags },
      });
      setRatingRideId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">سجل الرحلات والفواتير</h2>
              <p className="text-xs text-slate-400">سجل كامل بجميع رحلاتك، الإيصالات الضريبية وتقييم السائقين</p>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          {historyList.map((ride) => {
            const isRated = ratedRides[ride.id];
            return (
              <div
                key={ride.id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 hover:border-indigo-500/40 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">
                      {new Date(ride.createdAt).toLocaleDateString('ar-MA')}
                    </span>
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {ride.category}
                    </span>
                  </div>
                  <span className="text-base font-black text-amber-400">
                    {ride.acceptedFare || ride.proposedFare} MAD
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 truncate">{ride.pickup.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="text-slate-300 truncate">{ride.dropoff.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenReceipt(ride)}
                      className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>عرض الإيصال / الفاتورة</span>
                    </button>
                  </div>

                  <div>
                    {isRated ? (
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>تقييمك: {isRated.stars} نجوم</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setRatingRideId(ride.id);
                          setStars(5);
                        }}
                        className="bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>تقييم السائق</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RECEIPT / INVOICE MODAL SUB-OVERLAY */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-[5000] bg-slate-950/95 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 p-6 rounded-3xl shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <span className="font-black text-white text-base">ServiGo Morocco SARL</span>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between font-mono text-[11px] text-slate-400">
                  <span>رقم الفاتورة:</span>
                  <span className="text-amber-400 font-bold">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>التاريخ والوقت:</span>
                  <span>{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>الراكب:</span>
                  <span className="font-bold text-white">{selectedReceipt.riderName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>السائق المركبة:</span>
                  <span>{selectedReceipt.driverName} ({selectedReceipt.driverCar})</span>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-b border-slate-800 py-3">
                <div className="flex justify-between text-slate-300">
                  <span>الأجرة الأساسية:</span>
                  <span>{selectedReceipt.baseFareMAD} MAD</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>الضريبة على القيمة المضافة TVA (14%):</span>
                  <span>{selectedReceipt.tvaMAD} MAD</span>
                </div>
                {selectedReceipt.discountMAD > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>خصم البرومو كود:</span>
                    <span>-{selectedReceipt.discountMAD} MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-amber-400 pt-2 border-t border-slate-800">
                  <span>المجموع الصافي المدفوع:</span>
                  <span>{selectedReceipt.finalFareMAD} MAD</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>طريقة الدفع: {selectedReceipt.paymentMethod === 'wallet' ? 'المحفظة الرقمية 💳' : 'كاش نقداً 💵'}</span>
                <span>توليد تلقائي معتمد 🇲🇦</span>
              </div>

              <button
                onClick={() => {
                  alert('تم تنزيل إيصال الفاتورة بصيغة PDF بنجاح!');
                  setSelectedReceipt(null);
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الفاتورة PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* RATING MODAL SUB-OVERLAY */}
        {ratingRideId && (
          <div className="fixed inset-0 z-[5000] bg-slate-950/95 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4 text-center">
              <h3 className="font-black text-white text-lg">تقييم رحلتك وسائقك</h3>
              <p className="text-xs text-slate-400">ساعدنا في تحسين جودة النقل في المغرب عبر تقييمك</p>

              {/* Stars */}
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStars(s)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Feedback Tags */}
              <div className="flex flex-wrap justify-center gap-1.5 text-xs">
                {['قيادة آمنة', 'سيارة نظيفة', 'وصل في الوقت', 'سائق محترم', 'التزام بالمسار'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1 rounded-full border text-[11px] transition-all ${
                      feedbackTags.includes(tag)
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSubmitRating}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow"
                >
                  إرسال التقييم
                </button>
                <button
                  onClick={() => setRatingRideId(null)}
                  className="px-4 bg-slate-950 text-slate-400 border border-slate-800 rounded-xl text-xs font-bold"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
