// 한국어 조사 붙이기: 앞 글자에 받침이 있는지 보고 "으로/로", "이/가"를 골라 줍니다.
// 예) withRo('병아리') → '병아리로', withRo('곰') → '곰으로', withIGa('용') → '용이'

function lastJong(word) {
  if (!word) return 0;
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return 0; // 한글이 아니면 받침 없음으로 처리
  return code % 28; // 0이면 받침 없음, 8이면 ㄹ 받침
}

export function withRo(word) {
  const jong = lastJong(word);
  return word + (jong === 0 || jong === 8 ? '로' : '으로');
}

export function withIGa(word) {
  return word + (lastJong(word) === 0 ? '가' : '이');
}

export function withEunNeun(word) {
  return word + (lastJong(word) === 0 ? '는' : '은');
}

export function withIra(word) {
  return word + (lastJong(word) === 0 ? '라' : '이라');
}
