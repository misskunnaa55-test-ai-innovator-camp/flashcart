import { useState, useEffect } from 'react';
import { 
  Plus, 
  HelpCircle, 
  Sparkles, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  ListOrdered, 
  BookOpen, 
  RefreshCcw, 
  Info,
  Layers
} from 'lucide-react';
import { Flashcard } from './types';
import { INITIAL_FLASHCARDS } from './data';
import { Flashcard3D, speak } from './components/Flashcard3D';
import { StatsBanner } from './components/StatsBanner';
import { WordManager } from './components/WordManager';

export default function App() {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vocab-cards-v1');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse cached flashcards:', e);
        }
      }
    }
    return INITIAL_FLASHCARDS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('vocab-cards-v1', JSON.stringify(cards));
  }, [cards]);

  // Safe checks for index out of bounds
  const currentCard = cards[currentIndex] || cards[0] || null;

  const handleNext = () => {
    if (cards.length <= 1) return;
    
    // Smooth reset flip to false
    setIsFlipped(false);
    
    // Short delay for the 3D flip-back to execute before index alters
    setTimeout(() => {
      if (isShuffleMode) {
        let randomIndex = currentIndex;
        // Avoid sticking to the exact same card if multiple exist
        while (randomIndex === currentIndex) {
          randomIndex = Math.floor(Math.random() * cards.length);
        }
        setCurrentIndex(randomIndex);
      } else {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
      }
    }, 180);
  };

  const handlePrev = () => {
    if (cards.length <= 1) return;
    setIsFlipped(false);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 180);
  };

  const handleAddCard = (newCardData: Omit<Flashcard, 'id' | 'status' | 'correctCount' | 'wrongCount'>) => {
    const newCard: Flashcard = {
      ...newCardData,
      id: `custom-${Date.now()}`,
      status: 'learning',
      correctCount: 0,
      wrongCount: 0,
    };
    
    setCards((prev) => [newCard, ...prev]);
    setCurrentIndex(0); // View the new card immediately
    setIsFlipped(false);
  };

  const handleDeleteCard = (id: string) => {
    if (cards.length <= 1) {
      alert('จำเป็นต้องเหลือคำศัพท์อย่างน้อย 1 คำเพื่อให้บทเรียนดำเนินต่อไปได้');
      return;
    }
    
    setIsFlipped(false);
    
    setTimeout(() => {
      const idxToDelete = cards.findIndex(c => c.id === id);
      const updated = cards.filter(c => c.id !== id);
      setCards(updated);

      if (currentIndex >= updated.length) {
        setCurrentIndex(updated.length - 1);
      } else if (idxToDelete === currentIndex) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    }, 180);
  };

  const handleStatusChange = (id: string, newStatus: 'learning' | 'mastered') => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: newStatus,
            correctCount: newStatus === 'mastered' ? c.correctCount + 1 : c.correctCount,
            wrongCount: newStatus === 'learning' ? c.wrongCount + 1 : c.wrongCount,
          };
        }
        return c;
      })
    );
  };

  const handleResetProgress = () => {
    if (confirm('คุณต้องการรีเซ็ตสถานะความเข้าใจคำศัพท์สะสมทั้งหมดเป็น "กำลังเรียนรู้" หรือไม่?')) {
      setCards((prev) =>
        prev.map((c) => ({
          ...c,
          status: 'learning',
          correctCount: 0,
          wrongCount: 0,
        }))
      );
      setIsFlipped(false);
      setCurrentIndex(0);
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm('คุณต้องการลบคำศัพท์ส่วนตัวที่สร้างขึ้นทั้งหมดและคืนค่าเป็นคำศัพท์เริ่มต้น 10 คำหรือไม่?')) {
      setCards(INITIAL_FLASHCARDS);
      setCurrentIndex(0);
      setIsFlipped(false);
      localStorage.removeItem('vocab-cards-v1');
    }
  };

  const handleQuickAddPredefined = (eng: string, th: string, pos: string, phonetic: string, sample: string, res: string) => {
    handleAddCard({
      word: eng,
      translation: th,
      partOfSpeech: pos,
      pronunciation: phonetic,
      example: sample,
      exampleTranslation: res,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased p-3 sm:p-6 sm:py-10 transition-colors duration-300">
      
      {/* Outer elegant container */}
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* PREMIUM MAIN HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-[24px] border-2 border-slate-200 py-5 px-6 sm:px-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-slate-900 text-white rounded-2xl">
              <Layers className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>การ์ดคำศัพท์พลิกได้</span>
                <span className="text-[10px] bg-primary text-white border-0 px-2.5 py-0.5 rounded-lg font-black tracking-widest uppercase">FLIP CARD</span>
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">ท่องศัพท์ภาษาอังกฤษด้วย Active Recall และ 3D แอนิเมชัน</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-50 border-2 border-slate-200 text-slate-500 rounded-xl">
              🎯 เซฟอัตโนมัติ (LocalStorage)
            </span>
          </div>
        </header>

        {/* STUDY NOTICE / HELPFUL INTRO TIP */}
        {showWelcomeAlert && (
          <div className="bg-indigo-50/50 border-2 border-indigo-150/50 p-5 rounded-[22px] relative flex gap-3.5 text-slate-700 shadow-2xs">
            <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-extrabold uppercase tracking-wider text-indigo-950 block mb-1">💡 วิธีเรียนรู้แบบ Active Recall:</span>
              <p className="text-indigo-900 leading-relaxed font-medium">
                เพ่งกระแสเสียงและคำศัพท์ด้านหน้าหน้าการ์ด แล้วพยายาม <strong className="font-black underline decoration-2">นึกความหมายด้วยตนเองก่อน</strong> คลิกที่ตัวการ์ดเพื่อพลิกดูคำแปลด้านหลังทันที! เพื่อย้ำกระบวนการเรียนรู้ที่มีประสิทธิภาพสูงสุดประเมินผลระดับหัวใจคุณด้านล่างด้วยครับ
              </p>
            </div>
            <button
              onClick={() => setShowWelcomeAlert(false)}
              className="absolute top-2.5 right-3 text-indigo-400 hover:text-indigo-805 font-black text-xl p-1 leading-none"
              title="ปิดคำแนะนำ"
            >
              ×
            </button>
          </div>
        )}

        {/* ACTIVE MAIN PLAYING SCREEN */}
        <main className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-[32px] border-2 border-slate-200 p-6 sm:p-10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center">
            
            {/* Upper deck details */}
            <div className="w-full max-w-lg mx-auto flex justify-between items-center mb-6 text-[10px] sm:text-xs text-slate-450 uppercase tracking-[0.15em] font-black px-1">
              <div>
                การ์ดใบที่ <span className="font-mono text-slate-900 text-xs sm:text-sm font-black">{currentIndex + 1}</span> จาก <span className="font-mono text-slate-900 text-xs sm:text-sm font-black">{cards.length}</span> คำ
              </div>
              
              {/* Shuffle Indicator */}
              <button
                type="button"
                onClick={() => setIsShuffleMode(!isShuffleMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-black transition-all ${
                  isShuffleMode 
                    ? 'bg-amber-500 border-amber-500 text-white shadow-xs' 
                    : 'bg-slate-50 border-slate-200 text-slate-450 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                }`}
                title={isShuffleMode ? "ปิดโหมดสุ่ม (เดินหน้าทีละคำ)" : "เปิดโหมดสุ่มคำถัดไป"}
              >
                {isShuffleMode ? <Shuffle className="w-3.5 h-3.5 text-white" /> : <ListOrdered className="w-3.5 h-3.5" />}
                <span>{isShuffleMode ? 'สุ่มการ์ด' : 'เรียงลำดับ'}</span>
              </button>
            </div>

            {/* Render 3D Flashcard */}
            {currentCard ? (
              <Flashcard3D
                card={currentCard}
                onStatusChange={handleStatusChange}
                isFlipped={isFlipped}
                setIsFlipped={setIsFlipped}
              />
            ) : (
              <div className="py-12 text-center text-slate-400">
                <p className="text-sm">ไม่มีคำศัพท์พร้อมใช้ในระบบ</p>
                <p className="text-xs">กรุณาเพิ่มคำศัพท์ใหม่ด้านล่าง</p>
              </div>
            )}

            {/* Bottom Controls panel */}
            <div className="w-full max-w-lg mx-auto flex items-center justify-between gap-4 mt-8">
              <button
                type="button"
                id="prev-card-button"
                onClick={handlePrev}
                disabled={cards.length <= 1}
                className="flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed bg-white py-3 px-5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 shadow-2xs"
                title="ย้อนกลับการ์ดใบล่าสุด"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span>ก่อนหน้า (Prev)</span>
              </button>

              <button
                type="button"
                id="next-card-button"
                onClick={handleNext}
                disabled={cards.length <= 1}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 px-6 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
                title="สุ่ม/เดินไปยังคำถัดไป"
              >
                <span>ถัดไป (Next)</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
            
            {/* Quick Helper Tips under controls */}
            <p className="text-[10px] text-slate-400 mt-5 uppercase tracking-widest font-extrabold text-center select-none">
              💡 คีย์ลัด: คุณสามารถกดสลับด้านการ์ด หรือกดเลือกฝึกตามแต่ละหมวดหมู่คลังได้
            </p>
          </div>

          {/* VISUAL STATS DASHBOARD */}
          <StatsBanner
            cards={cards}
            onResetProgress={handleResetProgress}
            onRestoreDefaults={handleRestoreDefaults}
          />

          {/* WORD MANAGEMENT SYSTEM AND SEARCH FORM */}
          <WordManager
            cards={cards}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onSelectCard={(idx) => {
              setCurrentIndex(idx);
              setIsFlipped(false);
            }}
            activeCardId={currentCard?.id || ''}
          />

          {/* QUICK SUGGESTIONS DRAWER */}
          <div className="bg-slate-100/85 rounded-[24px] border-2 border-slate-200 p-5sm:p-6 mt-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 mb-0.5">
                <Sparkles className="w-4.5 h-4.5 text-primary" />
                <span>ต้องการฝึกคำศัพท์ชุดเพิ่มเติมทันที?</span>
              </h4>
              <p className="text-xs font-semibold text-slate-500">คลิกที่ปุ่มด้านข้างเพื่อเพิ่มคำศัพท์สอบเข้าเรียนต่อ/ศัพท์น่าสนใจเข้าสู่คลังแบบด่วน!</p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => handleQuickAddPredefined(
                  'Pragmatic', 
                  'เน้นการปฏิบัติจริง, ที่เหมาะสมกับสถานการณ์จริง', 
                  'adjective', 
                  '/præɡˈmætɪk/',
                  'We need a pragmatic approach to solving this crisis rather than ideology.',
                  'เราต้องการวิธีการปฏิบัติที่เป็นจริงเพื่อแก้ปัญหาวิกฤตนี้ แทนการใช้ลัทธิอุดมการณ์'
                )}
                className="bg-white hover:bg-slate-900 border-2 border-slate-200 hover:border-slate-805 hover:text-white px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 shadow-2xs"
              >
                + Pragmatic
              </button>
              <button
                onClick={() => handleQuickAddPredefined(
                  'Equivocal', 
                  'สองแง่สองมุม, ไม่แน่นอน, ตีความได้หลายแบบ', 
                  'adjective', 
                  '/ɪˈkwɪvəkəl/',
                  'His response to our invitation was equivocal and caused confusion.',
                  'การตอบกลับคำเชิญของเราของเขาค่อนข้างสองแง่สองมุมส่งผลให้เกิดความสับสนขึ้น'
                )}
                className="bg-white hover:bg-slate-900 border-2 border-slate-200 hover:border-slate-805 hover:text-white px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 shadow-2xs"
              >
                + Equivocal
              </button>
              <button
                onClick={() => handleQuickAddPredefined(
                  'Quintessential', 
                  'เป็นตัวอย่างขั้นสูงสุด, แก่นแท้ดั้งเดิมของบางสิ่ง', 
                  'adjective', 
                  '/ˌkwɪntɪˈsenʃəl/',
                  'This beautiful building is the quintessential example of classical design.',
                  'อาคารอันสวยงามหลังนี้คือแบบอย่างคลาสสิกขั้นสุดของงานออกแบบโบราณ'
                )}
                className="bg-white hover:bg-slate-900 border-2 border-slate-200 hover:border-slate-805 hover:text-white px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 shadow-2xs"
              >
                + Quintessential
              </button>
            </div>
          </div>
        </main>
        
        {/* Footnotes */}
        <footer className="text-center text-xs text-slate-400 font-extrabold uppercase tracking-widest py-6">
          <p>Flashcard App (การ์ดคำศัพท์พลิกได้) • พัฒนาด้วย React & Tailwind v4</p>
        </footer>
      </div>
    </div>
  );
}
