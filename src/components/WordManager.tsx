import React, { useState } from 'react';
import { PlusCircle, Search, Trash2, Tag, BookOpen, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { Flashcard, CardFilter } from '../types';

interface WordManagerProps {
  cards: Flashcard[];
  onAddCard: (newCard: Omit<Flashcard, 'id' | 'status' | 'correctCount' | 'wrongCount'>) => void;
  onDeleteCard: (id: string) => void;
  onSelectCard: (index: number) => void;
  activeCardId: string;
}

export const WordManager: React.FC<WordManagerProps> = ({
  cards,
  onAddCard,
  onDeleteCard,
  onSelectCard,
  activeCardId,
}) => {
  // Add state form
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('noun');
  const [pronunciation, setPronunciation] = useState('');
  const [example, setExample] = useState('');
  const [exampleTranslation, setExampleTranslation] = useState('');

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<CardFilter>('all');
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto-generate phonetic suggestions for fun/usability if empty
  const handleAutoFillPronunciation = () => {
    if (!word.trim()) {
      setFeedback({ type: 'error', message: 'โปรดใส่คำศัพท์ภาษาอังกฤษก่อน เพื่อดูคำแนะนำตัวช่วย' });
      return;
    }
    // Simple phonetic hints
    const cleanWord = word.trim().toLowerCase();
    let hint = `/${cleanWord}/`;
    if (cleanWord === 'scrutinize') hint = '/ˈskruːtənaɪz/';
    else if (cleanWord === 'acquire') hint = '/əˈkwaɪər/';
    else if (cleanWord === 'inevitable') hint = '/ɪnˈevɪtəbəl/';
    else if (cleanWord === 'resilient') hint = '/rɪˈzɪliənt/';
    else if (cleanWord === 'benevolent') hint = '/bəˈnevələnt/';
    else if (cleanWord === 'ephemeral') hint = '/ɪˈfemərəl/';
    else if (cleanWord === 'meticulous') hint = '/məˈtɪkjələs/';
    
    setPronunciation(hint);
    setFeedback({ type: 'success', message: 'สร้างแนวทางคำอ่านจำลองให้แล้ว (คุณสามารถปรับแต่งในภายหลัง)' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!word.trim() || !translation.trim()) {
      setFeedback({ type: 'error', message: 'กรุณากรอก "คำศัพท์" และ "คำแปล" ให้ครบถ้วน' });
      return;
    }

    onAddCard({
      word: word.trim(),
      translation: translation.trim(),
      partOfSpeech,
      pronunciation: pronunciation.trim() || `/${word.trim().toLowerCase()}/`,
      example: example.trim(),
      exampleTranslation: exampleTranslation.trim(),
      isCustom: true
    });

    // Reset fields
    setWord('');
    setTranslation('');
    setPartOfSpeech('noun');
    setPronunciation('');
    setExample('');
    setExampleTranslation('');
    
    setFeedback({ type: 'success', message: 'บันทึกคำศัพท์ลงคลังเรียบร้อยแล้ว!' });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Filter lists based on search queue and filter tab values
  const filteredCards = cards.filter(card => {
    const matchesSearch = 
      card.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.translation.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'learning') return card.status === 'learning';
    if (filterType === 'mastered') return card.status === 'mastered';
    if (filterType === 'custom') return card.isCustom;
    return true;
  });

  return (
    <div id="word-manager-section" className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-8">
      
      {/* 1. VOCABULARY ACCORDION/FORM */}
      <div className="lg:col-span-5 bg-white rounded-[24px] border-2 border-slate-200 p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary" />
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">เพิ่มคำศัพท์ใหม่</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingOpen(!isAddingOpen)}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white border-2 border-slate-100 hover:border-primary hover:bg-primary px-2.5 py-1 rounded-lg transition-all"
          >
            {isAddingOpen ? 'ซ่อนฟอร์ม' : 'เพิ่มคำศัพท์'}
          </button>
        </div>

        {feedback && (
          <div className={`p-3.5 rounded-xl mb-4 text-xs font-bold flex items-start gap-2 border-2 ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'
          }`}>
            <AlertCircle className={`w-4 h-4 shrink-0 ${feedback.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`} />
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-4 transition-all duration-300 ${isAddingOpen ? 'block' : 'hidden md:block'}`}>
          
          <div className="grid grid-cols-2 gap-3.5">
            {/* Word Name */}
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="word-input" className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                ENGLISH WORD *
              </label>
              <input
                id="word-input"
                type="text"
                placeholder="เช่น Meticulous"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-bold border-2 border-slate-200 focus:border-slate-805 focus:outline-none rounded-xl transition-all text-slate-800 placeholder:font-normal placeholder:text-slate-400"
                required
              />
            </div>

            {/* Pronunciation */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="pronunciation-input" className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                  PRONUNCIATION
                </label>
                <button
                  type="button"
                  onClick={handleAutoFillPronunciation}
                  className="text-[9px] text-primary font-black uppercase tracking-widest hover:underline flex items-center gap-0.5"
                  title="สร้างคำอ่านจำลองให้รวดเร็ว"
                >
                  <Sparkles className="w-2.5 h-2.5" /> แนะนำคำอ่าน
                </button>
              </div>
              <input
                id="pronunciation-input"
                type="text"
                placeholder="เช่น /sensəbl/"
                value={pronunciation}
                onChange={(e) => setPronunciation(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-bold border-2 border-slate-200 focus:border-slate-805 focus:outline-none rounded-xl transition-all text-slate-800 font-mono placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3.5">
            {/* Part of Speech Selection */}
            <div className="col-span-1">
              <label htmlFor="pos-select" className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                POS
              </label>
              <select
                id="pos-select"
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
                className="w-full px-2 py-2 text-xs font-black uppercase tracking-wider border-2 border-slate-200 focus:border-slate-805 focus:outline-none rounded-xl bg-white text-slate-700"
              >
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adj.</option>
                <option value="adverb">Adv.</option>
              </select>
            </div>

            {/* Translation description */}
            <div className="col-span-2">
              <label htmlFor="translation-input" className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                THAI TRANSLATION *
              </label>
              <input
                id="translation-input"
                type="text"
                placeholder="เช่น พิถีพิถัน, ละเอียดลออ"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-bold border-2 border-slate-200 focus:border-slate-805 focus:outline-none rounded-xl transition-all text-slate-800 placeholder:font-normal placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {/* Example sentences */}
          <div className="space-y-2">
            <div>
              <label htmlFor="example-input" className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                EXAMPLE SENTENCE (OPTIONAL)
              </label>
              <textarea
                id="example-input"
                rows={2}
                placeholder="เช่น He was meticulous about keeping his room clean."
                value={example}
                onChange={(e) => setExample(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold border-2 border-slate-200 focus:border-slate-805 focus:outline-none rounded-xl transition-all text-slate-805 font-sans placeholder:font-normal placeholder:text-slate-400"
              />
            </div>

            <div>
              <label htmlFor="example-translation-input" className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                THAI EXAMPLE TRANSLATION (OPTIONAL)
              </label>
              <input
                id="example-translation-input"
                type="text"
                placeholder="เช่น เขาเป็นคนพิถีพิถันกับการดูแลห้องให้สะอาด"
                value={exampleTranslation}
                onChange={(e) => setExampleTranslation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-bold border-2 border-slate-200 focus:border-slate-805 focus:outline-none rounded-xl transition-all text-slate-800 placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Form Submit button */}
          <button
            type="submit"
            id="save-card-button"
            className="w-full bg-slate-900 hover:bg-black text-white py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-md flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>บันทึกเข้าระบบ • SAVE CARD</span>
          </button>
        </form>
      </div>

      {/* 2. DICTIONARY LIST & MANAGEMENT */}
      <div className="lg:col-span-7 bg-white rounded-[24px] border-2 border-slate-200 p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col h-112 md:max-h-128">
        
        {/* Header containing Filters */}
        <div className="flex flex-col gap-3.5 border-b-2 border-slate-100 pb-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-primary" />
              <span>คลังศัพท์ ({cards.length} คำ)</span>
            </h3>
            
            {/* Search Input Box */}
            <div className="relative w-full sm:w-56 shrink-0">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาตามคำศัพท์ / คำแปล"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-xl border-2 border-slate-100 focus:border-slate-350 focus:outline-none text-slate-700 transition"
              />
            </div>
          </div>

          {/* Mini navigation filters pills with high contrast */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(['all', 'learning', 'mastered', 'custom'] as CardFilter[]).map((type) => {
              const labelMap: Record<CardFilter, string> = {
                all: 'ทั้งหมด',
                learning: 'กำลังจำ',
                mastered: 'ขึ้นใจแล้ว',
                custom: 'ศัพท์ของฉัน',
              };
              
              const countMap = {
                all: cards.length,
                learning: cards.filter(c => c.status === 'learning').length,
                mastered: cards.filter(c => c.status === 'mastered').length,
                custom: cards.filter(c => c.isCustom).length,
              };

              const isActive = filterType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {labelMap[type]} <span className={`font-mono text-[9px] ml-0.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>({countMap[type]})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* List scrollbox */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400">
              <FileText className="w-10 h-10 mb-2 stroke-[1.5]" />
              <p className="text-sm font-extrabold text-slate-600">ไม่พบคำศัพท์ตรงตามเงื่อนไข</p>
              <p className="text-xs text-slate-400 mt-1">ลองพิมพ์คำอื่น หรือกด "แนะนำคำศัพท์" ที่อยู่ด้านบนของจอสำหรับฝึกฝน</p>
            </div>
          ) : (
            filteredCards.map((card) => {
              // Locate index inside the raw parent array
              const originalIndex = cards.findIndex(c => c.id === card.id);
              const isActive = card.id === activeCardId;

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    if (originalIndex !== -1) {
                      onSelectCard(originalIndex);
                    }
                  }}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between gap-3 transition cursor-pointer group ${
                    isActive 
                      ? 'bg-indigo-50/65 border-primary text-slate-900 shadow-sm' 
                      : 'bg-white border-slate-100/90 hover:bg-slate-50/70 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Active Check marker */}
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      isActive ? 'bg-primary' : 'bg-slate-200'
                    }`} />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-sm tracking-tight text-slate-850 truncate">
                          {card.word}
                        </span>
                        
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-extrabold border border-slate-200 shrink-0">
                          {card.partOfSpeech}
                        </span>

                        {card.status === 'mastered' && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider px-1.5 rounded-sm shrink-0">
                            จำแล้ว
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                        {card.translation}
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectCard(originalIndex)}
                      className={`text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-primary border-primary text-white'
                          : 'bg-slate-50 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-600'
                      }`}
                    >
                      เลือกเรียน
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteCard(card.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                      title="ลบคำศัพท์"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
