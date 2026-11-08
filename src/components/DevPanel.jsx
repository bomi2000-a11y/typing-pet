// 개발용 도구: 테스트 도구 패널과 예시 기록 버튼.
// `npm run dev`로 실행한 체험 모드에서만 나타나고, 실제 배포(npm run build)한 앱에는 나오지 않습니다.
import { useState } from 'react';
import { MOODS, SPECIES, STAGES, createPet, feedPet, getSpecies } from '../lib/pet.js';
import { calcReward } from '../lib/reward.js';
import { withRo } from '../lib/josa.js';
import { LOCAL_KEYS, read, write } from '../storage/local.js';
import { storage } from '../storage/index.js';
import { clearPractice } from '../hooks/usePractice.js';
import StageIcon from './StageIcon.jsx';

const DAY = 24 * 60 * 60 * 1000;
// 배부름 4단계를 하나씩 확인하는 값 (각 단계 범위 안의 값)
const MOOD_VALUE = { happy: 100, peckish: 70, ok: 40, hungry: 15, sad: 0 };
const shift = (iso, ms) => new Date(new Date(iso).getTime() - ms).toISOString();

export default function DevPanel({ pet, onChange }) {
  const [open, setOpen] = useState(false);
  const species = getSpecies(pet?.species);

  // 하루가 지난 것처럼: 모든 기록과 펫의 시각을 24시간 앞당김
  // → 오늘 보상 횟수가 다시 3회가 되고, 펫은 하루만큼 배고파짐
  function passDay() {
    write(LOCAL_KEYS.records, read(LOCAL_KEYS.records, []).map((r) => ({ ...r, date: shift(r.date, DAY) })));
    const p = read(LOCAL_KEYS.pet, null);
    if (p) write(LOCAL_KEYS.pet, { ...p, lastFedAt: shift(p.lastFedAt, DAY), createdAt: shift(p.createdAt, DAY) });
    clearPractice();
    onChange();
  }

  function updatePet(fn) {
    const p = read(LOCAL_KEYS.pet, null);
    if (!p) return;
    write(LOCAL_KEYS.pet, fn(p));
    onChange();
  }

  function resetAll() {
    Object.values(LOCAL_KEYS).forEach((k) => localStorage.removeItem(k));
    clearPractice();
    onChange();
  }

  const box = {
    position: 'fixed', right: 16, bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))', zIndex: 30,
    background: 'var(--surface)', color: 'var(--ink)', border: '1.5px dashed var(--muted)',
    borderRadius: 14, padding: open ? 14 : 0, width: open ? 260 : 'auto', fontSize: 14,
    boxShadow: '0 8px 24px rgba(0,0,0,.18)',
  };
  const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 8 };
  const btn = {
    padding: '7px 8px', borderRadius: 8, border: '1.5px solid var(--line)',
    background: 'var(--bg)', cursor: 'pointer', fontSize: 13,
  };
  const label = { margin: '12px 0 0', fontSize: 12, color: 'var(--muted)' };

  if (!open) {
    return (
      <div style={box}>
        <button type="button" style={{ ...btn, border: 'none', background: 'none', padding: '8px 12px' }} onClick={() => setOpen(true)}>
          🛠 테스트 도구
        </button>
      </div>
    );
  }

  return (
    <div style={box} role="region" aria-label="테스트 도구">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>🛠 테스트 도구</strong>
        <button type="button" style={{ ...btn, padding: '2px 8px' }} onClick={() => setOpen(false)}>닫기</button>
      </div>

      <p style={label}>시간</p>
      <div style={grid}>
        <button type="button" style={{ ...btn, gridColumn: 'span 2' }} onClick={passDay}>
          하루 지나기 (보상 횟수 초기화)
        </button>
      </div>

      <p style={label}>경험치</p>
      <div style={grid}>
        <button type="button" style={btn} onClick={() => updatePet((p) => ({ ...p, xp: p.xp + 100 }))}>+100 XP</button>
        <button type="button" style={btn} onClick={() => updatePet((p) => ({ ...p, xp: p.xp + 500 }))}>+500 XP</button>
      </div>

      <p style={label}>성장 단계로 바로 가기</p>
      <div style={grid}>
        {STAGES.map((s) => (
          <button key={s.key} type="button" style={btn} onClick={() => updatePet((p) => ({ ...p, xp: s.minXp }))}>
            <StageIcon stage={species.stages[s.key]} /> {species.stages[s.key].name}
          </button>
        ))}
      </div>

      <p style={label}>동물 바꾸기 (경험치 유지)</p>
      <div style={{ ...grid, gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {SPECIES.map((sp) => (
          <button
            key={sp.key}
            type="button"
            title={sp.name}
            aria-label={`${withRo(sp.name)} 바꾸기`}
            aria-pressed={sp.key === species.key}
            style={{ ...btn, padding: '6px 0', borderColor: sp.key === species.key ? 'var(--shell)' : 'var(--line)' }}
            onClick={() => updatePet((p) => ({ ...p, species: sp.key }))}
          >
            <StageIcon stage={sp.stages.adult} />
          </button>
        ))}
      </div>

      <p style={label}>배부름 단계 (동작·표정 확인)</p>
      <div style={grid}>
        {MOODS.map((m) => (
          <button
            key={m.key}
            type="button"
            style={btn}
            onClick={() => updatePet((p) => ({ ...p, fullness: MOOD_VALUE[m.key], lastFedAt: new Date().toISOString() }))}
          >
            {m.label} ({MOOD_VALUE[m.key]})
          </button>
        ))}
      </div>

      <p style={label}>처음부터</p>
      <div style={grid}>
        <button type="button" style={{ ...btn, gridColumn: 'span 2', color: 'var(--danger)' }} onClick={resetAll}>
          모든 기록·펫·명예의 전당 초기화
        </button>
      </div>
    </div>
  );
}

// 기록이 하나도 없을 때: 지난 2주치 예시 기록을 넣어 화면을 미리 볼 수 있게 함 (지금 펫의 동물·이름은 그대로)
export function DemoSeedButton({ pet, onDone }) {
  const [busy, setBusy] = useState(false);
  async function seed() {
    if (busy) return;
    setBusy(true);
    let history = [];
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 15);
    let next = { ...createPet(pet.species, pet.name), lastFedAt: start.toISOString(), createdAt: start.toISOString() };
    for (let i = 14; i >= 1; i -= 1) {
      if (i === 9 || i === 5) continue; // 쉬는 날
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(19, 10 + i, 0, 0);
      const type = i % 4 === 0 ? '긴 글 연습' : '짧은 글 연습';
      const base = type === '긴 글 연습' ? 170 : 190;
      const values = {
        type,
        speed: Math.round(base + (14 - i) * 9 + ((i * 37) % 23) - 11),
        accuracy: 90 + ((i * 7) % 9),
        memo: i === 1 ? '손이 많이 풀렸다' : '',
      };
      const practiceMs = 5 * 60_000;
      const { xp } = calcReward(values, history, practiceMs, date);
      const saved = await storage.addRecord({ ...values, date: date.toISOString(), xpGained: xp, practiceMs });
      history = [saved, ...history];
      next = feedPet(next, xp, date.getTime());
    }
    await storage.savePet(next);
    onDone();
  }
  return (
    <button type="button" className="btn btn-quiet" onClick={seed} disabled={busy}>
      {busy ? '넣는 중…' : '예시 기록으로 미리 보기'}
    </button>
  );
}
