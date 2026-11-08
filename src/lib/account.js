// 닉네임 + 비밀번호 로그인 도우미.
// Supabase는 이메일 주소로 계정을 구분하므로, 닉네임을 겹치지 않는 내부용 주소로 바꿔서 씁니다.
// 예) "타닥이" → "ned8380eb8ba5ec9db4@player.tadakpet.app" (메일은 보내지 않아요)
import { ACCOUNT_EMAIL_DOMAIN } from '../config.js';

export function normalizeNickname(nickname) {
  return nickname.trim().toLowerCase();
}

export function nicknameToEmail(nickname) {
  const bytes = new TextEncoder().encode(normalizeNickname(nickname));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `n${hex}@${ACCOUNT_EMAIL_DOMAIN}`;
}

// Supabase 오류 메시지를 이해하기 쉬운 말로
export function friendlyAuthError(error, mode) {
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('already registered') || msg.includes('already exists')) {
    return '이미 있는 닉네임이에요. 내 닉네임이면 "불러오기"를 눌러 비밀번호를 적어요. 아니면 다른 닉네임을 정해요.';
  }
  if (msg.includes('invalid login credentials')) return '닉네임이나 비밀번호가 맞지 않아요. 다시 한번 확인해요.';
  if (msg.includes('password')) return '비밀번호가 너무 쉬워요. 6글자 이상으로 다시 정해요.';
  if (msg.includes('rate limit') || msg.includes('too many')) return '너무 여러 번 눌렀어요. 조금 쉬었다가 다시 해요.';
  if (msg.includes('email') && mode === 'signup') {
    return '지금은 닉네임을 만들 수 없어요. 선생님이나 부모님께 알려 주세요. (관리자: Supabase 이메일 설정과 config.js 의 ACCOUNT_EMAIL_DOMAIN 확인)';
  }
  return `문제가 생겼어요. 잠시 뒤에 다시 해 보고, 계속 안 되면 어른께 알려 주세요. (${error?.message || '알 수 없는 오류'})`;
}
