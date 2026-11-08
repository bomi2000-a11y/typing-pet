// 타닥펫 시뮬레이터 (어른·개발자용): 앱의 규칙 코드를 그대로 써서 연습 습관 20가지를 90일씩 돌리고,
// 성장 기간·배부름 상태 비율·졸업 시점을 보여 주며 규칙 위반을 찾아요.
// 실행: npm run simulate   (규칙 숫자를 config.js 에서 바꾼 뒤 결과를 비교해 보세요)
import { calcReward } from '../src/lib/reward.js';
import { getProgress } from '../src/lib/progress.js';
import { buildResult } from '../src/lib/advice.js';
import { createPet, feedPet, currentFullness, getMood, getStage, pickRandomSpecies } from '../src/lib/pet.js';
import { isFullyGrown, makeHallEntry } from '../src/lib/hall.js';
import { dateKey, rewardedToday, lowAccuracyToday, practiceStreakBefore, practiceStreak, visibleRecords } from '../src/lib/records.js';
import { PRACTICE_TYPES, MIN_ACCURACY, DAILY_REWARD_LIMIT, LOW_ACCURACY_DAILY, SPACED_HOURS } from '../src/config.js';

const FACTOR={'자리 연습':1.1,'낱말 연습':1.0,'짧은 글 연습':0.95,'긴 글 연습':0.9,'필사':0.85};
const H=3600e3;
const expectedMood = (h) => h < 3 ? 'happy' : h < 24 ? 'peckish' : h < 48 ? 'ok' : h < 72 ? 'hungry' : 'sad'; // 경계가 되면 다음 단계

