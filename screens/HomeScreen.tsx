
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { DAILY_CHALLENGES } from '../constants';
import { Moon, Sun, Users, TrendingUp, Heart, Smile, Star, Coffee, Cloud, BookOpen, Sparkles, ChevronLeft } from 'lucide-react';
import { hapticFeedback } from '../utils/haptics';
import LocalImage from '../components/LocalImage';

interface Props {
  onNavigate: (screen: Screen) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const HomeScreen: React.FC<Props> = ({ onNavigate, isDarkMode, toggleTheme }) => {
  const [dailyDare, setDailyDare] = useState({ date: 'ديسمبر ٢٩', title: 'تحدي DARE اليومي' });

  const categories = [
    { id: '1', title: 'تخفيف القلق', icon: <Heart className="text-rose-400" fill="#fecdd3" />, color: 'bg-rose-50', screen: 'RELAX' },
    { id: '2', title: 'وقف نوبات الهلع', icon: <Cloud className="text-indigo-400" fill="#e0e7ff" />, color: 'bg-indigo-50', screen: 'CHALLENGES' },
    { id: '3', title: 'سكينة في العمل', icon: <Star className="text-amber-400" fill="#fef3c7" />, color: 'bg-amber-50', screen: 'RELAX' },
    { id: '4', title: 'إنهاء الأرق', icon: <Moon className="text-blue-400" fill="#dbeafe" />, color: 'bg-blue-50', screen: 'RELAX' },
    { id: '5', title: 'دعم SOS', icon: <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-white shadow-lg">SOS</div>, color: 'bg-slate-50', screen: 'DARE_FLOW' },
    { id: '6', title: 'تجاوز القلق', icon: <Smile className="text-emerald-400" fill="#d1fae5" />, color: 'bg-emerald-50', screen: 'CHALLENGES' },
  ];

  return (
    <div className="flex flex-col p-6 space-y-8 animate-in fade-in duration-500 pb-32">
      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">سكينة</h1>
        <button 
          onClick={() => { hapticFeedback.impact(); toggleTheme(); }}
          className="p-2.5 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl text-[#6b5db3] dark:text-indigo-400"
        >
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>

      {/* Top Banner Cards */}
      <div className="flex space-x-4 space-x-reverse overflow-x-auto pb-4 scrollbar-hide">
        <div 
          onClick={() => { hapticFeedback.impact(); onNavigate('RELAX'); }}
          className="min-w-[200px] bg-[#a8a1d1] rounded-[32px] p-6 text-white shadow-lg relative overflow-hidden active:scale-95 transition-transform cursor-pointer"
        >
          <span className="text-[10px] font-black opacity-70 uppercase tracking-widest">{dailyDare.date}</span>
          <h3 className="text-xl font-black leading-tight mt-1">{dailyDare.title}</h3>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        </div>
        <div 
          onClick={() => { hapticFeedback.impact(); onNavigate('CHALLENGES'); }}
          className="min-w-[200px] bg-[#6b5db3] rounded-[32px] p-6 text-white shadow-lg relative overflow-hidden active:scale-95 transition-transform cursor-pointer"
        >
          <span className="text-[10px] font-black opacity-70 uppercase tracking-widest">{dailyDare.date}</span>
          <h3 className="text-xl font-black leading-tight mt-1">تحدي الاسترخاء</h3>
          <div className="absolute top-2 right-4"><Coffee size={20} className="opacity-20" /></div>
        </div>
      </div>

      {/* Daily Journal Prompt */}
      <div className="bg-gradient-to-l from-[#6b5db3] to-[#8a7bc7] rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black">يوميات سكينة</h3>
              <p className="text-xs opacity-80">فرغ مشاعرك وتحدى أفكارك الآن</p>
            </div>
          </div>
          <button 
            onClick={() => { hapticFeedback.impact(); onNavigate('JOURNAL'); }}
            className="w-full bg-white text-[#6b5db3] py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            بدء التدوين اليومي
            <ChevronLeft size={16} />
          </button>
        </div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={64} />
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => { hapticFeedback.impact(); onNavigate(cat.screen as Screen); }}
            className="flex flex-col items-center space-y-3 active:scale-95 transition-transform"
          >
            <div className={`w-full aspect-[4/5] ${cat.color} dark:bg-slate-900 rounded-[28px] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center transition-colors`}>
              {cat.icon}
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center px-1 leading-tight">
              {cat.title}
            </span>
          </button>
        ))}
      </div>

      {/* Progress Card */}
      <div 
        onClick={() => { hapticFeedback.impact(); }}
        className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer active:bg-slate-50 dark:active:bg-slate-800 transition-colors"
      >
         <div className="flex-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">تتبع تقدمك</h3>
            <div className="flex space-x-2 space-x-reverse">
               <div className="w-6 h-6 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-[10px]">❤️</div>
               <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-[10px]">☁️</div>
               <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-[10px]">🌿</div>
            </div>
         </div>
         <div className="w-24 h-16 flex items-end space-x-1.5 space-x-reverse">
            <div className="w-2.5 bg-slate-100 dark:bg-slate-800 h-4 rounded-full" />
            <div className="w-2.5 bg-slate-200 dark:bg-slate-700 h-8 rounded-full" />
            <div className="w-2.5 bg-[#6b5db3]/30 h-10 rounded-full" />
            <div className="w-2.5 bg-[#6b5db3] h-14 rounded-full" />
         </div>
      </div>

      {/* Social Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
         <div className="flex justify-between items-start mb-6">
            <div>
               <h3 className="text-[10px] font-black text-[#6b5db3] dark:text-[#a8a1d1] uppercase mb-1 flex items-center gap-1">
                 <Users size={12} /> مجتمع سكينة
               </h3>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">مجتمعنا</h2>
            </div>
            <div className="flex -space-x-3 space-x-reverse">
               {[1,2,3,4].map(i => (
                 <LocalImage 
                   key={i} 
                   cacheKey={`avatar_${i}`} 
                   prompt="Diverse human facial feature icon, minimalist flat art style, serene profile"
                   className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900" 
                 />
               ))}
            </div>
         </div>
         <button 
           onClick={() => { hapticFeedback.impact(); }}
           className="w-full bg-[#6b5db3] text-white py-4 rounded-2xl text-base font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
         >
           انضم للمجتمع
         </button>
         <p className="text-xs text-slate-400 mt-4 text-center">أنت لست وحدك، نحن جميعاً معك</p>
      </div>

      {/* Wellness Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
         <h3 className="text-[10px] font-black text-[#6b5db3] uppercase mb-4 tracking-tighter">WELLNESS SECTION</h3>
         <div className="h-32 bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 dark:from-indigo-950 dark:via-purple-950 dark:to-teal-950 rounded-[24px] mb-5 border border-white/20 overflow-hidden">
            <LocalImage 
              cacheKey="wellness_banner"
              prompt="Beautiful digital art of soft clouds over a calm sea, sunset colors, tranquil horizon"
              className="w-full h-full"
            />
         </div>
         <div className="flex items-center justify-between">
            <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg">ابدأ تجربتك المجانية</h4>
            <button 
              className="bg-[#6b5db3] text-white px-5 py-2.5 rounded-xl text-sm font-black active:scale-95 transition-all" 
              onClick={() => { hapticFeedback.impact(); onNavigate('PAYWALL'); }}
            >
              تطوير
            </button>
         </div>
      </div>
    </div>
  );
};

export default HomeScreen;
