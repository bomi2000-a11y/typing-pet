// 성장 단계(알·아기·청소년·어른) × 배부름 단계(배부름·출출·보통·배고픔·굶주림)마다 펫의 동작과 표정.
// 모든 동물이 함께 씁니다. 문구나 표정을 바꾸고 싶으면 이 표만 고치면 돼요.
//   motion : 동작 이름 (styles.css 의 .motion-이름 애니메이션)
//   face   : 펫 옆 말풍선에 보이는 표정 (알은 아직 얼굴이 없어서 소리로 표현)
//   fx     : 머리 위에 떠오르는 효과 기호 (없으면 빈 문자열)
//   text   : 화면 아래 한 줄 말
//   desc   : 동작 설명 (화면 낭독기와 미리보기에서 사용)
// 배고픔·굶주림일 때는 모두 바닥에 완전히 누운 자세(lie, lie-limp)예요.

export const LOOKS = {
  egg: {
    happy: { motion: 'wiggle', face: '톡톡!', fx: '♪', text: '신나서 들썩들썩!', desc: '통통 튀며 좌우로 들썩여요' },
    peckish: { motion: 'rock', face: '꿈틀', fx: '', text: '곧 깨어날 것 같아요', desc: '천천히 흔들흔들해요' },
    ok: { motion: 'rock', face: '…', fx: '', text: '오늘은 연습 안 해요?', desc: '조용히 흔들려요' },
    hungry: { motion: 'lie', face: '쿨쿨', fx: '💤', text: '옆으로 누워 쉬어요…', desc: '옆으로 데굴 누워 가만히 있어요' },
    sad: { motion: 'lie-limp', face: '……', fx: '❄', text: '꽁꽁 식었어요. 데워 주세요', desc: '옆으로 누운 채 꼼짝 않아요' },
  },
  baby: {
    happy: { motion: 'bounce', face: '(＾▽＾)', fx: '♪', text: '꺄르르! 같이 놀아요!', desc: '깡충깡충 뛰어요' },
    peckish: { motion: 'waddle', face: '(・ω・)?', fx: '🍙', text: '간식 시간이에요?', desc: '좌우로 아장아장 걸어요' },
    ok: { motion: 'waddle', face: '(´・ω・)', fx: '', text: '보고 싶었어요!', desc: '천천히 아장아장 걸어요' },
    hungry: { motion: 'lie', face: '(´・ω・`)', fx: '💦', text: '배고파서 누워 버렸어요…', desc: '바닥에 누워 숨만 쉬어요' },
    sad: { motion: 'lie-limp', face: '(╥﹏╥)', fx: '💧', text: '으앙… 일어날 힘이 없어요', desc: '축 늘어져 누운 채 훌쩍여요' },
  },
  teen: {
    happy: { motion: 'flip', face: '(≧▽≦)', fx: '✦', text: '기분 최고! 연습 가자!', desc: '점프하며 한 바퀴 돌아요' },
    peckish: { motion: 'nod', face: '(￣ー￣)', fx: '🍙', text: '출출한데 연습할까?', desc: '리듬에 맞춰 고개를 까딱여요' },
    ok: { motion: 'nod', face: '(・_・)', fx: '', text: '오늘은 연습 안 해?', desc: '천천히 고개를 까딱여요' },
    hungry: { motion: 'lie', face: '(－_－;)', fx: '💦', text: '배고파서 드러누웠어…', desc: '바닥에 드러누워 꼬르륵거려요' },
    sad: { motion: 'lie-limp', face: '(｀へ´)', fx: '💢', text: '흥, 밥 줄 때까지 안 일어나!', desc: '누운 채 꼼짝도 안 하고 삐졌어요' },
  },
  adult: {
    happy: { motion: 'proud', face: '(｀・ω・´)', fx: '★', text: '든든해요! 힘이 넘쳐요', desc: '가슴을 펴고 당당하게 서요' },
    peckish: { motion: 'breathe', face: '(´ー｀)', fx: '🍙', text: '슬슬 배고프네요', desc: '천천히 숨 쉬며 쉬어요' },
    ok: { motion: 'breathe', face: '(・_・)', fx: '', text: '기다리고 있었어요', desc: '천천히 숨 쉬며 기다려요' },
    hungry: { motion: 'lie', face: '(－.－)', fx: '💤', text: '배고파서 누워 쉬는 중…', desc: '엎드려 누워 꾸벅꾸벅 졸아요' },
    sad: { motion: 'lie-limp', face: '(×﹏×)', fx: '💫', text: '기운이 없어요… 밥 주세요', desc: '바닥에 축 늘어져 누워 있어요' },
  },
};

