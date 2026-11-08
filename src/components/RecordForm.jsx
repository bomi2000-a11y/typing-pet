// 기록 입력/수정 창 (PC 전용)
// 수정: 저장 후 10분 안에는 종류·타수·정확도를 고칠 수 있고 경험치도 다시 계산돼요. 그 뒤에는 메모만.
import { useEffect, useMemo, useRef, useState } from 'react';
import { EDIT_WINDOW_MS, MAX_SPEED, PRACTICE_TYPES } from '../config.js';
import { averageSpeed, canEditNumbers, filterByType, isSuspicious } from '../lib/records.js';
import { getProgress } from '../lib/progress.js';
import { calcReward } from '../lib/reward.js';

export default function RecordForm({ mode, initial, elapsedMs, records, onSubmit, onCancel }) {
  const isEdit = mode === 'edit';
  const locked = isEdit && !canEditNumbers(initial); // 10분이 지나 메모만 고칠 수 있음
  // 수정할 때는 이 기록을 빼고, 그 기록보다 앞선 기록만으로 계산 (처음 저장할 때와 같은 조건)
  const others = useMemo(() => {
    if (!isEdit) return records;
    const at = new Date(initial.date);
    return records.filter((r) => r.id !== initial.id && new Date(r.date) < at);
  }, [isEdit, records, initial]);
  const progress = useMemo(() => getProgress(others), [others]);

  const [type, setType] = useState(initial?.type ?? progress.recommended);
  const [speed, setSpeed] = useState(initial ? String(initial.speed) : '');
  const [accuracy, setAccuracy] = useState(initial ? String(initial.accuracy) : '');
  const [memo, setMemo] = useState(initial?.memo ?? '');
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const firstField = useRef(null);
  const memoField = useRef(null);
  const cancelRef = useRef(onCancel);
  cancelRef.current = onCancel;

  // 처음 열 때 한 번만 커서를 둠 (앱이 다시 불러와도 입력 중인 칸에서 커서가 튀지 않게)
  useEffect(() => {
    (locked ? memoField : firstField).current?.focus();
    const onKey = (e) => e.key === 'Escape' && cancelRef.current();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const minutes = elapsedMs != null ? Math.max(1, Math.round(elapsedMs / 60000)) : null;
  const dirty = isEdit
    ? type !== initial.type || speed !== String(initial.speed) || accuracy !== String(initial.accuracy) || memo !== (initial.memo ?? '')
    : Boolean(speed || accuracy || memo.trim());

  async function save(values) {
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (e) {
      setError(`저장하지 못했어요. 인터넷을 확인하고 다시 눌러 봐요. (${e.message})`);
      setSaving(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (locked) {
      save({ type: initial.type, speed: initial.speed, accuracy: initial.accuracy, memo: memo.trim() });
      return;
    }
    const s = Number(speed);
    const a = Number(accuracy);
    if (!Number.isInteger(s) || s < 1 || s > MAX_SPEED) {
      setError(`타수는 1부터 ${MAX_SPEED} 사이의 숫자로 적어요.`);
      return;
    }
    if (!Number.isInteger(a) || a < 0 || a > 100) {
      setError('정확도는 0부터 100 사이의 숫자로 적어요.');
      return;
    }
    setError('');
    const values = { type, speed: s, accuracy: a, memo: memo.trim() };
    // 평소보다 훨씬 높으면 한 번 더 확인 (새 기록과 숫자 수정 모두)
    const changed = !isEdit || s !== initial.speed || type !== initial.type;
    if (changed && !confirming && isSuspicious(values, others)) {
      setConfirming(true);
      return;
    }
    save(values);
  }

  const avg = averageSpeed(filterByType(others, type));

  // 입력하는 동안 받을 보상을 미리 보여 줌 (수정할 때는 다시 계산한 값)
  const preview = useMemo(() => {
    if (locked) return null;
    const s = Number(speed);
    const a = Number(accuracy);
    if (!speed || !accuracy || s < 1 || s > MAX_SPEED || a > 100) return null;
    if (isEdit) {
      return calcReward({ type, speed: s, accuracy: a }, others, initial.practiceMs ?? null, new Date(initial.date));
    }
    return calcReward({ type, speed: s, accuracy: a }, records, elapsedMs ?? null);
  }, [locked, isEdit, type, speed, accuracy, records, others, elapsedMs, initial]);

  const optionLabel = (t) => {
    const level = progress.levels.find((l) => l.type === t);
    if (level?.graduated) return `${t} (졸업)`;
    if (t === progress.recommended) return `${t} (추천)`;
    return t;
  };

  const editMinutes = Math.round(EDIT_WINDOW_MS / 60000);

  return (
    // 바깥을 눌러 닫는 것은 아무것도 입력하지 않았을 때만 (입력한 숫자가 날아가지 않게)
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && !dirty && onCancel()}>
      <form className="sheet" role="dialog" aria-modal="true" aria-labelledby="form-title" onSubmit={handleSubmit}>
        <h2 id="form-title">{isEdit ? '기록 고치기' : '연습 결과 적기'}</h2>
        {!isEdit && minutes && <p className="sheet-sub">약 {minutes}분 동안 연습했어요.</p>}
        {!isEdit && !minutes && (
          <p className="sheet-sub">연습 시간을 몰라서 XP가 반만 나와요.</p>
        )}
        {isEdit && (
          <p className="sheet-sub">
            {locked
              ? `${editMinutes}분이 지나서 메모만 고칠 수 있어요.`
              : '숫자를 고치면 XP도 다시 계산해요.'}
          </p>
        )}

        <label className="field">
          <span>연습 종류</span>
          <select ref={firstField} value={type} disabled={locked} onChange={(e) => { setType(e.target.value); setConfirming(false); }}>
            {PRACTICE_TYPES.map((t) => <option key={t} value={t}>{optionLabel(t)}</option>)}
          </select>
        </label>

        <div className="field-row">
          <label className="field">
            <span>타수</span>
            <input
              inputMode="numeric"
              value={speed}
              disabled={locked}
              onChange={(e) => { setSpeed(e.target.value.replace(/[^0-9]/g, '')); setConfirming(false); }}
              placeholder={avg ? `요즘 ${avg}` : '예: 150'}
              required
            />
          </label>
          <label className="field">
            <span>정확도 (%)</span>
            <input
              inputMode="numeric"
              value={accuracy}
              disabled={locked}
              onChange={(e) => setAccuracy(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="예: 96"
              required
            />
          </label>
        </div>

        <label className="field">
          <span>메모</span>
          <input ref={memoField} value={memo} maxLength={80} onChange={(e) => setMemo(e.target.value)} placeholder="오늘 연습은 어땠어요?" />
        </label>

        {preview && (
          <div className="preview" aria-live="polite">
            <span className="preview-xp">
              {isEdit ? `고치면 +${preview.xp}XP (지금 +${initial.xpGained || 0}XP)` : `받을 XP: +${preview.xp}`}
            </span>
            {preview.notes.length > 0 && (
              <ul>{preview.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
            )}
          </div>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        {confirming && (
          <p className="form-confirm" role="alert">
            평소({avg}타)보다 엄청 빨라요! 맞으면 한 번 더 눌러요.
          </p>
        )}

        <div className="sheet-actions">
          <button type="submit" className="btn btn-primary submit-btn" disabled={saving}>
  {saving ? '저장 중...' : confirming ? '맞아요, 저장' : '기록 저장하기'}
</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? '저장 중…' : confirming ? '맞아요, 저장' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}
