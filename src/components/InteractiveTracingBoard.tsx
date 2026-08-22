import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, Download, Sparkles } from 'lucide-react';

interface TracingBoardProps {
  guideText?: string;
  height?: number;
  title?: string;
}

export const InteractiveTracingBoard: React.FC<TracingBoardProps> = ({
  guideText = 'أَ',
  height = 220,
  title = 'سبورة التتبع والكتابة بخط اليد'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#1E3A8A');
  const [penSize, setPenSize] = useState(4);
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [height]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history for undo
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), currentData]);

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastState = history[history.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setHistory((prev) => prev.slice(0, -1));
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `كتابة-${guideText}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
            ✍️ {title}
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            اكتب بإصبعك أو القلم على خط التتبع
          </span>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Colors */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {['#1E3A8A', '#059669', '#DC2626', '#7C3AED', '#000000'].map((color) => (
              <button
                key={color}
                onClick={() => setPenColor(color)}
                className={`w-5 h-5 rounded-full transition ${
                  penColor === color ? 'scale-125 ring-2 ring-amber-400' : 'opacity-80'
                }`}
                style={{ backgroundColor: color }}
                title="تغيير لون القلم"
              />
            ))}
          </div>

          {/* Size */}
          <select
            value={penSize}
            onChange={(e) => setPenSize(Number(e.target.value))}
            className="bg-slate-100 border border-slate-300 text-xs rounded-lg px-1.5 py-1 font-bold outline-hidden"
          >
            <option value={2}>قلم رفيع</option>
            <option value={4}>قلم متوسط</option>
            <option value={7}>قلم عريض</option>
          </select>

          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 disabled:opacity-40 transition"
            title="تراجع"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Clear */}
          <button
            onClick={clearCanvas}
            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-rose-200"
            title="مسح اللوحة"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span className="text-[11px]">مسح</span>
          </button>

          {/* Download */}
          <button
            onClick={downloadDrawing}
            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold transition border border-amber-200"
            title="تنزيل الرسمة"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Box with Arabic Calligraphy Lines & Watermark Guide */}
      <div 
        className="relative bg-[#FCFAF7] border-2 border-dashed border-amber-300/80 rounded-xl overflow-hidden flex items-center justify-center select-none"
        style={{ height }}
      >
        {/* Notebook Lines Guide */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-around opacity-25">
          <div className="border-b border-amber-400 w-full"></div>
          <div className="border-b-2 border-red-400 w-full"></div>
          <div className="border-b border-amber-400 w-full"></div>
        </div>

        {/* Watermark Guide Text */}
        {guideText && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-slate-300 font-black font-cairo text-7xl sm:text-8xl tracking-wider opacity-60">
              {guideText}
            </span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-cairo">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          التدريب التكراري يرسخ المهارة الإملائية في الذاكرة العضلية للطالب.
        </span>
        <span className="font-bold text-amber-800">
          النموذج الإرشادي: ({guideText})
        </span>
      </div>
    </div>
  );
};