// 동물·단계별 특별한 장면. 위 표(LOOKS)의 내용을 배부름 단계에 따라 덮어씁니다.
//   props : 펫 옆에 함께 나오는 소품 (이모지, 또는 'ball' 처럼 StageIcon.jsx 의 PROP_ART 그림 이름)
//   idle  : 보상 직후처럼 장면 동작이 없을 때 소품 상태 (없으면 소품 숨김)
//   각 배부름 단계: motion·face·text·desc 를 바꾸고, prop 은 소품 상태 (styles.css 의 .prop--장면.is-상태)
//   배부름·출출일 때 장면을 보여 주고(출출이면 느긋하게), 1~2일 못 만나면 기본 모습, 배고프면 장면을 멈추고 누워요.
export const SCENES = {
  gift: { // 강아지·곰의 첫 단계: 선물 상자 (포유류는 알에서 나오지 않아요). 배고파도 눕지 않고 똑바로 서 있어요
    happy: { face: '부스럭!', text: '상자가 들썩들썩!', desc: '선물 상자가 신나게 들썩여요' },
    peckish: { face: '꼼지락', text: '상자 안에서 뭔가 움직여요', desc: '선물 상자가 살짝살짝 흔들려요' },
    ok: { face: '…', text: '상자가 조용해요', desc: '선물 상자가 가끔 흔들려요' },
    hungry: { motion: 'box-rest', face: '쌔근쌔근', fx: '💤', text: '상자가 조용해졌어요…', desc: '선물 상자가 꼼짝 않고 조용히 서 있어요' },
    sad: { motion: 'box-limp', face: '……', fx: '', text: '상자가 축 처졌어요…', desc: '선물 상자가 살짝 찌그러진 채 꼼짝 않아요' },
  },
  ball: { // 강아지 아기: 공놀이
    props: ['ball'],
    idle: 'still',
    happy: { motion: 'pounce', face: '(＾ω＾)', text: '공이다! 멍멍!', desc: '통통 튀는 공을 쫓아 폴짝 뛰어요', prop: 'bounce' },
    peckish: { motion: 'paw', face: '(・ω・)', text: '공을 톡톡 굴려요', desc: '앞발로 공을 톡톡 굴려요', prop: 'roll' },
    hungry: { text: '공 옆에 누워 버렸어요…', desc: '공 옆에 웅크려 누워 쉬어요', prop: 'still' },
    sad: { text: '공놀이할 힘이 없어요…', desc: '공이 저만치 굴러가도 누워만 있어요', prop: 'away' },
  },
  frisbee: { // 강아지 청소년: 원반 놀이
    props: ['🥏'],
    idle: 'still',
    happy: { motion: 'leap', face: '(≧▽≦)', text: '점프해서 원반 캐치!', desc: '날아오는 원반을 향해 높이 뛰어올라요', prop: 'fly' },
    peckish: { motion: 'wag', face: '(´▽｀)', text: '원반 던져 줄래요?', desc: '원반 옆에서 꼬리를 흔들어요', prop: 'spin' },
    hungry: { text: '배고파서 원반도 싫어…', desc: '원반 옆에 엎드려 누워요', prop: 'still' },
    sad: { text: '원반 놀이도 싫어…', desc: '원반을 멀리 두고 축 늘어져 누워요', prop: 'away' },
  },
  honey: { // 곰 청소년: 꿀 먹는 주니어 곰
    props: ['🍯'],
    idle: 'still',
    happy: { motion: 'munch', face: '(＾～＾)', text: '꿀맛! 냠냠 쩝쩝', desc: '꿀단지에 얼굴을 묻고 꿀을 먹어요', prop: 'eat' },
    peckish: { motion: 'munch-slow', face: '(´～｀)', text: '꿀 한 입만 더…', desc: '천천히 꿀을 떠먹어요', prop: 'eat-slow' },
    hungry: { text: '꿀단지가 텅 비었어요…', desc: '빈 꿀단지 옆에 드러누워요', prop: 'still' },
    sad: { text: '꿀이 하나도 없어… 흥!', desc: '엎어진 꿀단지 옆에 누워 삐졌어요', prop: 'tipped' },
  },
  study: { // 공룡 청소년: 안경 쓰고 책 읽는 주니어 공룡
    happy: { motion: 'read', face: '(・∀・)', text: '공부가 제일 재밌어!', desc: '안경을 고쳐 쓰고 신나게 책을 읽어요' },
    peckish: { motion: 'read-slow', face: '(・_・)', text: '한 쪽만 더 읽을게요', desc: '책장을 천천히 넘겨요' },
    hungry: { text: '배고파서 글자가 안 보여…', desc: '책을 등에 덮고 엎드려 누웠어요' },
    sad: { text: '공부할 힘이 없어요…', desc: '책을 덮은 채 축 늘어져 누웠어요' },
  },
  grizzly: { // 곰 어른: 웃으며 달리는 민첩한 그리즐리
    props: ['💨'],
    happy: { motion: 'dash', face: '(＾▽＾)ノ', text: '쌩쌩! 누구보다 빠르게!', desc: '웃으며 재빠르게 달려요', prop: 'puff' },
    peckish: { motion: 'trot', face: '(´▽｀)', text: '가볍게 몸 푸는 중~', desc: '웃으며 가볍게 뛰어요', prop: 'puff-slow' },
  },
  majestic: { // 공룡 어른: 늠름한 티라노
    happy: { motion: 'stomp', face: '(｀・ω・´)', text: '쿵! 쿵! 늠름한 티라노', desc: '가슴을 펴고 쿵쿵 걸어요' },
    peckish: { motion: 'stand-tall', face: '(￣ー￣)b', text: '든든하게 지키는 중', desc: '늠름하게 서서 주위를 살펴요' },
  },
  sky: { // 용 어른: 하늘로 날아가는 용
    props: ['☁️', '☁️'],
    happy: { motion: 'soar', face: '(｀▽´)ゞ', text: '하늘 높이 날아올라요!', desc: '구름을 가르며 하늘로 날아가요', prop: 'rise' },
    peckish: { motion: 'glide', face: '(´ー｀)', text: '구름 위를 천천히 날아요', desc: '날개를 펴고 천천히 날아올라요', prop: 'rise-slow' },
    hungry: { text: '내려와 누워 쉬어요…', desc: '땅에 내려와 엎드려 쉬어요' },
  },
};

