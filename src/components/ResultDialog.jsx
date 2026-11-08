// 기록을 저장한 뒤 뜨는 결과 팝업: 펫 상태 변화, 이번 보상, 다음 연습 제안 (lib/advice.js)
import { useEffect, useRef } from 'react';
import { HANCOM_TAJA_URL } from '../config.js';
import { markPracticeStart } from '../hooks/usePractice.js';
import StageIcon from './StageIcon.jsx';

export default function ResultDialog({ result, onClose }) {
  const okButton = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    okButton.current?.focus();
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const { pet, record } = result;

  // 바로 다음 연습: 연습 시작 시각을 기록하고 한컴타자를 새 탭으로 (돌아오면 입력 창이 열려요)
  function goPractice() {
    markPracticeStart();
    onClose();
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet result-sheet" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <div className="result-head">
          <span className={result.grew ? 'result-pet result-pet--grew' : 'result-pet'} aria-hidden="true">
            <StageIcon stage={pet.stage} />
          </span>
          <div>
            <h2 id="result-title">{result.title}</h2>
            <p className="sheet-sub">{record.type} · {record.speed}타 · 정확도 {record.accuracy}%</p>
          </div>
        </div>

        <section className="result-block" aria-labelledby="result-pet-title">
          <h3 id="result-pet-title">펫</h3>
          <ul className="result-stats">
            <li><span>XP</span><strong>{pet.xpBefore} → {pet.xpAfter}</strong></li>
            <li><span>배부름</span><strong>{pet.moodBefore === pet.moodAfter ? pet.moodAfter : `${pet.moodBefore} → ${pet.moodAfter}`}</strong></li>
            <li>
              <span>{pet.adult ? '성장' : '다음 성장까지'}</span>
              <strong>
                {pet.adult
                  ? '다 자랐어요!'
                  : `${pet.left}XP${pet.estimate ? ` (약 ${pet.estimate}번)` : ''}`}
              </strong>
            </li>
          </ul>
          {!pet.adult && (
            <div className="result-bar" role="progressbar" aria-label="다음 성장까지" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pet.growth * 100)}>
              <i style={{ width: `${Math.round(pet.growth * 100)}%` }} />
            </div>
          )}
        </section>

        {result.notes.length > 0 && (
          <section className="result-block" aria-labelledby="result-reward-title">
            <h3 id="result-reward-title">받은 XP</h3>
            <ul className="result-notes">{result.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
          </section>
        )}

        <section className="result-block result-plan" aria-labelledby="result-plan-title">
          <h3 id="result-plan-title">다음엔?</h3>
          <ol>{result.plan.map((p, i) => <li key={i}>{p}</li>)}</ol>
        </section>

        <div className="sheet-actions">
          {result.rewardsLeft > 0 && (
            <a className="btn btn-quiet" href={HANCOM_TAJA_URL} target="_blank" rel="noopener noreferrer" onClick={goPractice}>
              바로 연습하러 가기
            </a>
          )}
          <button ref={okButton} type="button" className="btn btn-primary" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
}
