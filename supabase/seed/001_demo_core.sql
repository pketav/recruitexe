insert into public.products (code, name, description)
values
  ('recruitexe', 'RecruitExe', 'AI-powered HRMS, ATS, recruitment, candidate, and workforce platform')
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.product_modules (product_id, code, name, description)
select products.id, module.code, module.name, module.description
from public.products
cross join (
  values
    ('organization', 'Organization Setup', 'Companies, branches, departments, designations, roles'),
    ('recruitment', 'Recruitment', 'Jobs, vacancies, candidates, applications, interviews'),
    ('candidate', 'Candidate Portal', 'Candidate profile, applications, documents'),
    ('employee', 'Employee Management', 'Employees, managers, work locations'),
    ('expense', 'Expense Management', 'Expenses, trips, advances, policies'),
    ('documents', 'Documents', 'Templates, uploads, generated files'),
    ('integrations', 'Integrations', 'Email, Gmail, LinkedIn, social posting'),
    ('verification', 'Verification Suite', 'Verification cases and reports'),
    ('reports', 'Reports', 'Report definitions and generated reports'),
    ('admin', 'Admin', 'Platform and product administration')
) as module(code, name, description)
where products.code = 'recruitexe'
on conflict (product_id, code) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.plans (product_id, code, name, price, limits, features)
select products.id, plan.code, plan.name, plan.price, plan.limits::jsonb, plan.features::jsonb
from public.products
cross join (
  values
    ('starter', 'Starter', 0, '{"jobs": 5, "users": 3, "applications": 250}', '["Recruitment", "Candidate portal"]'),
    ('growth', 'Growth', 4999, '{"jobs": 25, "users": 15, "applications": 2500}', '["Recruitment", "AI screening", "Documents"]'),
    ('enterprise', 'Enterprise', 0, '{"jobs": -1, "users": -1, "applications": -1}', '["All modules"]')
) as plan(code, name, price, limits, features)
where products.code = 'recruitexe'
on conflict (product_id, code) do update set
  name = excluded.name,
  price = excluded.price,
  limits = excluded.limits,
  features = excluded.features;

insert into public.permissions (product_id, code, module, action, description)
select products.id, permission.code, permission.module, permission.action, permission.description
from public.products
cross join (
  values
    ('org.read', 'organization', 'read', 'Read organization setup'),
    ('org.write', 'organization', 'write', 'Manage organization setup'),
    ('recruitment.read', 'recruitment', 'read', 'Read recruitment data'),
    ('recruitment.write', 'recruitment', 'write', 'Manage jobs and applications'),
    ('candidate.read', 'candidate', 'read', 'Read candidates'),
    ('candidate.write', 'candidate', 'write', 'Manage candidates'),
    ('expense.read', 'expense', 'read', 'Read expenses'),
    ('expense.write', 'expense', 'write', 'Manage expenses'),
    ('integration.write', 'integration', 'write', 'Manage integrations'),
    ('admin.full', 'admin', 'full', 'Full admin access')
) as permission(code, module, action, description)
where products.code = 'recruitexe'
on conflict (code) do update set
  product_id = excluded.product_id,
  module = excluded.module,
  action = excluded.action,
  description = excluded.description;
