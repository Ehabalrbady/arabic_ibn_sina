import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Edit2, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Search, 
  Sliders, 
  Eye, 
  Settings, 
  AlertCircle, 
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BookPage, UnitId } from './types';
import { BOOK_UNITS } from './unitsInfo';

interface CurriculumEditorProps {
  pages: BookPage[];
  onSavePages: (updatedPages: BookPage[]) => void;
  onNavigateToPage: (pageNumber: number) => void;
}

export const CurriculumEditor: React.FC<CurriculumEditorProps> = ({
  pages,
  onSavePages,
  onNavigateToPage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [editingPage, setEditingPage] = useState<BookPage | null>(null);
  
  // Local form state for editing
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formGoal, setFormGoal] = useState('');
  const [formProcedure, setFormProcedure] = useState('');
  const [formRuleNotice, setFormRuleNotice] = useState('');
  const [formText, setFormText] = useState('');
  const [formItems, setFormItems] = useState<string[]>([]);
  const [formGridItems, setFormGridItems] = useState<string[]>([]);
  const [formSentences, setFormSentences] = useState<string[]>([]);
  const [formDictationWords, setFormDictationWords] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filtered pages list
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesSearch = 
        page.pageNumber.toString() === searchTerm.trim() ||
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (page.subtitle && page.subtitle.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesUnit = selectedUnit === 'all' || page.unitId === selectedUnit;
      
      return matchesSearch && matchesUnit;
    });
  }, [pages, searchTerm, selectedUnit]);

  const handleStartEdit = (page: BookPage) => {
    setEditingPage(page);
    setFormTitle(page.title || '');
    setFormSubtitle(page.subtitle || '');
    setFormGoal(page.goal || '');
    setFormProcedure(page.procedure || '');
    setFormRuleNotice(page.ruleNotice || '');
    setFormText(page.content?.text || '');
    setFormItems(page.content?.items || []);
    setFormGridItems(page.content?.gridItems || []);
    setFormSentences(page.content?.sentences || []);
    setFormDictationWords(page.content?.dictationSuggestedWords || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavePage = () => {
    if (!editingPage) return;

    const updatedPages = pages.map(p => {
      if (p.pageNumber === editingPage.pageNumber) {
        return {
          ...p,
          title: formTitle,
          subtitle: formSubtitle,
          goal: formGoal,
          procedure: formProcedure,
          ruleNotice: formRuleNotice,
          content: {
            ...p.content,
            text: formText || undefined,
            items: formItems.length > 0 ? formItems : undefined,
            gridItems: formGridItems.length > 0 ? formGridItems : undefined,
            sentences: formSentences.length > 0 ? formSentences : undefined,
            dictationSuggestedWords: formDictationWords.length > 0 ? formDictationWords : undefined,
          }
        };
      }
      return p;
    });

    onSavePages(updatedPages);
    showNotification('success', `تم حفظ التعديلات للصفحة رقم ${editingPage.pageNumber} بنجاح!`);
    setEditingPage(null);
  };

  const handleResetCurriculum = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين جميع الدروس والصفحات إلى حالتها الافتراضية الأولى؟ سيتم فقدان أي تعديلات قمت بها.')) {
      localStorage.removeItem('ibn_sinai_custom_pages');
      window.location.reload();
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Helper arrays update functions
  const handleItemChange = (index: number, val: string) => {
    const updated = [...formItems];
    updated[index] = val;
    setFormItems(updated);
  };

  const handleGridItemChange = (index: number, val: string) => {
    const updated = [...formGridItems];
    updated[index] = val;
    setFormGridItems(updated);
  };

  const handleSentenceChange = (index: number, val: string) => {
    const updated = [...formSentences];
    updated[index] = val;
    setFormSentences(updated);
  };

  const handleDictationWordChange = (index: number, val: string) => {
    const updated = [...formDictationWords];
    updated[index] = val;
    setFormDictationWords(updated);
  };

  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">
      
      {/* Upper Title Panel */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-800">
              <Settings className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              لوحة تحرير وإعداد المنهج الدراسي
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            تتيح هذه اللوحة للمعلمين إمكانية تعديل وتحرير نصوص الدروس، الحروف، الكلمات، والخطوات المنهجية لكل صفحات البرنامج (١٢١ صفحة) وحفظها فورياً.
          </p>
        </div>
        <button
          onClick={handleResetCurriculum}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition font-bold text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة تعيين المنهج للافتراضي</span>
        </button>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <Check className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">{notification.message}</p>
        </div>
      )}

      {editingPage ? (
        /* EDITING SCREEN FORM */
        <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full text-sm">
                صفحة {editingPage.pageNumber}
              </span>
              <h2 className="text-lg font-extrabold text-slate-800">
                تعديل محتويات الدرس
              </h2>
            </div>
            <button
              onClick={() => setEditingPage(null)}
              className="text-slate-500 hover:text-slate-800 font-bold text-sm"
            >
              إلغاء والعودة للقائمة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meta and Basic Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">عنوان الصفحة الرئيسي</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">العنوان الفرعي أو التوضيحي</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">الهدف التعليمي (يظهر في الهامش العلوي)</label>
                <textarea
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">الإجراء المنهجي للمعلم أو ولي الأمر</label>
                <textarea
                  value={formProcedure}
                  onChange={(e) => setFormProcedure(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">تنبيه القاعدة الصوتية / الملاحظة الهامة</label>
                <input
                  type="text"
                  value={formRuleNotice}
                  onChange={(e) => setFormRuleNotice(e.target.value)}
                  placeholder="مثال: انتبه لنطق الحرف الساكن دفعة واحدة مع ما قبله"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            {/* Dynamic Content Fields depending on what content exists */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200/50 space-y-4">
              <h3 className="text-sm font-black text-amber-900 border-b border-amber-200 pb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>مكونات ومحتوى الصفحة المنهجي</span>
              </h3>

              {editingPage.content?.text !== undefined && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">النص الرئيسي للدرس</label>
                  <textarea
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    rows={4}
                    dir="rtl"
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-lg font-bold focus:outline-hidden focus:border-amber-400 text-center"
                  />
                </div>
              )}

              {formItems.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">الكلمات / الحروف المستهدفة (القائمة)</label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 bg-white border border-slate-100 rounded-xl">
                    {formItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1 px-1">
                        <span className="text-xs text-slate-400 w-5 text-left">{idx + 1}.</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleItemChange(idx, e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-md text-sm text-center font-bold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formGridItems.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">محتويات الجدول / شبكة القراءة</label>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1 bg-white border border-slate-100 rounded-xl">
                    {formGridItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="text-xs text-slate-400 w-4 text-left">{idx + 1}</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleGridItemChange(idx, e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-md text-sm text-center font-bold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formSentences.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">الجمل القرائية المقترحة</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto p-1 bg-white border border-slate-100 rounded-xl">
                    {formSentences.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-400 w-4 text-left">{idx + 1}</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleSentenceChange(idx, e.target.value)}
                          className="w-full px-3 py-1 border border-slate-200 rounded-md text-sm font-bold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formDictationWords.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">كلمات الإملاء المقترحة للدرس</label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 bg-white border border-slate-100 rounded-xl">
                    {formDictationWords.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="text-xs text-slate-400 w-5 text-left">{idx + 1}.</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleDictationWordChange(idx, e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded-md text-sm text-center font-bold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber-100/60 rounded-xl text-xs text-amber-900 border border-amber-200/50 flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="font-medium">
                  ملاحظة: يدعم محرك النطق قراءة التشكيل المكتوب تلقائياً. تأكد من إدخال الحروف والكلمات بالتشكيل الصحيح (الفتحة َ، الضمة ُ، الكسرة ِ، السكون ْ، التنوين) لضمان النطق السليم للبطل الصغير.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setEditingPage(null)}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition font-bold text-sm"
            >
              إلغاء التعديلات
            </button>
            <button
              onClick={handleSavePage}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-bold text-sm shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الصفحة الحالية</span>
            </button>
          </div>
        </div>
      ) : (
        /* MAIN LIST VIEW WITH SEARCH & FILTER */
        <div className="space-y-4">
          <div className="bg-white border border-amber-100 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث برقم الصفحة أو العنوان..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* Unit filter */}
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-amber-400 bg-white font-medium"
              >
                <option value="all">كل الوحدات الدراسية</option>
                {BOOK_UNITS.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    الوحدة {unit.number}: {unit.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500 font-bold">
              عرض {filteredPages.length} صفحة من أصل {pages.length}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPages.map(page => {
              const unit = BOOK_UNITS.find(u => u.id === page.unitId);
              return (
                <div 
                  key={page.pageNumber} 
                  className="bg-white border border-slate-150 rounded-xl p-4 hover:border-amber-300 transition shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full text-xs">
                        صفحة {page.pageNumber}
                      </span>
                      {unit && (
                        <span className="text-[11px] font-bold text-slate-400">
                          الوحدة {unit.number}: {unit.shortTitle}
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-800 text-sm line-clamp-1">
                      {page.title}
                    </h3>
                    {page.subtitle && (
                      <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                        {page.subtitle}
                      </p>
                    )}
                    
                    <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                      <div>نمط العرض: <span className="font-bold text-slate-500">{page.pageType}</span></div>
                      {page.content?.text && (
                        <div className="line-clamp-1">النص: <span className="font-medium text-slate-600">"{page.content.text}"</span></div>
                      )}
                      {page.content?.items && (
                        <div>الكلمات: <span className="font-bold text-slate-500">{page.content.items.length} كلمات</span></div>
                      )}
                      {page.content?.gridItems && (
                        <div>الجدول: <span className="font-bold text-slate-500">{page.content.gridItems.length} خلية</span></div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
                    <button
                      onClick={() => handleStartEdit(page)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>تعديل الصفحة</span>
                    </button>
                    <button
                      onClick={() => onNavigateToPage(page.pageNumber)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg hover:text-slate-800 transition"
                      title="عرض تفاعلي للصفحة"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPages.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-150">
              <p className="text-slate-400 font-bold text-sm">لا توجد صفحات تطابق خيارات البحث الحالية.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