function run(sc) {
  let seed=sc.seed||7; const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const issues=[]; const bad=(m)=>{ if (issues.length<12) issues.push(m); else issues.count=(issues.count||12)+1; };
  const start=new Date(2026,0,5,0,0);  // 월요일
  let recs=[]; let pet=createPet(pickRandomSpecies([], rnd)); pet={...pet, createdAt:start.toISOString(), lastFedAt:start.toISOString()};
  const hall=[]; const reach={}; const daily=[]; const moodHours={}; let lastRec=-1; let gradSeen=new Set(); let recIdx=0;
  let firstBonusDays=new Set(); const notesCount={};
  for (let d=0; d<(sc.days||90); d++) {
    const dayStart=new Date(start.getTime()+d*24*H);
    const times=(sc.sessions(d, rnd, dayStart)||[]).sort((a,b)=>a-b);
    let dayXp=0;
    // 시간 순서로: 1시간 단위 배부름 검사 + 연습
    let ti=0;
    for (let h=0; h<24; h++) {
      const tHour=dayStart.getTime()+h*H;
      while (ti<times.length && dayStart.getTime()+times[ti]*H < tHour+H) {
        const at=new Date(dayStart.getTime()+times[ti]*H); ti++;
        const skill=Math.min(sc.cap||300,(sc.start||110)+(sc.growth??1.5)*d);
        let type=getProgress(recs).recommended;
        if (sc.type) type=sc.type(type, rnd, recs);
        const speed=Math.max(1,Math.round(skill*FACTOR[type]*(0.93+rnd()*0.14)));
        const accuracy=Math.min(100,Math.max(0,Math.round(sc.acc(rnd))));
        const elapsed=sc.elapsed?sc.elapsed(rnd):10*60e3;
        // 규칙 확인용 '전' 상태
        const properBefore=rewardedToday(recs,at), lowBefore=lowAccuracyToday(recs,at);
        const gradBefore=getProgress(recs);
        const r=calcReward({type,speed,accuracy},recs,elapsed,at);
        const rec={type,speed,accuracy,date:at.toISOString(),xpGained:r.xp,practiceMs:elapsed};
        const petBefore=pet; const fed=feedPet(pet,r.xp,at.getTime());
        if (sc.hideFirstOfDay && properBefore===0 && accuracy>=MIN_ACCURACY) rec.hidden=true; // 그날 첫 기록을 지움(숨김)
        recs=[rec,...recs];
        const res=buildResult({petBefore,petAfter:fed,record:rec,xp:r.xp,notes:r.notes,records:recs,elapsedMs:elapsed,now:at});
        pet=fed; dayXp+=r.xp; recIdx++;
        r.notes.forEach(n=>{ const k=n.replace(/[0-9]+/g,'n'); notesCount[k]=(notesCount[k]||0)+1; });
        const when=`${d+1}일째 ${at.getHours()}:${String(at.getMinutes()).padStart(2,'0')}`;
        // ---- 보상 규칙 ----
        if (!Number.isInteger(r.xp) || r.xp<0) bad(`${when} XP가 이상함: ${r.xp}`);
        if (accuracy<MIN_ACCURACY) {
          if (properBefore>=DAILY_REWARD_LIMIT) { if (r.xp!==0) bad(`${when} 하루 한도 뒤 정확도 낮은 기록에 XP ${r.xp}`); }
          else if (lowBefore>=LOW_ACCURACY_DAILY ? r.xp!==0 : r.xp!==5) bad(`${when} 정확도 낮은 기록 XP ${r.xp} (그날 낮은 기록 ${lowBefore}번째)`);
        } else {
          if (properBefore>=DAILY_REWARD_LIMIT && r.xp!==0) bad(`${when} 하루 ${DAILY_REWARD_LIMIT}번 넘었는데 XP ${r.xp}`);
          if (properBefore<DAILY_REWARD_LIMIT && r.xp<5) bad(`${when} 제대로 했는데 XP ${r.xp}`);
          const hasFirst=r.notes.some(n=>n.includes('오늘 첫 연습'));
          if (properBefore<DAILY_REWARD_LIMIT && hasFirst!==(properBefore===0)) bad(`${when} 오늘 첫 연습 보너스 판단 틀림 (그날 ${properBefore}번째)`);
          if (hasFirst) { const k=dateKey(at); if (firstBonusDays.has(k)) bad(`${when} 오늘 첫 연습 보너스를 하루에 두 번`); firstBonusDays.add(k);
            const st=practiceStreakBefore(recs.slice(1),at)+1; const m=r.notes.find(n=>/일 연속! \+/.test(n));
            if (st>=2 && !m) bad(`${when} ${st}일 연속인데 연속 보너스 없음`);
            if (m && !m.startsWith(`${st}일 연속`)) bad(`${when} 연속 일수 틀림: "${m}" (실제 ${st})`);
            if ((st%7===0)!==r.notes.some(n=>n.includes('🏅'))) bad(`${when} 7일 보너스 판단 틀림 (${st}일 연속)`); }
          const spaced=r.notes.some(n=>n.includes('쉬었다 와서'));
          if (properBefore>0 && properBefore<DAILY_REWARD_LIMIT) {
            const lastToday=Math.max(...recs.slice(1).filter(x=>dateKey(x.date)===dateKey(at)&&x.xpGained>0&&x.accuracy>=MIN_ACCURACY).map(x=>new Date(x.date).getTime()));
            const should=at.getTime()-lastToday>=SPACED_HOURS*H;
            if (spaced!==should) bad(`${when} 쉬었다 오기 보너스 판단 틀림 (간격 ${((at.getTime()-lastToday)/H).toFixed(1)}시간)`);
          } else if (spaced) bad(`${when} 첫 연습인데 쉬었다 오기 보너스`);
        }
        if (r.xp>0 && Math.abs(currentFullness(pet,at.getTime())-100)>1e-9) bad(`${when} 먹이 뒤 배부름이 100이 아님`);
        // ---- 졸업·추천 ----
        const gradAfter=getProgress(recs);
        gradBefore.levels.forEach((l,i)=>{ if (l.graduated && !gradAfter.levels[i].graduated) bad(`${when} ${l.type} 졸업이 풀림`); });
        if (PRACTICE_TYPES.indexOf(gradAfter.recommended)<PRACTICE_TYPES.indexOf(gradBefore.recommended)) bad(`${when} 추천이 쉬운 연습으로 돌아감`);
        gradAfter.levels.forEach(l=>{ if (l.graduated && !gradSeen.has(l.type)) { gradSeen.add(l.type); reach['졸업:'+l.type]=d+1; } });
        // ---- 결과 팝업 ----
        const txt=[res.title,...res.plan,...res.notes].join(' | ');
        if (/undefined|NaN|null|Infinity/.test(txt)) bad(`${when} 팝업 문장에 이상한 값: ${txt}`);
        if (res.plan.length<1 || res.plan.length>3) bad(`${when} 다음엔? 줄 수 ${res.plan.length}`);
        if (res.pet.estimate!==null && (!(res.pet.estimate>0) || res.pet.estimate>999)) bad(`${when} 약 n번 이상: ${res.pet.estimate}`);
        const tg=res.plan.find(p=>p.includes('넘으면 졸업'));
        if (tg) { const m=tg.match(/타수 (\d+), 정확도 (\d+)%/); const goal=gradAfter.levels.find(l=>l.type===gradAfter.recommended).goal; if (m && (+m[1]<goal.speed || +m[2]<goal.accuracy || +m[2]>=100)) bad(`${when} 졸업 목표 숫자 이상: ${tg}`); }
        // ---- 팝업 제목: 배고팠던 정도에 맞는 반응 ----
        if (r.xp>0 && !res.grew) { const hb=getMood(currentFullness(petBefore,at.getTime())).key;
          const want={happy:'냠냠!',peckish:'맛있다!',ok:'와, 밥이다!',hungry:'살았다',sad:'살았다'}[hb];
          if (!res.title.startsWith(want)) bad(`${when} 제목 "${res.title}" (배고픔 ${hb})`); }
        // ---- 위쪽 연속 표시 = 보너스 연속 ----
        const shown=practiceStreak(recs,at); const bonusStreak=rewardedToday(recs,at)>0 ? practiceStreakBefore(recs,at)+1 : practiceStreakBefore(recs,at);
        if (shown!==bonusStreak) bad(`${when} 위쪽 '${shown}일 연속'과 보너스 연속 ${bonusStreak}일이 다름`);
        // ---- 성장·명예의 전당 ----
        const stg=getStage(pet.xp).key; if (!reach[`${hall.length}:${stg}`]) reach[`${hall.length}:${stg}`]=d+1;
        if (isFullyGrown(pet) && sc.retire) {
          const entry=makeHallEntry(pet,visibleRecords(recs),at); hall.push({...entry,id:hall.length});
          const sp=pickRandomSpecies(hall,rnd);
          if (hall.length<5 && hall.some(x=>x.species===sp)) bad(`${when} 아직 안 키운 동물이 있는데 같은 동물이 또 나옴 (${sp})`);
          pet={...createPet(sp), createdAt:at.toISOString(), lastFedAt:at.toISOString(), name:''};
        }
        lastRec=at.getTime();
      }
      // 배부름 = 마지막 먹이 뒤 시간 규칙
      const fedAt=new Date(pet.lastFedAt).getTime(); const hrs=(tHour+30*60e3-fedAt)/H;
      if (hrs>=0) { const m=getMood(currentFullness(pet,tHour+30*60e3)).key; moodHours[m]=(moodHours[m]||0)+1;
        if (pet.fullness===100 && m!==expectedMood(hrs)) bad(`${d+1}일째 ${h}시 반: 마지막 먹이 ${hrs.toFixed(1)}시간 뒤인데 ${m}`); }
    }
    daily.push(dayXp);
  }
  return { issues, reach, daily, moodHours, hall, recs, pet, notesCount };
}

