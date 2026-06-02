import { Flashcard } from './types';

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'default-1',
    word: 'Meticulous',
    translation: 'พิถีพิถัน, ละเอียดลอออย่างยิ่ง',
    partOfSpeech: 'adjective',
    pronunciation: '/məˈtɪkjələs/',
    example: 'She was meticulous about keeping her medical records extremely organized.',
    exampleTranslation: 'เธอเป็นคนพิถีพิถันกับการดูแลจัดระเบียบประวัติทางการแพทย์ของเธออย่างยิ่ง',
    status: 'learning',
    correctCount: 0,
    wrongCount: 0
  },
  {
    id: 'default-2',
    word: 'Ephemeral',
    translation: 'คงอยู่เพียงชั่วครู่, ไม่จีรัง, มีอายุสั้น',
    partOfSpeech: 'adjective',
    pronunciation: '/ɪˈfemərəl/',
    example: 'Fame in the internet age can be ephemeral, lasting only for a few days.',
    exampleTranslation: 'ชื่อเสียงในยุคอินเทอร์เน็ตอาจเป็นสิ่งชั่วครู่ จัดอยู่ได้เพียงไม่กี่วันเท่านั้น',
    status: 'learning',
    correctCount: 0,
    wrongCount: 0
  },
  {
    id: 'default-3',
    word: 'Acquire',
    translation: 'ได้รับมา, ได้รับความรู้หรือทักษะมา',
    partOfSpeech: 'verb',
    pronunciation: '/əˈkwaɪər/',
    example: 'She managed to acquire a good fluent command of English after moving to London.',
    exampleTranslation: 'เธอสามารถฝึกฝนจนได้รับทักษะความคล่องแคล่วในการใช้ภาษาอังกฤษหลังจากย้ายไปลอนดอน',
    status: 'learning',
    correctCount: 0,
    wrongCount: 0
  },
  {
    id: 'default-4',
    word: 'Benevolent',
    translation: 'เมตตากรุณา, ใจกว้าง, ประสงค์ดี',
    partOfSpeech: 'adjective',
    pronunciation: '/bəˈnevələnt/',
    example: 'The school was founded by a benevolent local businessman.',
    exampleTranslation: 'โรงเรียนแห่งนี้ก่อตั้งขึ้นโดยนักธุรกิจท้องถิ่นผู้มีจิตเมตตากรุณา',
    status: 'learning',
    correctCount: 0,
    wrongCount: 0
  },
  {
    id: 'default-5',
    word: 'Resilient',
    translation: 'ยืดหยุ่น, ล้มแล้วลุกเร็ว, ฟื้นตัวเร็ว',
    partOfSpeech: 'adjective',
    pronunciation: '/rɪˈzɪliənt/',
    example: 'Children are often remarkably resilient and adapt quickly to new surroundings.',
    exampleTranslation: 'เด็กๆ มักจะมีความยืดหยุ่นและฟื้นตัวได้ดีเป็นอย่างยิ่ง ตลอดจนปรับตัวเข้ากับสภาพแวดล้อมใหม่ได้อย่างรวดเร็ว',
    status: 'learning',
    correctCount: 0,
    wrongCount: 0
  },
  {
    id: 'default-6',
    word: 'Cognitive',
    translation: 'เกี่ยวกับกระบวนการคิด รับรู้ และความเข้าใจ',
    partOfSpeech: 'adjective',
    pronunciation: '/ˈkɒɡnətɪv/',
    example: 'Reading books is a great way to improve your cognitive abilities.',
    exampleTranslation: 'การอ่านหนังสือเป็นวิธีที่ยอดเยี่ยมในการพัฒนาความสามารถด้านกระบวนการคิดและรับรู้ของคุณ',
    status: 'learning',
    correctCount: 0,
    wrongCount: 0
  },
  {
    id: 'default-7',
    word: 'Ambiguous',
    translation: 'กำกวม, คลุมเครือ, ตีความได้หลายความหมาย',
    partOfSpeech: 'adjective',
    pronunciation: '/æmˈbɪɡjuəs/',
    example: 'The ending of the movie was ambiguous, leaving the audience to parse its true meaning.',
    exampleTranslation: 'ตอนจบของภาพยนตร์เรื่องนี้ค่อนข้างกำกวม ปล่อยให้ผู้ชมตีความความหมายที่แท้จริงเอาเอง',
    status: 'learning',
    correctCount: 0,
    wrongCount: 0
  },
  {
    id: 'default-8',
    word: 'Inevitable',
    translation: 'หลีกเลี่ยงไม่ได้, ต้องเกิดขึ้นอย่างแน่นอน',
    partOfSpeech: 'adjective',
    pronunciation: '/ɪnˈevɪtəbəl/',
    example: 'With more vehicles on the road, an increase in traffic congestion is inevitable.',
    exampleTranslation: 'มีรถยนต์บนท้องถนนมากขึ้น การเพิ่มขึ้นของปัญหารถติดจึงเป็นสิ่งหลีกเลี่ยงไม่ได้',
    status: 'learning',
    correctCount: 0,
    wrongCount: 0
  },
  {
    id: 'default-9',
    word: 'Scrutinize',
    translation: 'ตรวจสอบหรือพิจารณาอย่างละเอียดถี่ถ้วน',
    partOfSpeech: 'verb',
    pronunciation: '/ˈskruːtənaɪz/',
    example: 'Customers are advised to scrutinize historical terms before signing.',
    exampleTranslation: 'แนะนำให้ลูกค้าตรวจสอบเงื่อนไขย้อนหลังอย่างละเอียดถี่ถ้วนนก่อนทำการลงนาม',
    status: 'learning',
    correctCount: 0,
    wrongCount: 0
  },
  {
    id: 'default-10',
    word: 'Alleviate',
    translation: 'บรรเทา, ทำให้น้อยลง, ทำให้อาการเบาบางลง',
    partOfSpeech: 'verb',
    pronunciation: '/əˈliːvieɪt/',
    example: 'A warm bath can help to alleviate joint muscle pain and stiffness.',
    exampleTranslation: 'การแช่น้ำอุ่นสามารถช่วยบรรเทาอาการปวดตึงและแข็งเกร็งของกล้ามเนื้อได้',
    status: 'learning',
    correctCount: 0,
    wrongCount: 0
  }
];
