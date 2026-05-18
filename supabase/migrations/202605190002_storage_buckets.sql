insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'resumes',
    'resumes',
    false,
    10485760,
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  ),
  (
    'candidate-documents',
    'candidate-documents',
    false,
    20971520,
    array[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  ),
  (
    'employee-documents',
    'employee-documents',
    false,
    20971520,
    array[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  ),
  (
    'generated-documents',
    'generated-documents',
    false,
    20971520,
    array[
      'application/pdf',
      'text/html',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "authenticated users can read app storage"
on storage.objects for select
to authenticated
using (bucket_id in ('resumes', 'candidate-documents', 'employee-documents', 'generated-documents'));

create policy "authenticated users can upload app storage"
on storage.objects for insert
to authenticated
with check (bucket_id in ('resumes', 'candidate-documents', 'employee-documents', 'generated-documents'));

create policy "authenticated users can update app storage"
on storage.objects for update
to authenticated
using (bucket_id in ('resumes', 'candidate-documents', 'employee-documents', 'generated-documents'))
with check (bucket_id in ('resumes', 'candidate-documents', 'employee-documents', 'generated-documents'));

create policy "authenticated users can delete app storage"
on storage.objects for delete
to authenticated
using (bucket_id in ('resumes', 'candidate-documents', 'employee-documents', 'generated-documents'));
