// 1분마다 바뀌는 지금 시각. 배고픔, '오늘 남은 먹이'(자정이 지나면), 연속 연습일이 저절로 갱신돼요.
import { useEffect, useState } from 'react';

export function useNow(ms = 60_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}
