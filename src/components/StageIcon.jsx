// 펫 단계 모습: 보통은 이모지, 직접 그린 그림(SVG)이 있으면 그림을 보여 줍니다.
// 그림은 글자 크기(1em)에 맞춰 커지므로 이모지와 똑같이 font-size 로 크기를 정하면 됩니다.
//   ART   : 서 있을 때부터 그림인 단계 (stand: 평소, lying: 배고파서 누운 모습) — lib/pet.js 의 art
//   LYING : 평소엔 이모지지만 배고플 때는 눈 감고 엎드린 그림으로 바뀌는 단계 — lib/pet.js 의 lying
// 그림마다 실제로 그려진 범위만 잘라 크기를 맞췄어요 (서 있는 그림은 단계에 맞는 높이 1~1.18em, 누운 그림은 바닥에 그림자).

// 웃으며 달리는 민첩한 그리즐리 베어 (곰 어른)
function Grizzly() {
  return (
    <svg className="art" viewBox="2 14 116 78" width="1.49em" height="1.0em" aria-hidden="true" focusable="false">
      <g stroke="#5c3b1e" strokeWidth="13" strokeLinecap="round" fill="none">
      <path d="M46 60 L27 75"/>
      <path d="M90 58 L109 67"/>
      </g>
      <circle cx="104" cy="45" r="5" fill="#7a4e26"/>
      <ellipse cx="70" cy="53" rx="34" ry="19" fill="#8b5a2b"/>
      <ellipse cx="53" cy="40" rx="19" ry="15" fill="#8b5a2b"/>
      <ellipse cx="72" cy="63" rx="22" ry="6" fill="#a87442"/>
      <g stroke="#7a4e26" strokeWidth="14" strokeLinecap="round" fill="none">
      <path d="M52 62 L40 83"/>
      <path d="M86 61 L98 83"/>
      </g>
      <ellipse cx="38" cy="86" rx="8" ry="4" fill="#4a2f17"/>
      <ellipse cx="100" cy="86" rx="8" ry="4" fill="#4a2f17"/>
      <circle cx="22" cy="25" r="6.5" fill="#8b5a2b"/>
      <circle cx="22" cy="25" r="3.2" fill="#d9b07c"/>
      <circle cx="38" cy="23" r="6.5" fill="#8b5a2b"/>
      <circle cx="38" cy="23" r="3.2" fill="#d9b07c"/>
      <circle cx="31" cy="40" r="17.5" fill="#8b5a2b"/>
      <ellipse cx="17" cy="46" rx="12" ry="9" fill="#d9b07c"/>
      <ellipse cx="9" cy="42.5" rx="4.2" ry="3.2" fill="#2a1a0e"/>
      <path d="M25 36 q4.5 -5.5 9 0" stroke="#2a1a0e" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <circle cx="35" cy="46" r="3.6" fill="#e98f7a" opacity=".75"/>
      <path d="M9 49 Q16 59 26 50 Z" fill="#2a1a0e"/>
      <path d="M13.5 53.5 Q18 57.5 22.5 52.5 Q18 52 13.5 53.5 Z" fill="#e66b6b"/>
    </svg>
  );
}

// 웃으며 달리는 민첩한 그리즐리 베어 — 배고파서 엎드려 누운 모습
function GrizzlyLying() {
  return (
    <svg className="art" viewBox="3.0 55.0 113.0 38.5" width="1.624em" height="0.553em" aria-hidden="true" focusable="false">
      <ellipse cx="104" cy="85" rx="10" ry="4.5" fill="#6e4523"/>
      <circle cx="106" cy="72" r="4.5" fill="#7a4e26"/>
      <ellipse cx="70" cy="76" rx="36" ry="13" fill="#8b5a2b"/>
      <ellipse cx="56" cy="66" rx="17" ry="9" fill="#8b5a2b"/>
      <ellipse cx="72" cy="85" rx="24" ry="4" fill="#a87442"/>
      <ellipse cx="18" cy="87" rx="13" ry="4.5" fill="#6e4523"/>
      <circle cx="26" cy="64" r="5.5" fill="#8b5a2b"/>
      <circle cx="26" cy="64" r="2.7" fill="#d9b07c"/>
      <circle cx="39" cy="63" r="5.5" fill="#8b5a2b"/>
      <circle cx="39" cy="63" r="2.7" fill="#d9b07c"/>
      <circle cx="32" cy="76" r="14" fill="#8b5a2b"/>
      <ellipse cx="22" cy="81" rx="10" ry="6.5" fill="#d9b07c"/>
      <ellipse cx="14" cy="78.5" rx="3.6" ry="2.8" fill="#2a1a0e"/>
      <path d="M28 73 q4 3.5 8 0" stroke="#2a1a0e" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <circle cx="38" cy="80" r="3" fill="#e98f7a" opacity=".7"/>
    </svg>
  );
}

