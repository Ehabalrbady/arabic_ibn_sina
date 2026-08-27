import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Play, 
  Sliders, 
  Database, 
  Pause, 
  Layers 
} from 'lucide-react';
import { 
  getAudioSettings, 
  saveAudioSettings, 
  playArabicAudio, 
  stopAudio, 
  AudioEngineSettings, 
  VoicePersona,
  PERSONA_INFO 
} from './audio';
import { getAudioCacheStats } from './audioCache';
import { autoWarmupAudioCache } from './audioPreloader';
import { AudioCacheManagerModal } from './AudioCacheManagerModal';

interface QuickAudioBarProps {
  onOpenSettingsModal?: () => void;
}

export const QuickAudioBar: React.FC<QuickAudioBarProps> = ({ onOpenSettingsModal }) => {
  const [settings, setSettings] = useState<AudioEngineSettings>(() => getAudioSettings());
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [currentSyllable, setCurrentSyllable] = useState<string | null>(null);
  const [isCacheModalOpen, setIsCacheModalOpen] = useState(false);
  const [cacheCount, setCacheCount] = useState<number>(0);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  const refreshCacheInfo = async () => {
    try {
      const stats = await getAudioCacheStats();
      setCacheCount(stats.count);
    } catch (e) {}
  };

  useEffect(() => {
    // 1. Initial warmup in background
    autoWarmupAudioCache();
    refreshCacheInfo();

    const handleSettingsChange = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
      } else {
        setSettings(getAudioSettings());
      }
      refreshCacheInfo();
    };

    const handleProgress = (e: any) => {
      setAudioProgress(e.detail);
    };

    window.addEventListener('ibn_sinai_audio_settings_changed', handleSettingsChange);
    window.addEventListener('ibn_sinai_audio_progress', handleProgress);
    const interval = setInterval(refreshCacheInfo, 10000);

    return () => {
      window.removeEventListener('ibn_sinai_audio_settings_changed', handleSettingsChange);
      window.removeEventListener('ibn_sinai_audio_progress', handleProgress);
      clearInterval(interval);
    };
  }, []);

  const handlePersonaSelect = (persona: VoicePersona) => {
    const updated: Partial<AudioEngineSettings> = {
      voicePersona: persona,
      pitch: persona === 'child' ? 1.45 : 1.0,
      rate: PERSONA_INFO[persona].defaultRate
    };
    setSettings(prev => ({ ...prev, ...updated }));
    saveAudioSettings(updated);

    // Audio preview of selected persona
    const sampleWord = persona === 'child' ? 'أَنَا أَتَعَلَّمُ القِرَاءَةَ!' : 'مَرْحَبًا بِكُمْ فِي مَدَارِسِ ابْنِ سِينَاءَ';
    setIsPlayingTest(true);
    setCurrentSyllable(null);
    playArabicAudio(sampleWord, {
      persona: persona,
      onEnd: () => {
        setIsPlayingTest(false);
        setCurrentSyllable(null);
        refreshCacheInfo();
      }
    });
  };

  const handleToggleSyllableSpelling = () => {
    const newVal = !settings.syllableSpelling;
    const updated = { syllableSpelling: newVal };
    setSettings(prev => ({ ...prev, ...updated }));
    saveAudioSettings(updated);
  };

  const handleRateChange = (newRate: number) => {
    const updated = { rate: newRate };
    setSettings(prev => ({ ...prev, ...updated }));
    saveAudioSettings(updated);
  };

  const handlePlaySample = () => {
    if (isPlayingTest) {
      stopAudio();
      setIsPlayingTest(false);
      setCurrentSyllable(null);
      return;
    }

    setIsPlayingTest(true);
    const testSample = settings.syllableSpelling 
      ? 'مَدْرَسَةٌ' 
      : 'كِتَابٌ نَافِعٌ لِلطُّلابِ';

    playArabicAudio(testSample, {
      onSyllable: (syl) => {
        setCurrentSyllable(syl);
      },
      onEnd: () => {
        setIsPlayingTest(false);
        setCurrentSyllable(null);
        refreshCacheInfo();
      }
    });
  };

  const activePersona = settings.voicePersona || 'teacher';

  return (
    <>
      <div id="quick-audio-bar" className="relative bg-slate-900 text-white border-y border-amber-400/40 px-3 py-2 sm:py-2.5 font-cairo shadow-md select-none transition-all overflow-hidden">
        
        {/* Interactive Progress Bar background indicator */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all duration-75 z-0"
          style={{ width: `${audioProgress * 100}%` }}
        />

        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 relative z-10">
          
          {/* Left: Persona Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold pl-1 border-l border-slate-700 ml-1">
              <Volume2 className="w-4 h-4 animate-pulse text-amber-400" />
              <span className="hidden sm:inline">نظام الصوت التأسيسي:</span>
            </div>

            {/* Teacher Persona Button */}
            <button
              id="voice-persona-teacher-btn"
              onClick={() => handlePersonaSelect('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                activePersona === 'teacher'
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm shadow-emerald-900/50 scale-105'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="نبرة دافئة، أمومية، فصيحة، مخارج حروف واضحة وإيقاع متزن"
            >
              <span>👩‍🏫</span>
              <span>صوت المعلمة</span>
              {activePersona === 'teacher' && (
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
              )}
            </button>

            {/* Child Persona Button */}
            <button
              id="voice-persona-child-btn"
              onClick={() => handlePersonaSelect('child')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                activePersona === 'child'
                  ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-sm shadow-amber-950/50 scale-105'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="نبرة طفولية نقية مرحة ومتحمسة لتشجيع الأطفال على المحاكاة"
            >
              <span>👦</span>
              <span>صوت طفولي</span>
              {activePersona === 'child' && (
                <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
              )}
            </button>
          </div>

          {/* Center: Syllable Breakdown Mode & Cache Quick Button */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Reading Mode Indicator / Switcher */}
            <button
              id="toggle-syllable-breakdown-btn"
              onClick={handleToggleSyllableSpelling}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                settings.syllableSpelling
                  ? 'bg-amber-600/90 border-amber-300 text-white shadow-xs'
                  : 'bg-emerald-800/80 border-emerald-500/80 text-emerald-100 shadow-xs'
              }`}
              title={settings.syllableSpelling ? 'وضع التهجئة المقطعة بفاصل زمني' : 'وضع القراءة الانسيابية المستمرة للكلمة (الموصى به)'}
            >
              <span>{settings.syllableSpelling ? '🧩' : '🌊'}</span>
              <span>{settings.syllableSpelling ? 'نمط التهجئة المقطّعة' : 'قراءة انسيابية مستمرة'}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                settings.syllableSpelling ? 'bg-amber-300 text-slate-950' : 'bg-emerald-400 text-slate-950'
              }`}>
                {settings.syllableSpelling ? 'مقطّع' : 'طبيعي'}
              </span>
            </button>

            {/* Audio Cache Studio Button */}
            <button
              id="open-audio-cache-manager-btn"
              onClick={() => setIsCacheModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/50 text-slate-200 text-xs font-bold transition cursor-pointer"
              title="إدارة وتوليد الذاكرة الصوتية للمنهاج كاملاً (IndexedDB)"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">الذاكرة الصوتية:</span>
              <span className="font-mono px-1.5 py-0.2 rounded bg-slate-700/80 text-amber-300 text-[11px] font-bold">
                {cacheCount} مقطع
              </span>
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            </button>

            {/* Speed Selector */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 text-[11px]">السرعة:</span>
              {[
                { rate: 0.75, label: 'هادئ' },
                { rate: 0.85, label: 'طبيعي' },
                { rate: 1.0, label: 'سريع' }
              ].map(item => (
                <button
                  key={item.rate}
                  onClick={() => handleRateChange(item.rate)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                    Math.abs(settings.rate - item.rate) < 0.06
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Test Audio & Settings */}
          <div className="flex items-center gap-2">
            {currentSyllable && (
              <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg font-black text-sm animate-bounce shadow-sm">
                {currentSyllable}
              </span>
            )}

            <button
              id="test-current-audio-btn"
              onClick={handlePlaySample}
              className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                isPlayingTest
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
              }`}
              title="تجربة النطق الصوتي الآن بالإعدادات المحددة"
            >
              {isPlayingTest ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>إيقاف</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>تجربة الصوت</span>
                </>
              )}
            </button>

            {onOpenSettingsModal && (
              <button
                id="open-audio-settings-modal-btn"
                onClick={onOpenSettingsModal}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title="فتح استوديو الصوت المتقدم"
              >
                <Sliders className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Audio Cache Manager Modal */}
      <AudioCacheManagerModal 
        isOpen={isCacheModalOpen} 
        onClose={() => {
          setIsCacheModalOpen(false);
          refreshCacheInfo();
        }} 
      />
    </>
  );
};
