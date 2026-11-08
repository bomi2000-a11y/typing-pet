-- Supabase 대시보드 > SQL Editor 에 전체를 붙여넣고 Run 하세요.

-- 1) 타자 기록
create table public.records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  type text not null,
  speed integer not null check (speed between 1 and 1500),
  accuracy integer not null check (accuracy between 0 and 100),
  xp_gained integer not null default 0,
  memo text not null default '',
  hidden boolean not null default false,  -- 지운 기록 (화면에서만 빠지고 보상 계산에는 남음)
  practice_ms integer                      -- 연습 시간(밀리초), 모르면 비움
);

create index records_user_created_idx on public.records (user_id, created_at desc);

alter table public.records enable row level security;

create policy "본인 기록 조회" on public.records
  for select using ((select auth.uid()) = user_id);
create policy "본인 기록 추가" on public.records
  for insert with check ((select auth.uid()) = user_id);
create policy "본인 기록 수정" on public.records
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "본인 기록 삭제" on public.records
  for delete using ((select auth.uid()) = user_id);

-- 2) 펫 상태 (사용자당 1마리)
create table public.pets (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  name text not null default '타닥이',
  species text not null default 'chicken' check (species in ('chicken', 'dog', 'bear', 'dino', 'dragon')),
  xp integer not null default 0,
  fullness integer not null default 80,
  last_fed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.pets enable row level security;

create policy "본인 펫 조회" on public.pets
  for select using ((select auth.uid()) = user_id);
create policy "본인 펫 생성" on public.pets
  for insert with check ((select auth.uid()) = user_id);
create policy "본인 펫 수정" on public.pets
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "본인 펫 삭제" on public.pets
  for delete using ((select auth.uid()) = user_id);

-- 3) 명예의 전당 (다 자란 펫 기록)
create table public.hall_of_fame (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  species text not null,
  xp integer not null,
  started_at timestamptz not null,
  completed_at timestamptz not null default now(),
  record_count integer not null default 0,
  best_speed integer
);

create index hall_of_fame_user_idx on public.hall_of_fame (user_id, completed_at desc);

alter table public.hall_of_fame enable row level security;

create policy "본인 명예의 전당 조회" on public.hall_of_fame
  for select using ((select auth.uid()) = user_id);
create policy "본인 명예의 전당 추가" on public.hall_of_fame
  for insert with check ((select auth.uid()) = user_id);

-- ============================================================
-- 예전 schema.sql 로 이미 테이블을 만들었다면, 위 전체 대신 아래 블록만
-- 맨 앞 "-- " 를 지우고 Run 하세요.
--
-- [동물 종류] 기존 펫은 닭으로 설정됩니다
-- alter table public.pets add column if not exists species text not null default 'chicken';
-- alter table public.pets add constraint pets_species_check check (species in ('chicken', 'dog', 'bear', 'dino', 'dragon'));
--
-- [지운 기록 숨김 · 연습 시간] 버그 수정 때 추가
-- alter table public.records add column if not exists hidden boolean not null default false;
-- alter table public.records add column if not exists practice_ms integer;
--
-- [명예의 전당] 위 "3) 명예의 전당" 부분(create table public.hall_of_fame 부터 끝까지)과 아래 한 줄
-- create policy "본인 펫 삭제" on public.pets for delete using ((select auth.uid()) = user_id);
