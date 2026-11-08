// 펫이 마지막 단계(어른)까지 자라면 나타나는 카드.
// 명예의 전당에 올리면 지금 펫은 기록으로 남고, 새 동물을 골라 알부터 다시 키웁니다.
import { useEffect, useState } from 'react';
import { getPetStage } from '../lib/pet.js';
import { withIGa, withRo } from '../lib/josa.js';

export default function RetireCard({ pet, onRetire, canRetire }) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const stage = getPetStage(pet);

  useEffect(() => {
    if (!armed) return undefined;
    const t = setTimeout(() => setArmed(false), 5000);
    return () => clearTimeout(t);
  }, [armed]);

  async function handleClick() {
    if (!armed) {
      setArmed(true);
      return;
    }
    setBusy(true);
    try {
      await onRetire();
    } finally {
      setBusy(false); // 성공하면 동물 고르기 화면으로 바뀌어 이 카드는 사라집니다
    }
  }

  return (
    <div className="retire" role="status">
      <p className="retire-title">🎉 {withIGa(pet.name)} {withRo(stage.name)} 다 자랐어요!</p>
      <p className="retire-text">
        명예의 전당에 올리고 새 친구를 만나요.
      </p>
      {canRetire ? (
        <button type="button" className={armed ? 'btn btn-primary' : 'btn btn-quiet'} onClick={handleClick} disabled={busy}>
          {busy ? '올리는 중…' : armed ? '정말 올려요! (다시 못 바꿔요)' : '명예의 전당에 올리기'}
        </button>
      ) : (
        <p className="retire-text">PC에서 올릴 수 있어요.</p>
      )}
    </div>
  );
}
