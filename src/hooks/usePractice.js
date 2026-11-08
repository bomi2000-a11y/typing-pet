// "연습하러 가기"를 누른 시각을 저장하고,
// 사용자가 한컴타자 탭에서 이 앱 탭으로 돌아오면 기록 입력 창을 띄웁니다.
import { useEffect } from 'react';
import { PRACTICE_EXPIRE_MS } from '../config.js';

const KEY = 'typingPet.practiceStartedAt';

export function markPracticeStart() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* 무시 */
  }
}

// "연습하러 가기"를 누른 뒤 지난 시간. 누른 적이 없거나 너무 오래됐으면(3시간) null = 시간 모름
export function getPracticeElapsed() {
  try {
    const started = Number(localStorage.getItem(KEY));
    if (!started) return null;
    const elapsed = Date.now() - started;
    if (elapsed < 0 || elapsed > PRACTICE_EXPIRE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return elapsed;
  } catch {
    return null;
  }
}

export function clearPractice() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* 무시 */
  }
}

export function usePracticeReturn(onReturn, enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    const handler = () => {
      if (document.visibilityState !== 'visible') return;
      const elapsed = getPracticeElapsed();
      if (elapsed !== null) onReturn(elapsed);
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [onReturn, enabled]);
}
