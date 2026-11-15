create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default 'Student',
  college text not null default '',
  department text not null default '',
  year_of_study text not null default '',
  bio text not null default '',
  skills text[] not null default '{}',
  soft_skills text[] not null default '{}',
  interests text[] not null default '{}',
  languages text[] not null default '{}',
  github text not null default '',
  linkedin text not null default '',
  portfolio text not null default '',
  availability text not null default 'Available'
    check (availability in ('Available', 'Busy', 'Open to discuss')),
  avatar text not null default '',
  role text not null default 'student'
    check (role in ('student', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  description text not null default '',
  category text not null default 'Events',
  eligibility text not null default '',
  deadline date,
  location text not null default '',
  application_link text not null default '',
  is_published boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  cover_letter text not null default '',
  status text not null default 'submitted'
    check (status in ('submitted', 'reviewing', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (opportunity_id, student_id)
);

create index if not exists applications_student_created_idx
  on public.applications (student_id, created_at desc);
create index if not exists applications_opportunity_idx
  on public.applications (opportunity_id);
create index if not exists opportunities_published_deadline_idx
  on public.opportunities (is_published, deadline);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, college, department, year_of_study)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), 'Student'),
    coalesce(new.raw_user_meta_data ->> 'college', ''),
    coalesce(new.raw_user_meta_data ->> 'department', ''),
    coalesce(new.raw_user_meta_data ->> 'year_of_study', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
    and (select auth.uid()) = old.id
    and not public.is_admin() then
    raise exception 'Only an administrator can change profile roles';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role
  before update on public.profiles
  for each row execute procedure public.protect_profile_role();

drop trigger if exists opportunities_set_updated_at on public.opportunities;
create trigger opportunities_set_updated_at
  before update on public.opportunities
  for each row execute procedure public.set_updated_at();

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
  before update on public.applications
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.applications enable row level security;

grant execute on function public.is_admin() to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.opportunities to anon, authenticated;
grant insert, update, delete on public.opportunities to authenticated;
grant select, insert, update on public.applications to authenticated;

drop policy if exists "Profiles visible to signed-in students" on public.profiles;
create policy "Profiles visible to signed-in students"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "Students update own profile" on public.profiles;
create policy "Students update own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

drop policy if exists "Admins update profiles" on public.profiles;
create policy "Admins update profiles"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Published opportunities are visible" on public.opportunities;
create policy "Published opportunities are visible"
  on public.opportunities for select
  to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "Admins add opportunities" on public.opportunities;
create policy "Admins add opportunities"
  on public.opportunities for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins edit opportunities" on public.opportunities;
create policy "Admins edit opportunities"
  on public.opportunities for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete opportunities" on public.opportunities;
create policy "Admins delete opportunities"
  on public.opportunities for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Students view own applications and admins view all" on public.applications;
create policy "Students view own applications and admins view all"
  on public.applications for select
  to authenticated
  using (student_id = (select auth.uid()) or public.is_admin());

drop policy if exists "Students apply for published opportunities" on public.applications;
create policy "Students apply for published opportunities"
  on public.applications for insert
  to authenticated
  with check (
    student_id = (select auth.uid())
    and status = 'submitted'
    and exists (
      select 1
      from public.opportunities
      where id = opportunity_id
        and is_published
    )
  );

drop policy if exists "Admins update application status" on public.applications;
create policy "Admins update application status"
  on public.applications for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- After registering the account that should administer the site, run this once
-- in the Supabase SQL Editor, replacing the email with that account's email:
-- update public.profiles
-- set role = 'admin'
-- where id = (select id from auth.users where email = 'admin@example.edu');
