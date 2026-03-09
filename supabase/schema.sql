create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  department text,
  role text not null default 'teacher' check (role in ('admin', 'teacher')),
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists status text check (status in ('pending', 'approved', 'rejected'));

alter table public.profiles
  alter column status set default 'approved';

update public.profiles
set status = 'approved'
where status is null;

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  teacher_name text not null,
  class_number text not null,
  course_name text not null,
  class_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.class_questions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  question text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes (id) on delete cascade,
  satisfaction integer not null check (satisfaction between 1 and 10),
  recommend integer not null check (recommend between 1 and 10),
  comment text,
  student_name text,
  anonymous boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback_question_answers (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedback (id) on delete cascade,
  class_question_id uuid not null references public.class_questions (id) on delete cascade,
  answer text not null,
  created_at timestamptz not null default now(),
  unique (feedback_id, class_question_id)
);

create index if not exists classes_teacher_id_idx on public.classes (teacher_id);
create index if not exists classes_class_date_idx on public.classes (class_date desc);
create index if not exists class_questions_class_id_idx on public.class_questions (class_id);
create index if not exists feedback_class_id_idx on public.feedback (class_id);
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
create index if not exists feedback_question_answers_feedback_id_idx on public.feedback_question_answers (feedback_id);
create index if not exists feedback_question_answers_class_question_id_idx on public.feedback_question_answers (class_question_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, department, role, status)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    nullif(new.raw_user_meta_data ->> 'department', ''),
    'teacher',
    'pending'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        department = excluded.department;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_user_status()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select status from public.profiles where id = auth.uid()
$$;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_questions enable row level security;
alter table public.feedback enable row level security;
alter table public.feedback_question_answers enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.current_user_role() = 'admin');

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.current_user_role() = 'admin')
with check (id = auth.uid() or public.current_user_role() = 'admin');

drop policy if exists "classes_public_read" on public.classes;
create policy "classes_public_read"
on public.classes
for select
to anon, authenticated
using (true);

drop policy if exists "classes_teacher_insert" on public.classes;
create policy "classes_teacher_insert"
on public.classes
for insert
to authenticated
with check (
  (teacher_id = auth.uid() and public.current_user_status() = 'approved')
  or public.current_user_role() = 'admin'
);

drop policy if exists "classes_teacher_update" on public.classes;
create policy "classes_teacher_update"
on public.classes
for update
to authenticated
using (
  (teacher_id = auth.uid() and public.current_user_status() = 'approved')
  or public.current_user_role() = 'admin'
)
with check (
  (teacher_id = auth.uid() and public.current_user_status() = 'approved')
  or public.current_user_role() = 'admin'
);

drop policy if exists "classes_teacher_delete" on public.classes;
create policy "classes_teacher_delete"
on public.classes
for delete
to authenticated
using (
  (teacher_id = auth.uid() and public.current_user_status() = 'approved')
  or public.current_user_role() = 'admin'
);

drop policy if exists "class_questions_public_read" on public.class_questions;
create policy "class_questions_public_read"
on public.class_questions
for select
to anon, authenticated
using (true);

drop policy if exists "class_questions_teacher_insert" on public.class_questions;
create policy "class_questions_teacher_insert"
on public.class_questions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.classes
    where classes.id = class_questions.class_id
      and (
        (classes.teacher_id = auth.uid() and public.current_user_status() = 'approved')
        or public.current_user_role() = 'admin'
      )
  )
);

drop policy if exists "class_questions_teacher_delete" on public.class_questions;
create policy "class_questions_teacher_delete"
on public.class_questions
for delete
to authenticated
using (
  exists (
    select 1
    from public.classes
    where classes.id = class_questions.class_id
      and (
        (classes.teacher_id = auth.uid() and public.current_user_status() = 'approved')
        or public.current_user_role() = 'admin'
      )
  )
);

drop policy if exists "feedback_teacher_or_admin_read" on public.feedback;
create policy "feedback_teacher_or_admin_read"
on public.feedback
for select
to authenticated
using (
  exists (
    select 1
    from public.classes
    where classes.id = feedback.class_id
      and (classes.teacher_id = auth.uid() or public.current_user_role() = 'admin')
  )
);

drop policy if exists "feedback_public_insert" on public.feedback;
create policy "feedback_public_insert"
on public.feedback
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.classes
    where classes.id = feedback.class_id
  )
);

drop policy if exists "feedback_question_answers_teacher_or_admin_read" on public.feedback_question_answers;
create policy "feedback_question_answers_teacher_or_admin_read"
on public.feedback_question_answers
for select
to authenticated
using (
  exists (
    select 1
    from public.feedback
    join public.classes on classes.id = feedback.class_id
    where feedback.id = feedback_question_answers.feedback_id
      and (classes.teacher_id = auth.uid() or public.current_user_role() = 'admin')
  )
);

drop policy if exists "feedback_question_answers_public_insert" on public.feedback_question_answers;
create policy "feedback_question_answers_public_insert"
on public.feedback_question_answers
for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.feedback
    join public.class_questions on class_questions.class_id = feedback.class_id
    where feedback.id = feedback_question_answers.feedback_id
      and class_questions.id = feedback_question_answers.class_question_id
  )
);
