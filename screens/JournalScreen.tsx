
import React, { useState, useMemo } from 'react';
import { ThinkingTrap, MoodEntry } from '../types';
import { ChevronRight, Brain, Sparkles, Loader2, Check, History, Plus, Calendar, SlidersHorizontal, ArrowUpDown, X, Search, Filter, AlertCircle } from 'lucide-react';
import { getAIReframe } from '../services/geminiService';
import { hapticFeedback } from '../utils/haptics';

interface Props {
  onSave: (entry: MoodEntry) => void;
  onBack: () => void;
  isDarkMode: boolean;
  entries: MoodEntry[];
}

type SortOption = 'LATEST' | 'OLDEST' | 'MOOD_HIGH' | 'MOOD_LOW';
type MoodFilter = 'ALL' | 'HIGH' | 'LOW';

const JournalScreen: React.FC<Props> = ({ onSave, onBack, isDarkMode, entries }) => {
  const [view, setView] = useState<'NEW' | 'HISTORY'>('NEW');
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  
  // New Entry State
  const [mood, setMood] = useState(5);
  const [thought, setThought] = useState('');
  const [selectedTraps, setSelectedTraps] = useState<ThinkingTrap[]>([]);
  const [reframe, setReframe] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [saved, setSaved] = useState(false);

  // History State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTraps, setFilterTraps] = useState<ThinkingTrap[]>([]);
  const [moodFilter, setMoodFilter] = useState<MoodFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('LATEST');
  const [showFilters, setShowFilters] = useState(false);

  const traps: ThinkingTrap[] = [
    ThinkingTrap.FortuneTelling,
    ThinkingTrap.Catastrophizing,
    ThinkingTrap.Personalization,
    ThinkingTrap.MindReading,
    ThinkingTrap.EmotionalReasoning
  ];

  const toggleTrap = (trap: ThinkingTrap) => {
    hapticFeedback.impact();
    setSelectedTraps(prev => 
      prev.includes(trap) ? prev.filter(t => t !== trap) : [...prev, trap]
    );
  };

  const handleAIReframe = async () => {
    hapticFeedback.impact();
    if (!thought || selectedTraps.length === 0) return;
    setLoadingAI(true);
    const result = await getAIReframe(thought, selectedTraps);
    setReframe(result);
    setLoadingAI(false);
  };

  const handleSubmit = () => {
    hapticFeedback.success();
    const entry: MoodEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      moodLevel: mood,
      traps: selectedTraps,
      originalThought: thought,
      reframe: reframe
    };
    onSave(entry);
    setSaved(true);
    // Reset form
    setThought('');
    setSelectedTraps([]);
    setReframe('');
    setMood(5);
    
    setTimeout(() => {
      setSaved(false);
      setView('HISTORY');
    }, 1500);
  };

  // Memoized Filtered and Sorted Entries
  const processedEntries = useMemo(() => {
    let result = [...entries];

    // Search
    if (searchQuery) {
      result = result.filter(e => 
        e.originalThought.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.reframe.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Traps Multi-Filter
    if (filterTraps.length > 0) {
      result = result.filter(e => 
        filterTraps.some(trap => e.traps.includes(trap))
      );
    }

    // Mood Filter
    if (moodFilter === 'HIGH') {
      result = result.filter(e => e.moodLevel >= 7);
    } else if (moodFilter === 'LOW') {
      result = result.filter(e => e.moodLevel <= 4);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'LATEST': return b.timestamp - a.timestamp;
        case 'OLDEST': return a.timestamp - b.timestamp;
        case 'MOOD_HIGH': return b.moodLevel - a.moodLevel;
        case 'MOOD_LOW': return a.moodLevel - b.moodLevel;
        default: return 0;
      }
    });

    return result;
  }, [entries, searchQuery, filterTraps, moodFilter, sortBy]);

  const toggleHistoryTrapFilter = (trap: ThinkingTrap) => {
    hapticFeedback.impact();
    setFilterTraps(prev => 
      prev.includes(trap) ? prev.filter(t => t !== trap) : [...prev, trap]
    );
  };

  const cycleSort = () => {
    hapticFeedback.impact();
    const options: SortOption[] = ['LATEST', 'OLDEST', 'MOOD_HIGH', 'MOOD_LOW'];
    const nextIndex = (options.indexOf(sortBy) + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const clearFilters = () => {
    hapticFeedback.impact();
    setFilterTraps([]);
    setMoodFilter('ALL');
    setSearchQuery('');
    setSortBy('LATEST');
  };

  const isFilterActive = filterTraps.length > 0 || moodFilter !== 'ALL' || searchQuery !== '';

  if (saved) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 dark:bg-slate-950">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
          <Check size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2 tracking-tight">تم الحفظ بنجاح</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">فخورون بك لمحاولة التفكير بواقعية اليوم.</p>
      </div>
    );
  }

  if (selectedEntry) {
    return (
      <div className="p-6 space-y-6 dark:bg-slate-950 min-h-full pb-32">
        <div className="flex items-center space-x-2 space-x-reverse">
          <button onClick={() => { hapticFeedback.impact(); setSelectedEntry(null); }} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-full text-slate-600 dark:text-slate-400">
            <ChevronRight size={24} />
          </button>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">تفاصيل اليومية</h2>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 space-y-8 shadow-sm transition-colors">
          <div className="flex justify-between items-center">
            <span className={`text-sm font-black px-4 py-1.5 rounded-full ${
              selectedEntry.moodLevel >= 7 ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/20' : 
              selectedEntry.moodLevel <= 4 ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20' : 'bg-amber-50 text-amber-500 dark:bg-amber-900/20'
            }`}>
              مستوى القلق: {selectedEntry.moodLevel}
            </span>
            <span className="text-xs font-bold text-slate-400">{new Date(selectedEntry.timestamp).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <section>
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3">الفكرة الأصلية</h4>
            <p className="text-slate-700 dark:text-slate-200 text-lg italic leading-relaxed">"{selectedEntry.originalThought}"</p>
          </section>
          <section>
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3">فخاخ التفكير المكتشفة</h4>
            <div className="flex flex-wrap gap-2">
              {selectedEntry.traps.map(t => (
                <span key={t} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">{t}</span>
              ))}
            </div>
          </section>
          <section className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
            <h4 className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
               <Sparkles size={14} /> إعادة الصياغة
            </h4>
            <p className="text-emerald-900 dark:text-emerald-200 font-bold text-lg leading-relaxed">{selectedEntry.reframe}</p>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 dark:bg-slate-950 min-h-full pb-32">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 space-x-reverse">
          <button onClick={onBack} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-full text-slate-600 dark:text-slate-400 active:scale-95 transition-all">
            <ChevronRight size={24} />
          </button>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">مفكرة سكينة</h2>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
          <button 
            onClick={() => { hapticFeedback.impact(); setView('NEW'); }}
            className={`p-3 rounded-xl transition-all ${view === 'NEW' ? 'bg-white dark:bg-slate-800 shadow-md text-[#6b5db3]' : 'text-slate-400'}`}
          >
            <Plus size={20} />
          </button>
          <button 
            onClick={() => { hapticFeedback.impact(); setView('HISTORY'); }}
            className={`p-3 rounded-xl transition-all ${view === 'HISTORY' ? 'bg-white dark:bg-slate-800 shadow-md text-[#6b5db3]' : 'text-slate-400'}`}
          >
            <History size={20} />
          </button>
        </div>
      </div>

      {view === 'NEW' ? (
        <div className="space-y-8 animate-in slide-in-from-top duration-300">
          <section>
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[#6b5db3] rounded-full shadow-lg shadow-indigo-500/20" />
              مستوى القلق (1-10)
            </h3>
            <div className="px-2">
              <input 
                type="range" min="1" max="10" step="1" 
                value={mood} onChange={(e) => { hapticFeedback.impact(); setMood(parseInt(e.target.value)); }}
                className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#6b5db3] hover:accent-[#7e6bc4] transition-all"
              />
              <div className="flex justify-between mt-4 text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">
                <span>هدوء تام</span>
                <span>قلق حاد</span>
              </div>
              <div className="text-center mt-2 text-5xl font-black text-[#6b5db3] dark:text-indigo-400 transition-all">{mood}</div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[#6b5db3] rounded-full" />
              بماذا تفكر الآن؟
            </h3>
            <textarea 
              placeholder="اكتب الفكرة التي تشغل بالك بصدق..."
              className="w-full h-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 text-slate-800 dark:text-slate-100 text-lg leading-relaxed focus:ring-4 focus:ring-[#6b5db3]/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-sm"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
            />
          </section>

          <section>
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-3">
              <Brain size={22} className="text-[#6b5db3] dark:text-indigo-400" />
              حدد فخاخ التفكير
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {traps.map(trap => (
                <button
                  key={trap}
                  onClick={() => toggleTrap(trap)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all border ${
                    selectedTraps.includes(trap) 
                      ? 'bg-[#6b5db3] border-[#6b5db3] text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-500 active:bg-slate-50 dark:active:bg-slate-800'
                  }`}
                >
                  {trap}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 p-8 rounded-[40px] space-y-5 shadow-sm transition-colors">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-emerald-900 dark:text-emerald-300 text-xl flex items-center gap-2">
                <Sparkles size={20} />
                إعادة الصياغة
              </h3>
              <button 
                onClick={handleAIReframe}
                disabled={loadingAI || !thought || selectedTraps.length === 0}
                className="bg-white/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black px-4 py-2 rounded-xl shadow-sm border border-emerald-100/50 dark:border-emerald-800/50 disabled:opacity-50 active:scale-95 transition-all flex items-center gap-2"
              >
                {loadingAI ? <Loader2 className="animate-spin" size={16} /> : <><Sparkles size={14} /> ذكاء اصطناعي</>}
              </button>
            </div>
            <textarea 
              placeholder="دعنا نصيغ الفكرة بطريقة أكثر واقعية..."
              className="w-full h-32 bg-white/60 dark:bg-slate-950/40 border border-emerald-200/50 dark:border-emerald-900/30 rounded-2xl p-5 text-emerald-950 dark:text-emerald-100 text-lg leading-relaxed outline-none focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-emerald-300/60"
              value={reframe}
              onChange={(e) => setReframe(e.target.value)}
            />
          </section>

          <button 
            onClick={handleSubmit}
            disabled={!thought || !reframe}
            className="w-full bg-[#6b5db3] hover:bg-[#7e6bc4] text-white py-6 rounded-3xl font-black text-2xl shadow-2xl shadow-indigo-500/20 disabled:opacity-50 active:scale-[0.98] transition-all mb-10"
          >
            حفظ اليومية
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
          {/* History Toolbar */}
          <div className="space-y-4 mb-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="بحث في اليوميات..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3 pr-10 pl-10 text-sm outline-none focus:ring-2 focus:ring-[#6b5db3]/20 transition-all text-right"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><X size={14} /></button>
                )}
              </div>
              <button 
                onClick={() => { hapticFeedback.impact(); setShowFilters(!showFilters); }}
                className={`p-3 rounded-2xl border transition-all ${showFilters || isFilterActive ? 'bg-[#6b5db3] text-white border-[#6b5db3]' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500'}`}
              >
                <SlidersHorizontal size={20} />
              </button>
              <button 
                onClick={cycleSort}
                className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 active:scale-95 transition-all flex items-center gap-1"
              >
                <ArrowUpDown size={18} />
                <span className="text-[10px] font-black uppercase whitespace-nowrap">
                  {sortBy === 'LATEST' ? 'الأحدث' : sortBy === 'OLDEST' ? 'الأقدم' : sortBy === 'MOOD_HIGH' ? 'الأعلى' : 'الأقل'}
                </span>
              </button>
            </div>

            {(showFilters || isFilterActive) && (
              <div className="animate-in slide-in-from-top duration-200 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">فلاتر متقدمة</h4>
                   <button onClick={clearFilters} className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1">
                     <X size={12} /> مسح الكل
                   </button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500">فخاخ التفكير:</p>
                  <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
                    {traps.map(trap => (
                      <button
                        key={trap}
                        onClick={() => toggleHistoryTrapFilter(trap)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                          filterTraps.includes(trap) 
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-[#6b5db3] text-[#6b5db3]' 
                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        {trap}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500">مستوى القلق:</p>
                  <div className="flex gap-2">
                    {(['ALL', 'HIGH', 'LOW'] as MoodFilter[]).map(m => (
                      <button
                        key={m}
                        onClick={() => { hapticFeedback.impact(); setMoodFilter(m); }}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                          moodFilter === m 
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 border-[#6b5db3] text-[#6b5db3]' 
                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        {m === 'ALL' ? 'الكل' : m === 'HIGH' ? 'حاد (7+)' : 'منخفض (4-)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {processedEntries.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-slate-900/50 rounded-[40px] border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700">
                {isFilterActive ? <Filter size={40} /> : <Calendar size={40} />}
              </div>
              <p className="text-slate-400 dark:text-slate-600 font-bold px-8">
                {isFilterActive ? 'لا توجد نتائج مطابقة لهذه الفلاتر' : 'لا توجد سجلات بعد. ابدأ أول تدوين لك اليوم واستعد توازنك!'}
              </p>
              {isFilterActive && (
                <button onClick={clearFilters} className="mt-4 text-[#6b5db3] text-sm font-black underline">إعادة تعيين البحث</button>
              )}
            </div>
          ) : (
            processedEntries.map(entry => (
              <button 
                key={entry.id}
                onClick={() => { hapticFeedback.impact(); setSelectedEntry(entry); }}
                className="w-full text-right p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-sm active:scale-[0.98] active:shadow-none transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                    entry.moodLevel >= 7 ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/20' : 
                    entry.moodLevel <= 4 ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20' : 'bg-amber-50 text-amber-500 dark:bg-amber-900/20'
                  }`}>
                    المستوى {entry.moodLevel}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">{new Date(entry.timestamp).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 text-lg line-clamp-2 font-black leading-tight mb-4">"{entry.originalThought}"</p>
                <div className="flex gap-1.5 flex-wrap">
                  {entry.traps.slice(0, 3).map(t => (
                    <span key={t} className="text-[9px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-2.5 py-1 rounded-lg">{t}</span>
                  ))}
                  {entry.traps.length > 3 && <span className="text-[9px] font-bold text-slate-300">+ {entry.traps.length - 3}</span>}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JournalScreen;