// 원반 놀이하는 강아지 (강아지 청소년)
function Puppy() {
  return (
    <svg className="art" viewBox="6 10 110 82" width="1.34em" height="1.0em" aria-hidden="true" focusable="false">
      <path d="M93 56 Q104 46 101 30" stroke="#e8b47a" strokeWidth="7" fill="none" strokeLinecap="round"/>
      <g stroke="#d9a066" strokeWidth="10" strokeLinecap="round">
      <path d="M64 66 L60 84"/>
      <path d="M90 64 L96 82"/>
      </g>
      <ellipse cx="76" cy="60" rx="22" ry="15" fill="#f2c48d"/>
      <ellipse cx="80" cy="53" rx="9" ry="6" fill="#c98a52"/>
      <ellipse cx="74" cy="67" rx="14" ry="6" fill="#fbe6c8"/>
      <g stroke="#f2c48d" strokeWidth="10" strokeLinecap="round">
      <path d="M58 66 L52 85"/>
      <path d="M84 66 L86 85"/>
      </g>
      <ellipse cx="51" cy="87" rx="6" ry="3.5" fill="#fbe6c8"/>
      <ellipse cx="87" cy="87" rx="6" ry="3.5" fill="#fbe6c8"/>
      <ellipse cx="56" cy="28" rx="8" ry="14" transform="rotate(-28 56 28)" fill="#a8693a"/>
      <circle cx="38" cy="40" r="21" fill="#f2c48d"/>
      <ellipse cx="22" cy="38" rx="8.5" ry="15" transform="rotate(22 22 38)" fill="#a8693a"/>
      <ellipse cx="28" cy="51" rx="12" ry="9" fill="#fbe6c8"/>
      <ellipse cx="19" cy="47" rx="4.6" ry="3.6" fill="#2a1a0e"/>
      <circle cx="36" cy="37" r="4.4" fill="#2a1a0e"/>
      <circle cx="37.4" cy="35.6" r="1.5" fill="#fff"/>
      <path d="M21 54 Q27 61 34 55" stroke="#2a1a0e" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <ellipse cx="28" cy="59.5" rx="3.6" ry="4.6" fill="#ee7b8b"/>
      <circle cx="44" cy="47" r="3.4" fill="#f4a28c" opacity=".8"/>
      <path d="M45 58 Q53 64 59 55" stroke="#e8476a" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <circle cx="52" cy="64.5" r="3.4" fill="#f5c542"/>
    </svg>
  );
}

// 원반 놀이하는 강아지 — 배고파서 엎드려 누운 모습
function PuppyLying() {
  return (
    <svg className="art" viewBox="10.0 51.9 104.0 41.1" width="1.495em" height="0.59em" aria-hidden="true" focusable="false">
      <path d="M94 80 Q108 82 112 76" stroke="#e8b47a" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <ellipse cx="72" cy="78" rx="27" ry="11" fill="#f2c48d"/>
      <ellipse cx="78" cy="72" rx="9" ry="5" fill="#c98a52"/>
      <ellipse cx="98" cy="85" rx="9" ry="4" fill="#f2c48d"/>
      <ellipse cx="24" cy="87" rx="12" ry="4" fill="#fbe6c8"/>
      <ellipse cx="54" cy="66" rx="7" ry="12" transform="rotate(-60 54 66)" fill="#a8693a"/>
      <circle cx="38" cy="73" r="17" fill="#f2c48d"/>
      <ellipse cx="28" cy="77" rx="7" ry="13" transform="rotate(70 28 77)" fill="#a8693a"/>
      <ellipse cx="25" cy="82" rx="10" ry="6.5" fill="#fbe6c8"/>
      <ellipse cx="16" cy="80" rx="4" ry="3" fill="#2a1a0e"/>
      <path d="M33 70 q4 3.5 8 0" stroke="#2a1a0e" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <circle cx="44" cy="78" r="3" fill="#f4a28c" opacity=".8"/>
    </svg>
  );
}

// 앉아 있는 아기 강아지 (공놀이)
function BabyDog() {
  return (
    <svg className="art" viewBox="9.7 15.0 80.7 87.0" width="0.927em" height="1.0em" aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="97" rx="30" ry="3" fill="#000" opacity=".12"/>
      <path d="M70 80 q14 -4 12 -20" stroke="#e8c9a0" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <ellipse cx="33" cy="91" rx="11" ry="6.5" fill="#f0d3ad"/>
      <ellipse cx="67" cy="91" rx="11" ry="6.5" fill="#f0d3ad"/>
      <ellipse cx="50" cy="74" rx="22" ry="20" fill="#f6dfbf"/>
      <ellipse cx="50" cy="79" rx="13" ry="13" fill="#fff6ea"/>
      <ellipse cx="42" cy="84" rx="6.5" ry="10" fill="#f6dfbf"/>
      <ellipse cx="58" cy="84" rx="6.5" ry="10" fill="#f6dfbf"/>
      <ellipse cx="42" cy="93" rx="7.5" ry="4.8" fill="#fff2df"/>
      <ellipse cx="58" cy="93" rx="7.5" ry="4.8" fill="#fff2df"/>
      <path d="M39 93 v2.5 M42 93.5 v2.5 M45 93 v2.5 M55 93 v2.5 M58 93.5 v2.5 M61 93 v2.5" stroke="#d6bb94" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M33 60 Q50 67 67 60" stroke="#3a8fd8" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <circle cx="50" cy="65.5" r="3.4" fill="#f5c542"/>
      <ellipse cx="25" cy="40" rx="9" ry="17" transform="rotate(16 25 40)" fill="#8d5a3b"/>
      <ellipse cx="75" cy="40" rx="9" ry="17" transform="rotate(-16 75 40)" fill="#8d5a3b"/>
      <ellipse cx="50" cy="40" rx="26" ry="23" fill="#f6dfbf"/>
      <ellipse cx="61" cy="36" rx="9.5" ry="8.5" fill="#c98b5a"/>
      <circle cx="40" cy="37" r="4.4" fill="#3b2a20"/>
      <circle cx="41.4" cy="35.6" r="1.5" fill="#fff"/>
      <circle cx="61" cy="37" r="4.4" fill="#3b2a20"/>
      <circle cx="62.4" cy="35.6" r="1.5" fill="#fff"/>
      <ellipse cx="50" cy="50" rx="11.5" ry="8.5" fill="#fff"/>
      <ellipse cx="50" cy="46" rx="4.6" ry="3.4" fill="#3b2a20"/>
      <path d="M44.5 51 q5.5 4.5 11 0" stroke="#3b2a20" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <ellipse cx="50" cy="55" rx="3" ry="3.4" fill="#ee7b8b"/>
      <circle cx="32" cy="47" r="3.4" fill="#f4a28c" opacity=".6"/>
      <circle cx="68" cy="47" r="3.4" fill="#f4a28c" opacity=".6"/>
    </svg>
  );
}

