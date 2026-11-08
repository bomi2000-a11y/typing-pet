// 펫의 종류, 성장 단계, 배고픔 계산.
// 핵심: 배고픔을 기기마다 따로 줄이지 않고, 서버에 저장된 "마지막 먹이 시각"으로
// 매번 같은 공식으로 계산하기 때문에 PC와 휴대폰에서 항상 같은 상태가 보입니다.

// 성장 단계와 필요한 경험치 (모든 동물 공통)
export const STAGES = [
  { key: 'egg', label: '알', minXp: 0 },
  { key: 'baby', label: '아기', minXp: 100 },
  { key: 'teen', label: '청소년', minXp: 800 },
  { key: 'adult', label: '어른', minXp: 2500 }, // 매일 1번이면 약 4주, 매일 2번이면 약 2~3주
];

// 고를 수 있는 동물. 단계별 이름과 이모지를 바꾸면 화면에 바로 반영됩니다.
//   birth : 'egg'(알에서 태어남) 또는 'gift'(포유류: 선물 상자에서 나옴)
//   emoji : 펫 모습 (art가 있으면 글자로만 쓸 곳의 대신 표시용)
//   art   : 직접 그린 그림 이름 (components/StageIcon.jsx 의 ART)
//   scene : 특별한 장면 이름 (lib/moods.js 의 SCENES — 꿀 먹기, 축구 등)
//   size  : 펫 화면에서 크기 배율 (기본 1)
//   lying : 배고플 때 보여 줄 엎드린 그림 이름 (components/StageIcon.jsx 의 LYING). 없으면 이모지를 옆으로 눕혀요
// 동물을 추가하려면 같은 모양으로 한 줄 더 넣으면 됩니다. (Supabase를 쓴다면 schema.sql의 목록도 함께)
export const SPECIES = [
  {
    key: 'chicken', name: '닭', birth: 'egg',
    stages: {
      egg: { name: '알', emoji: '🥚', lying: 'egg' },
      baby: { name: '아기 병아리', emoji: '🐣', lying: 'chick-shell' },
      teen: { name: '병아리', emoji: '🐥', lying: 'chick' },
      adult: { name: '닭', emoji: '🐔', lying: 'hen' },
    },
  },
  {
    key: 'dog', name: '강아지', birth: 'gift', // 포유류는 알 대신 선물 상자에서 나와요
    stages: {
      egg: { name: '선물 상자', emoji: '🎁', scene: 'gift' }, // 상자는 배고파도 눕지 않아요
      baby: { name: '아기 강아지', emoji: '🐶', art: 'baby-dog', scene: 'ball' },
      teen: { name: '강아지', emoji: '🐕', art: 'puppy', scene: 'frisbee' },
      adult: { name: '듬직한 개', emoji: '🐕‍🦺', lying: 'service-dog' },
    },
  },
  {
    key: 'bear', name: '곰', birth: 'gift',
    stages: {
      egg: { name: '선물 상자', emoji: '🎁', scene: 'gift' }, // 상자는 배고파도 눕지 않아요
      baby: { name: '아기 곰', emoji: '🧸', lying: 'teddy' },
      teen: { name: '주니어 곰', emoji: '🐻', art: 'junior-bear', scene: 'honey' },
      adult: { name: '그리즐리 베어', emoji: '🐻', art: 'grizzly', scene: 'grizzly' },
    },
  },
  {
    key: 'dino', name: '공룡', birth: 'egg',
    stages: {
      egg: { name: '알', emoji: '🥚', lying: 'egg' },
      baby: { name: '아기 공룡', emoji: '🦎', lying: 'lizard' },
      teen: { name: '주니어 공룡', emoji: '🦖', art: 'junior-trex', scene: 'study' },
      adult: { name: '티라노', emoji: '🦖', scene: 'majestic', size: 1.15, lying: 'trex' },
    },
  },
  {
    key: 'dragon', name: '용', birth: 'egg',
    stages: {
      egg: { name: '알', emoji: '🥚', lying: 'egg' },
      baby: { name: '이무기', emoji: '🐍', lying: 'snake' },
      teen: { name: '아기 용', emoji: '🐲', art: 'baby-dragon' },
      adult: { name: '용', emoji: '🐉', scene: 'sky', lying: 'dragon' },
    },
  },
];

export const DEFAULT_SPECIES = 'chicken'; // 동물 정보가 없는 예전 펫은 닭으로 봅니다

