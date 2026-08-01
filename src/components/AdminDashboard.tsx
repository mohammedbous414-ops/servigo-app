import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  FileCheck,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Users,
  XCircle,
  Car,
  Settings,
} from 'lucide-react';
import { Driver, Language, PromoCode, RideRequest, WithdrawalRequest } from '../types';
import { t } from '../i18n/translations';
import { OpenStreetMap } from './OpenStreetMap';
import { Wallet, ArrowDownRight, Building2 } from 'lucide-react';

interface AdminDashboardProps {
  lang: Language;
  drivers: Driver[];
  activeRides: RideRequest[];
  promoCodes: PromoCode[];
  withdrawals?: WithdrawalRequest[];
  onApproveDriver: (driverId: string) => void;
  onRejectDriver: (driverId: string) => void;
  onAddPromoCode: (newCode: PromoCode) => void;
  onTogglePromoCode: (codeStr: string) => void;
  onApproveWithdrawal?: (withdrawalId: string) => void;
  onRejectWithdrawal?: (withdrawalId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  drivers,
  activeRides,
  promoCodes,
  withdrawals = [],
  onApproveDriver,
  onRejectDriver,
  onAddPromoCode,
  onTogglePromoCode,
  onApproveWithdrawal,
  onRejectWithdrawal,
}) => {
  const [newCodeName, setNewCodeName] = useState('');
  const [newDiscountPct, setNewDiscountPct] = useState(15);
  const [newMaxMAD, setNewMaxMAD] = useState(20);

  const totalDriversCount = drivers.length;
  const verifiedDriversCount = drivers.filter((d) => d.verified).length;
  const pendingDrivers = drivers.filter((d) => !d.verified);

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName.trim()) return;
    onAddPromoCode({
      code: newCodeName.trim().toUpperCase(),
      discountPercent: newDiscountPct,
      maxMAD: newMaxMAD,
      active: true,
      usageCount: 0,
    });
    setNewCodeName('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* 1. ADMIN HEADER & METRICS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-100 text-lg sm:text-xl">
                {t(lang, 'adminDashboardTitle')}
              </h2>
              <p className="text-xs text-slate-400">إدارة الخدمة والسائقين والعمولات للمملكة المغربية 🇲🇦</p>
            </div>
          </div>

          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold px-3 py-1.5 rounded-full">
            نظام موثوق ومعتمد
          </span>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-xs font-medium block">{t(lang, 'totalRevenue')}</span>
            <div className="text-2xl font-black text-slate-100 mt-1">
              124,500 <span className="text-xs font-bold text-indigo-400">DH</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold mt-1 block">+12.4% هذا الشهر</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-xs font-medium block">{t(lang, 'platformCommission')}</span>
            <div className="text-2xl font-black text-indigo-400 mt-1">
              12,450 <span className="text-xs font-bold text-slate-300">DH</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">صافي نسبة 10%</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-xs font-medium block">{t(lang, 'activeRidesCount')}</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">
              {activeRides.length} <span className="text-xs font-bold text-slate-400">رحلة</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold mt-1 block">مباشر الآن على الخريطة</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 text-xs font-medium block">{t(lang, 'registeredDrivers')}</span>
            <div className="text-2xl font-black text-slate-100 mt-1">
              {totalDriversCount} <span className="text-xs font-bold text-indigo-400">({verifiedDriversCount} موثق)</span>
            </div>
            <span className="text-[10px] text-amber-400 font-semibold mt-1 block">{pendingDrivers.length} قيد التوثيق</span>
          </div>

        </div>
      </div>

      {/* 2. FLEET LIVE MAP */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
        <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
          <Car className="w-5 h-5 text-indigo-400" />
          <span>{t(lang, 'fleetMap')}</span>
        </h3>
        <OpenStreetMap
          nearbyDrivers={drivers}
          height="300px"
        />
      </div>

      {/* 3. DRIVER VERIFICATIONS PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-400" />
            <span>{t(lang, 'driverApprovals')} ({pendingDrivers.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">مراجعة البطاقة الوطنية والرخصة والورق</span>
        </div>

        {pendingDrivers.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6 bg-slate-950 rounded-2xl border border-slate-800">
            جميع السائقين الجدد موثقين ومعتمدين بنجاح
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingDrivers.map((driver) => (
              <div
                key={driver.id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-100 text-sm">{driver.name}</h4>
                    <p className="text-xs text-slate-400">🚘 {driver.carModel} ({driver.plateNumber})</p>
                    <p className="text-[11px] text-amber-400 mt-1 font-semibold">
                      CIN: {driver.cinNumber || 'قيد المراجعة'} • رخصة: {driver.licenseNumber || 'سارية'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onApproveDriver(driver.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-xs font-black shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{t(lang, 'approve')}</span>
                  </button>
                  <button
                    onClick={() => onRejectDriver(driver.id)}
                    className="bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    {t(lang, 'reject')}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. PROMO CODE MANAGER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2 border-b border-slate-800 pb-3">
          <Tag className="w-5 h-5 text-indigo-400" />
          <span>{t(lang, 'promoCodesManagement')}</span>
        </h3>

        {/* Add Promo Code Form */}
        <form onSubmit={handleCreatePromo} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px] space-y-1">
            <label className="text-xs font-bold text-slate-300">اسم الكود</label>
            <input
              type="text"
              value={newCodeName}
              onChange={(e) => setNewCodeName(e.target.value)}
              placeholder="مثال: SERVIGO2026"
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 uppercase"
            />
          </div>

          <div className="w-28 space-y-1">
            <label className="text-xs font-bold text-slate-300">الخصم (%)</label>
            <input
              type="number"
              value={newDiscountPct}
              onChange={(e) => setNewDiscountPct(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="w-28 space-y-1">
            <label className="text-xs font-bold text-slate-300">أقصى خصم (DH)</label>
            <input
              type="number"
              value={newMaxMAD}
              onChange={(e) => setNewMaxMAD(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة كود جديد</span>
          </button>
        </form>

        {/* Promo Codes Table/List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {promoCodes.map((promo) => (
            <div
              key={promo.code}
              className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between"
            >
              <div>
                <span className="font-extrabold text-slate-100 text-sm block uppercase tracking-wider">{promo.code}</span>
                <span className="text-[11px] text-indigo-400 font-semibold">
                  خصم {promo.discountPercent}% (أقصى {promo.maxMAD} DH)
                </span>
                <span className="text-[10px] text-slate-500 block">استُخدم {promo.usageCount} مرة</span>
              </div>

              <button
                onClick={() => onTogglePromoCode(promo.code)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                  promo.active
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {promo.active ? 'مفعل' : 'معطل'}
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* 5. WALLET PAYOUT & WITHDRAWAL REQUESTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-400" />
            <span>{t(lang, 'payoutRequests')} ({withdrawals.filter((w) => w.status === 'pending').length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>تحويلات CIH / Attijari / Cash Plus</span>
          </span>
        </div>

        {withdrawals.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
            لا توجد طلبات سحب رصيد معلقة حالياً
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <div key={w.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{w.userName}</span>
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {w.paymentMethod}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    الحساب/الـ RIB: <span className="font-mono text-slate-200">{w.accountDetails}</span>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    تاريخ الطلب: {new Date(w.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-black text-indigo-400 block">{w.amountMAD} MAD</span>
                    <span className={`text-[10px] font-bold ${
                      w.status === 'pending' ? 'text-amber-400' : w.status === 'approved' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {w.status === 'pending' ? 'قيد المراجعة' : w.status === 'approved' ? 'تم تحويل المبلغ' : 'مرفوض'}
                    </span>
                  </div>

                  {w.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApproveWithdrawal && onApproveWithdrawal(w.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
                      >
                        {t(lang, 'approvePayout')}
                      </button>
                      <button
                        onClick={() => onRejectWithdrawal && onRejectWithdrawal(w.id)}
                        className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      >
                        {t(lang, 'rejectPayout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
