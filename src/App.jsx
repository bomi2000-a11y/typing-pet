import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DAILY_REWARD_LIMIT, PRACTICE_TYPES } from './config.js';
import { storage, supabase, isDemoMode, missingConfig } from './storage/index.js';
import { createPet, feedPet, getPetStage, pickRandomSpecies } from './lib/pet.js';
import { buildResult } from './lib/advice.js';
import { canEditNumbers, filterByType, practiceStreak, rewardedToday, visibleRecords } from './lib/records.js';
import { calcReward } from './lib/reward.js';
import { getProgress } from './lib/progress.js';
import { useDevice } from './hooks/useDevice.js';
import { useNow } from './hooks/useNow.js';
import { clearPractice, getPracticeElapsed, usePracticeReturn } from './hooks/usePractice.js';
import PetDevice from './components/PetDevice.jsx';
import PracticePanel from './components/PracticePanel.jsx';
import RecordForm from './components/RecordForm.jsx';
import Summary from './components/Summary.jsx';
import SpeedChart from './components/SpeedChart.jsx';
import RecordList from './components/RecordList.jsx';
import Login from './components/Login.jsx';
import DevPanel, { DemoSeedButton } from './components/DevPanel.jsx';
import PetPicker from './components/PetPicker.jsx';
import SkillPath from './components/SkillPath.jsx';
import HallOfFame from './components/HallOfFame.jsx';
import RetireCard from './components/RetireCard.jsx';
import NameDialog from './components/NameDialog.jsx';
import ResultDialog from './components/ResultDialog.jsx';
import { isFullyGrown, makeHallEntry } from './lib/hall.js';
import Footer from './components/Footer.jsx';

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(!supabase);

  useEffect(() => {
    if (!supabase) return undefined;
    // 로그인 확인이 실패해도 '불러오는 중'에 멈추지 않고 로그인 화면으로
    supabase.auth.getSession()
      .then(({ data }) => setSession(data.session))
      .catch(() => setSession(null))
      .finally(() => setAuthReady(true));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  let screen;
  if (missingConfig) screen = <ConfigNeeded />;
  else if (!authReady) screen = <p className="loading">불러오는 중…</p>;
  else if (supabase && !session) screen = <Login />;
  else {
    screen = (
      <Main
        nickname={session?.user?.user_metadata?.nickname ?? ''}
        onSignOut={supabase ? () => supabase.auth.signOut() : null}
      />
    );
  }
  // 모든 화면 맨 아래에 제작자·저작권 표시
  return (
    <>
      {screen}
      <Footer />
    </>
  );
}

// 위쪽에 보여 줄 펫 주인 이름 (개발용 체험 모드는 닉네임이 없어서 '체험 사용자')
function ownerLabel(nickname) {
  if (nickname) return `${nickname}님`;
  return isDemoMode ? '체험 사용자' : '';
}

// 배포한 앱에 Supabase 설정이 없을 때 (체험 모드로 넘어가지 않아요)
function ConfigNeeded() {
  return (
    <main className="loading">
      <h1 className="logo title-balloon">타닥펫</h1>
      <p>지금은 타닥펫을 열 수 없어요. 선생님이나 부모님께 알려 주세요.</p>
      <p className="admin-note">관리자: 배포 환경 변수에 VITE_SUPABASE_URL 과 VITE_SUPABASE_KEY 를 넣고 다시 배포해 주세요.</p>
    </main>
  );
}

function Main({ nickname, onSignOut }) {
  const { isPC, toggle } = useDevice();
  const now = useNow();
  const [records, setRecords] = useState([]); // 숨긴(지운) 기록까지 모두 — 규칙 계산용
  const [pet, setPet] = useState(null); // null이면 아직 펫이 없음 (새 친구 맞이하기)
  const [loaded, setLoaded] = useState(false);
  const [hall, setHall] = useState([]); // 명예의 전당
  const [loadError, setLoadError] = useState('');
  const [syncNote, setSyncNote] = useState(''); // 처음 이후 다시 불러오기에 실패했을 때 안내
  const [typeFilter, setTypeFilter] = useState('전체');
  const [form, setForm] = useState(null); // { mode: 'new', elapsedMs } | { mode: 'edit', record }
  const [reaction, setReaction] = useState(null); // { text, id }
  const [notes, setNotes] = useState([]);
  const [unsavedPet, setUnsavedPet] = useState(null); // 저장에 실패한 펫 상태 (다시 저장 대기)
  const [result, setResult] = useState(null); // 기록 저장 뒤 결과 팝업 내용

  // 저장과 불러오기가 겹칠 때 오래된 불러오기 결과로 방금 저장한 내용을 덮어쓰지 않도록
  const writes = useRef(0); // 진행 중인 저장 수
  const writeVersion = useRef(0); // 저장을 시작할 때마다 +1
  const loadSeq = useRef(0);
  const loadedRef = useRef(false);
  const unsavedRef = useRef(null);
  const namingRef = useRef(false);
  const popupRef = useRef(false); // 결과 팝업이 떠 있는지

  async function writing(fn) {
    writes.current += 1;
    writeVersion.current += 1;
    try {
      return await fn();
    } finally {
      writes.current -= 1;
    }
  }

  const load = useCallback(async () => {
    const seq = ++loadSeq.current;
    const version = writeVersion.current;
    try {
      const [recs, savedPet, savedHall] = await Promise.all([
        storage.getRecords(),
        storage.getPet(),
        // 명예의 전당을 못 불러와도(예: Supabase에 새 테이블을 아직 안 만듦) 나머지는 동작하게
        storage.getHallOfFame().catch((e) => {
          console.warn('명예의 전당을 불러오지 못했어요', e);
          return [];
        }),
      ]);
      // 더 새로운 불러오기가 있었거나, 불러오는 동안 저장이 있었으면 이 결과는 버림
      if (seq !== loadSeq.current || version !== writeVersion.current || writes.current > 0) return;
      setRecords(recs);
      setHall(savedHall);
      if (!unsavedRef.current) setPet(savedPet); // 저장 못 한 펫이 있으면 화면의 펫을 유지
      loadedRef.current = true;
      setLoaded(true);
      setLoadError('');
      setSyncNote('');
    } catch (e) {
      if (seq !== loadSeq.current) return; // 더 새로운 불러오기가 있으면 이 오류는 무시
      // 처음 불러오기만 오류 화면, 이미 화면이 있으면 안내 문구만
      if (loadedRef.current) setSyncNote('인터넷이 잠깐 끊겼나 봐요. 조금 뒤에 다시 열어 주세요.');
      else setLoadError(`펫을 불러오지 못했어요. 인터넷을 확인하고 다시 눌러 봐요. (${e.message})`);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // 휴대폰에서 앱을 다시 열었을 때 PC에서 입력한 최신 기록을 가져옵니다.
  useEffect(() => {
    const onVisible = () => document.visibilityState === 'visible' && load();
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [load]);

  // 한컴타자 탭에서 돌아오면 기록 입력 창 열기 (PC에서만, 이름 짓기·결과 팝업이 떠 있지 않을 때)
  const onReturn = useCallback((elapsedMs) => {
    if (namingRef.current || popupRef.current) return;
    setForm((f) => f ?? { mode: 'new', elapsedMs });
  }, []);
  usePracticeReturn(onReturn, isPC);

  useEffect(() => {
    if (!reaction) return undefined;
    const t = setTimeout(() => setReaction(null), 4000);
    return () => clearTimeout(t);
  }, [reaction]);

  const say = (text) => setReaction({ text, id: Date.now() });

  // 펫 저장. 실패하면 화면의 펫은 그대로 두고 "다시 저장" 버튼을 보여 줘요.
  async function persistPet(next) {
    try {
      await writing(() => storage.savePet(next));
      unsavedRef.current = null;
      setUnsavedPet(null);
    } catch (e) {
      unsavedRef.current = next;
      setUnsavedPet(next);
      console.warn('펫 저장 실패', e);
    }
  }

  async function handleAdd(values) {
    const elapsedMs = form.elapsedMs ?? null;
    const at = new Date();
    const { xp, notes: rewardNotes } = calcReward(values, records, elapsedMs, at);
    // 기록 저장이 실패하면 여기서 멈추고 입력 창에 오류가 보여요 (아무것도 저장되지 않음)
    const saved = await writing(() => storage.addRecord({
      ...values, date: at.toISOString(), xpGained: xp, practiceMs: elapsedMs,
    }));

    // 여기부터는 기록이 저장됨: 창을 닫고, 펫 저장이 실패해도 기록을 다시 저장하지 않아요
    const fedPet = feedPet(pet, xp, at.getTime());
    const nextRecords = [saved, ...records];
    const res = buildResult({
      petBefore: pet, petAfter: fedPet, record: saved, xp, notes: rewardNotes, records: nextRecords, elapsedMs, now: at,
    });
    setRecords((list) => [saved, ...list]);
    setPet(fedPet);
    say(res.title);
    setNotes(rewardNotes);
    setResult(res); // 결과 팝업: 펫 상태 변화와 다음 연습 제안
    clearPractice();
    setForm(null);
    if (xp > 0) await persistPet(fedPet);
  }

  // 새 친구 맞이하기: 동물은 무작위 (명예의 전당에 아직 없는 동물이 먼저)
  async function handleStart() {
    const saved = await writing(() => storage.savePet(createPet(pickRandomSpecies(hall))));
    setPet(saved);
    setNotes([]);
  }

  // 알(선물 상자)에서 나온 뒤 이름 짓기
  async function handleName(name) {
    const saved = await writing(() => storage.savePet({ ...pet, name }));
    setPet(saved);
    // 이름을 짓는 동안 한컴타자에서 돌아왔다면, 이름을 지은 뒤 기록 입력 창을 열어요
    const elapsedMs = getPracticeElapsed();
    if (isPC && elapsedMs !== null) setForm((f) => f ?? { mode: 'new', elapsedMs });
  }

  // 다 자란 펫을 명예의 전당에 올리고, 새 친구 맞이하기 화면으로.
  // 앞에서 올리기만 성공하고 펫 정리가 실패했다면, 다시 눌러도 두 번 올라가지 않아요.
  async function handleRetire() {
    try {
      const started = new Date(pet.createdAt).getTime();
      const already = hall.find((h) => new Date(h.startedAt).getTime() === started);
      const saved = already ?? await writing(() => storage.addToHallOfFame(makeHallEntry(pet, visibleRecords(records))));
      if (!already) setHall((list) => [saved, ...list]);
      await writing(() => storage.clearPet());
      unsavedRef.current = null;
      setUnsavedPet(null);
      setReaction(null);
      setNotes([]);
      setPet(null);
    } catch (e) {
      setNotes([`명예의 전당에 올리지 못했어요. 인터넷을 확인하고 다시 해 봐요. (${e.message})`]);
    }
  }

  // 기록 수정: 저장 후 10분 안에는 종류·타수·정확도를 고치고 경험치를 다시 계산,
  // 그 뒤에는 메모만 고칠 수 있어요 (보상 받은 뒤 숫자를 부풀리지 못하게)
  async function handleEdit(values) {
    const rec = form.record;
    if (!canEditNumbers(rec)) {
      const updated = await writing(() => storage.updateRecord(rec.id, { memo: values.memo }));
      setRecords((list) => list.map((r) => (r.id === updated.id ? updated : r)));
      setForm(null);
      return;
    }
    const at = new Date(rec.date);
    const prior = records.filter((r) => r.id !== rec.id && new Date(r.date) < at);
    const { xp } = calcReward(values, prior, rec.practiceMs ?? null, at);
    const delta = xp - (rec.xpGained || 0);
    const updated = await writing(() => storage.updateRecord(rec.id, { ...values, xpGained: xp }));
    setRecords((list) => list.map((r) => (r.id === updated.id ? updated : r)));
    setForm(null);
    if (delta !== 0) {
      const next = { ...pet, xp: Math.max(0, pet.xp + delta) };
      setPet(next);
      setNotes([delta > 0 ? `고쳐서 XP +${delta}` : `고쳐서 XP -${-delta}`]);
      await persistPet(next);
    }
  }

  // 지우기: 실제로 지우지 않고 숨겨요 (보상 횟수·최고 기록 계산에는 남아서, 지웠다 다시 넣어 보상을 또 받을 수 없어요)
  async function handleDelete(id) {
    try {
      await writing(() => storage.updateRecord(id, { hidden: true }));
      setRecords((list) => list.map((r) => (r.id === id ? { ...r, hidden: true } : r)));
    } catch (e) {
      setNotes([`지우지 못했어요. 인터넷을 확인하고 다시 해 봐요. (${e.message})`]);
    }
  }

  function closeForm() {
    if (form?.mode === 'new') clearPractice();
    setForm(null);
  }

  const visible = useMemo(() => visibleRecords(records), [records]);
  const filtered = useMemo(() => filterByType(visible, typeFilter), [visible, typeFilter]);
  const streakDays = useMemo(() => practiceStreak(records, now), [records, now]);
  const progress = useMemo(() => getProgress(records), [records]);
  const rewardsLeft = Math.max(0, DAILY_REWARD_LIMIT - rewardedToday(records, now));
  const naming = Boolean(pet && !pet.name && getPetStage(pet).key !== 'egg');
  namingRef.current = naming;
  popupRef.current = Boolean(result);

  if (loadError) {
    return (
      <main className="loading">
        <p>{loadError}</p>
        <button type="button" className="btn btn-primary" onClick={load}>다시 시도</button>
      </main>
    );
  }
  if (!loaded) return <p className="loading">펫을 깨우는 중…</p>;
  if (!pet) return <PetPicker onStart={handleStart} hall={hall} owner={ownerLabel(nickname)} />;

  return (
    <div className={isPC ? 'app app--pc' : 'app app--mobile'}>
      <header className="topbar">
        <div className="brand">
          <h1 className="logo title-balloon">타닥펫</h1>
          {ownerLabel(nickname) && <span className="owner">👤 {ownerLabel(nickname)}</span>}
        </div>
        <div className="topbar-right">
          {streakDays > 0 && <span className="streak">🔥 {streakDays}일 연속</span>}
          <button type="button" className="link-btn" onClick={toggle}>
            {isPC ? '모바일 화면으로' : 'PC 화면으로'}
          </button>
          {onSignOut && (
            <button type="button" className="link-btn" onClick={onSignOut}>로그아웃</button>
          )}
        </div>
      </header>

      {isDemoMode && (
        <p className="demo-note">개발용 체험 모드예요. 기록이 이 브라우저에만 저장돼요. (배포한 앱에는 나오지 않아요)</p>
      )}
      {syncNote && <p className="sync-note" role="status">{syncNote}</p>}

      <div className="layout">
        <aside className="side">
          {/* 1분마다 다시 그려지고(useNow), 그릴 때마다 지금 시각으로 배부름을 계산해요 */}
          <PetDevice pet={pet} reaction={reaction} now={Date.now()} />
          {unsavedPet && (
            <div className="sync-note" role="alert">
              <span>펫을 저장하지 못했어요. 인터넷을 확인하고 "다시 저장"을 눌러요.</span>
              <button type="button" className="btn btn-quiet" onClick={() => persistPet(unsavedPet)}>다시 저장</button>
            </div>
          )}
          {isFullyGrown(pet) && <RetireCard pet={pet} onRetire={handleRetire} canRetire={isPC} />}
          {notes.length > 0 && (
            <ul className="notes" aria-live="polite">
              {notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          )}
          {isPC ? (
            <PracticePanel
              rewardsLeft={rewardsLeft}
              onManualEntry={() => !naming && !result && setForm({ mode: 'new', elapsedMs: getPracticeElapsed() })}
            />
          ) : (
            <p className="mobile-note">결과는 PC에서 적어요.</p>
          )}
          <SkillPath progress={progress} />
          <HallOfFame hall={hall} />
        </aside>

        <main className="content">
          <nav className="type-tabs" aria-label="연습 종류">
            {['전체', ...PRACTICE_TYPES].map((t) => (
              <button
                key={t}
                type="button"
                className={t === typeFilter ? 'tab active' : 'tab'}
                aria-pressed={t === typeFilter}
                onClick={() => setTypeFilter(t)}
              >
                {t}
              </button>
            ))}
          </nav>

          {visible.length === 0 ? (
            <div className="empty-state">
              <h2>아직 기록이 없어요</h2>
              <p>
                {isPC
                  ? '연습하고 결과를 적으면 펫이 자라요.'
                  : 'PC에서 결과를 적으면 여기서도 보여요.'}
              </p>
              {import.meta.env.DEV && isDemoMode && records.length === 0 && <DemoSeedButton pet={pet} onDone={load} />}
            </div>
          ) : (
            <>
              <Summary records={filtered} streakDays={streakDays} />
              <SpeedChart records={filtered} width={isPC ? 640 : 360} />
              <RecordList
                records={filtered}
                editable={isPC}
                onEdit={(record) => setForm({ mode: 'edit', record })}
                onDelete={handleDelete}
              />
            </>
          )}
        </main>
      </div>

      {/* 개발 중(npm run dev) 체험 모드에서만 테스트 도구 표시 */}
      {import.meta.env.DEV && isDemoMode && <DevPanel pet={pet} onChange={load} />}

      {/* 기록 저장 뒤 결과 팝업. 닫으면, 알에서 나온 경우 이름 짓기 창이 이어서 떠요 */}
      {result && <ResultDialog result={result} onClose={() => setResult(null)} />}

      {/* 정체가 드러났는데 아직 이름이 없으면 이름 짓기 (이 동안에는 기록 입력 창을 열지 않아요) */}
      {naming && !result && <NameDialog pet={pet} onSave={handleName} />}

      {form && isPC && !naming && !result && (
        <RecordForm
          mode={form.mode}
          initial={form.record}
          elapsedMs={form.elapsedMs}
          records={records}
          onSubmit={form.mode === 'new' ? handleAdd : handleEdit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
