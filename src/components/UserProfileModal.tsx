import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, ShieldAlert, Star, CheckCircle2, X, Camera, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
}) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [photo, setPhoto] = useState(user.photo);
  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact || '0661009988');
  const [savedHome, setSavedHome] = useState('شارع الأنشطة، المعاريف، الدار البيضاء');
  const [savedWork, setSavedWork] = useState('Technopark Casablanca');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...user,
      name,
      phone,
      email,
      photo,
      emergencyContact,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div className="relative">
            <img
              src={photo}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <button
              type="button"
              onClick={() => {
                const newAvatar = prompt('أدخل رابط الصورة الجديدة (URL):', photo);
                if (newAvatar) setPhoto(newAvatar);
              }}
              className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{name}</h2>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>حساب موثق</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{user.rating}</span>
              </span>
              <span>•</span>
              <span>{user.totalTrips} رحلة مكتملة</span>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl text-center font-bold animate-in fade-in">
            ✓ تم حفظ البيانات وتحديث الملف الشخصي بنجاح!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">الاسم الكامل</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl pr-9 pl-3 py-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">رقم الهاتف (+212)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl pr-9 pl-3 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl pr-9 pl-3 py-2.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1 text-rose-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>رقم طوارئ العائلة (SOS Emergency Contact)</span>
            </label>
            <input
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="0611223344"
              className="w-full bg-slate-950 border border-rose-500/30 text-slate-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">يُخطر هذا الرقم تلقائياً في حالة الضغط على زر SOS وقت الرحلة</span>
          </div>

          {/* Saved Addresses Section */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <span className="font-extrabold text-slate-200 block">العناوين المفضلة (Saved Places)</span>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 block font-bold">المنزل:</span>
                  <input
                    type="text"
                    value={savedHome}
                    onChange={(e) => setSavedHome(e.target.value)}
                    className="w-full bg-transparent text-slate-100 font-medium text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="flex-1">
                  <span className="text-[10px] text-slate-400 block font-bold">العمل / المكتب:</span>
                  <input
                    type="text"
                    value={savedWork}
                    onChange={(e) => setSavedWork(e.target.value)}
                    className="w-full bg-transparent text-slate-100 font-medium text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-2xl text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التغييرات والتحديث</span>
          </button>
        </form>

      </div>
    </div>
  );
};
