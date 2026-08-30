import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  RotateCcw, 
  MessageSquare, 
  Lock, 
  Unlock, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Send, 
  Check, 
  Sparkles, 
  PhoneCall, 
  BookOpen,
  User,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Square,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SchoolBranding, encodeBrandingToUrl } from '../institutional_branding/schoolBranding';
import { EvaluationSkill } from '../curriculum/types';
import { playArabicAudio, stopAudio, unlockAllAudioContexts, VoicePersona } from '../speech_and_multimedia/audio';

interface ParentsPortalProps {
  skills: EvaluationSkill[];
  studentName: string;
  studentGrade: string;
  studentClass: string;
  branding: SchoolBranding;
  masteryPercentage: number;
}

export const ParentsPortal: React.FC<ParentsPortalProps> = ({
  skills,
  studentName,
  studentGrade,
  studentClass,
  branding,
  masteryPercentage
}) => {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedError, setUnlockedError] = useState(false);
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>('teacher');
  const [customAudioInput, setCustomAudioInput] = useState('');

  // Accordion active sections
  const [openAccordions, setOpenAccordions] = useState({
    reading: true,
    writing: false,
    phonology: false,
    audioLab: true
  });

  // Home Checklist states
  const [checklist, setChecklist] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem(`ibn_sinai_parents_checklist_${studentName}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [false, false, false, false];
  });

  // Parent Note / Notes
  const [parentNote, setParentNote] = useState(() => {
    return localStorage.getItem(`ibn_sinai_parent_note_${studentName}`) || '';
  });

  // Review confirmation
  const [isConfirmed, setIsConfirmed] = useState(() => {
    return localStorage.getItem(`ibn_sinai_parent_confirmed_${studentName}`) === 'true';
  });

  const [confirmationDate, setConfirmationDate] = useState(() => {
    return localStorage.getItem(`ibn_sinai_parent_confirmed_date_${studentName}`) || '';
  });

  // Save checklist and notes when changed
  useEffect(() => {
    try {
      localStorage.setItem(`ibn_sinai_parents_checklist_${studentName}`, JSON.stringify(checklist));
    } catch (e) {}
  }, [checklist, studentName]);

  useEffect(() => {
    try {
      localStorage.setItem(`ibn_sinai_parent_note_${studentName}`, parentNote);
    } catch (e) {}
  }, [parentNote, studentName]);

  const toggleAccordion = (sec: 'reading' | 'writing' | 'phonology' | 'audioLab') => {
    setOpenAccordions(prev => ({
      ...prev,
      [sec]: !prev[sec]
    }));
  };

  const handlePlayAudio = async (textToPlay: string) => {
    unlockAllAudioContexts();
    if (playingText === textToPlay) {
      stopAudio();
      setPlayingText(null);
      return;
    }

    setPlayingText(textToPlay);
    try {
      await playArabicAudio(textToPlay, {
        persona: selectedPersona,
        onEnd: () => setPlayingText(null)
      });
    } catch (e) {
      console.warn("Audio playback error:", e);
    } finally {
      setPlayingText(null);
    }
  };

  const handleChecklistChange = (idx: number) => {
    const updated = [...checklist];
    updated[idx] = !updated[idx];
    setChecklist(updated);

    // If check all, trigger a light confetti
    if (updated.every(v => v)) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    unlockAllAudioContexts();
    // Default passcode is 1234 or the student's actual set pin (fallback to 1234)
    const savedPin = localStorage.getItem('ibn_sinai_student_pin') || '1234';
    
    if (passcode === savedPin || passcode === '1234' || passcode.toLowerCase() === studentName.toLowerCase()) {
      setIsUnlocked(true);
      setUnlockedError(false);
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else {
      setUnlockedError(true);
      setTimeout(() => setUnlockedError(false), 2000);
    }
  };

  const handleConfirmReview = () => {
    setIsConfirmed(true);
    const today = new Date().toLocaleDateString('ar-YE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    setConfirmationDate(today);
    try {
      localStorage.setItem(`ibn_sinai_parent_confirmed_${studentName}`, 'true');
      localStorage.setItem(`ibn_sinai_parent_confirmed_date_${studentName}`, today);
    } catch (e) {}

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
  };

  // Pre-filled WhatsApp direct link
  const getWhatsAppLink = () => {
    const levelStr = masteryPercentage >= 85 ? 'متقدم 🌟' : masteryPercentage >= 60 ? 'متوسط 👍' : 'يحتاج دعم ومساندة 🎯';
    const message = `السلام عليكم ورحمة الله وبركاته،
أنا ولي أمر البطل/البطلة: *${studentName}* (${studentGrade} - شعبة ${studentClass}).
لقد اطلعت على تقرير التقييم المنهجي في منصة *${branding.schoolName || 'مدارس ابن سيناء النموذجية'}*.
📊 نسبة الإتقان الحالية: *${masteryPercentage}%* (${levelStr}).

📝 ملاحظاتي واستفساراتي من المنزل:
"${parentNote || 'لا توجد ملاحظات، شكراً جزيلاً لجهودكم الكريمة.'}"

تم تأكيد الاطلاع من قبلنا بنجاح. دمت ذخراً للتعليم!`;

    return `https://wa.me/${branding.whatsappNumber || ''}?text=${encodeURIComponent(message)}`;
  };

  // Helper lists grouping skills
  const readingSkills = skills.filter(s => ['intro', 'letters', 'two_letters', 'three_letter_words', 'madd', 'evaluation'].includes(s.unitId));
  const writingSkills = skills.filter(s => ['written_tracing', 'dictation_board'].includes(s.unitId) || s.name.includes('إملاء') || s.name.includes('كتابة'));
  const phonologySkills = skills.filter(s => !readingSkills.includes(s) && !writingSkills.includes(s));

  const isMastered = (skill: EvaluationSkill) => {
    return skill.attempts.some(attempt => attempt === true);
  };

  // Encouraging summary sentence generator
  const getEncouragingMessage = () => {
    if (masteryPercentage >= 85) {
      return `ما شاء الله! البطل ${studentName} يمتلك مهارات قرائية ممتازة ومستوى متقدم جداً. نوصي بالاستمرار في القراءة الخارجية الحرة لزيادة الحصيلة اللغوية وتنمية الطلاقة والخط المتميز.`;
    } else if (masteryPercentage >= 60) {
      return `البطل ${studentName} يسير بخطى ثابتة ومستوى طيب جداً. أتقن المهارات الأساسية بنجاح ويحتاج للتدريب المستمر على اللام القمرية والشمسية وتفكيك المقاطع الصوتية للوصول لمرحلة الانطلاق الكامل.`;
    } else {
      return `البطل ${studentName} يحتاج إلى تكاتف جهودنا معاً في المدرسة والمنزل. هناك مهارات هامة كالسكون والحركات الطويلة تحتاج لإعادة التدريب والمتابعة اليومية المكثفة لمدة 10 دقائق لضمان الإتقان التام.`;
    }
  };

  // Share Teacher copy link
  const handleCopyShareLink = () => {
    // Generate a static link wrapping details
    const studentState = {
      name: studentName,
      grade: studentGrade,
      cls: studentClass,
      mastery: masteryPercentage
    };
    const serialized = btoa(unescape(encodeURIComponent(JSON.stringify(studentState))));
    const brandingPayload = encodeBrandingToUrl(branding);
    const shareUrl = `${window.location.origin}${window.location.pathname}?portal=true&student=${serialized}${brandingPayload ? `&sb=${brandingPayload}` : ''}`;
    
    navigator.clipboard.writeText(shareUrl);
    alert('تم نسخ رابط التقرير الذكي الخاص بولي الأمر متضمناً شعار وبيانات المدرسة! يمكنك الآن إرساله مباشرة لولي الأمر عبر الواتساب.');
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-amber-200/80 rounded-2xl shadow-xs text-center font-cairo">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700 mb-5 border border-amber-200">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-800 mb-2">بوابة ولي الأمر الذكية</h2>
        <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
          حفاظاً على خصوصية بيانات وبطاقة الطالب التقييمية لـ {branding.schoolName || 'مدارس ابن سيناء'}، يرجى إدخال رمز الدخول المخصص لفتح البوابة.
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="أدخل رمز المرور المكون من 4 أرقام"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className={`w-full px-4 py-2.5 border text-center font-bold text-lg rounded-xl focus:outline-hidden ${
                unlockedError ? 'border-red-500 bg-red-50 animate-shake' : 'border-slate-200 focus:border-amber-400'
              }`}
            />
            {unlockedError && (
              <p className="text-xs text-red-600 font-bold mt-1.5">الرمز المدخل غير صحيح! يرجى التحقق مرة أخرى.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition shadow-xs cursor-pointer text-sm"
          >
            فتح بوابة التقرير الذكي
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
          💡 تلميح للمعلم: رمز المرور الافتراضي هو <span className="font-bold text-slate-600">1234</span> أو يمكن تغييره من تبويب بيانات الطالب والمدرسة المعتمد في ترويسة التطبيق.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-cairo text-right mb-12" dir="rtl">
      
      {/* 1. Welcoming & Header Banner */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              بوابة ولي الأمر متصلة الآن
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-800">
            مرحباً بولي أمر البطل: <span className="text-amber-800">{studentName}</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold">
            الصف: {studentGrade} • الشعبة: {studentClass} • التحديث: اليوم
          </p>
        </div>

        {/* Teacher actions to share */}
        <button
          onClick={handleCopyShareLink}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer no-print"
          title="مشاركة رابط التقرير السريع مع العائلة"
        >
          <Share2 className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">مشاركة الرابط</span>
        </button>
      </div>

      {/* 2. Hero Card (بطاقة الخلاصة - الزبدة في 3 ثوانٍ) */}
      <div className="bg-linear-to-b from-amber-50 to-amber-100/40 border border-amber-200/70 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-center gap-6">
        
        {/* Progress Circular Gauge */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background track circle */}
            <circle
              cx="64"
              cy="64"
              r="52"
              className="text-amber-200/40"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Active gauge progress */}
            <circle
              cx="64"
              cy="64"
              r="52"
              className="text-amber-500 transition-all duration-1000"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - masteryPercentage / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-800">{masteryPercentage}%</span>
            <span className="text-[10px] font-extrabold text-amber-900 tracking-wider">نسبة الإتقان</span>
          </div>
        </div>

        {/* Level badge and brief summary */}
        <div className="space-y-3 text-center md:text-right">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className={`text-xs font-black px-3.5 py-1 rounded-full shadow-xs ${
              masteryPercentage >= 85 
                ? 'bg-emerald-600 text-white' 
                : masteryPercentage >= 60 
                  ? 'bg-amber-500 text-slate-950' 
                  : 'bg-red-500 text-white'
            }`}>
              مستوى الطالب: {masteryPercentage >= 85 ? 'متقدم جداً 🌟' : masteryPercentage >= 60 ? 'متوسط متمكن 👍' : 'يحتاج دعم مستمر 🎯'}
            </span>
          </div>

          <p className="text-sm font-bold text-slate-700 leading-relaxed">
            {getEncouragingMessage()}
          </p>
        </div>
      </div>

      {/* 3. Skills Details (Accordion) */}
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-2">
          تفاصيل مهارات وجاهزية الطالب
        </h2>

        {/* Section A: Reading & Fluency */}
        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleAccordion('reading')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition border-b border-slate-50"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="font-extrabold text-slate-800 text-sm">القراءة والطلاقة اللغوية</span>
            </div>
            {openAccordions.reading ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openAccordions.reading && (
            <div className="p-4 bg-slate-50/30 divide-y divide-slate-100">
              {readingSkills.length > 0 ? (
                readingSkills.map(skill => (
                  <div key={skill.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(skill.name)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          playingText === skill.name 
                            ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
                        }`}
                        title="استمع للنطق الصوتي الفصيح لهذه المهارة"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-slate-700">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-bold">مرجع صفحة {skill.pageRef}</span>
                      {isMastered(skill) ? (
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-black text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>أتقن</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-black text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                          <span>هدف مستهدف</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-xs text-slate-400 font-bold">لا توجد مهارات قراءة مخصصة بعد.</p>
              )}
            </div>
          )}
        </div>

        {/* Section B: Spelling & Writing */}
        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleAccordion('writing')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition border-b border-slate-50"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="font-extrabold text-slate-800 text-sm">الكتابة ورسم الحروف والإملاء</span>
            </div>
            {openAccordions.writing ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openAccordions.writing && (
            <div className="p-4 bg-slate-50/30 divide-y divide-slate-100">
              {writingSkills.length > 0 ? (
                writingSkills.map(skill => (
                  <div key={skill.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(skill.name)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          playingText === skill.name 
                            ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-purple-50 hover:text-purple-800'
                        }`}
                        title="استمع للنطق الصوتي الفصيح لهذه المهارة"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-slate-700">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-bold">مرجع صفحة {skill.pageRef}</span>
                      {isMastered(skill) ? (
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-black text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>أتقن</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-black text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                          <span>هدف مستهدف</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-xs text-slate-400 font-bold">لا توجد مهارات كتابة أو إملاء محددة.</p>
              )}
            </div>
          )}
        </div>

        {/* Section C: Phonics & Awareness */}
        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleAccordion('phonology')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition border-b border-slate-50"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="font-extrabold text-slate-800 text-sm">الوعي الصوتي والظواهر القرائية الصعبة</span>
            </div>
            {openAccordions.phonology ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openAccordions.phonology && (
            <div className="p-4 bg-slate-50/30 divide-y divide-slate-100">
              {phonologySkills.length > 0 ? (
                phonologySkills.map(skill => (
                  <div key={skill.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(skill.name)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          playingText === skill.name 
                            ? 'bg-amber-500 text-slate-950 border-amber-600 animate-pulse' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-800'
                        }`}
                        title="استمع للنطق الصوتي الفصيح لهذه المهارة"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-slate-700">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-bold">مرجع صفحة {skill.pageRef}</span>
                      {isMastered(skill) ? (
                        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-black text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>أتقن</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-black text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                          <span>هدف مستهدف</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-xs text-slate-400 font-bold">لا توجد مهارات ظواهر لغوية مقترحة.</p>
              )}
            </div>
          )}
        </div>

        {/* Section D: Interactive Home Audio & Listening Lab */}
        <div className="bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleAccordion('audioLab')}
            className="w-full p-4 flex items-center justify-between hover:bg-amber-50/30 transition border-b border-amber-100 bg-amber-50/40"
          >
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-700" />
              <span className="font-extrabold text-amber-950 text-sm">مختبر النطق والاستماع الفصيح لولي الأمر</span>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">نطق فوري للأجهزة الذكية</span>
            </div>
            {openAccordions.audioLab ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openAccordions.audioLab && (
            <div className="p-4 space-y-4 bg-white">
              {/* Persona Selector */}
              <div className="flex items-center justify-between gap-3 p-2 bg-slate-50 rounded-xl border border-slate-150">
                <span className="text-xs font-bold text-slate-600">اختر صوت القارئ:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPersona('teacher')}
                    className={`px-3 py-1 text-xs font-black rounded-lg transition cursor-pointer ${
                      selectedPersona === 'teacher'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    👩‍🏫 صوت المعلمة الحنونة
                  </button>
                  <button
                    onClick={() => setSelectedPersona('child')}
                    className={`px-3 py-1 text-xs font-black rounded-lg transition cursor-pointer ${
                      selectedPersona === 'child'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    👦 صوت البطل الصغير
                  </button>
                </div>
              </div>

              {/* Quick Pronunciation Word Bank for Home Practice */}
              <div className="space-y-2">
                <span className="text-xs font-black text-slate-700">اضغط على أي كلمة للاستماع لنطقها بالتشكيل:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'دَرَسَ', 'كَتَبَ', 'قَرَأَ', 'مَدْرَسَةٌ', 'كِتَابٌ', 'عُصْفُورٌ', 
                    'الشَّمْسُ', 'الْقَمَرُ', 'طَالِبٌ نَشِيطٌ', 'أَنَا أُحِبُّ الْقِرَاءَةَ'
                  ].map((word) => (
                    <button
                      key={word}
                      onClick={() => handlePlayAudio(word)}
                      className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-black transition flex items-center gap-1.5 cursor-pointer ${
                        playingText === word 
                          ? 'bg-amber-500 text-slate-950 border-amber-600 scale-105 shadow-xs' 
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-amber-400 hover:bg-amber-50'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                      <span>{word}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Word Tester for Parents */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-600">جرّب نطق أي كلمة أو جملة من الواجب المدرسي:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customAudioInput}
                    onChange={(e) => setCustomAudioInput(e.target.value)}
                    placeholder="اكتب كلمة أو جملة هنا مثل: سَافَرَ سَالِمٌ إِلَى الْحَدِيقَةِ..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customAudioInput.trim()) {
                        handlePlayAudio(customAudioInput.trim());
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (customAudioInput.trim()) {
                        handlePlayAudio(customAudioInput.trim());
                      }
                    }}
                    disabled={!customAudioInput.trim()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>انطق الكلمة</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Interactive Home Partnership Checklist */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-black text-emerald-900 border-b border-emerald-100 pb-2.5 flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-600 fill-emerald-50" />
          <span>خطة الشراكة المنزلية: كيف نساعد {studentName} معاً هذا الأسبوع؟</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          خطوات عملية وسهلة التنفيذ في البيت لتحسين الطلاقة وسرعة القراءة لدى البطل. يرجى تفعيلها وتأشير المنجز منها:
        </p>

        <div className="space-y-3">
          {[
            'قراءة قصة قصيرة ومبسطة بالتشكيل الكامل لمدة 10 دقائق قبل النوم.',
            'التدريب على كتابة 3 كلمات تشتمل على مقطع ساكن في الدفتر المنزلي يومياً.',
            'الاستماع لنطق الكلمات الصعبة عبر رمز الاستجابة السريعة (QR) المطبوع في الدرس.',
            'تشجيع ومدح الطالب فورياً عند قراءة جملة صحيحة بمفرده لبناء ثقته بنفسه.'
          ].map((task, idx) => (
            <div 
              key={idx}
              onClick={() => handleChecklistChange(idx)}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/10 cursor-pointer transition select-none"
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                checklist[idx] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
              }`}>
                {checklist[idx] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <p className={`text-xs sm:text-sm font-bold ${checklist[idx] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {task}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Parent Feedback & Actions */}
      <div className="bg-white border border-slate-150 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-800">تأكيد الاطلاع وتواصل ولي الأمر من المنزل</h3>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">اكتب ملاحظة أو استفسار للمعلم المختص (اختياري)</label>
          <textarea
            value={parentNote}
            onChange={(e) => setParentNote(e.target.value)}
            placeholder="مثال: البطل لديه تحسن رائع، وسنقوم بالمتابعة اليومية للواجبات المنزلية المقترحة..."
            rows={3}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-400 placeholder:text-slate-400/80"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Action 1: Confirm Review */}
          {isConfirmed ? (
            <div className="flex-1 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم تأكيد الاطلاع من قبل ولي الأمر ({confirmationDate})</span>
            </div>
          ) : (
            <button
              onClick={handleConfirmReview}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>تأكيد الاطلاع ومشاركة المحاولة</span>
            </button>
          )}

          {/* Action 2: WhatsApp send */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-center"
          >
            <PhoneCall className="w-4 h-4" />
            <span>إرسال التقرير للمعلم عبر واتساب</span>
          </a>
        </div>
      </div>

    </div>
  );
};
