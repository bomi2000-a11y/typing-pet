// 다마고치처럼 생긴 펫 화면. PC와 모바일 모두에서 보입니다.
import { currentFullness, getMood, getNextPetStage, getPetStage } from '../lib/pet.js';
import { getLook } from '../lib/moods.js';
import StageIcon, { PropIcon } from './StageIcon.jsx';

function Meter({ label, value }) {
  const segments = 10;
  const filled = Math.round(Math.max(0, Math.min(1, value)) * segments);
  return (
    <div className="meter">
      <span className="meter-label">{label}</span>
      <div
        className="meter-bar"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
      >
        {Array.from({ length: segments }, (_, i) => (
          <i key={i} className={i < filled ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
}

function growthLabel(stage, next, pet) {
  if (!next) return '다 자랐어요';
  const left = next.minXp - pet.xp;
  return stage.key === 'egg' ? `태어나기까지 ${left}XP` : `다음 성장까지 ${left}XP`;
}

// now: App 의 1분 시계 (배고픔이 1분마다 갱신돼요)
export default function PetDevice({ pet, reaction, now }) {
  const fullness = currentFullness(pet, now);
  const mood = getMood(fullness);
  const stage = getPetStage(pet);
  const next = getNextPetStage(pet);
  const growth = next ? (pet.xp - stage.minXp) / (next.minXp - stage.minXp) : 1;
  // reaction: { text, id } — 같은 말이 연달아 나와도 id 가 달라서 애니메이션이 다시 나와요
  const look = getLook(stage.key, mood.key, stage.scene, Boolean(reaction));
  const lookKey = reaction ? `r${reaction.id}` : `${stage.key}-${mood.key}`; // 바뀔 때마다 애니메이션을 처음부터

  return (
    <section className="device" aria-label="펫 상태">
      <div className="lcd">
        <div className="lcd-top">
          <span>{pet.name || '???'}</span>
          <span>{stage.name} · {pet.xp}XP</span>
        </div>
        <div
          className="pet-stage"
          role="img"
          aria-label={`${stage.name}, ${mood.label} 상태: ${look.desc}`}
        >
          {look.propState && look.props.map((p, i) => (
            // 소품(꿀단지, 축구공, 구름…): 상태에 따라 styles.css 에서 위치와 움직임이 바뀜
            <span key={`prop-${i}-${lookKey}`} className={`prop prop--${stage.scene} prop-${i} is-${look.propState}`} aria-hidden="true">
              <PropIcon prop={p} />
            </span>
          ))}
          {look.fx && <span key={`fx-${lookKey}`} className="pet-fx" aria-hidden="true">{look.fx}</span>}
          <span
            key={lookKey}
            className={`pet motion-${look.motion}`}
            style={stage.size ? { fontSize: `${80 * stage.size}px` } : undefined}
            aria-hidden="true"
          >
            <StageIcon stage={stage} pose={look.pose} />
          </span>
          <span key={`face-${lookKey}`} className="pet-face" aria-hidden="true">{look.face}</span>
        </div>
        <p className="lcd-msg" aria-live="polite">{reaction ? reaction.text : look.text}</p>
        <Meter label="배부름" value={fullness / 100} />
        {/* 다음 모습은 비밀: 무엇으로 자랄지 미리 알려 주지 않아요 */}
        <Meter label={growthLabel(stage, next, pet)} value={growth} />
      </div>
      <div className="device-buttons" aria-hidden="true">
        <span /><span /><span />
      </div>
    </section>
  );
}