// 앉아 있는 아기 강아지 — 배고파서 엎드려 누운 모습
function BabyDogLying() {
  return (
    <svg className="art" viewBox="13.4 38.5 92.6 43.0" width="1.505em" height="0.699em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <ellipse cx="86" cy="62" rx="13" ry="11" fill="#f0d3ad"/>
      <ellipse cx="66" cy="62" rx="28" ry="14" fill="#f6dfbf"/>
      <ellipse cx="66" cy="70" rx="18" ry="5" fill="#fff6ea"/>
      <path d="M98 66 Q86 78 60 75" stroke="#e8c9a0" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <ellipse cx="92" cy="73" rx="9" ry="4" fill="#fff2df"/>
      <ellipse cx="27" cy="73" rx="11" ry="4.5" fill="#fff2df"/>
      <path d="M47 60 Q52 70 48 74" stroke="#3a8fd8" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <ellipse cx="36" cy="59" rx="18" ry="15" fill="#f6dfbf"/>
      <ellipse cx="42" cy="54" rx="7.5" ry="6.5" fill="#c98b5a"/>
      <ellipse cx="48" cy="56" rx="7.5" ry="14" transform="rotate(-40 48 56)" fill="#8d5a3b"/>
      <ellipse cx="25" cy="65" rx="9.5" ry="7" fill="#fff"/>
      <ellipse cx="19" cy="62" rx="3.6" ry="2.7" fill="#3b2a20"/>
      <path d="M27 56 q3.5 3 7 0 M37 56 q3.5 3 7 0" stroke="#3b2a20" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <circle cx="34" cy="65" r="3" fill="#f4a28c" opacity=".6"/>
    </svg>
  );
}

// 앉아서 꿀을 먹는 주니어 곰 (곰 청소년)
function JuniorBear() {
  return (
    <svg className="art" viewBox="17.0 7.0 66.0 95.0" width="0.82em" height="1.18em" aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="97" rx="30" ry="3" fill="#000" opacity=".12"/>
      <ellipse cx="31" cy="90" rx="12" ry="7.5" fill="#a9714b"/>
      <ellipse cx="69" cy="90" rx="12" ry="7.5" fill="#a9714b"/>
      <ellipse cx="31" cy="91" rx="6" ry="4" fill="#e2b98d"/>
      <ellipse cx="69" cy="91" rx="6" ry="4" fill="#e2b98d"/>
      <ellipse cx="50" cy="72" rx="25" ry="22" fill="#a9714b"/>
      <ellipse cx="50" cy="76" rx="15" ry="15" fill="#e2b98d"/>
      <ellipse cx="34" cy="74" rx="7" ry="13" transform="rotate(-25 34 74)" fill="#96603d"/>
      <ellipse cx="66" cy="74" rx="7" ry="13" transform="rotate(25 66 74)" fill="#96603d"/>
      <circle cx="29" cy="18" r="9" fill="#a9714b"/>
      <circle cx="29" cy="18" r="4.5" fill="#e2b98d"/>
      <circle cx="71" cy="18" r="9" fill="#a9714b"/>
      <circle cx="71" cy="18" r="4.5" fill="#e2b98d"/>
      <circle cx="50" cy="38" r="24" fill="#a9714b"/>
      <path d="M36 35 q4 -5 8 0 M56 35 q4 -5 8 0" stroke="#2a1a10" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
      <ellipse cx="50" cy="48" rx="12.5" ry="9" fill="#e2b98d"/>
      <ellipse cx="50" cy="44" rx="4.8" ry="3.5" fill="#2a1a10"/>
      <path d="M44 50 q6 6 12 0" stroke="#2a1a10" strokeWidth="1.8" fill="#c0392b" strokeLinecap="round"/>
      <path d="M57 51 q2 4 0 6 q-2 -2 0 -6 z" fill="#f6b40e"/>
      <circle cx="33" cy="45" r="3.6" fill="#f08a6a" opacity=".55"/>
      <circle cx="67" cy="45" r="3.6" fill="#f08a6a" opacity=".55"/>
    </svg>
  );
}

