
import { AudioTrack, ThinkingTrap, DailyChallenge } from './types';

export const COLORS = {
  primary: '#0f766e', // Deep Teal
  sos: '#be123c',     // Rose Red
  accent: '#f59e0b',  // Amber
  background: '#f8fafc',
  relaxBg: '#eef2ff',
  challengeBg: '#fff1f2'
};

export const RELAX_CONTENT: AudioTrack[] = [
  { id: 'r1', title: 'Deep Breathing', category: 'RELAX', duration: '5:00', isPremium: false, arabicLabel: 'تنفس عميق', icon: 'Wind' },
  { id: 'r2', title: 'Deep Release', category: 'RELAX', duration: '19:57', isPremium: false, arabicLabel: 'تحرر عميق', icon: 'User' },
  { id: 'r3', title: 'Dissolve Anxiety Video', category: 'RELAX', duration: '12:00', isPremium: false, arabicLabel: 'فيديو تبديد القلق', icon: 'Sun' },
  { id: 'r4', title: 'Acceptance', category: 'RELAX', duration: '8:45', isPremium: true, arabicLabel: 'التقبل', icon: 'Heart' },
  { id: 'r5', title: 'Meditate', category: 'RELAX', duration: '15:00', isPremium: true, arabicLabel: 'تأمل', icon: 'Mountain' },
  { id: 'r6', title: 'Nature Sounds', category: 'RELAX', duration: '30:00', isPremium: false, arabicLabel: 'أصوات الطبيعة', icon: 'Leaf' },
  { id: 'r7', title: 'Sleep', category: 'RELAX', duration: '45:00', isPremium: true, arabicLabel: 'النوم', icon: 'Moon' },
  { id: 'r8', title: 'Motivate Me', category: 'RELAX', duration: '6:30', isPremium: false, arabicLabel: 'حفزني', icon: 'Zap' },
  { id: 'r9', title: 'Gratitude', category: 'RELAX', duration: '10:00', isPremium: false, arabicLabel: 'الامتنان', icon: 'HeartHandshake' },
];

export const CHALLENGE_CONTENT: AudioTrack[] = [
  { id: 'c1', title: 'Health Anxiety', category: 'CHALLENGE', duration: '7:00', isPremium: false, arabicLabel: 'قلق الصحة', icon: 'Stethoscope' },
  { id: 'c2', title: 'Social Anxiety', category: 'CHALLENGE', duration: '10:00', isPremium: true, arabicLabel: 'القلق الاجتماعي', icon: 'Users' },
  { id: 'c3', title: 'Intrusive Thoughts', category: 'CHALLENGE', duration: '8:30', isPremium: true, arabicLabel: 'أفكار دخيلة', icon: 'CloudRain' },
  { id: 'c4', title: 'Feeling Trapped', category: 'CHALLENGE', duration: '9:15', isPremium: true, arabicLabel: 'الشعور بالحصار', icon: 'Home' },
  { id: 'c5', title: 'Safety Crutches', category: 'CHALLENGE', duration: '11:00', isPremium: true, arabicLabel: 'عكازات الأمان', icon: 'Accessibility' },
  { id: 'c6', title: 'Bodily Sensations', category: 'CHALLENGE', duration: '12:45', isPremium: true, arabicLabel: 'أحاسيس جسدية', icon: 'Heart' },
  { id: 'c7', title: 'Overcoming Setbacks', category: 'CHALLENGE', duration: '14:20', isPremium: true, arabicLabel: 'تجاوز الانتكاسات', icon: 'ArrowUpCircle' },
  { id: 'c8', title: 'Anticipatory Anxiety', category: 'CHALLENGE', duration: '9:50', isPremium: true, arabicLabel: 'القلق الاستباقي', icon: 'Clock' },
  { id: 'c9', title: 'Driving Anxiety', category: 'CHALLENGE', duration: '13:10', isPremium: true, arabicLabel: 'قلق القيادة', icon: 'Car' },
];

export const AUDIO_LIBRARY: AudioTrack[] = [...RELAX_CONTENT, ...CHALLENGE_CONTENT];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 'd1', title: 'تحدي المواجهة', description: 'قم بفعل شيء واحد يجعلك غير مرتاح اليوم.', icon: '🎯' },
  { id: 'd2', title: 'تحدي القبول', description: 'لاحظ دقات قلبك اليوم دون إصدار أحكام.', icon: '💓' }
];

export const DARE_STEPS = [
  {
    id: 'defuse',
    title: 'نزع الفتيل (Defuse)',
    instruction: 'لا تقلق، هذا مجرد أدرينالين. قل لنفسك: "ليكن، أنا مستعد لهذا الشعور".',
    audioText: 'لا تقلق، ما تشعر به هو مجرد استجابة جسدية طبيعية. إنه الأدرينالين يتحدث.'
  },
  {
    id: 'allow',
    title: 'التقبل (Allow)',
    instruction: 'اسمح للرجفة أو الضيق، لا تقاومها. تقبّل وجود القلق كضيف عابر.',
    audioText: 'اسمح لهذه الأحاسيس بالبقاء. لا تحاول طردها. كلما سمحت لها، كلما فقدت قوتها.'
  },
  {
    id: 'run_toward',
    title: 'التحدي (Run Toward)',
    instruction: 'اطلب المزيد! قل لهلوعك: "هل هذا كل ما لديك؟ أعطني المزيد!"',
    audioText: 'اركض نحو القلق. اطلب منه المزيد. قل له: أرني أسوأ ما عندك. أنت أقوى منه.'
  },
  {
    id: 'engage',
    title: 'الانخراط (Engage)',
    instruction: 'الآن، عد للتركيز في عملك أو ما كنت تفعله بوعي كامل.',
    audioText: 'الآن، عد إلى لحظتك الحالية. ما الذي تفعله الآن؟ ركز حواسك فيه بالكامل.'
  }
];
