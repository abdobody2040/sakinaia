
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Volume2, SkipBack, SkipForward, Maximize2, Share2, List, ChevronDown, ListMusic } from 'lucide-react';
import { AudioTrack } from '../types';
import { hapticFeedback } from '../utils/haptics';
import LocalImage from './LocalImage';

interface Props {
  track: AudioTrack;
  onClose: () => void;
  isMini?: boolean;
}

const AudioPlayer: React.FC<Props> = ({ track, onClose, isMini: initialIsMini = true }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMini, setIsMini] = useState(initialIsMini);
  const [duration] = useState(1197); // 19:57 mock
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, duration]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    hapticFeedback.impact();
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isMini) {
    return (
      <div 
        onClick={() => setIsMini(false)}
        className="fixed inset-x-4 bottom-24 bg-[#7e6bc4] text-white p-4 rounded-2xl flex items-center justify-between shadow-2xl z-[150] animate-in slide-in-from-bottom duration-300 cursor-pointer border border-white/10"
      >
        <div className="flex items-center space-x-3 space-x-reverse flex-1">
          <button onClick={togglePlay} className="p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <div className="flex-1 overflow-hidden">
            <h4 className="font-bold text-sm truncate text-right">{track.arabicLabel}</h4>
          </div>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-xs font-bold opacity-90">{formatTime(duration - currentTime)}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f8f7ff] dark:bg-slate-950 z-[200] flex flex-col animate-in slide-in-from-bottom duration-500 overflow-y-auto">
      <div className="p-6 flex justify-between items-center">
        <button onClick={() => setIsMini(true)} className="p-2 text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition-colors">
          <ChevronDown size={28} />
        </button>
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">قسم الاسترخاء</h4>
        <div className="w-10" />
      </div>

      <div className="flex-1 px-8 flex flex-col pt-4">
        <h2 className="text-3xl font-black text-[#2e1065] dark:text-white mb-6 text-right">{track.arabicLabel}</h2>
        
        <div className="aspect-square w-full rounded-[40px] overflow-hidden shadow-2xl mb-8 relative bg-slate-200 dark:bg-slate-800">
          <LocalImage 
            cacheKey={`track_${track.id}`}
            prompt={`Abstract peaceful landscape, calm zen garden theme, soft purple and blue hues, meditation vibes`}
            className="w-full h-full"
            alt={track.title}
          />
        </div>

        <div className="space-y-6">
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed text-right">
            استمع لهذا التأمل الموجه لتقليل مشاعر القلق العام والحصول على تحرر أعمق.
          </p>

          <div className="flex justify-between items-center text-[#6b5db3] dark:text-indigo-400 pt-4">
             <div className="flex space-x-6 space-x-reverse">
                <button onClick={() => hapticFeedback.impact()} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl"><ListMusic size={26} /></button>
                <button onClick={() => hapticFeedback.impact()} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl"><Share2 size={26} /></button>
             </div>
             <button className="p-2 text-slate-300 dark:text-slate-700">...</button>
          </div>
        </div>

        <div className="mt-12 mb-12 space-y-8">
          <button 
            onClick={togglePlay}
            className="w-full bg-[#7e6bc4] text-white py-5 rounded-[28px] flex items-center justify-between px-8 shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="mr-1" />}
              </div>
              <span className="text-xl font-black">{isPlaying ? 'إيقاف المشغل' : 'تشغيل المشغل'}</span>
            </div>
            <span className="text-white/80 font-bold text-lg">{formatTime(duration)}</span>
          </button>

          <div className="space-y-4">
            <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full">
              <div 
                className="absolute h-full bg-[#7e6bc4] rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <div 
                className="absolute top-1/2 -mt-2 w-4 h-4 bg-white border-2 border-[#7e6bc4] rounded-full shadow-md"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
