create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.touch_updated_at(table_name text)
returns void
language plpgsql
as $$
begin
  execute format('drop trigger if exists set_updated_at on public.%I', table_name);
  execute format(
    'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
    table_name
  );
end;
$$;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  status text not null default 'active',
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_modules (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  code text not null,
  name text not null,
  description text,
  status text not null default 'active',
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, code)
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  legal_name text,
  organization_type text,
  industry text,
  website text,
  status text not null default 'active',
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  status text not null default 'active',
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, product_id)
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  user_type text not null check (user_type in ('super_admin', 'hr', 'employee', 'candidate', 'agency', 'client')),
  full_name text,
  email text,
  phone text,
  avatar_url text,
  employee_code text,
  candidate_code text,
  status text not null default 'active',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select id from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.current_organization_id()
returns uuid
language sql
stable
as $$
  select organization_id from public.profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.can_access_organization(target_organization_id uuid)
returns boolean
language sql
stable
as $$
  select target_organization_id is not null and target_organization_id = public.current_organization_id();
$$;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  code text unique not null,
  module text not null,
  action text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, role_id)
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  legal_name text,
  tax_id text,
  address jsonb not null default '{}',
  status text not null default 'active',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  name text not null,
  branch_type text,
  address jsonb not null default '{}',
  status text not null default 'active',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  parent_department_id uuid references public.departments(id) on delete set null,
  name text not null,
  status text not null default 'active',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.designations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  name text not null,
  level text,
  status text not null default 'active',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid references public.branches(id) on delete set null,
  name text not null,
  address jsonb not null default '{}',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  designation_id uuid references public.designations(id) on delete set null,
  work_location_id uuid references public.work_locations(id) on delete set null,
  reporting_manager_id uuid references public.employees(id) on delete set null,
  employee_code text,
  employment_type text,
  joining_date date,
  status text not null default 'active',
  personal_info jsonb not null default '{}',
  employment_history jsonb not null default '[]',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_code)
);

create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  candidate_code text,
  full_name text not null,
  email text,
  phone text,
  current_location text,
  source text,
  status text not null default 'active',
  resume_url text,
  profile_data jsonb not null default '{}',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_descriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  designation_id uuid references public.designations(id) on delete set null,
  title text not null,
  description text,
  responsibilities text,
  requirements text,
  skills jsonb not null default '[]',
  experience_min numeric,
  experience_max numeric,
  status text not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vacancy_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_description_id uuid references public.job_descriptions(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  designation_id uuid references public.designations(id) on delete set null,
  requested_by uuid references public.profiles(id) on delete set null,
  openings integer not null default 1,
  priority text not null default 'normal',
  status text not null default 'pending',
  reason text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.job_posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_description_id uuid references public.job_descriptions(id) on delete set null,
  vacancy_request_id uuid references public.vacancy_requests(id) on delete set null,
  title text not null,
  slug text,
  department_id uuid references public.departments(id) on delete set null,
  designation_id uuid references public.designations(id) on delete set null,
  work_location_id uuid references public.work_locations(id) on delete set null,
  employment_type text,
  openings integer not null default 1,
  salary_min numeric,
  salary_max numeric,
  status text not null default 'draft',
  published_at timestamptz,
  closes_at timestamptz,
  content jsonb not null default '{}',
  metadata jsonb not null default '{}',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_post_id uuid not null references public.job_posts(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  status text not null default 'applied',
  ai_score numeric,
  ai_summary text,
  source text,
  answers jsonb not null default '{}',
  metadata jsonb not null default '{}',
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_post_id, candidate_id)
);

