-- Uruchom raz w SQL Editor własnego projektu Supabase.
create table if not exists public.englishflow_events (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  constraint payload_id_matches check (payload->>'id' = id::text)
);
alter table public.englishflow_events enable row level security;
drop policy if exists "Read own sessions" on public.englishflow_events;
drop policy if exists "Append own sessions" on public.englishflow_events;
create policy "Read own sessions" on public.englishflow_events for select to authenticated using ((select auth.uid()) = user_id);
create policy "Append own sessions" on public.englishflow_events for insert to authenticated with check ((select auth.uid()) = user_id);
grant select, insert on public.englishflow_events to authenticated;
create index if not exists englishflow_events_user_idx on public.englishflow_events(user_id);
-- Brak polityki UPDATE: sesje są niezmienne; ponowienia ignorują istniejące UUID.

create table if not exists public.englishflow_documents (
 user_id uuid not null references auth.users(id) on delete cascade,
 item_key text not null,
 payload jsonb,
 version_ms bigint not null,
 revision uuid not null,
 primary key(user_id,item_key),
 constraint valid_document_key check (length(item_key) between 1 and 240)
);
alter table public.englishflow_documents enable row level security;
drop policy if exists "Own documents select" on public.englishflow_documents;
drop policy if exists "Own documents insert" on public.englishflow_documents;
drop policy if exists "Own documents update" on public.englishflow_documents;
create policy "Own documents select" on public.englishflow_documents for select to authenticated using ((select auth.uid())=user_id);
create policy "Own documents insert" on public.englishflow_documents for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Own documents update" on public.englishflow_documents for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
grant select,insert,update on public.englishflow_documents to authenticated;
create or replace function public.merge_englishflow_documents(records jsonb) returns void
language sql security invoker set search_path = public as $$
 insert into public.englishflow_documents(user_id,item_key,payload,version_ms,revision)
 select auth.uid(),item->>'item_key',item->'payload',(item->>'version_ms')::bigint,(item->>'revision')::uuid
 from jsonb_array_elements(records) as item
 on conflict(user_id,item_key) do update
 set payload=excluded.payload,version_ms=excluded.version_ms,revision=excluded.revision
 where (excluded.version_ms,excluded.revision)>(englishflow_documents.version_ms,englishflow_documents.revision);
$$;
revoke all on function public.merge_englishflow_documents(jsonb) from public;
grant execute on function public.merge_englishflow_documents(jsonb) to authenticated;