// 앉아서 꿀을 먹는 주니어 곰 — 배고파서 엎드려 누운 모습
function JuniorBearLying() {
  return (
    <svg className="art" viewBox="10.0 31.5 97.5 50.0" width="1.584em" height="0.812em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <circle cx="101" cy="53" r="4.5" fill="#a9714b"/>
      <ellipse cx="92" cy="66" rx="12" ry="9" fill="#96603d"/>
      <ellipse cx="68" cy="60" rx="30" ry="15" fill="#a9714b"/>
      <ellipse cx="68" cy="70" rx="20" ry="4.5" fill="#e2b98d"/>
      <ellipse cx="96" cy="72" rx="7" ry="4" fill="#e2b98d"/>
      <ellipse cx="24" cy="72" rx="12" ry="5" fill="#96603d"/>
      <circle cx="30" cy="40" r="6.5" fill="#a9714b"/>
      <circle cx="30" cy="40" r="3.2" fill="#e2b98d"/>
      <circle cx="47" cy="40" r="6.5" fill="#a9714b"/>
      <circle cx="47" cy="40" r="3.2" fill="#e2b98d"/>
      <circle cx="38" cy="56" r="17" fill="#a9714b"/>
      <ellipse cx="28" cy="63" rx="9.5" ry="7" fill="#e2b98d"/>
      <ellipse cx="21" cy="60" rx="3.6" ry="2.7" fill="#2a1a10"/>
      <path d="M30 53 q3.5 3 7 0 M41 54 q3.5 3 7 0" stroke="#2a1a10" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <circle cx="45" cy="62" r="3" fill="#f08a6a" opacity=".55"/>
    </svg>
  );
}

// 날개와 꼬리가 있는 아기 용 (용 청소년)
function BabyDragon() {
  return (
    <svg className="art" viewBox="4.0 2.0 92.0 100.0" width="1.012em" height="1.1em" aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="97" rx="30" ry="3" fill="#000" opacity=".12"/>
      <path d="M64 88 Q88 92 90 74 Q91 66 84 64" stroke="#4caf50" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M80 60 l10 2 l-6 7 z" fill="#2e7d32"/>
      <path d="M33 62 Q12 46 6 60 Q14 58 16 66 Q22 62 28 70 Z" fill="#81c784"/>
      <path d="M67 62 Q88 46 94 60 Q86 58 84 66 Q78 62 72 70 Z" fill="#81c784"/>
      <path d="M30 63 L13 56 M70 63 L87 56" stroke="#4caf50" strokeWidth="1.6"/>
      <ellipse cx="38" cy="92" rx="9.5" ry="6" fill="#43a047"/>
      <ellipse cx="62" cy="92" rx="9.5" ry="6" fill="#43a047"/>
      <path d="M32 96 l-1 2.5 M37 97 v2.5 M42 96.5 l1 2.5 M58 96.5 l-1 2.5 M63 97 v2.5 M68 96 l1 2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
      <ellipse cx="50" cy="73" rx="20" ry="20" fill="#4caf50"/>
      <ellipse cx="50" cy="76" rx="12" ry="14" fill="#fff59d"/>
      <path d="M40 70 h20 M39 77 h22 M41 84 h18" stroke="#e6d36b" strokeWidth="1.6"/>
      <ellipse cx="33" cy="73" rx="5" ry="8.5" transform="rotate(20 33 73)" fill="#43a047"/>
      <ellipse cx="67" cy="73" rx="5" ry="8.5" transform="rotate(-20 67 73)" fill="#43a047"/>
      <path d="M38 20 q-6 -14 4 -16 q-2 8 4 14 z" fill="#f5d76e"/>
      <path d="M62 20 q6 -14 -4 -16 q2 8 -4 14 z" fill="#f5d76e"/>
      <path d="M44 18 l3 -7 l3 7 z M50 17 l3 -7 l3 7 z" fill="#2e7d32"/>
      <ellipse cx="50" cy="38" rx="24" ry="21" fill="#4caf50"/>
      <circle cx="40" cy="35" r="5.2" fill="#1e3d1f"/>
      <circle cx="41.8" cy="33.2" r="1.8" fill="#fff"/>
      <circle cx="60" cy="35" r="5.2" fill="#1e3d1f"/>
      <circle cx="61.8" cy="33.2" r="1.8" fill="#fff"/>
      <ellipse cx="50" cy="48" rx="14" ry="8.5" fill="#81c784"/>
      <circle cx="45" cy="46" r="1.6" fill="#1e3d1f"/>
      <circle cx="55" cy="46" r="1.6" fill="#1e3d1f"/>
      <path d="M44 51 q6 4 12 0" stroke="#1e3d1f" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <circle cx="31" cy="44" r="3.4" fill="#ff8a80" opacity=".5"/>
      <circle cx="69" cy="44" r="3.4" fill="#ff8a80" opacity=".5"/>
    </svg>
  );
}

// 날개와 꼬리가 있는 아기 용 — 배고파서 엎드려 누운 모습
function BabyDragonLying() {
  return (
    <svg className="art" viewBox="13.5 35.0 92.5 46.5" width="1.503em" height="0.756em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <path d="M96 60 Q114 72 86 76 Q62 79 44 75" stroke="#4caf50" strokeWidth="7" fill="none" strokeLinecap="round"/>
      <path d="M44 75 l-8 -4 l2 8 z" fill="#2e7d32"/>
      <ellipse cx="72" cy="59" rx="26" ry="15" fill="#4caf50"/>
      <ellipse cx="72" cy="69" rx="18" ry="4.5" fill="#fff59d"/>
      <path d="M58 47 Q76 30 94 44 Q82 45 74 53 Z" fill="#81c784"/>
      <path d="M62 47 L80 38 M70 50 L88 42" stroke="#4caf50" strokeWidth="1.4"/>
      <path d="M84 47 l3 -6 l3 6 M92 51 l3 -5 l2 6" fill="#2e7d32"/>
      <ellipse cx="94" cy="70" rx="8" ry="4" fill="#43a047"/>
      <ellipse cx="28" cy="73" rx="11" ry="4.5" fill="#43a047"/>
      <path d="M41 49 Q48 38 58 37" stroke="#f5d76e" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="38" cy="60" rx="18" ry="14" fill="#4caf50"/>
      <ellipse cx="25" cy="65" rx="9.5" ry="6.5" fill="#81c784"/>
      <circle cx="19" cy="63" r="1.2" fill="#1e3d1f"/>
      <path d="M32 56 q4 3.5 8 0" stroke="#1e3d1f" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <circle cx="42" cy="64" r="3" fill="#ff8a80" opacity=".5"/>
    </svg>
  );
}

