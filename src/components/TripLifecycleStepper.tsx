import React from 'react';
import { UserCheck, MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import { RideStatus, Language } from '../types';

interface TripLifecycleStepperProps {
  status: RideStatus;
  lang?: Language;
}

export const TripLifecycleStepper: React.FC<TripLifecycleStepperProps> = ({
  status,
  lang = 'ar',
}) => {
  // Define 4 lifecycle steps requested:
  // 1. Driver Assigned
  // 2. Pickup Location Reached
  // 3. Trip Started
  // 4. Trip Completed
  
  const getStepState = (stepIndex: number) => {
    // stepIndex: 1, 2, 3, 4
    let currentStepNum = 0;
    if (status === 'accepted') currentStepNum = 1;
    else if (status === 'en_route_pickup') currentStepNum = 2;
    else if (status === 'in_trip') currentStepNum = 3;
    else if (status === 'completed') currentStepNum = 4;

    if (stepIndex < currentStepNum) return 'completed';
    if (stepIndex === currentStepNum) return 'active';
    return 'upcoming';
  };

  const steps = [
    {
      id: 1,
      titleAr: 'تخصيص السائق',
      titleFr: 'Chauffeur Assigné',
      titleEn: 'Driver Assigned',
      descAr: 'السائق وافق وينطلق إليك',
      descFr: 'En route vers votre départ',
      descEn: 'Heading to pickup location',
      icon: UserCheck,
    },
    {
      id: 2,
      titleAr: 'موقع الركوب',
      titleFr: 'Lieu de Prise en Charge',
      titleEn: 'Pickup Location Reached',
      descAr: 'السائق وصل إلى نقطة الانطلاق',
      descFr: 'Chauffeur arrivé sur place',
      descEn: 'Driver arrived at pickup',
      icon: MapPin,
    },
    {
      id: 3,
      titleAr: 'بدء الرحلة',
      titleFr: 'Trajet en Cours',
      titleEn: 'Trip Started',
      descAr: 'الرحلة جارية نحو الوجهة',
      descFr: 'En route vers la destination',
      descEn: 'On the way to destination',
      icon: Navigation,
    },
    {
      id: 4,
      titleAr: 'إكمال الرحلة',
      titleFr: 'Trajet Terminé',
      titleEn: 'Trip Completed',
      descAr: 'الوصول بسلامة للهذف',
      descFr: 'Arrivé à destination',
      descEn: 'Safely arrived at destination',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 my-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
          {lang === 'fr'
            ? 'ÉTAPES DU TRAJET'
            : lang === 'en'
            ? 'TRIP PROGRESS'
            : 'مراحل وتتبع الرحلة'}
        </span>
        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
          {status === 'accepted' && (lang === 'fr' ? 'Chauffeur confirmé' : lang === 'en' ? 'Driver confirmed' : 'السائق مؤكد')}
          {status === 'en_route_pickup' && (lang === 'fr' ? 'Arrivé au départ' : lang === 'en' ? 'At pickup location' : 'السائق بموقع الركوب')}
          {status === 'in_trip' && (lang === 'fr' ? 'En route' : lang === 'en' ? 'Trip in progress' : 'الرحلة جارية الان')}
          {status === 'completed' && (lang === 'fr' ? 'Terminé' : lang === 'en' ? 'Completed' : 'تم الوصول واكتملت')}
        </span>
      </div>

      {/* Stepper Graphic */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 relative">
        {steps.map((step) => {
          const state = getStepState(step.id);
          const Icon = step.icon;
          
          let circleBg = 'bg-slate-900 border-slate-800 text-slate-500';
          let textColor = 'text-slate-500';
          let lineBg = 'bg-slate-800';

          if (state === 'completed') {
            circleBg = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10';
            textColor = 'text-emerald-400 font-bold';
            lineBg = 'bg-emerald-500';
          } else if (state === 'active') {
            circleBg = 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/20 scale-105';
            textColor = 'text-slate-100 font-extrabold';
            lineBg = 'bg-indigo-500';
          }

          const title = lang === 'fr' ? step.titleFr : lang === 'en' ? step.titleEn : step.titleAr;

          return (
            <div key={step.id} className="flex flex-col items-center text-center relative z-10">
              {/* Connector line (if not last) */}
              {step.id < 4 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 transition-all duration-500 ${
                    state === 'completed' ? 'bg-emerald-500' : state === 'active' ? 'bg-gradient-to-r from-indigo-500 to-slate-800' : 'bg-slate-800'
                  }`}
                />
              )}

              {/* Icon Circle */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${circleBg}`}
              >
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>

              {/* Step Title */}
              <span className={`text-[10px] sm:text-[11px] mt-2 leading-tight px-0.5 line-clamp-2 ${textColor}`}>
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
