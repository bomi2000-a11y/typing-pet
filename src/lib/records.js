// 기록 관련 계산: 통계, 연속 연습일, 날짜 표시.
// 보상 계산은 reward.js, 연습 단계(졸업·추천)는 progress.js 에 있어요.
// 기록을 지우면 실제로 지우지 않고 hidden(숨김) 으로 표시해요.
//   화면(목록·그래프·요약)에는 숨긴 기록을 빼고, 보상·졸업 같은 규칙 계산에는 숨긴 기록도 넣어요.
//   그래야 지웠다가 다시 입력해서 보상을 또 받을 수 없어요.
import { EDIT_WINDOW_MS, MIN_ACCURACY, SUSPICIOUS_RATIO } from '../config.js';

export function dateKey(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}

export function filterByType(records, type) {
  return type === '전체' ? records : records.filter((r) => r.type === type);
}

// 화면에 보여 줄 기록 (숨긴 기록 빼기)
export function visibleRecords(records) {
  return records.filter((r) => !r.hidden);
}

const isToday = (r, now) => dateKey(r.date) === dateKey(now);

// 오늘 받은 보상 횟수 (정확도 기준을 넘은 기록만. 기본 보상 5XP 는 따로 셈)
export function rewardedToday(records, now = new Date()) {
  return records.filter((r) => isToday(r, now) && r.xpGained > 0 && r.accuracy >= MIN_ACCURACY).length;
}

// 오늘 정확도 기준 미만으로 기본 보상을 받은 횟수
export function lowAccuracyToday(records, now = new Date()) {
  return records.filter((r) => isToday(r, now) && r.xpGained > 0 && r.accuracy < MIN_ACCURACY).length;
}

// 연속 연습: '제대로 연습한 날'(정확도 기준 이상으로 XP를 받은 날)을 셉니다.
// 화면의 '🔥 n일 연속'과 연속 보너스가 같은 기준이에요. (records 에는 지운 기록도 넣어요)
function practiceDays(records) {
  return new Set(records.filter((r) => r.xpGained > 0 && r.accuracy >= MIN_ACCURACY).map((r) => dateKey(r.date)));
}

function countBack(days, from) {
  const d = new Date(from);
  let count = 0;
  while (days.has(dateKey(d))) {
    count += 1;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

// 오늘 전(어제까지) 며칠 연속인지
export function practiceStreakBefore(records, now = new Date()) {
  const d = new Date(now);
  d.setDate(d.getDate() - 1);
  return countBack(practiceDays(records), d);
}

// 화면에 보여 줄 연속 일수: 오늘 했으면 오늘까지, 아직 안 했으면 어제까지
export function practiceStreak(records, now = new Date()) {
  const days = practiceDays(records);
  const d = new Date(now);
  if (!days.has(dateKey(d))) d.setDate(d.getDate() - 1);
  return countBack(days, d);
}

// 저장한 지 얼마 안 된 기록만 종류·타수·정확도를 고칠 수 있어요
export function canEditNumbers(record, now = Date.now()) {
  return now - new Date(record.date).getTime() < EDIT_WINDOW_MS;
}

export function bestSpeed(records) {
  return records.length ? Math.max(...records.map((r) => r.speed)) : null;
}

// records는 최신순 정렬이라고 가정
export function averageSpeed(records, count = 10) {
  const recent = records.slice(0, count);
  if (!recent.length) return null;
  return Math.round(recent.reduce((sum, r) => sum + r.speed, 0) / recent.length);
}

// 새 기록이 평소보다 지나치게 높은지 (입력 실수 확인용)
export function isSuspicious({ speed, type }, records) {
  const sameType = filterByType(records, type);
  const avg = averageSpeed(sameType);
  return sameType.length >= 3 && avg !== null && speed > avg * SUSPICIOUS_RATIO;
}

const fmt = new Intl.DateTimeFormat('ko-KR', {
  month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit',
});
export function formatDate(d) {
  return fmt.format(new Date(d));
}

export function monthLabel(d) {
  const x = new Date(d);
  return `${x.getFullYear()}년 ${x.getMonth() + 1}월`;
}