// 안경 쓰고 책을 든 주니어 공룡 (공룡 청소년)
function JuniorTrex() {
  return (
    <svg className="art" viewBox="13.0 11.0 88.0 91.0" width="1.083em" height="1.12em" aria-hidden="true" focusable="false">
      <ellipse cx="54" cy="97" rx="34" ry="3" fill="#000" opacity=".12"/>
      <path d="M62 70 Q86 74 99 92 Q80 91 60 86 Z" fill="#7cb342"/>
      <path d="M78 78 l2 6 M86 82 l2 5" stroke="#4f7a23" strokeWidth="2.4" strokeLinecap="round"/>
      <ellipse cx="44" cy="93" rx="11" ry="4.5" fill="#5f8f2e"/>
      <ellipse cx="62" cy="81" rx="12" ry="13" fill="#6b9e36"/>
      <ellipse cx="60" cy="94" rx="12" ry="4.5" fill="#6b9e36"/>
      <ellipse cx="52" cy="67" rx="19" ry="22" transform="rotate(-8 52 67)" fill="#7cb342"/>
      <ellipse cx="47" cy="72" rx="11" ry="15" fill="#d4e7a6"/>
      <path d="M64 50 l5 5 M68 59 l5 4 M69 69 l5 3" stroke="#4f7a23" strokeWidth="2.6" strokeLinecap="round"/>
      <path d="M27 51 L43 54.5 L59 51 L59 67 L43 70.5 L27 67 Z" fill="#e8476a"/>
      <path d="M29 52.5 L43 55.5 L43 68.5 L29 65.5 Z" fill="#fffdf5"/>
      <path d="M43 55.5 L57 52.5 L57 65.5 L43 68.5 Z" fill="#f4f0e2"/>
      <path d="M32 57 l8 1.7 M32 60.5 l8 1.7 M32 64 l6 1.3 M46 58.7 l8 -1.7 M46 62.2 l8 -1.7 M46 65.7 l6 -1.3" stroke="#b9b3a0" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="27" cy="60" rx="4.5" ry="3.5" fill="#6b9e36"/>
      <ellipse cx="59" cy="58" rx="4.5" ry="3.5" fill="#6b9e36"/>
      <ellipse cx="40" cy="33" rx="25" ry="18" fill="#7cb342"/>
      <path d="M52 18 l4 -5 l3 6 M60 22 l5 -4 l2 6" fill="#4f7a23"/>
      <path d="M17 40 Q30 47 46 42" stroke="#33501a" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M24 42.5 l1.5 3 l1.5 -3 M31 44 l1.5 3 l1.5 -3" fill="#fff"/>
      <circle cx="18" cy="30" r="1.6" fill="#24401a"/>
      <circle cx="31" cy="28" r="6.8" fill="#e3f2fd" opacity=".7" stroke="#2b3a55" strokeWidth="2.4"/>
      <circle cx="47" cy="28" r="6.8" fill="#e3f2fd" opacity=".7" stroke="#2b3a55" strokeWidth="2.4"/>
      <path d="M37.8 27.5 Q39 26 40.2 27.5 M53.8 27 L63 24" stroke="#2b3a55" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <circle cx="31.5" cy="29" r="2.8" fill="#1e2a14"/>
      <circle cx="32.4" cy="28" r="1" fill="#fff"/>
      <circle cx="47.5" cy="29" r="2.8" fill="#1e2a14"/>
      <circle cx="48.4" cy="28" r="1" fill="#fff"/>
      <circle cx="56" cy="38" r="3.4" fill="#ff8a80" opacity=".45"/>
    </svg>
  );
}

// 안경 쓰고 책을 든 주니어 공룡 — 배고파서 엎드려 누운 모습
function JuniorTrexLying() {
  return (
    <svg className="art" viewBox="10.0 36.0 110.0 45.5" width="1.788em" height="0.739em" aria-hidden="true" focusable="false">
      <ellipse cx="62" cy="76" rx="48" ry="3.5" fill="#000" opacity=".12"/>
      <path d="M86 58 Q106 62 118 72 Q100 72 84 70 Z" fill="#7cb342"/>
      <ellipse cx="84" cy="66" rx="12" ry="8.5" fill="#6b9e36"/>
      <ellipse cx="66" cy="63" rx="24" ry="12" fill="#7cb342"/>
      <ellipse cx="63" cy="71" rx="18" ry="3.8" fill="#d4e7a6"/>
      <path d="M60 53 l3 6 M70 52 l3 6 M80 55 l2 5" stroke="#4f7a23" strokeWidth="2.6" strokeLinecap="round"/>
      <path d="M51 55 L68 38 L85 55 L80 57 L68 46 L56 57 Z" fill="#e8476a"/>
      <path d="M55.5 55.5 L68 43 L80.5 55.5" stroke="#fffdf5" strokeWidth="2.6" fill="none" stroke-linejoin="round"/>
      <path d="M60 52 L68 44.5 M64 54 L70 48" stroke="#c7334f" strokeWidth="1" opacity=".5"/>
      <ellipse cx="88" cy="74" rx="8" ry="2.8" fill="#6b9e36"/>
      <ellipse cx="24" cy="73.5" rx="12" ry="3.5" fill="#6b9e36"/>
      <ellipse cx="32" cy="64" rx="20" ry="11" fill="#7cb342"/>
      <path d="M14 68 Q28 72 46 68" stroke="#33501a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="15" cy="60" r="1.4" fill="#24401a"/>
      <circle cx="28" cy="61" r="5.6" fill="#e3f2fd" opacity=".7" stroke="#2b3a55" strokeWidth="2.2"/>
      <circle cx="41" cy="60" r="5.6" fill="#e3f2fd" opacity=".7" stroke="#2b3a55" strokeWidth="2.2"/>
      <path d="M33.6 61 Q34.8 59.6 35.4 60.6 M46.4 59.4 L54 57" stroke="#2b3a55" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M25 61 q3 2.6 6 0 M38 60 q3 2.6 6 0" stroke="#1e2a14" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="48" cy="66" r="2.8" fill="#ff8a80" opacity=".45"/>
    </svg>
  );
}

