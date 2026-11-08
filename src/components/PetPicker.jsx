// 새 친구 맞이하기 화면. 펫이 없을 때(처음 시작, 명예의 전당에 올린 뒤) 나타납니다.
// 어떤 동물이 나올지는 비밀이에요. 버튼을 누르면 무작위로 알 또는 선물 상자를 받고,
// 연습을 해서 정체가 드러나면 그때 이름을 지어 줍니다.
import { useState } from 'react';
import HallOfFame from './HallOfFame.jsx';

export default function PetPicker({ onStart, hall = [], owner = '' }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleStart() {
    setSaving(true);
    setError('');
    try {
      await onStart();
    } catch (err) {
      setError(`시작하지 못했어요. 다시 눌러 봐요. (${err.message})`);
      setSaving(false);
    }
  }

  return (
    <main className="picker">
      <div className="picker-card">
        <div className="brand">
          <h1 className="logo">타닥펫</h1>
          {owner && <span className="owner">👤 {owner}</span>}
        </div>
        <div className="mystery" aria-hidden="true">
          <span className="mystery-item">🥚</span>
          <span className="mystery-q">?</span>
          <span className="mystery-item mystery-item--late">🎁</span>
        </div>
        <div className="picker-head">
          <h2>{hall.length ? '새 친구가 기다리고 있어요' : '어떤 친구가 찾아올까요?'}</h2>
          <p>매일 한 번씩 연습하면 한 달쯤 뒤 어른이 돼요.</p>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="button" className="btn btn-primary btn-big" onClick={handleStart} disabled={saving}>
          {saving ? '준비하는 중…' : '새 친구 맞이하기'}
        </button>
        <HallOfFame hall={hall} compact />
      </div>
    </main>
  );
}
