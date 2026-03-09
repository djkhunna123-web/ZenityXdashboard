-- Promote an existing signed-up user to admin.
-- Replace the email before running this in the Supabase SQL editor.

update public.profiles
set role = 'admin',
    status = 'approved'
where email = 'admin@example.com';
