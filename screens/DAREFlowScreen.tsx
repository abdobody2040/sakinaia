
import React, { useState, useEffect } from 'react';
import { DARE_STEPS } from '../constants';
import { ChevronLeft, ChevronRight, Volume2, X } from 'lucide-react';
import { hapticFeedback } from '../utils/haptics';

interface Props {
  onFinish: () => void;
}

const DAREFlowScreen: React.FC<Props> = ({ onFinish }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const step = DARE_STEPS[stepIndex];

  useEffect(() => {
    // Auto-play hint
    setIsPlaying(true);
    const timer = setTimeout(() => setIsPlaying(false), 3000);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  const nextStep = () => {
    hapticFeedback.impact();
    setStepIndex(prev => prev + 1);
  };

  const prevStep = () => {
    hapticFeedback.impact();
    setStepIndex(prev => prev - 1);
  };

  const handleFinish = () => {
    hapticFeedback.success();
    onFinish();
  };

  return (
    <div className="h-full bg-rose-900 text-white p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <button onClick={handleFinish} className="p-2 bg-white/10 rounded-full">
          <X size={24} />
        </button>
        <div className="text-center">
          <p className="text-rose-300 text-xs uppercase tracking-widest font-bold">منهجية المواجهة</p>
          <div className="flex space-x-1 space-x-reverse justify-center mt-1">
            {DARE_STEPS.map((_, i) => (
              <div key={i} className={`h-1 w-6 rounded-full transition-all ${i <= stepIndex ? 'bg-white' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in slide-in-from-bottom duration-500">
        <div className={`w-24 h-24 bg-white/10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'scale-110 shadow-[0_0_40px_rgba(255,255,255,0.2)]' : ''}`}>
          <Volume2 size={40} className={isPlaying ? 'animate-pulse' : ''} />
        </div>

        <div className="space-y-4 px-4">
          <h2 className="text-3xl font-black tracking-tight">{step.title}</h2>
          <p className="text-xl text-rose-100 font-medium leading-relaxed">
            {step.instruction}
          </p>
        </div>

        <div className="bg-black/20 p-6 rounded-3xl border border-white/5 w-full">
          <p className="text-sm opacity-60 italic mb-2">استمع جيداً:</p>
          <p className="text-lg leading-relaxed font-tajawal">
            "{step.audioText}"
          </p>
        </div>
      </div>

      <div className="py-8 flex space-x-4 space-x-reverse">
        {stepIndex > 0 && (
          <button 
            onClick={prevStep}
            className="flex-1 bg-white/10 border border-white/20 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 space-x-reverse"
          >
            <ChevronRight size={20} />
            <span>السابق</span>
          </button>
        )}
        
        {stepIndex < DARE_STEPS.length - 1 ? (
          <button 
            onClick={nextStep}
            className="flex-[2] bg-white text-rose-900 py-4 rounded-2xl font-black text-xl flex items-center justify-center space-x-2 space-x-reverse shadow-xl shadow-black/20"
          >
            <span>الخطوة التالية</span>
            <ChevronLeft size={24} />
          </button>
        ) : (
          <button 
            onClick={handleFinish}
            className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-black text-xl flex items-center justify-center shadow-xl shadow-black/20"
          >
            لقد انتهيت، أنا مستعد
          </button>
        )}
      </div>
    </div>
  );
};

export default DAREFlowScreen;
