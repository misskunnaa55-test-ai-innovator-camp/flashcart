import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, AlertCircle, RefreshCw, HelpCircle, GraduationCap } from 'lucide-react';
import { Flashcard } from '../types';

interface Flashcard3DProps {
  card: Flashcard;
  onStatusChange: (id: string, newStatus: 'learning' | 'mastered') => void;
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}

export function speak(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // Slightly slower for better learners attention
    window.speechSynthesis.speak(utterance);
  }
}

export const Flashcard3D: React.FC<Flashcard3DProps> = ({
  card,
  onStatusChange,
  isFlipped,
  setIsFlipped,
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  // Auto-speak word on load if selected (optional, let's do manual trigger for best user control)
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid flipping when clicking the sound button
    setIsPlayingSound(true);
    speak(card.word);
    setTimeout(() => setIsPlayingSound(false), 900);
  };

  const getPOSColor = (pos: string) => {
    const p = pos.toLowerCase();
    if (p.includes('adj')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (p.includes('verb')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (p.includes('noun')) return 'bg-sky-100 text-sky-800 border-sky-200';
    if (p.includes('adv')) return 'bg-purple-100 text-purple-800 border-purple-200';
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* 3D Container with custom shadows and layout */}
      <div 
        id="flashcard-3d-wrapper"
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-85 sm:h-[400px] perspective-1000 cursor-pointer select-none group focus:outline-none"
      >
        {/* Flipping Card Box */}
        <div 
          className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* FRONT FACE (WHITE BOLD MODERN LOOK) */}
          <div 
            id="card-front"
            className="absolute inset-0 w-full h-full rounded-[24px] border-2 border-slate-200 bg-white p-6 sm:p-9 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_10px_10px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between backface-hidden transition-all group-hover:border-indigo-300"
          >
            {/* Card Header information */}
            <div className="flex justify-between items-center w-full">
              <span className={`text-[10px] tracking-[0.15em] px-3 py-1 rounded-lg font-extrabold border ${getPOSColor(card.partOfSpeech)}`}>
                {card.partOfSpeech.toUpperCase()}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <GraduationCap className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                <span className="uppercase tracking-wider">
                  {card.status === 'mastered' ? 'MASTERED' : 'LEARNING'}
                </span>
              </div>
            </div>

            {/* Word Center & Phonetic */}
            <div className="flex flex-col items-center text-center my-auto py-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-indigo-500/80 mb-2">VOCABULARY</span>
              <h1 id="flashcard-word" className="text-4xl sm:text-[4.50rem] font-black tracking-[-0.03em] text-slate-800 leading-none mb-1.5 font-sans break-all">
                {card.word}
              </h1>
              {card.pronunciation && (
                <p className="text-sm sm:text-base text-slate-500 font-mono tracking-wide font-medium">
                  {card.pronunciation}
                </p>
              )}
              
              {/* Pronunciation Sound Button */}
              <button
                type="button"
                id="speak-button"
                onClick={handleSpeak}
                className={`mt-5 p-3 rounded-full transition-all duration-300 ${
                  isPlayingSound 
                    ? 'bg-indigo-600 text-white scale-110 shadow-lg' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                }`}
                title="ฟังการออกเสียง"
              >
                <Volume2 className={`w-5 h-5 ${isPlayingSound ? 'animate-bounce' : ''}`} />
              </button>
            </div>

            {/* Hint footer */}
            <div className="flex justify-center items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin-slow" />
              <span>คลิกเพื่อดูคำแปล</span>
            </div>
          </div>

          {/* BACK FACE (GRADIENT PRIMARY -> SECONDARY) */}
          <div 
            id="card-back"
            className="absolute inset-0 w-full h-full rounded-[24px] border-0 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 sm:p-9 shadow-[0_20px_25px_-5px_rgba(79,70,229,0.3),0_10px_10px_-5px_rgba(79,70,229,0.15)] flex flex-col justify-between rotate-y-180 backface-hidden"
          >
            {/* Card Header information */}
            <div className="flex justify-between items-center w-full">
              <span className="text-[10px] tracking-[0.15em] px-3 py-1 rounded-lg font-extrabold bg-white/20 border border-white/20 uppercase text-white">
                {card.partOfSpeech}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                TRANSLATION
              </span>
            </div>

            {/* Translation and Example */}
            <div className="flex flex-col justify-center my-auto py-2">
              <div className="text-center mb-5">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/50 block mb-1">คำแปลภาษาไทย</span>
                <h2 id="flashcard-translation" className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {card.translation}
                </h2>
              </div>

              {card.example && (
                <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10 shadow-xs max-h-36 overflow-y-auto">
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.15em] mb-1.5 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-white/70" /> ตัวอย่างประโยค
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed italic mb-1 font-sans">
                    "{card.example}"
                  </p>
                  {card.exampleTranslation && (
                    <p className="text-[11px] sm:text-xs text-indigo-100 font-medium leading-relaxed">
                      ({card.exampleTranslation})
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Active Recall Selector Buttons */}
            <div className="pt-2 w-full flex gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                id="mark-unsure-btn"
                onClick={() => onStatusChange(card.id, 'learning')}
                className={`flex-1 py-2 sm:py-3 px-3 rounded-xl border font-extrabold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
                  card.status === 'learning'
                    ? 'bg-amber-500 border-amber-400 text-white shadow-md ring-2 ring-amber-300'
                    : 'bg-white/10 hover:bg-white/25 border-white/25 text-white'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-250 shrink-0" />
                <span>ยังไม่คล่อง</span>
              </button>

              <button
                type="button"
                id="mark-mastered-btn"
                onClick={() => onStatusChange(card.id, 'mastered')}
                className={`flex-1 py-2 sm:py-3 px-3 rounded-xl border font-extrabold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 ${
                  card.status === 'mastered'
                    ? 'bg-emerald-500 border-emerald-400 text-white shadow-md ring-2 ring-emerald-300'
                    : 'bg-white/10 hover:bg-white/25 border-white/25 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-250 shrink-0" />
                <span>จำดีขึ้นใจ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
