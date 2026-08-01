import React, { useState } from 'react';
import { Wallet, X, PlusCircle, ArrowUpRight, ArrowDownLeft, CheckCircle2, Building2, CreditCard, Send, ShieldCheck } from 'lucide-react';
import { Language, UserRole, WalletTransaction, WithdrawalRequest } from '../types';
import { t } from '../i18n/translations';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  userRole: UserRole;
  balanceMAD: number;
  transactions: WalletTransaction[];
  onTopUp: (amountMAD: number, method: string) => void;
  onRequestWithdrawal?: (req: Omit<WithdrawalRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  lang,
  userRole,
  balanceMAD,
  transactions,
  onTopUp,
  onRequestWithdrawal,
}) => {
  const [activeTab, setActiveTab] = useState<'topup' | 'withdraw' | 'history'>('topup');
  const [topUpAmount, setTopUpAmount] = useState<number>(100);
  const [topUpMethod, setTopUpMethod] = useState<string>('cmiCard');
  
  // Withdrawal Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(200);
  const [withdrawMethod, setWithdrawMethod] = useState<'cih' | 'attijari' | 'gbp' | 'cashplus' | 'orange_money'>('cih');
  const [accountDetails, setAccountDetails] = useState<string>('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpAmount <= 0) return;
    onTopUp(topUpAmount, topUpMethod);
    setSuccessMsg(`تم تعبئة الرصيد بـ +${topUpAmount} ${t(lang, 'currency')} بنجاح عبر (${t(lang, topUpMethod)})!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > balanceMAD) {
      alert('المبلغ غير متاح في الرصيد الكافي للسحب');
      return;
    }
    if (!accountDetails.trim()) {
      alert('الرجاء إدخال رقم الحساب البنكي (RIB) أو رقم الهاتف');
      return;
    }

    if (onRequestWithdrawal) {
      onRequestWithdrawal({
        userId: userRole === 'driver' ? 'd1' : 'rider-1',
        userName: userRole === 'driver' ? 'يوسف العمراني (سائق)' : 'سارة العلمي (زبون)',
        userRole,
        amountMAD: withdrawAmount,
        paymentMethod: withdrawMethod,
        accountDetails,
      });
    }

    setSuccessMsg(`تم إرسال طلب سحب ${withdrawAmount} ${t(lang, 'currency')} إلى الإدارة للمراجعة!`);
    setAccountDetails('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const presetAmounts = [50, 100, 200, 500];

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-800/80 p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg leading-snug">
                {t(lang, 'walletTitle')}
              </h3>
              <p className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ServiGo Pay Maroc • Firebase Secured</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Balance Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white shadow-xl border border-indigo-500/30">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col justify-between">
              <div>
                <span className="text-indigo-100 text-xs font-semibold tracking-wider uppercase opacity-90">
                  {t(lang, 'currentBalance')}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight flex items-baseline gap-2">
                  <span>{balanceMAD.toFixed(2)}</span>
                  <span className="text-lg text-indigo-200 font-bold">{t(lang, 'currency')}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-indigo-100">
                <span>الحساب: {userRole === 'driver' ? 'كابتن سائق' : userRole === 'admin' ? 'مدير المنصة' : 'زبون ServiGo'}</span>
                <span className="bg-white/20 px-2.5 py-1 rounded-full font-medium">محدّث لحظياً ⚡</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('topup')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'topup'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t(lang, 'topUpTab')}
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'withdraw'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t(lang, 'withdrawTab')}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t(lang, 'historyTab')}
            </button>
          </div>

          {successMsg && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-indigo-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: TOP UP FORM */}
          {activeTab === 'topup' && (
            <form onSubmit={handleTopUpSubmit} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span>{t(lang, 'selectPaymentMethod')}</span>
                </label>
                
                <select
                  value={topUpMethod}
                  onChange={(e) => setTopUpMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="cmiCard">💳 {t(lang, 'cmiCard')}</option>
                  <option value="cihBank">🏛️ {t(lang, 'cihBank')}</option>
                  <option value="attijariBank">🏦 {t(lang, 'attijariBank')}</option>
                  <option value="cashPlus">🏬 {t(lang, 'cashPlus')}</option>
                  <option value="orangeMoney">📱 {t(lang, 'orangeMoney')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  {t(lang, 'topUpWallet')}
                </label>

                <div className="flex gap-2">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        topUpAmount === amt
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      +{amt} {t(lang, 'currency')}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    placeholder={t(lang, 'enterAmountMAD')}
                    className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t(lang, 'topUpBtn')}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: WITHDRAWAL FORM */}
          {activeTab === 'withdraw' && (
            <form onSubmit={handleWithdrawSubmit} className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>{t(lang, 'withdrawTitle')}</span>
                </label>
                <p className="text-[11px] text-slate-400">
                  يمكن لسائقي وشاركي ServiGo تحويل الأرباح مباشرة لحساباتهم البنكية بالمغرب
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  {t(lang, 'selectPaymentMethod')}
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="cih">🏛️ CIH Bank (CIH Mobile)</option>
                  <option value="attijari">🏦 Attijariwafa Bank</option>
                  <option value="gbp">🏬 البنك الشعبي (Banque Populaire)</option>
                  <option value="cashplus">💸 وكالات كاش بلاس (Cash Plus)</option>
                  <option value="orange_money">📱 أورنج ماني (Orange Money)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  {t(lang, 'withdrawAmount')}
                </label>
                <input
                  type="number"
                  min="50"
                  max={balanceMAD}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  {t(lang, 'accountDetailsLabel')}
                </label>
                <input
                  type="text"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="مثال: RIB 230 780 0001234567890123 45"
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>{t(lang, 'submitWithdrawalBtn')}</span>
              </button>
            </form>
          )}

          {/* TAB 3: TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t(lang, 'recentTransactions')}
              </h4>

              {transactions.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">لا توجد معاملات سابقة</p>
              ) : (
                <div className="space-y-2">
                  {transactions.map((tx) => {
                    const isPositive = tx.amount > 0;
                    return (
                      <div
                        key={tx.id}
                        className="bg-slate-800/40 border border-slate-700/40 p-3 rounded-2xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl text-xs font-bold ${
                              isPositive ? 'bg-indigo-500/10 text-indigo-400' : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-200">{tx.description}</p>
                            <span className="text-[10px] text-slate-500">
                              {new Date(tx.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className={`text-sm font-extrabold ${isPositive ? 'text-indigo-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : ''}{tx.amount} {t(lang, 'currency')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

