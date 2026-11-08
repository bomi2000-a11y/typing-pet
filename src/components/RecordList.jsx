// 전체 기록 목록: 기간 필터, 정렬, 월별 묶음, 더 보기. 수정/삭제는 PC에서만.
import { useEffect, useMemo, useState } from 'react';
import { bestSpeed, formatDate, monthLabel } from '../lib/records.js';

const PAGE = 20;
const PERIODS = [
  { key: 'week', label: '최근 7일', days: 7 },
  { key: 'month', label: '최근 30일', days: 30 },
  { key: 'all', label: '전체', days: null },
];

function DeleteButton({ onDelete }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return undefined;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type="button"
      className={armed ? 'link-btn danger' : 'link-btn'}
      onClick={() => (armed ? onDelete() : setArmed(true))}
    >
      {armed ? '정말 지울까요?' : '지우기'}
    </button>
  );
}

export default function RecordList({ records, editable, onEdit, onDelete }) {
  const [period, setPeriod] = useState('all');
  const [sort, setSort] = useState('recent');
  const [shown, setShown] = useState(PAGE);

  const best = bestSpeed(records);

  const list = useMemo(() => {
    const days = PERIODS.find((p) => p.key === period).days;
    const since = days ? Date.now() - days * 86_400_000 : 0;
    const filtered = records.filter((r) => new Date(r.date).getTime() >= since);
    return sort === 'speed' ? [...filtered].sort((a, b) => b.speed - a.speed) : filtered;
  }, [records, period, sort]);

  useEffect(() => setShown(PAGE), [period, sort, records.length]);

  const visible = list.slice(0, shown);
  const rows = [];
  let lastMonth = null;
  for (const r of visible) {
    const m = monthLabel(r.date);
    if (sort === 'recent' && m !== lastMonth) {
      rows.push(<li key={`m-${m}`} className="month">{m}</li>);
      lastMonth = m;
    }
    rows.push(
      <li key={r.id} className="record">
        <div className="record-main">
          <span className="record-speed">
            {r.speed}<small>타</small>
            {r.speed === best && <span className="badge" title="내 최고 타수">최고</span>}
          </span>
          <span className="record-meta">
            {r.type} · 정확도 {r.accuracy}%{r.xpGained > 0 ? ` · +${r.xpGained}XP` : ''}
          </span>
          {r.memo && <span className="record-memo">{r.memo}</span>}
        </div>
        <div className="record-side">
          <time dateTime={r.date}>{formatDate(r.date)}</time>
          {editable && (
            <span className="record-actions">
              <button type="button" className="link-btn" onClick={() => onEdit(r)}>고치기</button>
              <DeleteButton onDelete={() => onDelete(r.id)} />
            </span>
          )}
        </div>
      </li>
    );
  }

  return (
    <section className="records" aria-labelledby="records-title">
      <div className="records-head">
        <h2 id="records-title">내 기록</h2>
        <div className="records-controls">
          <select aria-label="기간" value={period} onChange={(e) => setPeriod(e.target.value)}>
            {PERIODS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
          <select aria-label="정렬" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">최근 것부터</option>
            <option value="speed">타수 높은 것부터</option>
          </select>
        </div>
      </div>
      {list.length === 0 ? (
        <p className="empty">이 기간에는 기록이 없어요.</p>
      ) : (
        <ul className="record-list">{rows}</ul>
      )}
      {shown < list.length && (
        <button type="button" className="btn btn-quiet more" onClick={() => setShown((n) => n + PAGE)}>
          더 보기 ({list.length - shown}개 남음)
        </button>
      )}
    </section>
  );
}
