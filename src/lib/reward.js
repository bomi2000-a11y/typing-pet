// 보상(경험치) 계산. 쉬운 연습만 반복하면 보상이 줄고,
// 실력이 늘거나 더 어려운 연습에 도전하면 보상이 커지도록 짜여 있습니다. 숫자는 config.js 에서 바꿉니다.
import {
  DAILY_FIRST_BONUS, DAILY_REWARD_LIMIT, FIRST_TRY_BONUS, GRADUATED_RATE, GRADUATION_BONUS, GROWTH_BONUS_MAX,
  GROWTH_MIN_GAIN, HIGH_ACCURACY, HIGH_ACCURACY_BONUS, LOW_ACCURACY_DAILY, LOW_ACCURACY_XP, MIN_ACCURACY,
  MIN_PRACTICE_MS, PERSONAL_BEST_BONUS, RECOMMENDED_RATE, REPEAT_TODAY_RATES, SPACED_BONUS, SPACED_HOURS,
  STREAK_BONUS, STREAK_BONUS_MAX, STREAK_MILESTONE, STREAK_MILESTONE_BONUS,
} from '../config.js';
import {
  averageSpeed, bestSpeed, dateKey, filterByType, lowAccuracyToday, practiceStreakBefore, rewardedToday,
} from './records.js';
import { getProgress, levelIndex } from './progress.js';

