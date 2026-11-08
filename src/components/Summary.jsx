// 기록 요약: 횟수, 최근 평균, 최고 타수, 연속 연습일
import { averageSpeed, bestSpeed } from '../lib/records.js';

export default function Summary({ records, streakDays }) {
  const items = [
    { label: '연습', value: records.length, unit: '번' },
    { label: '요즘 타수', value: averageSpeed(records) ?? '–', unit: '타' },
    { label: '최고 타수', value: bestSpeed(records) ?? '–', unit: '타' },
    { label: '연속', value: streakDays, unit: '일' },
  ];
  return (
    <dl className="summary">
      {items.map((it) => (
        <div key={it.label} className="summary-item">
          <dt>{it.label}</dt>
          <dd>
            {it.value}
            {it.value !== '–' && <small>{it.unit}</small>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
