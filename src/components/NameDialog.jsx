// 알(선물 상자)에서 정체가 드러나면 이름을 지어 주는 창.
import { useEffect, useRef, useState } from 'react';
import { birthPlace, getPetStage } from '../lib/pet.js';
import { withIGa } from '../lib/josa.js';
import StageIcon from './StageIcon.jsx';

const SUGGESTIONS = ['타닥이', '콩이', '두부', '보리', '몽실이'];

export default function NameDialog({ pet, onSave }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const input = useRef(null);
  const stage = getPetStage(pet);

  useEffect(() => input.current?.focus(), []);

  async function handleSubmit(e) {
    e.preventDefault();
    const value = name.trim();
    if (!value) {
      setError('이름을 한 글자 이상 적어요.');
      return;
    }
    setSaving(true);
    try {
      await onSave(value);
    } catch (err) {
      setError(`저장하지 못했어요. 다시 눌러 봐요. (${err.message})`);
      setSaving(false);
    }
  }

  return (
    <div className="overlay">
      <form className="sheet name-sheet" role="dialog" aria-modal="true" aria-labelledby="name-title" onSubmit={handleSubmit}>
        <span className="name-pet" aria-hidden="true"><StageIcon stage={stage} /></span>
        <h2 id="name-title">{birthPlace(pet.species)}에서 {withIGa(stage.name)} 나왔어요!</h2>
        <p className="sheet-sub">함께 자랄 친구에게 이름을 지어 주세요.</p>
        <label className="field">
          <span>이름</span>
          <input ref={input} value={name} maxLength={10} onChange={(e) => setName(e.target.value)} placeholder="예: 타닥이" />
        </label>
        <div className="name-chips">
          {SUGGESTIONS.map((n) => (
            <button key={n} type="button" className="tab" onClick={() => setName(n)}>{n}</button>
          ))}
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="sheet-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? '저장 중…' : '이 이름으로 할게요'}</button>
        </div>
      </form>
    </div>
  );
}
