import React from 'react';
import { Award, BookOpen, Clock, CheckCircle, RotateCcw } from 'lucide-react';
import { Flashcard } from '../types';

interface StatsBannerProps {
  cards: Flashcard[];
  onResetProgress: () => void;
  onRestoreDefaults: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  cards,
  onResetProgress,
  onRestoreDefaults,
}) => {
  const total = cards.length;
  const mastered = cards.filter(c => c.status === 'mastered').length;
  const learning = total - mastered;
  const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;

  const customCount = cards.filter(c => c.isCustom).length;

  return (
    <div className="w-full bg-white rounded-[24px] border-2 border-slate-200 p-6 sm:p-7 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* Percentage Gauge */}
      <div className="flex items-center gap-5">
        <div className="relative w-22 h-22 flex-shrink-0 flex items-center justify-center">
          {/* Subtle Circular ring background */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-slate-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="34"
              cx="44"
              cy="44"
            />
            <circle
              className="text-primary transition-all duration-500 ease-out"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - percentage / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="34"
              cx="44"
              cy="44"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-xl font-black text-slate-800 font-mono tracking-tight">{percentage}%</span>
          </div>
        </div>
        
        <div>
          <h2 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
            <Award className="w-4 h-4 text-amber-500 fill-amber-100" />
            คะแนนความจำสะสม (Mastery Progress)
          </h2>
          <p className="text-xl font-black text-slate-850">
            {mastered} จาก {total} คำศัพท์จำแม่นยำแล้ว
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {learning > 0 ? `เหลืออีก ${learning} คำที่ต้องเดินหน้าทบทวนความเร็วเพื่อขึ้นใจ!` : 'สุดยอดมาก! คุณจำคำศัพท์ทั้งหมดได้อย่างสมบูรณ์แบบ 🎉'}
          </p>
        </div>
      </div>

      {/* Grid statistics items (Bold and tracked) */}
      <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
        <div className="bg-slate-50 rounded-2xl p-3.5 border-2 border-slate-100 text-center min-w-[80px] sm:min-w-[105px]">
          <BookOpen className="w-4 h-4 text-indigo-500 mx-auto mb-1.5" />
          <div className="text-2xl font-black text-slate-800 font-mono leading-none mb-1">{total}</div>
          <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">คำศัพท์</div>
        </div>

        <div className="bg-emerald-50/50 rounded-2xl p-3.5 border-2 border-emerald-100 text-center min-w-[80px] sm:min-w-[105px]">
          <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
          <div className="text-2xl font-black text-emerald-700 font-mono leading-none mb-1">{mastered}</div>
          <div className="text-[9px] font-extrabold text-slate-550 uppercase tracking-widest">ขึ้นใจแล้ว</div>
        </div>

        <div className="bg-amber-50/55 rounded-2xl p-3.5 border-2 border-amber-100 text-center min-w-[80px] sm:min-w-[105px]">
          <Clock className="w-4 h-4 text-amber-500 mx-auto mb-1.5" />
          <div className="text-2xl font-black text-amber-700 font-mono leading-none mb-1">{learning}</div>
          <div className="text-[9px] font-extrabold text-slate-550 uppercase tracking-widest">กำลังฝึก</div>
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto self-stretch md:self-center justify-around border-t md:border-t-0 md:border-l-2 border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
        <button
          type="button"
          onClick={onResetProgress}
          className="flex items-center justify-center gap-1.5 text-slate-600 hover:text-white border-2 border-slate-200 hover:border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 shadow-xs"
          title="เริ่มสถิติกระบวนการจำใหม่ทั้งหมด"
        >
          <RotateCcw className="w-3.5 h-3.5 transition-transform duration-305 hover:rotate-180" />
          <span>ล้างสถิติใหม่</span>
        </button>

        {customCount > 0 && (
          <button
            type="button"
            onClick={onRestoreDefaults}
            className="flex items-center justify-center gap-1.5 text-slate-400 hover:text-red-700 border-2 border-transparent hover:border-red-200 hover:bg-red-50 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200"
            title="ลบคำศัพท์ส่วนตัวและกลับไปใช้คำศัพท์เริ่มต้น"
          >
            <span>คืนค่าเริ่มต้น</span>
          </button>
        )}
      </div>
    </div>
  );
};