create table public.application_status_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  application_id uuid not null references public.job_applications(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references public.profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  application_id uuid references public.job_applications(id) on delete cascade,
  candidate_id uuid references public.candidates(id) on delete cascade,
  scheduled_by uuid references public.profiles(id) on delete set null,
  interview_type text not null default 'hr',
  status text not null default 'scheduled',
  starts_at timestamptz,
  ends_at timestamptz,
  meeting_url text,
  panel jsonb not null default '[]',
  feedback jsonb not null default '{}',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_screening_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  module text not null default 'recruitment',
  criteria jsonb not null default '{}',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_screening_results (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  application_id uuid references public.job_applications(id) on delete cascade,
  rule_id uuid references public.ai_screening_rules(id) on delete set null,
  score numeric,
  recommendation text,
  summary text,
  raw_result jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.document_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  template_type text not null,
  content jsonb not null default '{}',
  variables jsonb not null default '[]',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  owner_profile_id uuid references public.profiles(id) on delete set null,
  owner_candidate_id uuid references public.candidates(id) on delete set null,
  owner_employee_id uuid references public.employees(id) on delete set null,
  document_type text not null,
  title text not null,
  storage_path text,
  public_url text,
  status text not null default 'active',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.form_definitions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  module text not null,
  name text not null,
  schema jsonb not null default '{}',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  form_definition_id uuid references public.form_definitions(id) on delete set null,
  submitted_by uuid references public.profiles(id) on delete set null,
  subject_type text,
  subject_id uuid,
  values jsonb not null default '{}',
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  parent_category_id uuid references public.expense_categories(id) on delete set null,
  name text not null,
  status text not null default 'active',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.expense_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  rules jsonb not null default '{}',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.expense_submissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete set null,
  policy_id uuid references public.expense_policies(id) on delete set null,
  submission_type text not null default 'expense',
  status text not null default 'draft',
  amount numeric not null default 0,
  currency text not null default 'INR',
  data jsonb not null default '{}',
  submitted_at timestamptz,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'open',
  priority text not null default 'normal',
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  due_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  title text,
  body text,
  subject_type text,
  subject_id uuid,
  created_by uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.file_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  parent_id uuid references public.file_items(id) on delete cascade,
  item_type text not null check (item_type in ('folder', 'file')),
  name text not null,
  storage_path text,
  mime_type text,
  size_bytes bigint,
  created_by uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.integration_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  provider text not null,
  account_name text,
  external_account_id text,
  status text not null default 'active',
  config jsonb not null default '{}',
  token_ref text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.email_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  provider text,
  direction text not null default 'outbound',
  subject text,
  from_email text,
  to_emails jsonb not null default '[]',
  body text,
  status text not null default 'draft',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.social_posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  provider text not null,
  job_post_id uuid references public.job_posts(id) on delete set null,
  content text,
  status text not null default 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  external_post_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.verification_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  candidate_id uuid references public.candidates(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  case_type text not null,
  status text not null default 'pending',
  provider text,
  result jsonb not null default '{}',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  code text not null,
  name text not null,
  price numeric not null default 0,
  currency text not null default 'INR',
  limits jsonb not null default '{}',
  features jsonb not null default '[]',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, code)
);

create table public.organization_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  status text not null default 'trialing',
  starts_at timestamptz,
  ends_at timestamptz,
  usage jsonb not null default '{}',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.report_definitions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  module text not null,
  config jsonb not null default '{}',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index profiles_auth_user_id_idx on public.profiles(auth_user_id);
create index profiles_organization_id_idx on public.profiles(organization_id);
create index organization_products_organization_id_idx on public.organization_products(organization_id);
create index organization_products_product_id_idx on public.organization_products(product_id);
create index employees_organization_id_idx on public.employees(organization_id);
create index candidates_organization_id_idx on public.candidates(organization_id);
create index job_posts_organization_id_idx on public.job_posts(organization_id);
create index job_applications_organization_id_idx on public.job_applications(organization_id);
create index job_applications_job_post_id_idx on public.job_applications(job_post_id);
create index interviews_organization_id_idx on public.interviews(organization_id);
create index documents_organization_id_idx on public.documents(organization_id);
create index audit_logs_organization_id_idx on public.audit_logs(organization_id);

select public.touch_updated_at('products');
select public.touch_updated_at('product_modules');
select public.touch_updated_at('organizations');
select public.touch_updated_at('organization_products');
select public.touch_updated_at('profiles');
select public.touch_updated_at('roles');
select public.touch_updated_at('companies');
select public.touch_updated_at('branches');
select public.touch_updated_at('departments');
select public.touch_updated_at('designations');
select public.touch_updated_at('work_locations');
select public.touch_updated_at('employees');
select public.touch_updated_at('candidates');
select public.touch_updated_at('job_descriptions');
select public.touch_updated_at('vacancy_requests');
select public.touch_updated_at('job_posts');
select public.touch_updated_at('job_applications');
select public.touch_updated_at('interviews');
select public.touch_updated_at('ai_screening_rules');
select public.touch_updated_at('document_templates');
select public.touch_updated_at('documents');
select public.touch_updated_at('form_definitions');
select public.touch_updated_at('form_submissions');
select public.touch_updated_at('expense_categories');
select public.touch_updated_at('expense_policies');
select public.touch_updated_at('expense_submissions');
select public.touch_updated_at('tasks');
select public.touch_updated_at('notes');
select public.touch_updated_at('file_items');
select public.touch_updated_at('integration_accounts');
select public.touch_updated_at('email_messages');
select public.touch_updated_at('social_posts');
select public.touch_updated_at('verification_cases');
select public.touch_updated_at('plans');
select public.touch_updated_at('organization_subscriptions');
select public.touch_updated_at('report_definitions');

alter table public.products enable row level security;
alter table public.product_modules enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_products enable row level security;
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.profile_roles enable row level security;
alter table public.companies enable row level security;
alter table public.branches enable row level security;
alter table public.departments enable row level security;
alter table public.designations enable row level security;
alter table public.work_locations enable row level security;
alter table public.employees enable row level security;
alter table public.candidates enable row level security;
alter table public.job_descriptions enable row level security;
alter table public.vacancy_requests enable row level security;
alter table public.job_posts enable row level security;
alter table public.job_applications enable row level security;
alter table public.application_status_history enable row level security;
alter table public.interviews enable row level security;
alter table public.ai_screening_rules enable row level security;
alter table public.ai_screening_results enable row level security;
alter table public.document_templates enable row level security;
alter table public.documents enable row level security;
alter table public.form_definitions enable row level security;
alter table public.form_submissions enable row level security;
alter table public.expense_categories enable row level security;
alter table public.expense_policies enable row level security;
alter table public.expense_submissions enable row level security;
alter table public.tasks enable row level security;
alter table public.notes enable row level security;
alter table public.file_items enable row level security;
alter table public.integration_accounts enable row level security;
alter table public.email_messages enable row level security;
alter table public.social_posts enable row level security;
alter table public.verification_cases enable row level security;
alter table public.plans enable row level security;
alter table public.organization_subscriptions enable row level security;
alter table public.report_definitions enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles read own organization" on public.profiles
  for select using (organization_id = public.current_organization_id() or auth_user_id = auth.uid());

create policy "products are readable" on public.products
  for select using (true);

create policy "product modules are readable" on public.product_modules
  for select using (true);

create policy "organizations read own" on public.organizations
  for select using (id = public.current_organization_id());

create policy "organization products read own" on public.organization_products
  for select using (public.can_access_organization(organization_id));

create policy "public active job posts" on public.job_posts
  for select using (status = 'published' or organization_id = public.current_organization_id());

create policy "job posts organization insert" on public.job_posts
  for insert with check (public.can_access_organization(organization_id));

create policy "job posts organization update" on public.job_posts
  for update using (public.can_access_organization(organization_id))
  with check (public.can_access_organization(organization_id));

create policy "job posts organization delete" on public.job_posts
  for delete using (public.can_access_organization(organization_id));

create policy "candidates read own profile" on public.candidates
  for select using (
    organization_id = public.current_organization_id()
    or profile_id = public.current_profile_id()
  );

create policy "candidates organization insert" on public.candidates
  for insert with check (
    organization_id is null
    or public.can_access_organization(organization_id)
    or profile_id = public.current_profile_id()
  );

create policy "candidates organization update" on public.candidates
  for update using (
    public.can_access_organization(organization_id)
    or profile_id = public.current_profile_id()
  )
  with check (
    public.can_access_organization(organization_id)
    or profile_id = public.current_profile_id()
  );

create policy "applications read own or organization" on public.job_applications
  for select using (
    organization_id = public.current_organization_id()
    or candidate_id in (select id from public.candidates where profile_id = public.current_profile_id())
  );

create policy "applications insert own or organization" on public.job_applications
  for insert with check (
    public.can_access_organization(organization_id)
    or candidate_id in (select id from public.candidates where profile_id = public.current_profile_id())
  );

create policy "applications update organization" on public.job_applications
  for update using (public.can_access_organization(organization_id))
  with check (public.can_access_organization(organization_id));

create policy "application history organization read" on public.application_status_history
  for select using (public.can_access_organization(organization_id));

create policy "application history organization insert" on public.application_status_history
  for insert with check (public.can_access_organization(organization_id));

create policy "permissions are readable" on public.permissions
  for select using (true);

create policy "profile roles readable in organization" on public.profile_roles
  for select using (
    exists (
      select 1
      from public.profiles target_profile
      where target_profile.id = profile_roles.profile_id
        and target_profile.organization_id = public.current_organization_id()
    )
  );

create policy "profile roles writable in organization" on public.profile_roles
  for all using (
    exists (
      select 1
      from public.profiles target_profile
      where target_profile.id = profile_roles.profile_id
        and target_profile.organization_id = public.current_organization_id()
    )
  )
  with check (
    exists (
      select 1
      from public.profiles target_profile
      where target_profile.id = profile_roles.profile_id
        and target_profile.organization_id = public.current_organization_id()
    )
  );

create policy "role permissions readable in organization" on public.role_permissions
  for select using (
    exists (
      select 1
      from public.roles target_role
      where target_role.id = role_permissions.role_id
        and target_role.organization_id = public.current_organization_id()
    )
  );

create policy "role permissions writable in organization" on public.role_permissions
  for all using (
    exists (
      select 1
      from public.roles target_role
      where target_role.id = role_permissions.role_id
        and target_role.organization_id = public.current_organization_id()
    )
  )
  with check (
    exists (
      select 1
      from public.roles target_role
      where target_role.id = role_permissions.role_id
        and target_role.organization_id = public.current_organization_id()
    )
  );

create policy "plans are readable" on public.plans
  for select using (true);

do $$
declare
  table_name text;
  organization_tables text[] := array[
    'roles',
    'companies',
    'branches',
    'departments',
    'designations',
    'work_locations',
    'employees',
    'job_descriptions',
    'vacancy_requests',
    'ai_screening_rules',
    'ai_screening_results',
    'document_templates',
    'documents',
    'form_definitions',
    'form_submissions',
    'expense_categories',
    'expense_policies',
    'expense_submissions',
    'tasks',
    'notes',
    'file_items',
    'integration_accounts',
    'email_messages',
    'social_posts',
    'verification_cases',
    'organization_subscriptions',
    'report_definitions',
    'audit_logs'
  ];
begin
  foreach table_name in array organization_tables loop
    execute format(
      'create policy %I on public.%I for select using (public.can_access_organization(organization_id))',
      table_name || '_org_select',
      table_name
    );
    execute format(
      'create policy %I on public.%I for insert with check (public.can_access_organization(organization_id))',
      table_name || '_org_insert',
      table_name
    );
    execute format(
      'create policy %I on public.%I for update using (public.can_access_organization(organization_id)) with check (public.can_access_organization(organization_id))',
      table_name || '_org_update',
      table_name
    );
    execute format(
      'create policy %I on public.%I for delete using (public.can_access_organization(organization_id))',
      table_name || '_org_delete',
      table_name
    );
  end loop;
end;
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (auth_user_id, email, full_name, user_type, metadata)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'user_type', 'candidate'),
    coalesce(new.raw_user_meta_data, '{}')
  )
  on conflict (auth_user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists create_profile_for_new_user on auth.users;
create trigger create_profile_for_new_user
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();
