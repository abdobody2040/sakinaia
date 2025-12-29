
import React from 'react';
import { ThemeMode } from '../types';
import { ChevronRight, Moon, Sun, Monitor, Bell, Shield, LogOut, Award, Calendar, Heart, Share2, Star, Key, ExternalLink } from 'lucide-react';
import { hapticFeedback } from '../utils/haptics';
import LocalImage from '../components/LocalImage';
import { openKeySelector } from '../services/imageService';

interface Props {
  onBack: () => void;
  themeMode: ThemeMode;
  onSetThemeMode: (mode: ThemeMode) => void;
  journalCount: number;
}

const ProfileScreen: React.FC<Props> = ({ onBack, themeMode, onSetThemeMode, journalCount }) => {
  const themeOptions: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'فاتح', icon: <Sun size={20} /> },
    { id: 'dark', label: 'داكن', icon: <Moon size={20} /> },
    { id: 'system', label: 'تلقائي', icon: <Monitor size={20} /> },
  ];

  const handleManageKey = async () => {
    hapticFeedback.impact();
    await openKeySelector();
  };

  return (
    <div className="flex flex-col p-6 space-y-8 animate-in fade-in duration-500 pb-32 dark:bg-slate-950 min-h-full">
      <div className="flex items-center space-x-2 space-x-reverse">
        <button onClick={onBack} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-full text-slate-600 dark:text-slate-400 active:scale-95 transition-all">
          <ChevronRight size={24} />
        </button>
        <h2 className="text-3xl font-black text-slate-800 dark:text-white">ملفي الشخصي</h2>
      </div>

      {/* User Info Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <LocalImage 
            cacheKey="user_avatar_main" 
            prompt="Minimalist profile avatar icon, serene face, soft colors, professional digital art"
            className="w-24 h-24 rounded-full border-4 border-[#6b5db3]/20 shadow-xl"
          />
          <div className="absolute bottom-0 right-0 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 shadow-sm" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">صديق سكينة</h3>
          <p className="text-slate-400 text-sm font-medium">مستكشف السلام الداخلي</p>
        </div>
        <div className="flex gap-4 w-full pt-4">
           <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">يوميات</p>
              <p className="text-2xl font-black text-[#6b5db3] dark:text-indigo-400">{journalCount}</p>
           </div>
           <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">مستوى الهدوء</p>
              <p className="text-2xl font-black text-emerald-500">٨/١٠</p>
           </div>
        </div>
      </div>

      {/* API Key Management - Resolves the 429 quota error */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">إدارة مفاتيح Gemini</h3>
        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950 dark:to-slate-900 rounded-[32px] p-6 border border-indigo-100 dark:border-indigo-900/30 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl text-[#6b5db3] dark:text-indigo-400 shadow-sm">
              <Key size={24} />
            </div>
            <div>
              <h4 className="font-black text-slate-800 dark:text-white">مفتاح API الخاص بك</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                استخدم مفتاحك الخاص للحصول على جودة صور أعلى (1K-4K) ولتجنب حدود الاستخدام العامة.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleManageKey}
              className="w-full bg-[#6b5db3] text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <Key size={16} />
              إعداد مفتاح الـ API
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1 hover:text-[#6b5db3] transition-colors"
            >
              شروط الدفع والفوترة <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </section>

      {/* Theme Selection */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">مظهر التطبيق</h3>
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-2 border border-slate-100 dark:border-slate-800 flex gap-1 shadow-sm transition-colors">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { hapticFeedback.impact(); onSetThemeMode(opt.id); }}
              className={`flex-1 py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                themeMode === opt.id 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-[#6b5db3] dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {opt.icon}
              <span className="text-[11px] font-black">{opt.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Other Settings */}
      <section className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">الإعدادات</h3>
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
          <SettingsItem icon={<Bell size={20} />} label="التنبيهات اليومية" />
          <SettingsItem icon={<Shield size={20} />} label="الخصوصية والأمان" />
          <SettingsItem icon={<Award size={20} />} label="الإنجازات" />
          <SettingsItem icon={<Star size={20} />} label="قيم التطبيق" last />
        </div>
      </section>

      <button 
        onClick={() => hapticFeedback.warning()}
        className="w-full py-5 rounded-[28px] text-rose-500 font-black flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 active:scale-[0.98] transition-all"
      >
        <LogOut size={20} />
        تسجيل الخروج
      </button>
    </div>
  );
};

const SettingsItem: React.FC<{ icon: React.ReactNode; label: string; last?: boolean }> = ({ icon, label, last }) => (
  <button className={`w-full flex items-center justify-between p-5 active:bg-slate-50 dark:active:bg-slate-800 transition-colors ${!last ? 'border-b border-slate-50 dark:border-slate-800' : ''}`}>
    <div className="flex items-center gap-4 text-slate-700 dark:text-slate-200">
      <div className="text-slate-400 dark:text-slate-600">{icon}</div>
      <span className="font-bold">{label}</span>
    </div>
    <ChevronRight size={18} className="text-slate-300 dark:text-slate-700" />
  </button>
);

export default ProfileScreen;