// values: { type, speed, accuracy }, records: 지금까지 기록(최신순, 숨긴 기록 포함), elapsedMs: 연습 시간(모르면 null)
// 반환: { xp, notes } — notes는 XP가 왜 이렇게 나왔는지 아이 눈높이로 설명하는 문장들
export function calcReward({ speed, accuracy, type }, records, elapsedMs, now = new Date()) {
  if (rewardedToday(records, now) >= DAILY_REWARD_LIMIT) {
    return { xp: 0, notes: ['오늘 먹이 끝! 기록은 저장했어요.'] };
  }
  if (accuracy < MIN_ACCURACY) {
    // 기본 보상은 하루 보상 횟수를 쓰지 않는 대신, 하루 LOW_ACCURACY_DAILY 번까지만
    if (lowAccuracyToday(records, now) >= LOW_ACCURACY_DAILY) {
      return { xp: 0, notes: [`정확도 ${MIN_ACCURACY}% 미만은 하루 ${LOW_ACCURACY_DAILY}번까지만 XP를 받아요.`] };
    }
    return {
      xp: LOW_ACCURACY_XP,
      notes: [`정확도 ${MIN_ACCURACY}% 미만이라 XP 조금`],
    };
  }

  const notes = [];
  const progress = getProgress(records);
  const level = progress.levels[levelIndex(type)] ?? progress.levels[0];
  const sameType = filterByType(records, type);

  // 1) 기본 점수 × 난이도 배율
  let rate = level.multiplier;

  // 2) 이미 졸업한 쉬운 연습이면 크게 줄이고, 추천 연습이면 늘림
  // 3) 오늘 같은 연습을 또 하면 점점 줄임
  //    (추천 연습을 또 한 경우 '더'와 '줄었어요'가 함께 보이면 헷갈려서 '줄었어요'만 보여 줘요)
  const today = dateKey(now);
  const doneToday = sameType.filter((r) => dateKey(r.date) === today && r.xpGained > 0 && r.accuracy >= MIN_ACCURACY).length;
  const repeatRate = REPEAT_TODAY_RATES[Math.min(doneToday, REPEAT_TODAY_RATES.length - 1)];
  if (level.graduated) {
    rate *= GRADUATED_RATE;
    notes.push('졸업한 연습이라 XP 조금');
  } else if (type === progress.recommended) {
    rate *= RECOMMENDED_RATE;
    if (repeatRate === 1) notes.push('추천 연습 ⭐ XP 더');
  }
  if (repeatRate < 1) {
    rate *= repeatRate;
    notes.push('같은 연습을 또 해서 XP 줄었어요');
  }

  let xp = Math.round(speed * (accuracy / 100) * 0.3 * rate);

  // 4) 실력이 늘었을 때 보너스 (졸업한 연습에서는 받지 않음)
  if (!level.graduated) {
    const best = bestSpeed(sameType);
    const avg = averageSpeed(sameType);
    if (sameType.length === 0) {
      xp += FIRST_TRY_BONUS;
      notes.push(`처음 도전! +${FIRST_TRY_BONUS}XP 🎉`);
    } else if (speed > best) {
      xp += PERSONAL_BEST_BONUS;
      notes.push(`최고 기록! +${PERSONAL_BEST_BONUS}XP 🏆`);
    } else if (sameType.length >= 3 && speed - avg >= GROWTH_MIN_GAIN) {
      const growth = Math.min(GROWTH_BONUS_MAX, Math.round((speed - avg) / 2));
      if (growth > 0) {
        xp += growth;
        notes.push(`요즘보다 ${speed - avg}타 빨라요! +${growth}XP`);
      }
    }
    if (accuracy >= HIGH_ACCURACY) {
      xp += HIGH_ACCURACY_BONUS;
      notes.push(`정확도 ${accuracy}%! +${HIGH_ACCURACY_BONUS}XP`);
    }

    // 5) 이번 기록으로 졸업 기준을 넘으면 졸업 보너스
    const after = getProgress([{ type, speed, accuracy, date: now.toISOString(), xpGained: 1 }, ...records]);
    if (!level.mastered && after.levels[level.index].mastered) {
      xp += GRADUATION_BONUS;
      notes.push(`🎓 ${type} 졸업! +${GRADUATION_BONUS}XP`);
    }
  }

  // 6) 매일 연습 보너스: 오늘 첫 연습 +20, 이틀째부터 연속 하루 +5 (최대 +25), 7일마다 +30
  //    같은 날 두 번째부터는 앞 연습에서 3시간 넘게 쉬었다 오면 +10 (아침·점심·저녁에 나눠서)
  const todays = records.filter((r) => dateKey(r.date) === today && r.xpGained > 0 && r.accuracy >= MIN_ACCURACY);
  if (todays.length === 0) {
    xp += DAILY_FIRST_BONUS;
    notes.push(`오늘 첫 연습 +${DAILY_FIRST_BONUS}XP 🌞`);
    const streak = practiceStreakBefore(records, now) + 1; // 오늘까지 며칠 연속
    const streakXp = Math.min(STREAK_BONUS_MAX, (streak - 1) * STREAK_BONUS);
    if (streakXp > 0) {
      xp += streakXp;
      notes.push(`${streak}일 연속! +${streakXp}XP 🔥`);
    }
    if (streak % STREAK_MILESTONE === 0) {
      xp += STREAK_MILESTONE_BONUS;
      notes.push(`🏅 ${streak}일 연속 달성! +${STREAK_MILESTONE_BONUS}XP`);
    }
  } else {
    const last = Math.max(...todays.map((r) => new Date(r.date).getTime()));
    if (now.getTime() - last >= SPACED_HOURS * 3_600_000) {
      xp += SPACED_BONUS;
      notes.push(`쉬었다 와서 +${SPACED_BONUS}XP ⏰`);
    }
  }

  // 7) 너무 짧게 연습했거나, 연습 시간을 알 수 없으면(직접 입력) 절반 (보너스까지 모두)
  if (elapsedMs === null || elapsedMs === undefined) {
    xp = Math.round(xp / 2);
    notes.push('연습 시간을 몰라서 XP 반');
  } else if (elapsedMs < MIN_PRACTICE_MS) {
    xp = Math.round(xp / 2);
    notes.push('1분보다 짧아서 XP 반');
  }
  return { xp: Math.max(5, xp), notes };
}