// 옆으로 누운 알 (닭·공룡·용 첫 단계)
function LieEgg() {
  return (
    <svg className="art" viewBox="14.0 29.7 92.0 52.5" width="1.495em" height="0.853em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <g transform="rotate(-8 60 56)">
      <ellipse cx="60" cy="56" rx="32" ry="20" fill="#f2d2a9"/>
      <ellipse cx="50" cy="47" rx="14" ry="5.5" fill="#fff" opacity=".5"/>
      <circle cx="73" cy="51" r="2.2" fill="#d6a46f"/>
      <circle cx="81" cy="60" r="1.7" fill="#d6a46f"/>
      <circle cx="66" cy="65" r="1.9" fill="#d6a46f"/>
      <circle cx="56" cy="61" r="1.4" fill="#d6a46f"/>
      </g>
    </svg>
  );
}

// 껍데기째 누워 자는 아기 병아리
function LieChickShell() {
  return (
    <svg className="art" viewBox="14.0 41.0 92.1 40.5" width="1.496em" height="0.658em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <path d="M40 72 l-7 3 M44 73 l-5 4" stroke="#ff9800" strokeWidth="2.4" strokeLinecap="round"/>
      <ellipse cx="60" cy="63" rx="24" ry="12.5" fill="#ffd23f"/>
      <ellipse cx="56" cy="60" rx="11" ry="6" transform="rotate(-12 56 60)" fill="#f5b800"/>
      <circle cx="36" cy="60" r="13.5" fill="#ffd94a"/>
      <path d="M26 62 L18 65 L26 68 Z" fill="#ff9800"/>
      <path d="M29 58 q3.5 3 7 0" stroke="#3b2a20" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <circle cx="39" cy="65" r="2.8" fill="#ff8a65" opacity=".55"/>
      <path d="M26 50 L30 44 L33 49 L37 43 L40 49 L44 45 L46 51 Q37 40 26 50 Z" fill="#f6eedd" stroke="#dccaa8" strokeWidth="1.3"/>
      <path d="M68 46 L74 52 L68 58 L74 64 L68 70 L73 76 Q100 78 104 62 Q105 46 86 44 Q76 43 68 46 Z" fill="#f6eedd" stroke="#dccaa8" strokeWidth="1.5"/>
      <ellipse cx="90" cy="54" rx="8" ry="3.5" fill="#fff" opacity=".6"/>
    </svg>
  );
}

// 배 깔고 엎드려 자는 병아리
function LieChick() {
  return (
    <svg className="art" viewBox="14.0 34.0 92.0 47.5" width="1.495em" height="0.772em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <path d="M88 58 l10 -4 l-3 7 l8 1 l-9 5 z" fill="#f5b800"/>
      <path d="M84 70 l12 3 M84 72 l10 5" stroke="#ff9800" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="64" cy="62" rx="28" ry="14" fill="#ffcf33"/>
      <circle cx="38" cy="58" r="16" fill="#ffd94a"/>
      <ellipse cx="68" cy="58" rx="13" ry="7" transform="rotate(-10 68 58)" fill="#f5b800"/>
      <path d="M36 42 q2 -6 6 -4 M34 42 q-3 -5 1 -6" stroke="#f5b800" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <path d="M24 58 L16 62 L25 65 Z" fill="#ff9800"/>
      <path d="M30 54 q4 3.5 8 0" stroke="#3b2a20" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <circle cx="40" cy="63" r="3" fill="#ff8a65" opacity=".55"/>
    </svg>
  );
}