// ---------------- 연습 습관 17가지 ----------------
const acc=(m,s=2)=>(r)=>m+(r()*2-1)*s;
const at=(...hs)=>()=>hs;
const SCENARIOS = [
 ['① 매일 1번 (저녁 7시)', {sessions:at(19), acc:acc(95)}],
 ['② 매일 2번 (점심·저녁)', {sessions:at(12,19), acc:acc(95), growth:2}],
 ['③ 매일 3번 (아침·점심·저녁)', {sessions:at(8,12.5,19), acc:acc(95), growth:2.3}],
 ['④ 매일 3번 몰아서 (19:00·19:10·19:20)', {sessions:at(19,19+1/6,19+2/6), acc:acc(95), growth:2.3}],
 ['⑤ 이틀에 한 번', {sessions:(d)=>d%2===0?[19]:[], acc:acc(95), growth:1}],
 ['⑥ 사흘에 한 번', {sessions:(d)=>d%3===0?[19]:[], acc:acc(95), growth:0.8}],
 ['⑦ 주말만 (토·일 2번씩)', {sessions:(d)=>[5,6].includes(d%7)?[10,16]:[], acc:acc(95), growth:0.8}],
 ['⑧ 평일만 (월~금 1번)', {sessions:(d)=>d%7<5?[17]:[], acc:acc(95), growth:1.3}],
 ['⑨ 1주 열심히 → 2주 쉼 → 다시', {sessions:(d)=>(d>=7&&d<21)?[]:[12,19], acc:acc(95), growth:1.5}],
 ['⑩ 들쭉날쭉 (날마다 60%, 시간 아무 때나)', {sessions:(d,r)=>r()<0.6?Array.from({length:1+Math.floor(r()*3)},()=>7+r()*15):[], acc:acc(94,3)}],
 ['⑪ 자정 근처 (23:50 · 다음 날 00:10)', {sessions:(d)=>d%2===0?[23+50/60]:[1/6], acc:acc(95)}],
 ['⑫ 정확도가 낮은 아이 (80~90%)', {sessions:at(19), acc:acc(85,5)}],
 ['⑬ "결과만 적기"만 쓰는 아이', {sessions:at(19), acc:acc(95), elapsed:()=>null}],
 ['⑭ 아주 잘 치는 아이 (450타)', {sessions:at(19), acc:acc(97,1.5), start:450, growth:0.3, cap:500}],
 ['⑮ 하루 6번 (한도 넘김)', {sessions:at(8,10,12,14,16,18), acc:acc(95), growth:2.5}],
 ['⑯ 실력이 안 느는 아이 (100타 그대로)', {sessions:at(19), acc:acc(95), start:100, growth:0, cap:100}],
 ['⑰ 매일 2번 + 다 키우면 명예의 전당 (5마리)', {sessions:at(12,19), acc:acc(96), growth:2, retire:true, days:120}],
 ['⑱ 지웠다가 다시 입력 (19:00 기록 지우고 19:05 다시)', {sessions:at(19,19+5/60), acc:acc(95), hideFirstOfDay:true}],
 ['⑲ 30초만 하고 돌아오기', {sessions:at(19), acc:acc(95), elapsed:()=>30e3}],
 ['⑳ 3시간 경계 (12:00 → 14:54 → 18:00)', {sessions:at(12,14.9,18), acc:acc(95), growth:2}],
];

