-- Uruchom raz w SQL Editor własnego projektu Supabase.
create table if not exists public.englishflow_events (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  constraint payload_id_matches check (payload->>'id' = id::text)
);
alter table public.englishflow_events enable row level security;
create policy "Read own sessions" on public.englishflow_events for select to authenticated using ((select auth.uid()) = user_id);
create policy "Append own sessions" on public.englishflow_events for insert to authenticated with check ((select auth.uid()) = user_id);
grant select, insert on public.englishflow_events to authenticated;
create index if not exists englishflow_events_user_idx on public.englishflow_events(user_id);
-- Brak polityki UPDATE: sesje są niezmienne; ponowienia ignorują istniejące UUID.
