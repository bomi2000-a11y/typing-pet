// PC / 모바일 화면 구분.
// 화면 너비만 보면 PC 창을 좁혔을 때 모바일 화면이 되므로, 마우스(정밀 포인터) 여부도 함께 봅니다.
import { useEffect, useState } from 'react';

const QUERY = '(pointer: fine) and (min-width: 768px)';
const OVERRIDE_KEY = 'typingPet.viewMode';

function readOverride() {
  try {
    return localStorage.getItem(OVERRIDE_KEY);
  } catch {
    return null;
  }
}

export function useDevice() {
  const [auto, setAuto] = useState(() => window.matchMedia(QUERY).matches);
  const [override, setOverride] = useState(readOverride);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setAuto(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isPC = override ? override === 'pc' : auto;

  // 태블릿+키보드처럼 예외 상황을 위해 수동 전환 버튼 제공
  const toggle = () => {
    const next = isPC ? 'mobile' : 'pc';
    const value = next === (auto ? 'pc' : 'mobile') ? null : next; // 자동 판정과 같으면 수동 설정 해제
    try {
      if (value) localStorage.setItem(OVERRIDE_KEY, value);
      else localStorage.removeItem(OVERRIDE_KEY);
    } catch {
      /* 저장 실패해도 화면 전환은 동작 */
    }
    setOverride(value);
  };

  return { isPC, toggle };
}
