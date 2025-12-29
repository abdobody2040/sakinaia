
import React, { useState, useMemo } from 'react';
import { RELAX_CONTENT, CHALLENGE_CONTENT } from '../constants';
// Fix: Added missing 'Smile' import from lucide-react to resolve the reported error.
import { ChevronRight, Lock, Play, Music2, Search, Sparkles, Wind, User, Sun, Heart, Mountain, Leaf, Moon, Zap, HeartHandshake, Stethoscope, Users, CloudRain, Home, Accessibility, ArrowUpCircle, Clock, Car, Smile, X } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import { AudioTrack } from '../types';
import { hapticFeedback } from '../utils/haptics';

interface Props {
  onBack: () => void;
  isPremium: boolean;
  onUpgrade: () => void;
  isDarkMode: boolean;
  mode: 'RELAX' | 'CHALLENGE';
}

const RelaxScreen: React.FC<Props> = ({ onBack, isPremium, onUpgrade, isDarkMode, mode }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'BODILY' | 'SITUATIONAL'>('ALL');
  const [playingTrack, setPlayingTrack] = useState<AudioTrack | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tracks = mode === 'RELAX' ? RELAX_CONTENT : CHALLENGE_CONTENT;

  const filteredTracks = useMemo(() => {
    return tracks.filter(track => {
      const matchesSearch = track.arabicLabel.includes(searchQuery) || track.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'ALL' || track.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [tracks, searchQuery, activeTab]);

  const iconMap: Record<string, any> = {
    Wind, User, Sun, Heart, Mountain, Leaf, Moon, Zap, HeartHandshake,
    Stethoscope, Users, CloudRain, Home, Accessibility, ArrowUpCircle, Clock, Car
  };

  const handleTrackClick = (track: AudioTrack) => {
    if (track.isPremium && !isPremium) {
      hapticFeedback.warning();
      onUpgrade();
      return;
    }
    hapticFeedback.impact();
    setPlayingTrack(track);
  };

  return (
    <div className={`p-6 space-y-6 ${mode === 'RELAX' ? 'bg-[#eef2ff]' : 'bg-[#fff1f2]'} dark:bg-slate-950 min-h-full transition-colors pb-32`}>
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-600 dark:text-slate-400 active:scale-95 transition-all">
          <ChevronRight size={24} />
        </button>
        <div className="bg-white/50 dark:bg-slate-900/50 p-2 rounded-full">
           {mode === 'RELAX' ? <Smile size={24} className="text-[#6b5db3]" /> : <Users size={24} className="text-[#be123c]" />}
        </div>
      </div>

      <div className="space-y-1 text-right">
        <h2 className="text-4xl font-black text-[#2e1065] dark:text-white leading-tight">
          {mode === 'RELAX' ? 'ماذا تريد أن تفعل؟' : 'ماذا تريد أن تتجاوز؟'}
        </h2>
      </div>

      {/* Search Bar - Style from screenshots */}
      <div className="relative">
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="ابحث عن دليل..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl py-4 pr-12 pl-12 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-[#6b5db3]/20 transition-all text-right"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 left-4 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white/40 dark:bg-slate-900/40 rounded-2xl">
        {(['ALL', 'SITUATIONAL', 'BODILY'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => { hapticFeedback.impact(); setActiveTab(tab); }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === tab 
                ? 'bg-white dark:bg-slate-800 shadow-md text-[#6b5db3] dark:text-indigo-400' 
                : 'text-slate-500 dark:text-slate-600'
            }`}
          >
            {tab === 'ALL' ? 'الكل' : tab === 'SITUATIONAL' ? 'مواقف' : 'أحاسيس'}
          </button>
        ))}
      </div>

      {/* List - Matches image style */}
      <div className="space-y-3">
        {filteredTracks.length > 0 ? filteredTracks.map(track => {
          const IconComp = iconMap[track.icon || 'Play'] || Play;
          return (
            <button 
              key={track.id} 
              onClick={() => handleTrackClick(track)}
              className="w-full text-right flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-[28px] shadow-sm hover:shadow-md active:scale-[0.98] transition-all group"
            >
              <div className="flex items-center space-x-5 space-x-reverse">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  track.isPremium && !isPremium 
                    ? 'bg-slate-50 dark:bg-slate-950 text-slate-300' 
                    : 'bg-indigo-50 dark:bg-indigo-900/20 text-[#6b5db3] dark:text-indigo-400'
                }`}>
                  <IconComp size={24} />
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{track.arabicLabel}</h4>
                  <p className="text-xs text-slate-400 font-medium">{track.duration} دقيقة</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {track.isPremium && !isPremium ? (
                  <Lock size={18} className="text-amber-400 opacity-60" />
                ) : (
                  <Play size={18} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </button>
          );
        }) : (
          <div className="text-center py-20 text-slate-400 font-bold">
            لا توجد نتائج مطابقة لبحثك
          </div>
        )}
      </div>

      {playingTrack && (
        <AudioPlayer track={playingTrack} onClose={() => setPlayingTrack(null)} isMini={false} />
      )}

      {/* AI Floating Button from images */}
      <button 
        onClick={() => { hapticFeedback.impact(); /* Simulation */ alert('تواصل مع مرشدك الذكي قريباً!'); }}
        className="fixed bottom-32 left-6 w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center text-[#6b5db3] border-2 border-[#6b5db3]/10 z-50 animate-bounce active:scale-90 transition-transform"
      >
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase">AI</span>
          <Sparkles size={16} />
        </div>
      </button>
    </div>
  );
};

export default RelaxScreen;
