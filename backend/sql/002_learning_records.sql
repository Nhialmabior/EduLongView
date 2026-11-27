-- EduLongView learning records foundation.
-- All learner and evidence rows are scoped to one active school.
-- Browser access is protected by RLS; privileged backend writes use the server-only key.

create or replace function private.is_school_member(target_school_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.school_memberships membership
    join public.schools school on school.id = membership.school_id
    where membership.school_id = target_school_id
      and membership.user_id = (select auth.uid())
      and membership.status = 'active'
      and school.status = 'active'
  );
$$;

revoke all on function private.is_school_member(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_school_member(uuid) to authenticated;

create table if not exists public.learners (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  admission_number text not null check (char_length(trim(admission_number)) between 1 and 80),
  first_name text not null check (char_length(trim(first_name)) between 1 and 100),
  last_name text not null check (char_length(trim(last_name)) between 1 and 100),
  grade smallint not null check (grade between 1 and 9),
  class_stream text check (class_stream is null or char_length(class_stream) <= 80),
  status text not null default 'active' check (status in ('active', 'archived')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, school_id)
);

create unique index if not exists learners_school_admission_number_unique
  on public.learners (school_id, lower(trim(admission_number)));
create index if not exists learners_school_grade_status_idx
  on public.learners (school_id, grade, status);
create index if not exists learners_school_name_idx
  on public.learners (school_id, last_name, first_name);

create table if not exists public.performance_records (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  learner_id uuid not null,
  learning_area text not null check (char_length(trim(learning_area)) between 1 and 120),
  assessment_title text not null check (char_length(trim(assessment_title)) between 1 and 160),
  assessment_type text check (assessment_type is null or char_length(assessment_type) <= 100),
  academic_year smallint check (academic_year is null or academic_year between 2000 and 2100),
  term smallint check (term is null or term between 1 and 3),
  assessment_date date,
  score numeric(10,2),
  max_score numeric(10,2),
  percentage numeric(5,2) generated always as (
    case when score is not null and max_score is not null
      then round((score / nullif(max_score, 0)) * 100, 2)
      else null
    end
  ) stored,
  participation text check (participation is null or char_length(participation) <= 100),
  teacher_observation text check (teacher_observation is null or char_length(teacher_observation) <= 2000),
  record_status text not null default 'active' check (record_status in ('active', 'voided')),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint performance_score_pair_check check (
    (score is null and max_score is null)
    or (score is not null and max_score is not null and score >= 0 and max_score > 0 and score <= max_score)
  ),
  constraint performance_learner_school_fk
    foreign key (learner_id, school_id)
    references public.learners(id, school_id) on delete restrict,
  unique (id, school_id)
);

create index if not exists performance_school_learner_date_idx
  on public.performance_records (school_id, learner_id, assessment_date desc);
create index if not exists performance_school_year_term_idx
  on public.performance_records (school_id, academic_year, term);
create index if not exists performance_school_learning_area_idx
  on public.performance_records (school_id, learner_id, learning_area);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  learner_id uuid not null,
  attendance_date date not null,
  attendance_status text not null check (attendance_status in ('present', 'late', 'absent', 'excused')),
  note text check (note is null or char_length(note) <= 1000),
  recorded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint attendance_learner_school_fk
    foreign key (learner_id, school_id)
    references public.learners(id, school_id) on delete restrict,
  unique (school_id, learner_id, attendance_date),
  unique (id, school_id)
);

create index if not exists attendance_school_learner_date_idx
  on public.attendance_records (school_id, learner_id, attendance_date desc);

create table if not exists public.report_drafts (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  learner_id uuid not null,
  academic_year smallint not null check (academic_year between 2000 and 2100),
  term smallint not null check (term between 1 and 3),
  draft_content jsonb not null check (jsonb_typeof(draft_content) = 'object'),
  evidence_snapshot jsonb not null check (jsonb_typeof(evidence_snapshot) = 'array'),
  model_provider text not null default 'rule-based' check (char_length(model_provider) between 1 and 80),
  model_name text not null default 'local-rule-engine' check (char_length(model_name) between 1 and 120),
  generated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint report_draft_learner_school_fk
    foreign key (learner_id, school_id)
    references public.learners(id, school_id) on delete restrict,
  unique (id, school_id)
);

create index if not exists report_drafts_school_learner_period_idx
  on public.report_drafts (school_id, learner_id, academic_year, term, created_at desc);

create table if not exists public.report_draft_evidence (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  report_draft_id uuid not null,
  performance_record_id uuid,
  attendance_record_id uuid,
  created_at timestamptz not null default now(),
  constraint report_draft_evidence_one_source_check check (
    (performance_record_id is not null and attendance_record_id is null)
    or (performance_record_id is null and attendance_record_id is not null)
  ),
  constraint report_draft_evidence_report_fk
    foreign key (report_draft_id, school_id)
    references public.report_drafts(id, school_id) on delete restrict,
  constraint report_draft_evidence_performance_fk
    foreign key (performance_record_id, school_id)
    references public.performance_records(id, school_id) on delete restrict,
  constraint report_draft_evidence_attendance_fk
    foreign key (attendance_record_id, school_id)
    references public.attendance_records(id, school_id) on delete restrict
);

