
import React, { useState, useEffect } from 'react';
import { generateThematicImage, imageCache, checkHasApiKey, openKeySelector, ImageGenError } from '../services/imageService';
import { Loader2, Image as ImageIcon, Key, AlertCircle } from 'lucide-react';
import { hapticFeedback } from '../utils/haptics';

interface Props {
  cacheKey: string;
  prompt: string;
  className?: string;
  alt?: string;
}

const LocalImage: React.FC<Props> = ({ cacheKey, prompt, className = "", alt = "" }) => {
  const [src, setSrc] = useState<string | null>(imageCache.get(cacheKey));
  const [loading, setLoading] = useState(!src);
  const [needsKey, setNeedsKey] = useState(false);
  const [error, setError] = useState(false);

  const fetchImage = async () => {
    setLoading(true);
    setError(false);
    setNeedsKey(false);
    
    try {
      const data = await generateThematicImage(prompt);
      if (data) {
        imageCache.set(cacheKey, data);
        setSrc(data);
      } else {
        setError(true);
      }
    } catch (err: any) {
      if (err instanceof ImageGenError && (err.code === 403 || err.code === 429)) {
        // Even if checkHasApiKey was true, the current key is failing with 403/429
        // So we force the "needs key" state to allow re-selection.
        setNeedsKey(true);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!src) {
      fetchImage();
    }
  }, [cacheKey, prompt, src]);

  const handleSetKey = async () => {
    hapticFeedback.impact();
    await openKeySelector();
    // Proceed immediately as the key selection is handled externally
    fetchImage();
  };

  if (loading) {
    return (
      <div className={`${className} bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 animate-pulse`}>
        <Loader2 className="animate-spin mb-2" size={24} />
        <span className="text-[10px] font-black uppercase tracking-widest">إنشاء صورة...</span>
      </div>
    );
  }

  if (needsKey) {
    return (
      <div className={`${className} bg-indigo-50 dark:bg-indigo-950/30 flex flex-col items-center justify-center p-4 text-center border border-indigo-100 dark:border-indigo-900/30`}>
        <Key size={20} className="text-[#6b5db3] dark:text-indigo-400 mb-2" />
        <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 mb-2 leading-tight">
          مشكلة في الصلاحيات أو الحصة. يرجى تفعيل مفتاح API صالح.
        </p>
        <button 
          onClick={handleSetKey}
          className="text-[9px] font-black bg-[#6b5db3] text-white px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all"
        >
          تفعيل/تغيير المفتاح
        </button>
      </div>
    );
  }

  if (error || !src) {
    return (
      <div className={`${className} bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 space-y-2`}>
        <AlertCircle size={24} />
        <button 
          onClick={fetchImage}
          className="text-[9px] font-black underline"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      className={`${className} object-cover`} 
      alt={alt} 
      loading="lazy"
    />
  );
};

export default LocalImage;
