// 연습 단계표: 자리 연습 → 낱말 → 짧은 글 → 긴 글 → 필사.
// 졸업한 연습, 오늘의 추천 연습, 졸업까지 남은 목표를 아이 눈높이로 보여 줍니다(어려움은 ★). PC와 모바일 모두에서 보입니다.
import { GRADUATION_COUNT } from '../config.js';

function GoalLine({ label, value, goal, unit }) {
  const ok = value !== null && value >= goal;
  return (
    <span className={ok ? 'goal ok' : 'goal'}>
      {label} {value ?? '–'}/{goal}{unit}{ok ? ' ✓' : ''}
    </span>
  );
}

export default function SkillPath({ progress }) {
  const { levels, recommended } = progress;
  return (
    <section className="path" aria-labelledby="path-title">
      <div className="path-head">
        <h2 id="path-title">연습 단계</h2>
        <span className="path-tip">★ 많을수록 XP 많이</span>
      </div>
      <ol className="path-list">
        {levels.map((l) => {
          const isRec = l.type === recommended;
          const state = l.graduated ? 'done' : isRec ? 'now' : 'later';
          return (
            <li key={l.type} className={`path-item path-item--${state}`} aria-current={isRec ? 'step' : undefined}>
              <span className="path-mark" aria-hidden="true">{l.graduated ? '🎓' : isRec ? '▶' : l.index + 1}</span>
              <span className="path-name">
                {l.type} <span className="path-stars" aria-label={`어려움 ${l.index + 1}단계`}>{'★'.repeat(l.index + 1)}</span>
              </span>
              <span className="path-rate">{l.graduated ? '졸업!' : isRec ? '추천 ⭐' : ''}</span>
              {isRec && (
                <div className="path-goal">
                  {l.goal ? (
                    <>
                      <span className="path-goal-title">졸업 목표</span>
                      <GoalLine label="타수" value={l.avgSpeed} goal={l.goal.speed} unit="" />
                      <GoalLine label="정확도" value={l.avgAccuracy} goal={l.goal.accuracy} unit="%" />
                      <GoalLine label="연습" value={l.count} goal={GRADUATION_COUNT} unit="번" />
                    </>
                  ) : (
                    <span className="path-goal-title">마지막 단계! 최고 기록에 도전해요</span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
