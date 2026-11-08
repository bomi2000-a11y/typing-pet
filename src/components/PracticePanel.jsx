// PC 전용: 한컴타자로 가는 버튼, 결과만 적는 버튼, 오늘 남은 먹이.
import { DAILY_REWARD_LIMIT, HANCOM_TAJA_URL } from '../config.js';
import { markPracticeStart } from '../hooks/usePractice.js';

export default function PracticePanel({ rewardsLeft, onManualEntry }) {
  return (
    <div className="practice">
      <a
        className="btn btn-primary btn-big"
        href={HANCOM_TAJA_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={markPracticeStart}
      >
        한컴타자에서 연습하기
      </a>
      <p className="practice-hint">연습하고 돌아오면 결과를 적어요.</p>
      <div className="practice-row">
        <span className="rewards-left">
          오늘 남은 먹이 <strong>{rewardsLeft}</strong>/{DAILY_REWARD_LIMIT}
        </span>
        <button type="button" className="btn btn-quiet" onClick={onManualEntry} title="연습 시간을 몰라서 XP가 반만 나와요">
          결과만 적기 <small>(XP 반)</small>
        </button>
      </div>
    </div>
  );
}
