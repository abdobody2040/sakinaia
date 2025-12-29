
import React from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, Heart } from 'lucide-react';

interface Props {
  onBack: () => void;
  onPurchase: () => void;
}

const PaywallScreen: React.FC<Props> = ({ onBack, onPurchase }) => {
  const benefits = [
    { icon: <Zap size={20} />, text: "جميع أدلة مواجهة الرهاب (القيادة، الطيران، إلخ)" },
    { icon: <ShieldCheck size={20} />, text: "تحليل فخاخ التفكير غير محدود بالذكاء الاصطناعي" },
    { icon: <Heart size={20} />, text: "تحديات سكينة اليومية المخصصة" },
    { icon: <CheckCircle2 size={20} />, text: "دعم الأبحاث العلمية لتطوير التطبيق" }
  ];

  return (
    <div className="h-full bg-slate-950 text-white flex flex-col p-6 overflow-y-auto">
      <div className="flex justify-end">
        <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="text-center mt-6 mb-10">
        <div className="inline-block px-4 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400 text-xs font-black mb-4 uppercase tracking-widest">
          سكينة بريميوم
        </div>
        <h2 className="text-4xl font-black mb-3">تحرر من القلق نهائياً</h2>
        <p className="text-slate-400 font-medium">انضم لآلاف المستخدمين الذين استعادوا حياتهم</p>
      </div>

      <div className="space-y-4 mb-10">
        {benefits.map((b, i) => (
          <div key={i} className="flex items-center space-x-4 space-x-reverse bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="text-amber-500">{b.icon}</div>
            <span className="text-slate-100 font-bold text-sm">{b.text}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4 mt-auto pb-10">
        <button 
          onClick={onPurchase}
          className="w-full bg-[#0f766e] hover:bg-[#138d83] py-5 rounded-2xl flex flex-col items-center justify-center shadow-2xl transition-all active:scale-[0.98]"
        >
          <span className="text-xl font-black">الاشتراك السنوي</span>
          <span className="text-sm opacity-80">99.99 ريال / سنة (وفر 40%)</span>
        </button>

        <button 
          onClick={onPurchase}
          className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl flex flex-col items-center justify-center transition-all active:bg-white/10"
        >
          <span className="text-xl font-black">الاشتراك الشهري</span>
          <span className="text-sm opacity-60">12.99 ريال / شهر</span>
        </button>

        <p className="text-[10px] text-center text-slate-500 px-4">
          بالضغط على "اشتراك"، أنت توافق على شروط الاستخدام وسياسة الخصوصية. سيتم الخصم من حساب متجر تطبيقات أندرويد الخاص بك.
        </p>
      </div>
    </div>
  );
};

export default PaywallScreen;
