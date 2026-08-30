import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Smartphone, 
  Download, 
  Share2, 
  Check, 
  X, 
  Sparkles, 
  WifiOff, 
  QrCode, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  School,
  ArrowRight,
  Package
} from 'lucide-react';
import { SchoolBranding, generateStudentShareableLink } from '../institutional_branding/schoolBranding';
import { IbnSinaLogo } from '../institutional_branding/IbnSinaLogo';
import { usePwaInstall } from './usePwaInstall';
import { ApkExportGuide } from './ApkExportGuide';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: SchoolBranding;
  studentName?: string;
  studentGrade?: string;
  studentClass?: string;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  branding,
  studentName = 'طالب متميز',
  studentGrade = '',
  studentClass = ''
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'qr' | 'whatsapp' | 'apk'>('install');
  const { isInstallable, isInstalled, triggerInstall } = usePwaInstall();

  const shareLink = generateStudentShareableLink(
    branding, 
    studentName, 
    studentGrade, 
    studentClass, 
    'student_hub'
  );

  useEffect(() => {
    if (isOpen && shareLink) {
      QRCode.toDataURL(shareLink, {
        width: 320,
        margin: 2,
        color: {
          dark: '#064e3b',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [isOpen, shareLink]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSendWhatsApp = () => {
    const schoolTitle = branding.schoolName || 'مدارس ابن سيناء الأهلية';
    const message = `📲 *تطبيق مسار تعلم الطالب والتفوق (أندرويد)*\n🏫 المدرسة: *${schoolTitle}*\n👨‍🎓 الطالب: *${studentName}*\n\n🔹 يمكنك فتح الرابط التالي وتثبيت التطبيق على الشاشة الرئيسية لهاتفك للعمل في أي وقت دون عناء:\n${shareLink}\n\n✨ مميزات التطبيق:\n- شعار وبيانات المدرسة محفوظة تلقائياً.\n- يعمل بكامل ميزات مسار القراءة وبوابة الطالب.\n- إمكانية القراءة ومراجعة الدروس دون انقطاع.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs font-cairo animate-fade-in no-print">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-emerald-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Smartphone className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide">تثبيت تطبيق الأندرويد</h2>
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">PWA / Android</span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium">
                {branding.schoolName || 'مدارس ابن سيناء الأهلية'} — مسار الطالب المباشر
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('install')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'install'
                ? 'border-emerald-700 text-emerald-800 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>التثبيت المباشر</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'qr'
                ? 'border-emerald-700 text-emerald-800 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>رمز المسح السريع (QR Code)</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'border-emerald-700 text-emerald-800 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة الرابط والواتساب</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'apk'
                ? 'border-emerald-700 text-emerald-800 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>تصدير ملف APK / AAB</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Institutional Preview Card */}
          <div className="bg-linear-to-br from-emerald-50 via-teal-50/40 to-amber-50/50 p-4 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <IbnSinaLogo size="sm" customLogoUrl={branding.logoUrl} schoolName={branding.schoolName} />
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-800">{branding.schoolName || 'مدارس ابن سيناء الأهلية'}</h4>
                <p className="text-[11px] text-emerald-800 font-medium">{branding.countryName || 'الجمهورية اليمنية'} • مسار الطالب والدروس</p>
              </div>
            </div>
            <div className="text-left">
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>شعار وبيانات مضمنة</span>
              </span>
            </div>
          </div>

          {/* TAB 1: Direct Android Install */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              {isInstalled ? (
                <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300 flex items-center gap-3 text-xs sm:text-sm font-bold">
                  <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-emerald-950">التطبيق مثبت بالفعل على هذا الجهاز!</p>
                    <p className="text-[11px] text-emerald-800">يمكنك فتحه في أي وقت مباشرة من شاشة هاتفك الرئيسية.</p>
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-center space-y-3">
                  <p className="text-xs sm:text-sm font-black text-amber-950">
                    جهازك جاهز للتثبيت الفوري بنقرة واحدة!
                  </p>
                  <button
                    onClick={() => triggerInstall()}
                    className="w-full py-3 px-4 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2 text-sm sm:text-base transition cursor-pointer transform hover:scale-[1.01]"
                  >
                    <Download className="w-5 h-5" />
                    <span>تثبيت التطبيق على الشاشة الرئيسية للهاتف 📲</span>
                  </button>
                </div>
              ) : null}

              {/* Instructions Guide for Android */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-700" />
                  <span>طريقة التثبيت على هواتف الأندرويد (Google Chrome / Samsung):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-700">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="font-black text-emerald-800 flex items-center gap-1">
                      <span className="w-5 h-5 bg-emerald-200 text-emerald-900 rounded-full flex items-center justify-center text-[11px]">١</span>
                      <span>افتح الرابط بالمتصفح</span>
                    </div>
                    <p className="text-[11px] text-slate-600">افتح رابط مسار الطالب في متصفح كروم على هاتف الأندرويد.</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="font-black text-emerald-800 flex items-center gap-1">
                      <span className="w-5 h-5 bg-emerald-200 text-emerald-900 rounded-full flex items-center justify-center text-[11px]">٢</span>
                      <span>اضغط قائمة الخيارات (⋮)</span>
                    </div>
                    <p className="text-[11px] text-slate-600">اضغط على النقاط الثلاث العلوية في زاوية المتصفح.</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="font-black text-emerald-800 flex items-center gap-1">
                      <span className="w-5 h-5 bg-emerald-200 text-emerald-900 rounded-full flex items-center justify-center text-[11px]">٣</span>
                      <span>اختر «تثبيت التطبيق»</span>
                    </div>
                    <p className="text-[11px] text-slate-600">اختر «إضافة للشاشة الرئيسية» أو «تثبيت التطبيق» لتجده فوراً مع تطبيقاتك.</p>
                  </div>
                </div>
              </div>

              {/* Offline & Performance Banner */}
              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs text-emerald-900">
                <div className="w-8 h-8 bg-emerald-200 text-emerald-800 rounded-xl flex items-center justify-center shrink-0">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black">جاهز للعمل دون اتصال دائم: </span>
                  <span className="text-slate-600 text-[11px]">يتم تخزين الصفحات والأنشطة في الهاتف لسهولة التعلم في أي وقت.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QR Code */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-600">
                امسح هذا الرمز بكاميرا هاتف الطالب أو ولي الأمر لفتح وتثبيت التطبيق مباشرة بشعار مدرستكم:
              </p>

              {qrDataUrl ? (
                <div className="inline-block p-4 bg-white rounded-3xl border-2 border-emerald-400 shadow-md">
                  <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 sm:w-60 sm:h-60 mx-auto" />
                  <div className="mt-2 text-xs font-black text-emerald-900 flex items-center justify-center gap-1">
                    <School className="w-3.5 h-3.5" />
                    <span>{branding.schoolName || 'مدارس ابن سيناء الأهلية'}</span>
                  </div>
                </div>
              ) : (
                <div className="w-52 h-52 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-xs text-slate-400">
                  جاري تجهيز رمز QR...
                </div>
              )}

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط الـ QR'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-800" />
                  <span>طباعة بطاقة الـ QR لأولياء الأمور</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Share & WhatsApp */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950">رابط تطبيق الطالب المباشر:</span>
                  <span className="text-[11px] text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 font-bold">جاهز للنشر</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-700 break-all select-all text-left">
                  {shareLink}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    onClick={handleCopy}
                    className={`w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-900 text-white'
                    }`}
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'تم نسخ الرابط بنجاح!' : 'نسخ الرابط'}</span>
                  </button>

                  <button
                    onClick={handleSendWhatsApp}
                    className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>إرسال عبر الواتساب للأهالي 📲</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">💡 ملاحظة للمدرسة والمعلمين:</p>
                <p>عندما تفتح ولي الأمر هذا الرابط على هاتفها، سيظهر لها زر تثبيت التطبيق تلقائياً مع الشعار واسم المدرسة وبيانات الطالب دون الحاجة لأي تسجيل دخول أو تعقيدات.</p>
              </div>
            </div>
          )}

          {/* TAB 4: APK & Native Android Export */}
          {activeTab === 'apk' && (
            <ApkExportGuide branding={branding} shareUrl={shareLink} />
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            🇾🇪 مسار تعلم القراءة والكتابة
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
