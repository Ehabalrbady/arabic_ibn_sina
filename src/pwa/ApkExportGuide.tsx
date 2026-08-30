import React, { useState } from 'react';
import { 
  Package, 
  Terminal, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  FileCode, 
  HelpCircle,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { SchoolBranding } from '../institutional_branding/schoolBranding';

interface ApkExportGuideProps {
  branding: SchoolBranding;
  shareUrl: string;
}

export const ApkExportGuide: React.FC<ApkExportGuideProps> = ({ branding, shareUrl }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 3000);
  };

  const bubblewrapCommand = `npx @bubblewrap/cli init --manifest="${window.location.origin}/manifest.json"`;
  const capacitorCommands = `# 1. تثبيت Capacitor في المشروع
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. تهيئة وتوليد مجلد الأندرويد الأصلي (Android Studio)
npx cap add android

# 3. بناء المشروع وتحديث كود التطبيق
npm run build
npx cap sync android

# 4. فتح المشروع في Android Studio لتصدير ملف APK أو AAB
npx cap open android`;

  return (
    <div className="space-y-4 text-slate-800 text-xs">
      
      {/* Introduction Card */}
      <div className="bg-linear-to-r from-emerald-900 to-teal-900 text-white p-4 rounded-2xl border border-emerald-700 space-y-2">
        <div className="flex items-center gap-2 font-black text-sm text-amber-300">
          <Package className="w-4 h-4" />
          <span>تصدير ملف تثبيت أصلي للأندرويد (APK / AAB)</span>
        </div>
        <p className="text-emerald-100 text-[11px] leading-relaxed">
          هذا المشروع مهيأ ومجهز بالكامل بملفات التكوين الخاصة بـ <strong>Capacitor</strong> و <strong>TWA Bubblewrap</strong> لتوليد ملف <code className="bg-black/30 px-1 py-0.5 rounded text-amber-200 font-mono">.apk</code> مستقل يمكنك توزيعه عبر الواتساب أو رفعه كحزمة <code className="bg-black/30 px-1 py-0.5 rounded text-amber-200 font-mono">.aab</code> على متجر Google Play.
        </p>
      </div>

      {/* Option 1: PWA2APK / PWABuilder (Instant No-Code Option) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xs text-slate-900">
            <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">١</span>
            <span>الطريقة الأسهل والأسرع: استخدام أداة PWABuilder الرسمية من Microsoft</span>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">بدون أكواد (No-Code)</span>
        </div>

        <p className="text-slate-600 text-[11px]">
          يقوم موقع <strong>PWABuilder</strong> بقراءة ملف الـ <code className="bg-slate-200 px-1 rounded text-slate-800 font-mono">manifest.json</code> المُعد مسبقاً وتوليد ملف APK جاهز للتنزيل بنقرة زر واحدة:
        </p>

        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
          <div className="font-mono text-[10px] text-slate-700 truncate select-all">
            {shareUrl || window.location.href}
          </div>
          <button
            onClick={() => copyToClipboard(shareUrl || window.location.href, 'pwa-url')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-lg transition flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {copiedCmd === 'pwa-url' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCmd === 'pwa-url' ? 'تم النسخ' : 'نسخ الرابط'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.pwabuilder.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-xs"
          >
            <span>فتح PWABuilder لتوليد APK مجاناً</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Option 2: Capacitor / Android Studio */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xs text-slate-900">
            <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px]">٢</span>
            <span>طريقة الحزم الاحترافية عبر Capacitor و Android Studio:</span>
          </div>
          <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">مطورين / Android Studio</span>
        </div>

        <p className="text-slate-600 text-[11px]">
          تم تضمين ملف التكوين <code className="bg-slate-200 px-1 rounded text-slate-800 font-mono">capacitor.config.json</code> بالمشروع. يمكنك تنفيذ هذه الأوامر في التيرمينال لإنشاء مشروع Android أصلي:
        </p>

        <div className="relative">
          <pre className="bg-slate-900 text-emerald-300 p-3.5 rounded-xl font-mono text-[10px] leading-relaxed overflow-x-auto text-left dir-ltr">
            {capacitorCommands}
          </pre>
          <button
            onClick={() => copyToClipboard(capacitorCommands, 'capacitor-cmd')}
            className="absolute top-2 right-2 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            {copiedCmd === 'capacitor-cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCmd === 'capacitor-cmd' ? 'تم النسخ' : 'نسخ الأوامر'}</span>
          </button>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
          <span>في Android Studio: اذهب إلى <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> وستحصل فوراً على ملف APK جاهز للتوزيع على الواتساب.</span>
        </div>
      </div>

    </div>
  );
};
