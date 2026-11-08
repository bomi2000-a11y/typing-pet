// 기록을 저장한 뒤 결과 팝업에 보여 줄 내용: 펫 상태 변화, 이번 보상, 다음 연습 제안.
// 다음 성장 모습(동물 이름)은 비밀이라 알려 주지 않아요.
import {
  DAILY_REWARD_LIMIT, GRADUATION_COUNT, MAX_SPEED, MIN_ACCURACY, MIN_PRACTICE_MS, SPACED_BONUS, SPACED_HOURS,
  PRACTICE_LEVELS,
} from '../config.js';
import { birthPlace, currentFullness, getMood, getNextPetStage, getPetStage } from './pet.js';
import { bestSpeed, filterByType, practiceStreakBefore, rewardedToday } from './records.js';
import { getProgress } from './progress.js';
import { withIGa, withRo } from './josa.js';

const sum = (list, key) => list.reduce((s, r) => s + r[key], 0);

// 이 연습을 다음 한 번에 졸업하려면 몇 타·몇 %가 필요한지
// (졸업 = 같은 연습 연속 GRADUATION_COUNT 회의 평균이 기준 이상, 평균은 반올림)
export function graduationTarget(records, level) {
  const { goal } = level;
  if (!goal) return null;
  const prev = filterByType(records, level.type).slice(0, GRADUATION_COUNT - 1);
  if (prev.length < GRADUATION_COUNT - 1) {
    return { more: GRADUATION_COUNT - prev.length, speed: goal.speed, accuracy: goal.accuracy };
  }
  const need = (key, g) => Math.ceil(GRADUATION_COUNT * g - 0.5 * GRADUATION_COUNT - sum(prev, key));
  // 최근 기록이 이미 좋아서 기준보다 낮아도 되는 경우에도, 아이가 헷갈리지 않게 기준 이상으로 보여 줘요
  const speed = Math.max(goal.speed, need('speed', goal.speed));
  const accuracy = Math.max(goal.accuracy, need('accuracy', goal.accuracy));
  const avg = (key) => Math.round(sum(prev, key) / prev.length);
  // 아이가 다음 한 번에 해낼 만한 목표인지: 정확도 100%가 필요하거나, 내 최고 타수보다 15% 넘게 빨라야 하면 '조금씩 올리기'로 안내
  const best = Math.max(goal.speed, ...prev.map((r) => r.speed));
  return {
    more: 1, speed, accuracy,
    possible: speed <= Math.min(MAX_SPEED, Math.round(best * 1.15)) && accuracy < 100,
    avgSpeed: avg('speed'), avgAccuracy: avg('accuracy'),
  };
}