// 배부름: 보상을 받을 때마다 100으로 가득 차고, 3일에 걸쳐 0까지 줄어요.
//   먹은 직후에 더 빨리 줄어서 아침 → 점심 → 저녁 사이에도 배고파지는 게 보여요.
//   마지막 연습 뒤 3시간 안: 배부름 / 3시간~1일: 출출 / 1~2일: 보통 / 2~3일: 배고픔 / 3일 넘게: 굶주림
//   → 매일 한 번 이상 연습하면(연습 사이가 48시간보다 짧으면) 늘 '보통' 이상이에요.
const HUNGER_CURVE = [ // [가득 찬 뒤 지난 시간, 배부름]
  [0, 100], [3, 85], [8, 70], [24, 50], [48, 25], [72, 0],
];
// 가득 찬 뒤 hours 시간이 지났을 때 배부름
function fullnessAfter(hours) {
  if (hours <= 0) return 100;
  for (let i = 1; i < HUNGER_CURVE.length; i += 1) {
    const [h1, f1] = HUNGER_CURVE[i];
    const [h0, f0] = HUNGER_CURVE[i - 1];
    if (hours <= h1) return f0 + ((f1 - f0) * (hours - h0)) / (h1 - h0);
  }
  return 0;
}
// 배부름이 fullness 가 되려면 가득 찬 뒤 몇 시간이 지나야 하는지 (fullnessAfter 의 반대)
function hoursUntil(fullness) {
  if (fullness >= 100) return 0;
  for (let i = 1; i < HUNGER_CURVE.length; i += 1) {
    const [h1, f1] = HUNGER_CURVE[i];
    const [h0, f0] = HUNGER_CURVE[i - 1];
    if (fullness >= f1) return h0 + ((f0 - fullness) * (h1 - h0)) / (f0 - f1);
  }
  return HUNGER_CURVE[HUNGER_CURVE.length - 1][0];
}

export function getSpecies(key) {
  return SPECIES.find((s) => s.key === key) || SPECIES.find((s) => s.key === DEFAULT_SPECIES);
}

// 새 펫. 이름은 알(선물 상자)에서 정체가 드러날 때 지어 줍니다 (그 전에는 빈 문자열).
export function createPet(species = DEFAULT_SPECIES, name = '') {
  const now = new Date().toISOString();
  return { name, species: getSpecies(species).key, xp: 0, fullness: 100, lastFedAt: now, createdAt: now };
}

// 처음 만나는 동물은 무작위. 명예의 전당에 아직 없는 동물이 먼저 나오고, 다 키워 봤으면 다섯 중 아무나.
export function pickRandomSpecies(hall = [], random = Math.random) {
  const raised = new Set(hall.map((h) => h.species));
  const fresh = SPECIES.filter((s) => !raised.has(s.key));
  const pool = fresh.length ? fresh : SPECIES;
  return pool[Math.floor(random() * pool.length)].key;
}

// 태어나는 방식: 알이면 '알에서', 선물 상자면 '선물 상자에서'
export function birthPlace(speciesKey) {
  return getSpecies(speciesKey).birth === 'gift' ? '선물 상자' : '알';
}

// 경험치로 공통 단계 찾기 (단계 key와 필요 경험치만 필요할 때)
export function getStage(xp) {
  let stage = STAGES[0];
  for (const s of STAGES) if (xp >= s.minXp) stage = s;
  return stage;
}

function withLook(stage, speciesKey) {
  return stage && { ...stage, ...getSpecies(speciesKey).stages[stage.key] };
}

// 펫의 현재 단계: { key, label, minXp, name, emoji } (이름·이모지는 동물마다 다름)
export function getPetStage(pet) {
  return withLook(getStage(pet.xp), pet.species);
}

// 다음 단계 (다 자랐으면 null)
export function getNextPetStage(pet) {
  return withLook(STAGES.find((s) => s.minXp > pet.xp) || null, pet.species);
}

// 기기 시계가 어긋나 마지막 먹이 시각이 미래여도 배부름은 0~100 사이로
export function currentFullness(pet, now = Date.now()) {
  const hours = Math.max(0, (now - new Date(pet.lastFedAt).getTime()) / 3_600_000);
  const start = Math.min(100, Math.max(0, pet.fullness));
  return fullnessAfter(hoursUntil(start) + hours);
}

// 배부름 단계 (위에서부터 확인). 단계별 동작·표정은 lib/moods.js 에 있어요.
// '배부름' 안에서 방금 먹은 때와 출출할 때를 나눠, 하루 안에서도 모습이 바뀌어요.
export const MOODS = [
  { key: 'happy', label: '배부름', min: fullnessAfter(3) },   // 마지막 연습 뒤 3시간 안 (85~100)
  { key: 'peckish', label: '출출', min: fullnessAfter(24) },  // 3시간~1일 (50~85)
  { key: 'ok', label: '보통', min: fullnessAfter(48) },       // 1~2일 (25~50)
  { key: 'hungry', label: '배고픔', min: 0 },                  // 2~3일 (0보다 큼)
  { key: 'sad', label: '굶주림', min: 0 },                     // 3일 넘게 (0)
];

// 경계 시간이 되면 다음 단계예요 (예: 딱 3시간이 되면 출출, 딱 1일이 되면 보통)
export function getMood(fullness) {
  return MOODS.find((m) => fullness > m.min) || MOODS[MOODS.length - 1];
}

// 보상을 받으면 경험치가 오르고 배부름이 채워집니다.
export function feedPet(pet, xpGained, now = Date.now()) {
  if (xpGained <= 0) return pet;
  return {
    ...pet,
    xp: pet.xp + xpGained,
    fullness: 100, // 연습하면 언제나 가득
    lastFedAt: new Date(now).toISOString(),
  };
}
