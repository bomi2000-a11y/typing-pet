// 명예의 전당: 어른까지 키운 펫들을 트로피처럼 보여 줍니다.
import { getSpecies } from '../lib/pet.js';
import { daysTaken } from '../lib/hall.js';
import StageIcon from './StageIcon.jsx';

const shortDate = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}.${x.getMonth() + 1}.${x.getDate()}`;
};

export default function HallOfFame({ hall, compact = false }) {
  if (!hall.length) return null;
  return (
    <section className={compact ? 'hall hall--compact' : 'hall'} aria-labelledby="hall-title">
      <div className="hall-head">
        <h2 id="hall-title">🏆 명예의 전당</h2>
        <span className="hall-count">{hall.length}마리</span>
      </div>
      <ul className="hall-list">
        {hall.map((h) => {
          const sp = getSpecies(h.species);
          return (
            <li key={h.id} className="hall-item">
              <span className="hall-emoji" aria-hidden="true"><StageIcon stage={sp.stages.adult} /></span>
              <span className="hall-name">{h.name}</span>
              <span className="hall-species">{sp.stages.adult.name}</span>
              {!compact && (
                <span className="hall-stats">
                  {daysTaken(h)}일 · {h.recordCount}번{h.bestSpeed ? ` · 최고 ${h.bestSpeed}타` : ''}
                </span>
              )}
              <time className="hall-date" dateTime={h.completedAt}>{shortDate(h.completedAt)}</time>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