// ---------------- 결과 보고 ----------------
let total=0;
for (const [name, sc] of SCENARIOS) {
  const o=run(sc);
  const r=o.reach; const g=(k)=>r[k]??'-';
  const mh=o.moodHours; const tot=Object.values(mh).reduce((a,b)=>a+b,0)||1;
  const pct=(k)=>Math.round((mh[k]||0)/tot*100);
  const avg=(a,b)=>Math.round(o.daily.slice(a,b).reduce((x,y)=>x+y,0)/(b-a));
  console.log(`\n${name}`);
  console.log(`  첫 펫: 아기 ${g('0:baby')}일 · 청소년 ${g('0:teen')}일 · 어른 ${g('0:adult')}일 | 하루 평균 XP: 1주 ${avg(0,7)}, 4주 ${avg(21,28)}, 8주 ${avg(49,56)}`);
  console.log(`  하루 중 상태: 배부름 ${pct('happy')}% · 출출 ${pct('peckish')}% · 보통 ${pct('ok')}% · 배고픔 ${pct('hungry')}% · 굶주림 ${pct('sad')}%`);
  const grads=Object.entries(r).filter(([k])=>k.startsWith('졸업:')).map(([k,v])=>`${k.slice(3)} ${v}일`).join(', ');
  console.log(`  졸업: ${grads||'없음'}${o.hall.length?` | 명예의 전당 ${o.hall.length}마리: ${o.hall.map(h=>h.species).join(', ')}`:''}`);
  if (o.issues.length) { total+=o.issues.length; console.log('  ⚠️ 규칙 위반:'); o.issues.forEach(i=>console.log('     - '+i)); if (o.issues.count) console.log(`     … 모두 ${o.issues.count}건`); }
}
console.log(`\n규칙 위반 합계: ${total}건 이상`);
