// 연습 단계(자리 연습 → … → 필사) 진행 상황: 졸업 여부와 추천 연습 계산.
import { GRADUATION_COUNT, PRACTICE_LEVELS } from '../config.js';
import { filterByType } from './records.js';

export function levelIndex(type) {
  return PRACTICE_LEVELS.findIndex((l) => l.type === type);
}

// 한 연습 종류의 최근 기록 통계 (records는 최신순)
export function recentStats(records, type) {
  const recent = filterByType(records, type).slice(0, GRADUATION_COUNT);
  if (!recent.length) return { count: 0, avgSpeed: null, avgAccuracy: null };
  const avg = (key) => Math.round(recent.reduce((sum, r) => sum + r[key], 0) / recent.length);
  return { count: recent.length, avgSpeed: avg('speed'), avgAccuracy: avg('accuracy') };
}

// 이 연습을 졸업한 적이 있는지: 연속 GRADUATION_COUNT 회 평균이 기준을 넘은 적이 한 번이라도 있으면 졸업.
// 한 번 졸업하면 나중에 느리게 쳐도 졸업이 풀리지 않아요.
function everMastered(records, type, goal) {
  if (!goal) return false;
  const list = filterByType(records, type); // 최신순
  for (let i = 0; i + GRADUATION_COUNT <= list.length; i += 1) {
    const w = list.slice(i, i + GRADUATION_COUNT);
    const avg = (key) => Math.round(w.reduce((sum, r) => sum + r[key], 0) / w.length);
    if (avg('speed') >= goal.speed && avg('accuracy') >= goal.accuracy) return true;
  }
  return false;
}

// 각 단계 상태와 추천 연습 (records 에는 숨긴 기록도 넣어요)
//   mastered  : 이 연습의 졸업 기준을 직접 넘은 적이 있음
//   graduated : 직접 졸업했거나, 더 어려운 연습을 졸업해서 자동으로 졸업 처리됨
//   추천      : 아직 졸업하지 않은 가장 쉬운 연습 (어려운 연습을 한 번 해 봤다고 건너뛰지 않아요)
export function getProgress(records) {
  const levels = PRACTICE_LEVELS.map((l, index) => {
    const stats = recentStats(records, l.type);
    const mastered = everMastered(records, l.type, l.goal);
    return { ...l, index, ...stats, mastered, graduated: mastered };
  });
  for (let i = levels.length - 2; i >= 0; i -= 1) {
    if (levels[i + 1].graduated) levels[i].graduated = true;
  }
  const next = levels.find((l) => !l.graduated) || levels[levels.length - 1];
  return { levels, recommended: next.type };
}
