// 닉네임 + 비밀번호로 시작하기 / 불러오기. Supabase 모드에서만 쓰입니다.
// PC에서 만든 닉네임과 비밀번호를 휴대폰에서 넣으면 같은 펫과 기록을 불러와요.
import { useState } from 'react';
import { supabase } from '../storage/index.js';
import { MIN_PASSWORD, NICKNAME_RULE } from '../config.js';
import { friendlyAuthError, nicknameToEmail } from '../lib/account.js';

export default function Login() {
  const [mode, setMode] = useState('signin'); // signin(불러오기) | signup(처음 시작)
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function switchMode(next) {
    setMode(next);
    setError('');
    setPassword('');
    setPassword2('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nick = nickname.trim();
    if (!NICKNAME_RULE.test(nick)) {
      setError('닉네임은 한글·영어·숫자로 2~10글자예요. (띄어쓰기·기호는 안 돼요)');
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`비밀번호는 ${MIN_PASSWORD}글자 이상으로 정해요.`);
      return;
    }
    if (mode === 'signup' && password !== password2) {
      setError('두 비밀번호가 서로 달라요. 똑같이 적어요.');
      return;
    }
    setBusy(true);
    setError('');
    const email = nicknameToEmail(nick);
    const { data, error: err } = mode === 'signup'
      ? await supabase.auth.signUp({ email, password, options: { data: { nickname: nick } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) {
      setError(friendlyAuthError(err, mode));
    } else if (mode === 'signup' && !data.session) {
      // Supabase에서 "Confirm email"이 켜져 있으면 바로 로그인되지 않아요
      setError('지금은 시작할 수 없어요. 선생님이나 부모님께 알려 주세요. (관리자: Supabase > Authentication > Email 에서 Confirm email 을 꺼 주세요)');
    }
    // 성공하면 App 이 로그인 상태를 감지해 화면을 바꿉니다
  }

  return (
    <main className="login">
      <div className="login-card">
        <h1 className="logo">타닥펫</h1>
        <p>PC와 휴대폰에서 같은 펫을 만나요.</p>

        <div className="login-tabs" role="tablist" aria-label="시작 방법">
          <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'tab active' : 'tab'} onClick={() => switchMode('signin')}>
            불러오기
          </button>
          <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'tab active' : 'tab'} onClick={() => switchMode('signup')}>
            처음 시작
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>닉네임</span>
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={10} autoComplete="username" placeholder="한글·영어·숫자 2~10글자" required />
          </label>
          <label className="field">
            <span>비밀번호</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder={`${MIN_PASSWORD}글자 이상`} required />
          </label>
          {mode === 'signup' && (
            <label className="field">
              <span>비밀번호 한 번 더</span>
              <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} autoComplete="new-password" required />
            </label>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-primary btn-big" type="submit" disabled={busy}>
            {busy ? '잠시만요…' : mode === 'signup' ? '닉네임 만들고 시작하기' : '내 펫 불러오기'}
          </button>
        </form>
        {mode === 'signup' && (
          <p className="login-hint">비밀번호는 어른과 함께 적어 두세요.</p>
        )}
      </div>
    </main>
  );
}