// 결과 팝업 내용 만들기
//   petBefore/petAfter: 저장 전후 펫, record: 방금 저장한 기록, records: 저장 후 모든 기록(숨김 포함)
export function buildResult({ petBefore, petAfter, record, xp, notes, records, elapsedMs, now = new Date() }) {
  const t = now.getTime();
  const before = getPetStage(petBefore);
  const after = getPetStage(petAfter);
  const next = getNextPetStage(petAfter);
  const hatched = before.key === 'egg' && after.key !== 'egg';
  const grew = after.key !== before.key;

  // 배고팠을수록 더 반가워해요
  const hungerBefore = getMood(currentFullness(petBefore, t)).key;
  const yum = { happy: '냠냠!', peckish: '맛있다!', ok: '와, 밥이다!', hungry: '살았다, 고마워요!', sad: '살았다, 고마워요!' }[hungerBefore];
  let title = xp > 0 ? `${yum} +${xp}XP` : '기록을 저장했어요';
  if (hatched) title = `${birthPlace(petAfter.species)}에서 ${withIGa(after.name)} 나왔어요!`;
  else if (grew) title = `${withRo(after.name)} 자랐어요!`;

  // 다음 성장까지: 최근 보상 평균으로 몇 번 더 연습하면 되는지 어림
  const recentXp = records.filter((r) => r.xpGained > 0).slice(0, 5).map((r) => r.xpGained);
  const avgXp = recentXp.length ? recentXp.reduce((a, b) => a + b, 0) / recentXp.length : 0;
  const left = next ? next.minXp - petAfter.xp : 0;
  const pet = {
    stage: after,
    xpBefore: petBefore.xp,
    xpAfter: petAfter.xp,
    moodBefore: getMood(currentFullness(petBefore, t)).label,
    moodAfter: getMood(currentFullness(petAfter, t)).label,
    left,
    growth: next ? (petAfter.xp - after.minXp) / (next.minXp - after.minXp) : 1,
    estimate: next && avgXp > 0 ? Math.ceil(left / avgXp) : null,
    adult: !next,
  };

  // 다음엔 이렇게! (중요한 것부터 최대 3개)
  const plan = [];
  if (record.accuracy < MIN_ACCURACY) {
    plan.push(`천천히, 정확도 ${MIN_ACCURACY}% 넘게!`);
  }
  if (elapsedMs === null || elapsedMs === undefined) {
    plan.push('빨간 버튼으로 시작하면 XP를 다 받아요');
  } else if (elapsedMs < MIN_PRACTICE_MS) {
    plan.push('1분 넘게 연습하면 XP 두 배');
  }

  const progress = getProgress(records);
  const rec = progress.recommended;
  const level = progress.levels.find((l) => l.type === rec);
  const target = graduationTarget(records, level);
  if (!target) {
    const best = bestSpeed(filterByType(records, rec));
    plan.push(best ? `${rec}: 최고 기록 ${best}타에 도전!` : `${rec}에 도전!`);
  } else if (target.more > 1) {
    plan.push(`${rec}: ${target.more}번 더 하면 졸업 (타수 ${target.speed}, 정확도 ${target.accuracy}%)`);
  } else if (target.possible) {
    plan.push(`${rec}: 타수 ${target.speed}, 정확도 ${target.accuracy}% 넘으면 졸업 🎓`);
  } else {
    // 부족한 것만 콕 집어서
    const { goal } = level;
    const speedOk = target.avgSpeed >= goal.speed;
    const accOk = target.avgAccuracy >= goal.accuracy;
    if (speedOk && !accOk) {
      plan.push(`${rec}: 정확도를 ${goal.accuracy}%까지 올려요`);
    } else if (accOk && !speedOk) {
      plan.push(`${rec}: 타수를 ${goal.speed}까지 올려요`);
    } else {
      plan.push(`${rec}: 타수 ${goal.speed}, 정확도 ${goal.accuracy}%가 목표`);
    }
  }

  const rewardsLeft = Math.max(0, DAILY_REWARD_LIMIT - rewardedToday(records, now));
  const streakTomorrow = practiceStreakBefore(records, now) + 2;
  if (rewardsLeft === 0) {
    plan.push(`오늘 먹이 끝! 내일도 오면 ${streakTomorrow}일 연속 🔥`);
  } else if (record.type !== rec) {
    plan.push(`남은 먹이 ${rewardsLeft}번: ${rec} 추천 ⭐`);
  } else {
    const harder = PRACTICE_LEVELS[PRACTICE_LEVELS.findIndex((l) => l.type === rec) + 1];
    if (harder) {
      const tried = filterByType(records, harder.type).length > 0;
      plan.push(`남은 먹이 ${rewardsLeft}번: ${harder.type}에 도전${tried ? '' : ' (처음 +40XP)'}`);
    } else {
      plan.push(`남은 먹이 ${rewardsLeft}번: 최고 기록에 도전!`);
    }
  }

  // 오늘 첫 연습이면 내일도 오라고(연속 보너스), 그다음부터는 쉬었다 오라고(쉬었다 오면 +10)
  const proper = record.accuracy >= MIN_ACCURACY && xp > 0;
  if (proper && rewardedToday(records, now) === 1) plan.push(`내일도 하면 ${streakTomorrow}일 연속 🔥`);
  else if (proper && rewardsLeft > 0) plan.push(`${SPACED_HOURS}시간 쉬었다 오면 +${SPACED_BONUS}XP ⏰`);

  return {
    title, hatched, grew, xp,
    record: { type: record.type, speed: record.speed, accuracy: record.accuracy },
    pet, notes, plan: plan.slice(0, 3), rewardsLeft,
  };
}
