// 앱 전체에서 쓰는 설정값. 숫자를 바꾸면 게임 밸런스가 바뀝니다.

export const HANCOM_TAJA_URL = 'https://www.hancomtaja.com';

export const APP_AUTHOR = 'BONASSAM'; // 제작자 (화면 맨 아래 저작권 표시)
export const COPYRIGHT_YEAR = 2026;

// 닉네임 로그인: 닉네임을 이 도메인의 내부용 주소로 바꿔 Supabase 비밀번호 로그인에 씁니다.
// 실제로 메일을 보내지 않으므로 아무 도메인이어도 되지만, Supabase가 주소 형식을 거절하면 바꿔 보세요.
export const ACCOUNT_EMAIL_DOMAIN = 'player.tadakpet.app';
export const NICKNAME_RULE = /^[가-힣a-zA-Z0-9_]{2,10}$/; // 한글·영문·숫자·_ 2~10자
export const MIN_PASSWORD = 6;

// 연습 종류: 쉬운 것부터 어려운 순서.
//   multiplier : 난이도 배율 (어려운 연습일수록 보상이 큼)
//   goal       : 졸업 기준. 최근 GRADUATION_COUNT회의 평균 타수와 평균 정확도가 이 이상이면 졸업
//                (졸업한 연습은 보상이 크게 줄고, 다음 연습을 추천합니다. 마지막 단계는 졸업 없음)
export const PRACTICE_LEVELS = [
  { type: '자리 연습', multiplier: 0.6, goal: { speed: 100, accuracy: 95 } },
  { type: '낱말 연습', multiplier: 0.8, goal: { speed: 150, accuracy: 95 } },
  { type: '짧은 글 연습', multiplier: 1.0, goal: { speed: 200, accuracy: 95 } },
  { type: '긴 글 연습', multiplier: 1.2, goal: { speed: 250, accuracy: 95 } },
  { type: '필사', multiplier: 1.3, goal: null },
];
export const PRACTICE_TYPES = PRACTICE_LEVELS.map((l) => l.type);

export const GRADUATION_COUNT = 5;        // 졸업 판정에 쓰는 최근 기록 수
export const GRADUATED_RATE = 0.3;        // 이미 졸업한(쉬운) 연습의 보상 배율
export const RECOMMENDED_RATE = 1.2;      // 추천 연습을 하면 받는 보상 배율
export const REPEAT_TODAY_RATES = [1, 0.6, 0.4]; // 같은 날 같은 연습 1·2·3번째 보상 배율

export const FIRST_TRY_BONUS = 40;        // 처음 해 보는 연습 종류 보너스
export const PERSONAL_BEST_BONUS = 30;    // 종류별 최고 기록 갱신 보너스
export const GROWTH_BONUS_MAX = 30;       // 최근 평균보다 빨라졌을 때 보너스 최대치 (늘어난 타수의 절반)
export const GROWTH_MIN_GAIN = 5;         // 이만큼(타) 이상 빨라졌을 때만 그 보너스 (1~2타는 운이라 알림만 많아져요)
export const HIGH_ACCURACY = 98;          // 이 정확도 이상이면 정확도 보너스
export const HIGH_ACCURACY_BONUS = 10;
export const GRADUATION_BONUS = 50;       // 연습을 졸업하는 순간 보너스
export const DAILY_FIRST_BONUS = 20;      // 오늘 첫 연습 보너스 (매일 한 번이라도 연습하도록)
export const STREAK_BONUS = 5;            // 연속 연습 보너스: 이틀째부터 하루 +5씩
export const STREAK_BONUS_MAX = 25;       // 연속 보너스 최대 (6일 연속부터 +25)
export const STREAK_MILESTONE = 7;        // 7일마다(7, 14, 21…일 연속) 특별 보너스
export const STREAK_MILESTONE_BONUS = 30;
export const SPACED_HOURS = 3;            // 같은 날 앞 연습에서 이만큼 쉬었다 오면
export const SPACED_BONUS = 10;           // 보너스 (아침·점심·저녁에 나눠 연습하도록)

export const DAILY_REWARD_LIMIT = 3;      // 하루에 보상(먹이·경험치)을 받는 최대 횟수
export const LOW_ACCURACY_XP = 5;         // 정확도 기준 미만일 때 기본 보상
export const LOW_ACCURACY_DAILY = 2;      // 기본 보상을 받는 하루 최대 횟수 (위 보상 3번과는 따로 셈)
export const PRACTICE_EXPIRE_MS = 3 * 60 * 60 * 1000; // "연습하러 가기"를 누른 뒤 이 시간이 지나면 무효
export const EDIT_WINDOW_MS = 10 * 60 * 1000;         // 저장 후 이 시간 안에만 종류·타수·정확도 수정 (경험치 다시 계산)
export const MIN_PRACTICE_MS = 60 * 1000; // 이보다 짧게 연습하거나, 연습 시간을 모르면(직접 입력) 보상 절반
export const MIN_ACCURACY = 80;           // 이 정확도 미만이면 기본 보상만
export const SUSPICIOUS_RATIO = 1.5;      // 최근 평균보다 이 배수 이상이면 한 번 더 확인
export const MAX_SPEED = 1500;            // 입력 가능한 최대 타수
