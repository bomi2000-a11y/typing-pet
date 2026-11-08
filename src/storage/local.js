// 체험 모드용 저장소: 이 브라우저(localStorage)에만 저장됩니다.
// Supabase 저장소(supabase.js)와 똑같은 함수 이름을 가지고 있어서 서로 바꿔 끼울 수 있습니다.

export const LOCAL_KEYS = {
  records: 'typingPet.records',
  pet: 'typingPet.pet',
  hall: 'typingPet.hallOfFame',
};
const { records: RECORDS_KEY, pet: PET_KEY, hall: HALL_KEY } = LOCAL_KEYS;

export function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

// 저장에 실패하면(브라우저 저장 공간 부족 등) 오류를 그대로 알려서 화면에서 "다시 저장"을 보여 줄 수 있게
export function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const localAdapter = {
  async getRecords() {
    return read(RECORDS_KEY, []);
  },
  async addRecord(record) {
    const saved = { ...record, id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` };
    const list = [saved, ...read(RECORDS_KEY, [])].sort((a, b) => new Date(b.date) - new Date(a.date));
    write(RECORDS_KEY, list);
    return saved;
  },
  async updateRecord(id, fields) {
    const list = read(RECORDS_KEY, []).map((r) => (r.id === id ? { ...r, ...fields } : r));
    write(RECORDS_KEY, list);
    return list.find((r) => r.id === id);
  },
  async getPet() {
    return read(PET_KEY, null);
  },
  async savePet(pet) {
    write(PET_KEY, pet);
    return pet;
  },
  async clearPet() {
    localStorage.removeItem(PET_KEY);
  },
  async getHallOfFame() {
    return read(HALL_KEY, []);
  },
  async addToHallOfFame(entry) {
    const saved = { ...entry, id: `hall_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` };
    write(HALL_KEY, [saved, ...read(HALL_KEY, [])]);
    return saved;
  },
};
