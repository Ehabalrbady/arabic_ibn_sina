import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, Volume2, ArrowLeft } from 'lucide-react';
import { ALL_BOOK_PAGES } from '../data/bookData';
import { playArabicAudio } from '../utils/audio';

interface SearchModalProps {
  onClose: () => void;
  onSelectPage: (pageNumber: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose, onSelectPage }) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const results: Array<{ pageNumber: number; title: string; matchReason: string; word?: string }> = [];

    ALL_BOOK_PAGES.forEach((page) => {
      // Check title
      if (page.title.toLowerCase().includes(q)) {
        results.push({ pageNumber: page.pageNumber, title: page.title, matchReason: 'عنوان الصفحة' });
      }
      // Check grid items / words
      if (page.content?.gridItems) {
        page.content.gridItems.forEach((word) => {
          if (word.includes(q)) {
            results.push({ pageNumber: page.pageNumber, title: page.title, matchReason: `كلمة: (${word})`, word });
          }
        });
      }
      // Check analysis words
      if (page.content?.analysisWords) {
        page.content.analysisWords.forEach((item) => {
          if (item.word.includes(q)) {
            results.push({ pageNumber: page.pageNumber, title: page.title, matchReason: `تحليل كلمة: (${item.word})`, word: item.word });
          }
        });
      }
      // Check sentences
      if (page.content?.sentences) {
        page.content.sentences.forEach((s) => {
          if (s.includes(q)) {
            results.push({ pageNumber: page.pageNumber, title: page.title, matchReason: `جملة: (${s.substring(0, 30)}...)` });
          }
        });
      }
    });

    // Remove duplicates
    return results.slice(0, 30);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-2 border-amber-400 font-cairo space-y-4 animate-in fade-in zoom-in duration-200 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-800 text-base">البحث في كامل الكتاب (١٢١ صفحة)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن كلمة، حرف، مهارة، أو رقم صفحة (مثال: قَرَأَ، مد، تنوين، 42)..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-2 border-amber-300 focus:border-emerald-600 rounded-xl font-cairo text-sm outline-hidden"
            autoFocus
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
          <span className="text-slate-400">بحث سريع:</span>
          {['الفتحة', 'المقطع الساكن', 'المد بالألف', 'الشدة', 'التاء المربوطة', 'اللام الشمسية'].map((chip) => (
            <button
              key={chip}
              onClick={() => setQuery(chip)}
              className="bg-slate-100 hover:bg-amber-100 px-2 py-0.5 rounded-lg text-slate-700 font-medium transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {searchResults.length === 0 && query.trim() ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              لم يتم العثور على نتائج مطابقة لـ "{query}".
            </div>
          ) : (
            searchResults.map((res, index) => (
              <div
                key={index}
                className="p-3 bg-slate-50 hover:bg-amber-50 rounded-xl border border-slate-200 hover:border-amber-400 flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {res.pageNumber}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">{res.title}</span>
                    <span className="text-[11px] text-amber-800 font-medium">{res.matchReason}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {res.word && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playArabicAudio(res.word!);
                      }}
                      className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-emerald-700 border border-slate-200"
                      title="استماع"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onSelectPage(res.pageNumber);
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>فتح</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