// 바닥에 웅크려 엎드린 닭
function LieHen() {
  return (
    <svg className="art" viewBox="12.0 35.0 102.0 46.5" width="1.657em" height="0.756em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <path d="M88 52 Q104 34 110 48 Q106 42 100 52 Q112 44 112 58 Q104 52 96 62 Z" fill="#fafafa" stroke="#d0d0d0" strokeWidth="1.4"/>
      <ellipse cx="64" cy="61" rx="32" ry="15" fill="#fafafa" stroke="#d6d6d6" strokeWidth="1.4"/>
      <path d="M52 58 Q66 50 82 58 Q70 66 52 58 Z" fill="#ececec" stroke="#d0d0d0" strokeWidth="1.2"/>
      <circle cx="34" cy="56" r="13" fill="#fafafa" stroke="#d6d6d6" strokeWidth="1.4"/>
      <path d="M26 45 q2 -7 6 -3 q2 -7 6 -2 q3 -6 6 0 q-2 4 -6 4 h-10 z" fill="#e53935"/>
      <path d="M22 57 L14 60 L22 62 Z" fill="#ffb300"/>
      <path d="M22 62 q-2 7 3 7 q3 -2 1 -7 z" fill="#e53935"/>
      <path d="M28 53 q4 3.5 8 0" stroke="#3b2a20" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// 조끼를 입은 채 엎드려 자는 듬직한 개
function LieServiceDog() {
  return (
    <svg className="art" viewBox="8.6 36.0 109.4 45.5" width="1.778em" height="0.739em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <path d="M96 66 Q108 70 116 70" stroke="#b07840" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <ellipse cx="86" cy="65" rx="13" ry="10" fill="#c8894a"/>
      <ellipse cx="64" cy="65" rx="30" ry="11" fill="#c8894a"/>
      <ellipse cx="72" cy="58" rx="20" ry="6.5" fill="#3b2a1e"/>
      <path d="M56 54 Q66 50 77 54 L78 72 Q66 75 55 72 Z" fill="#2f80d1"/>
      <path d="M61 53 q5 -8 10 0" stroke="#1d5fa3" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
      <path d="M55.5 62 Q66 64.5 77.5 62" stroke="#ffd54f" strokeWidth="2.6" fill="none"/>
      <ellipse cx="24" cy="74" rx="13" ry="4" fill="#c8894a"/>
      <path d="M38 52 L44 38 L50 54 Z" fill="#3b2a1e"/>
      <ellipse cx="36" cy="64" rx="14" ry="11" fill="#c8894a"/>
      <ellipse cx="22" cy="68" rx="10" ry="6" fill="#b07840"/>
      <ellipse cx="14" cy="66" rx="3.4" ry="2.6" fill="#1e1410"/>
      <path d="M28 61 q4 3.5 8 0" stroke="#1e1410" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// 옆으로 누워 자는 아기 곰
function LieTeddy() {
  return (
    <svg className="art" viewBox="14.0 33.0 96.0 48.5" width="1.56em" height="0.788em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <ellipse cx="98" cy="69" rx="10" ry="6.5" fill="#b8743f"/>
      <ellipse cx="102" cy="69" rx="5" ry="4" fill="#e8bf8f"/>
      <ellipse cx="76" cy="63" rx="24" ry="13" fill="#b8743f"/>
      <ellipse cx="78" cy="66" rx="12" ry="6" fill="#d39a64"/>
      <ellipse cx="58" cy="72" rx="11" ry="5" fill="#a5642f"/>
      <circle cx="27" cy="44" r="7" fill="#b8743f"/>
      <circle cx="27" cy="44" r="3.5" fill="#e8bf8f"/>
      <circle cx="50" cy="42" r="7" fill="#b8743f"/>
      <circle cx="50" cy="42" r="3.5" fill="#e8bf8f"/>
      <circle cx="39" cy="58" r="18" fill="#b8743f"/>
      <ellipse cx="34" cy="65" rx="9.5" ry="7" fill="#e8bf8f"/>
      <ellipse cx="32" cy="62" rx="3.2" ry="2.4" fill="#3b2a20"/>
      <path d="M31 54 q3.5 3 7 0 M42 54 q3.5 3 7 0" stroke="#3b2a20" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M56 56 l8 -6 v14 z M56 56 l-2 9" fill="#f4b400"/>
      <circle cx="56" cy="57" r="3" fill="#f4b400"/>
    </svg>
  );
}

// 바닥에 납작 엎드린 아기 공룡
function LieLizard() {
  return (
    <svg className="art" viewBox="14.0 50.0 99.3 31.5" width="1.614em" height="0.512em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <path d="M82 66 Q104 70 110 60 Q114 52 106 52" stroke="#6cc04a" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <ellipse cx="80" cy="73" rx="7" ry="3" fill="#4f9a33"/>
      <ellipse cx="46" cy="73" rx="7" ry="3" fill="#4f9a33"/>
      <ellipse cx="62" cy="66" rx="24" ry="8.5" fill="#6cc04a"/>
      <ellipse cx="62" cy="70" rx="18" ry="3" fill="#a8dd8a"/>
      <circle cx="56" cy="62" r="2" fill="#4f9a33"/>
      <circle cx="66" cy="61" r="2.4" fill="#4f9a33"/>
      <circle cx="75" cy="63" r="1.8" fill="#4f9a33"/>
      <ellipse cx="72" cy="74" rx="6" ry="2.6" fill="#6cc04a"/>
      <ellipse cx="52" cy="74" rx="6" ry="2.6" fill="#6cc04a"/>
      <ellipse cx="32" cy="67" rx="13" ry="7.5" fill="#6cc04a"/>
      <path d="M27 64 q3.5 3 7 0" stroke="#24401a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="21" cy="66" r="1" fill="#24401a"/>
    </svg>
  );
}

// 머리를 바닥에 대고 엎드린 티라노
function LieTrex() {
  return (
    <svg className="art" viewBox="7.0 48.5 113.0 33.0" width="1.836em" height="0.536em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <path d="M84 56 Q104 60 118 72 Q100 72 84 70 Z" fill="#7cb342"/>
      <ellipse cx="84" cy="66" rx="14" ry="9.5" fill="#6b9e36"/>
      <ellipse cx="64" cy="63" rx="25" ry="12.5" fill="#7cb342"/>
      <ellipse cx="62" cy="71" rx="19" ry="4" fill="#d4e7a6"/>
      <path d="M58 52 l4 8 M68 51 l3 8 M78 53 l2 7 M94 60 l1 6" stroke="#4f7a23" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="88" cy="74" rx="9" ry="3" fill="#6b9e36"/>
      <path d="M46 68 l-5 3" stroke="#6b9e36" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="29" cy="63" rx="20" ry="11.5" fill="#7cb342"/>
      <path d="M11 68 Q26 72 44 68" stroke="#4f7a23" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M16 69 l2 3 l2 -3 M24 70 l2 3 l2 -3 M32 70 l2 3 l2 -3" fill="#fff"/>
      <path d="M28 57 q4 3.5 8 0" stroke="#24401a" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <circle cx="13" cy="59" r="1.4" fill="#24401a"/>
    </svg>
  );
}

// 길게 뻗어 누운 이무기
function LieSnake() {
  return (
    <svg className="art" viewBox="9.0 58.0 109.0 23.5" width="1.771em" height="0.382em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <path d="M102 70 Q110 74 116 69" stroke="#8bc34a" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M102 70 Q90 58 78 68 Q66 78 54 68 Q42 58 32 67" stroke="#8bc34a" strokeWidth="11" fill="none" strokeLinecap="round"/>
      <path d="M100 72 Q90 62 78 71 Q66 80 54 71 Q44 63 34 70" stroke="#d7ef9c" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="90" cy="62" r="2" fill="#5b8f2a"/>
      <circle cx="66" cy="70" r="2.2" fill="#5b8f2a"/>
      <circle cx="46" cy="62" r="2" fill="#5b8f2a"/>
      <ellipse cx="23" cy="68" rx="12" ry="7.5" fill="#8bc34a"/>
      <path d="M18 65 q3.5 3 7 0" stroke="#24401a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="12" cy="68" r="1" fill="#24401a"/>
    </svg>
  );
}

// 땅에 길게 엎드린 용
function LieDragon() {
  return (
    <svg className="art" viewBox="0.0 42.0 123.0 39.5" width="1.999em" height="0.642em" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="76" rx="44" ry="3.5" fill="#000" opacity=".12"/>
      <path d="M106 62 Q114 66 117 58" stroke="#43a047" strokeWidth="6" fill="none" strokeLinecap="round"/>
      <circle cx="117" cy="56" r="4" fill="#f9a825"/>
      <path d="M106 62 Q96 52 84 62 Q72 72 60 62 Q50 54 40 63" stroke="#43a047" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <path d="M104 66 Q96 58 84 66 Q72 76 60 66 Q50 59 42 66" stroke="#c5e1a5" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M94 54 l3 -6 l2 6 M80 58 l3 -6 l2 6 M66 60 l2 -6 l3 6 M54 55 l2 -6 l3 6" fill="#f9a825"/>
      <path d="M62 72 l-3 4 M66 73 l0 4 M90 66 l-2 5 M94 67 l1 4" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round"/>
      <path d="M38 56 l-4 -8 l8 4 l2 -8 l4 8 l6 -4 l-2 9 z" fill="#f9a825"/>
      <path d="M34 58 Q40 48 48 46" stroke="#f5d76e" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <ellipse cx="27" cy="66" rx="15" ry="8.5" fill="#43a047"/>
      <ellipse cx="17" cy="69" rx="7" ry="4.5" fill="#66bb6a"/>
      <circle cx="13" cy="66" r="1.3" fill="#1e3d1f"/>
      <path d="M24 62 q4 3.5 8 0" stroke="#1e3d1f" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M12 70 Q4 72 2 64 M14 64 Q6 58 4 52" stroke="#2e7d32" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// 아기 강아지가 가지고 노는 빨간 고무공 (소품)
function Ball() {
  return (
    <svg className="art" viewBox="0 0 40 40" width="1em" height="1em" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="18" fill="#e8476a" />
      <path d="M4 16 Q20 26 36 16" stroke="#fff" strokeWidth="4" fill="none" />
      <circle cx="13" cy="11" r="4" fill="#fff" opacity=".55" />
    </svg>
  );
}

const ART = {
  'grizzly': { stand: Grizzly, lying: GrizzlyLying },
  'puppy': { stand: Puppy, lying: PuppyLying },
  'baby-dog': { stand: BabyDog, lying: BabyDogLying },
  'junior-bear': { stand: JuniorBear, lying: JuniorBearLying },
  'baby-dragon': { stand: BabyDragon, lying: BabyDragonLying },
  'junior-trex': { stand: JuniorTrex, lying: JuniorTrexLying },
};
const LYING = {
  'egg': LieEgg,
  'chick-shell': LieChickShell,
  'chick': LieChick,
  'hen': LieHen,
  'service-dog': LieServiceDog,
  'teddy': LieTeddy,
  'lizard': LieLizard,
  'trex': LieTrex,
  'snake': LieSnake,
  'dragon': LieDragon,
};
const PROP_ART = { ball: Ball };

function pick(stage, pose) {
  if (pose === 'lying' && stage.lying && LYING[stage.lying]) return LYING[stage.lying];
  const set = stage.art && ART[stage.art];
  return set ? set[pose] || set.stand : null;
}

// 이 자세를 그림으로 그리는지 (그림이면 회전하지 않고 숨 쉬는 동작만, 이모지면 옆으로 눕혀요)
export function hasArt(stage, pose = 'stand') {
  return Boolean(pick(stage, pose));
}

export default function StageIcon({ stage, pose = 'stand' }) {
  const Art = pick(stage, pose);
  return Art ? <Art /> : stage.emoji;
}

// 소품: 이모지 또는 'ball' 처럼 이름이 있는 그림
export function PropIcon({ prop }) {
  const Art = PROP_ART[prop];
  return Art ? <Art /> : prop;
}
