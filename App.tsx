
import React, { useState, useEffect } from 'react';
import { Screen, MoodEntry, ThemeMode } from './types';
import HomeScreen from './screens/HomeScreen';
import DAREFlowScreen from './screens/DAREFlowScreen';
import JournalScreen from './screens/JournalScreen';
import RelaxScreen from './screens/LibraryScreen';
import PaywallScreen from './screens/PaywallScreen';
import ProfileScreen from './screens/ProfileScreen';
import { Home, BookOpen, Music, CreditCard, LifeBuoy, User, ShieldAlert } from 'lucide-react';
import { hapticFeedback } from './utils/haptics';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [journalEntries, setJournalEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('journal_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('is_premium') === 'true');
  const [showSplash, setShowSplash] = useState(true);
  
  // Theme Management
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme_mode') as ThemeMode;
    return saved || 'system';
  });
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      let shouldBeDark = false;
      if (themeMode === 'system') {
        shouldBeDark = mediaQuery.matches;
      } else {
        shouldBeDark = themeMode === 'dark';
      }
      setIsDarkMode(shouldBeDark);
      document.documentElement.classList.toggle('dark', shouldBeDark);
      localStorage.setItem('theme_mode', themeMode);
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (screen: Screen) => {
    hapticFeedback.impact();
    setCurrentScreen(screen);
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#0f766e] flex flex-col items-center justify-center text-white p-6 z-[100]">
        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
          <div className="text-6xl font-black text-white">س</div>
        </div>
        <h1 className="text-4xl font-black mb-2 tracking-wider">سكينة</h1>
        <p className="text-xl opacity-90 text-center">واجه مخاوفك.. لتستعيد حياتك</p>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME': return (
        <HomeScreen 
          onNavigate={handleNavigate} 
          isDarkMode={isDarkMode} 
          toggleTheme={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} 
        />
      );
      case 'DARE_FLOW': return <DAREFlowScreen onFinish={() => handleNavigate('HOME')} />;
      case 'JOURNAL': return (
        <JournalScreen 
          onSave={(entry) => setJournalEntries([entry, ...journalEntries])} 
          onBack={() => handleNavigate('HOME')} 
          isDarkMode={isDarkMode} 
          entries={journalEntries}
        />
      );
      case 'RELAX': return (
        <RelaxScreen 
          mode="RELAX"
          onBack={() => handleNavigate('HOME')} 
          isPremium={isPremium} 
          onUpgrade={() => handleNavigate('PAYWALL')} 
          isDarkMode={isDarkMode} 
        />
      );
      case 'CHALLENGES': return (
        <RelaxScreen 
          mode="CHALLENGE"
          onBack={() => handleNavigate('HOME')} 
          isPremium={isPremium} 
          onUpgrade={() => handleNavigate('PAYWALL')} 
          isDarkMode={isDarkMode} 
        />
      );
      case 'PAYWALL': return (
        <PaywallScreen 
          onBack={() => handleNavigate('HOME')} 
          onPurchase={() => { setIsPremium(true); localStorage.setItem('is_premium', 'true'); handleNavigate('HOME'); }} 
        />
      );
      case 'PROFILE': return (
        <ProfileScreen 
          onBack={() => handleNavigate('HOME')}
          themeMode={themeMode}
          onSetThemeMode={setThemeMode}
          journalCount={journalEntries.length}
        />
      );
      default: return <HomeScreen onNavigate={handleNavigate} isDarkMode={isDarkMode} toggleTheme={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')} />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="max-w-md mx-auto h-screen bg-[#fafaff] dark:bg-slate-950 flex flex-col relative overflow-hidden shadow-2xl border-x border-slate-100 dark:border-slate-800 transition-colors duration-300">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderScreen()}
        </div>

        {/* Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-[150] h-20">
          <NavButton active={currentScreen === 'HOME'} icon={<Home size={22} />} label="الرئيسية" onClick={() => handleNavigate('HOME')} />
          <NavButton active={currentScreen === 'RELAX'} icon={<Music size={22} />} label="استرخاء" onClick={() => handleNavigate('RELAX')} />
          
          {/* SOS Floating Button */}
          <div className="relative -top-6">
            <button 
              onClick={() => handleNavigate('DARE_FLOW')}
              className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-[#fff1f2] dark:border-slate-900 active:scale-90 transition-all group"
            >
              <ShieldAlert size={28} className="text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-rose-500">SOS</span>
            </button>
          </div>

          <NavButton active={currentScreen === 'CHALLENGES'} icon={<TrendingUp size={22} />} label="تحديات" onClick={() => handleNavigate('CHALLENGES')} />
          <NavButton active={currentScreen === 'PROFILE'} icon={<User size={22} />} label="ملفي" onClick={() => handleNavigate('PROFILE')} />
        </nav>
      </div>
    </div>
  );
};

const TrendingUp: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>
);

const NavButton: React.FC<{ active: boolean, icon: React.ReactNode, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center space-y-1 flex-1 transition-colors ${active ? 'text-[#6b5db3] dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>
    <div className={`p-1 rounded-xl transition-all ${active ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
      {icon}
    </div>
    <span className="text-[9px] font-bold tracking-tight">{label}</span>
  </button>
);

export default App;
