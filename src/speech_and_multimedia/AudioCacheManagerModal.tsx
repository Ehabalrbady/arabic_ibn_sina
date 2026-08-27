import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  RefreshCw, 
  X, 
  Layers, 
  Volume2,
  HardDrive,
  Cpu,
  StopCircle
} from 'lucide-react';
import { 
  getAudioCacheStats, 
  clearAudioCache 
} from './audioCache';
import { 
  precacheAllCurriculumAudio, 
  cancelAudioPreload, 
  isAudioPreloading, 
  PreloadProgress 
} from './audioPreloader';
import { extractAllCurriculumVocabulary } from './curriculumVocabExtractor';
import { playArabicAudio, stopAudio } from './audio';

interface AudioCacheManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioCacheManagerModal: React.FC<AudioCacheManagerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [stats, setStats] = useState<{
    count: number;
    teacherCount: number;
    childCount: number;
    estimatedSizeKb: number;
    cachedKeys: string[];
  }>({
    count: 0,
    teacherCount: 0,
    childCount: 0,
    estimatedSizeKb: 0,
    cachedKeys: []
  });

  const [totalVocabCount, setTotalVocabCount] = useState<number>(0);
  const [progress, setProgress] = useState<PreloadProgress | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [testWord, setTestWord] = useState<string>('كِتَابٌ');
  const [activeTab, setActiveTab] = useState<'overview' | 'test' | 'vocabulary'>('overview');
  const [vocabList, setVocabList] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const refreshStats = async () => {
    const s = await getAudioCacheStats();
    setStats(s);
  };

  useEffect(() => {
    if (isOpen) {
      const vocab = extractAllCurriculumVocabulary();
      setVocabList(vocab);
      setTotalVocabCount(vocab.length * 2); // 2 personas
      refreshStats();
      setIsBusy(isAudioPreloading());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartPrecache = async () => {
    setIsBusy(true);
    setProgress({
      totalItems: totalVocabCount,
      completedItems: stats.count,
      percent: Math.min(100, Math.round((stats.count / (totalVocabCount || 1)) * 100)),
      currentWord: 'بدء فحص الذاكرة وتوليد المقاطع...',
      currentPersona: 'teacher',
      isComplete: false,
      statusText: 'جاري بدء العملية...'
    });

    await precacheAllCurriculumAudio((prog) => {
      setProgress(prog);
      if (prog.completedItems % 20 === 0 || prog.isComplete) {
        refreshStats();
      }
    });

    setIsBusy(false);
    refreshStats();
  };

  const handleCancelPrecache = () => {
    cancelAudioPreload();
    setIsBusy(false);
    setProgress(null);
  };

  const handleClearCache = async () => {
    if (window.confirm('هل أنت متأكد من مسح جميع الملفات الصوتية المخزنة في الذاكرة المحلية؟')) {
      await clearAudioCache();
      await refreshStats();
      setProgress(null);
    }
  };

  const handleTestPlay = (word: string, persona: 'teacher' | 'child') => {
    playArabicAudio(word, { persona });
  };

  const filteredVocab = vocabList.filter(w => !searchFilter || w.includes(searchFilter));

  const totalRequired = totalVocabCount || 1;
  const coveragePercent = Math.min(100, Math.round((stats.count / totalRequired) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-cairo">
      <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>استوديو التخزين الصوتي الذكي (IndexedDB Cache)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-normal">
                  بدون استهلاك للشبكة
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                تخزين وتشغيل كافة أصوات الكلمات والمقاطع محلياً بنوعي الأصوات لتوفير سرعة 0ms للطفل
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/60">
          {[
            { id: 'overview', label: 'لوحة التخزين والجاهزية', icon: HardDrive },
            { id: 'test', label: 'مختبر تجربة النبرات', icon: Volume2 },
            { id: 'vocabulary', label: `قاموس المنهاج (${vocabList.length})`, icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-amber-400/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-xs text-slate-400 font-medium">المقاطع المخزنة</div>
                  <div className="text-xl font-black text-amber-400 mt-1 font-mono">{stats.count}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">من أصل {totalRequired} مطلوب</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-xs text-slate-400 font-medium">صوت المعلمة 👩‍🏫</div>
                  <div className="text-xl font-black text-emerald-400 mt-1 font-mono">{stats.teacherCount}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">مقطع محفوظ</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-xs text-slate-400 font-medium">صوت البطل 👦</div>
                  <div className="text-xl font-black text-cyan-400 mt-1 font-mono">{stats.childCount}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">مقطع محفوظ</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-xs text-slate-400 font-medium">حجم الذاكرة المستهلك</div>
                  <div className="text-xl font-black text-purple-400 mt-1 font-mono">{stats.estimatedSizeKb} KB</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">IndexedDB محلي</div>
                </div>
              </div>

              {/* Readiness Progress Bar */}
              <div className="p-5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>نسبة جاهزية الأصوات في المتصفح:</span>
                  </span>
                  <span className="font-mono font-black text-amber-300 text-sm">{coveragePercent}%</span>
                </div>

                <div className="w-full bg-slate-700/60 rounded-full h-3 overflow-hidden p-0.5">
                  <div 
                    className="bg-linear-to-r from-amber-500 via-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 shadow-sm"
                    style={{ width: `${coveragePercent}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  عند تخزين الأصوات في الذاكرة المحلية (IndexedDB)، ينطق التطبيق كافة كلمات وحروف المنهاج بسرعة البرق (0ms) فور النقر عليها دون الحاجة للاتصال بالإنترنت أو انتظار معالجة الخادم.
                </p>
              </div>

              {/* Progress Box if Running */}
              {isBusy && progress && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-pulse">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>{progress.statusText}</span>
                    </span>
                    <span className="font-mono font-bold text-amber-200">{progress.percent}%</span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full transition-all duration-200"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>الكلمة الحالية: <strong className="text-white text-xs">{progress.currentWord}</strong></span>
                    <span>{progress.completedItems} / {progress.totalItems}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {!isBusy ? (
                  <button
                    onClick={handleStartPrecache}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>توليد وتخزين جميع كلمات ومقاطع المنهاج الآن (بنوعي الأصوات)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCancelPrecache}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>إيقاف عملية التوليد</span>
                  </button>
                )}

                <button
                  onClick={handleClearCache}
                  disabled={stats.count === 0 || isBusy}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-rose-900/30 hover:border-rose-700/50 border border-slate-700 text-slate-300 hover:text-rose-300 font-bold text-xs transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="مسح الذاكرة المخزنة"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>مسح الذاكرة</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Test Laboratory */}
          {activeTab === 'test' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-4">
                <label className="block text-xs font-bold text-slate-300">
                  اكتب أي كلمة أو جملة مشكّلة لاختبار النطق والتخزين:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testWord}
                    onChange={(e) => setTestWord(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-400"
                    placeholder="مثال: مَدْرَسَةٌ، كَتَبَ، صَادَ"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleTestPlay(testWord, 'teacher')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-600/30 transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold">تجربة صوت المعلمة الحنونة 👩‍🏫</span>
                  </button>

                  <button
                    onClick={() => handleTestPlay(testWord, 'child')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-600/30 transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold">تجربة صوت البطل الصغير 👦</span>
                  </button>
                </div>
              </div>

              {/* Sample Quick Chips */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400">عينات سريعة من المنهاج:</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'كَتَبَ', 'قَرَأَ', 'دَرَسَ', 'صَادَ', 'نَامَ', 'سُلْطَانُ', 'قَلَمٌ',
                    'أَ إِ أُ', 'بَ بِ بُ', 'الشَّمْسُ', 'الْقَمَرُ', 'أَحْسَنْتَ!'
                  ].map(w => (
                    <button
                      key={w}
                      onClick={() => setTestWord(w)}
                      className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white hover:border-amber-400 transition cursor-pointer"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Vocabulary Directory */}
          {activeTab === 'vocabulary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="بحث في الكلمات المستخرجة..."
                  className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                />
                <span className="text-xs text-slate-400 font-mono">
                  {filteredVocab.length} كلمة
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto border border-slate-800 rounded-xl divide-y divide-slate-800/60 bg-slate-950/40">
                {filteredVocab.slice(0, 100).map((word, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2 hover:bg-slate-800/30">
                    <span className="text-xs font-bold text-slate-200">{word}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTestPlay(word, 'teacher')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 text-[11px] font-bold transition cursor-pointer"
                        title="نطق بصوت المعلمة"
                      >
                        👩‍🏫 المعلمة
                      </button>
                      <button
                        onClick={() => handleTestPlay(word, 'child')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-600/30 text-cyan-300 text-[11px] font-bold transition cursor-pointer"
                        title="نطق بصوت الطفل"
                      >
                        👦 الطفل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>نظام التخزين المحلي الآمن (IndexedDB) نشط وجاهز</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