// 보상을 받은 직후 잠깐 보이는 모습 (모든 단계 공통)
export const CHEER_LOOK = { motion: 'cheer', face: '\\(^o^)/', fx: '✦', desc: '기뻐서 폴짝폴짝 뛰어요' };

const LYING = new Set(['lie', 'lie-limp']);

// 펫 화면에 그릴 모습: { motion, face, fx, text, desc, props, propState, pose }
//   scene : 단계의 특별한 장면 이름 (없으면 기본 표만 사용)
//   cheer : 보상 직후인지
//   pose  : 'lying'(누운 자세) 또는 'stand' — 직접 그린 그림은 누운 그림으로 바뀌고, 이모지는 옆으로 눕혀요
export function getLook(stageKey, moodKey, scene, cheer = false) {
  const base = LOOKS[stageKey]?.[moodKey] ?? LOOKS.egg.ok;
  const sc = SCENES[scene];
  const look = cheer
    ? { ...base, ...CHEER_LOOK, props: sc?.props ?? [], propState: sc?.idle ?? null }
    : { ...base, ...(sc?.[moodKey] ?? {}), props: sc?.props ?? [], propState: sc?.[moodKey]?.prop ?? sc?.idle ?? null };
  return { ...look, pose: LYING.has(look.motion) ? 'lying' : 'stand' };
}
