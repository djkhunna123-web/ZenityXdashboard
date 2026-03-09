# Supabase setup

## 1. Create environment variables

Create `.env` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Run the database schema

Open the Supabase SQL editor and run:

- `supabase/schema.sql`

This creates:

- `profiles`
- `classes`
- `class_questions`
- `feedback`
- `feedback_question_answers`
- auth trigger for new users
- row level security policies

## 3. Create your first users

Teacher accounts:

- Use the signup form in `/login`
- New signups are created with role `teacher`
- New teacher accounts start with status `pending`
- Teachers cannot access the dashboard until an admin approves them

Admin account:

1. Sign up once with the email you want to use as admin
2. Run `supabase/admin-setup.sql` after replacing the email

## 4. Verify the full flow

1. Sign up as a teacher
2. Sign in as admin
3. Approve that teacher in the admin teachers page
4. Sign in as the approved teacher
5. Create a class
6. Add optional custom questions
7. Open the generated feedback link or QR code
8. Submit feedback, including answers to custom questions
9. Sign in as admin and confirm the class, feedback, and question answers appear

## Notes

- Public users can open feedback links and submit feedback without logging in
- Teachers can only manage their own classes and questions
- Admins can view all teachers, classes, feedback, and question answers
- Pending or rejected teachers are blocked from the teacher dashboard
