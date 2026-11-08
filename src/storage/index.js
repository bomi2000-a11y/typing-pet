// Supabase 설정(.env)이 있으면 서버 저장, 닉네임 로그인으로 PC·휴대폰이 같은 기록을 봅니다.
// 체험 모드(이 브라우저에만 저장)는 개발할 때(npm run dev)만 쓸 수 있어요.
// 배포한 앱(npm run build)에 Supabase 설정이 없으면 체험 모드로 넘어가지 않고 "설정이 필요해요" 화면을 보여 줘요.
import { createClient } from '@supabase/supabase-js';
import { localAdapter } from './local.js';
import { createSupabaseAdapter } from './supabase.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = url && key ? createClient(url, key) : null;
export const isDemoMode = !supabase && import.meta.env.DEV; // 개발용 체험 모드
export const missingConfig = !supabase && !import.meta.env.DEV; // 배포했는데 서버 설정이 없음
export const storage = supabase ? createSupabaseAdapter(supabase) : localAdapter;