create index if not exists report_draft_evidence_school_report_idx
  on public.report_draft_evidence (school_id, report_draft_id);
create index if not exists report_draft_evidence_performance_idx
  on public.report_draft_evidence (performance_record_id)
  where performance_record_id is not null;
create index if not exists report_draft_evidence_attendance_idx
  on public.report_draft_evidence (attendance_record_id)
  where attendance_record_id is not null;

alter table public.learners enable row level security;
alter table public.performance_records enable row level security;
alter table public.attendance_records enable row level security;
alter table public.report_drafts enable row level security;
alter table public.report_draft_evidence enable row level security;

-- Explicit table grants are required for the Data API. No anonymous access.
grant select, insert, update on public.learners to authenticated;
grant select, insert, update on public.performance_records to authenticated;
grant select, insert, update on public.attendance_records to authenticated;
grant select, insert, update on public.report_drafts to authenticated;
grant select, insert on public.report_draft_evidence to authenticated;

grant all on public.learners, public.performance_records, public.attendance_records,
  public.report_drafts, public.report_draft_evidence to service_role;

drop policy if exists "School members can read learners" on public.learners;
create policy "School members can read learners"
  on public.learners for select to authenticated
  using (private.is_school_member(school_id));

drop policy if exists "School members can add learners" on public.learners;
create policy "School members can add learners"
  on public.learners for insert to authenticated
  with check (private.is_school_member(school_id));

drop policy if exists "School members can update learners" on public.learners;
create policy "School members can update learners"
  on public.learners for update to authenticated
  using (private.is_school_member(school_id))
  with check (private.is_school_member(school_id));

drop policy if exists "School members can read performance records" on public.performance_records;
create policy "School members can read performance records"
  on public.performance_records for select to authenticated
  using (private.is_school_member(school_id));

drop policy if exists "School members can add performance records" on public.performance_records;
create policy "School members can add performance records"
  on public.performance_records for insert to authenticated
  with check (private.is_school_member(school_id));

drop policy if exists "School members can update performance records" on public.performance_records;
create policy "School members can update performance records"
  on public.performance_records for update to authenticated
  using (private.is_school_member(school_id))
  with check (private.is_school_member(school_id));

drop policy if exists "School members can read attendance records" on public.attendance_records;
create policy "School members can read attendance records"
  on public.attendance_records for select to authenticated
  using (private.is_school_member(school_id));

drop policy if exists "School members can add attendance records" on public.attendance_records;
create policy "School members can add attendance records"
  on public.attendance_records for insert to authenticated
  with check (private.is_school_member(school_id));

drop policy if exists "School members can update attendance records" on public.attendance_records;
create policy "School members can update attendance records"
  on public.attendance_records for update to authenticated
  using (private.is_school_member(school_id))
  with check (private.is_school_member(school_id));

drop policy if exists "School members can read report drafts" on public.report_drafts;
create policy "School members can read report drafts"
  on public.report_drafts for select to authenticated
  using (private.is_school_member(school_id));

drop policy if exists "School members can add report drafts" on public.report_drafts;
create policy "School members can add report drafts"
  on public.report_drafts for insert to authenticated
  with check (private.is_school_member(school_id));

drop policy if exists "School members can update report drafts" on public.report_drafts;
create policy "School members can update report drafts"
  on public.report_drafts for update to authenticated
  using (private.is_school_member(school_id))
  with check (private.is_school_member(school_id));

drop policy if exists "School members can read report evidence links" on public.report_draft_evidence;
create policy "School members can read report evidence links"
  on public.report_draft_evidence for select to authenticated
  using (private.is_school_member(school_id));

drop policy if exists "School members can add report evidence links" on public.report_draft_evidence;
create policy "School members can add report evidence links"
  on public.report_draft_evidence for insert to authenticated
  with check (private.is_school_member(school_id));

-- No browser DELETE policies are created. Records are retained for accountability;
-- performance evidence can be marked voided instead of being physically deleted.


-- Cover foreign-key lookups for school records and audit attribution.
create index if not exists learners_created_by_idx on public.learners(created_by) where created_by is not null;
create index if not exists learners_updated_by_idx on public.learners(updated_by) where updated_by is not null;
create index if not exists performance_learner_school_fk_idx on public.performance_records(learner_id, school_id);
create index if not exists performance_created_by_idx on public.performance_records(created_by) where created_by is not null;
create index if not exists performance_updated_by_idx on public.performance_records(updated_by) where updated_by is not null;
create index if not exists attendance_learner_school_fk_idx on public.attendance_records(learner_id, school_id);
create index if not exists attendance_recorded_by_idx on public.attendance_records(recorded_by) where recorded_by is not null;
create index if not exists report_drafts_learner_school_fk_idx on public.report_drafts(learner_id, school_id);
create index if not exists report_drafts_generated_by_idx on public.report_drafts(generated_by) where generated_by is not null;
create index if not exists report_evidence_report_school_fk_idx on public.report_draft_evidence(report_draft_id, school_id);
create index if not exists report_evidence_performance_school_fk_idx on public.report_draft_evidence(performance_record_id, school_id) where performance_record_id is not null;
create index if not exists report_evidence_attendance_school_fk_idx on public.report_draft_evidence(attendance_record_id, school_id) where attendance_record_id is not null;
