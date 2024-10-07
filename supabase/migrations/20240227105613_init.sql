
/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
CREATE TYPE public.Role AS ENUM ('Teacher', 'Student', 'Guest');
CREATE TYPE public.Push_Notifications_State AS ENUM ('Idle', 'On', 'Off');
CREATE TYPE public.NotificationType AS ENUM ('enrollment', 'submission', 'assignment');
create table users (
  -- UUID from auth.users
  id uuid references auth.users on delete cascade not null primary key,
  creator_id text,
  name text not null,
  role Role not null,
  email text not null,
  avatar text not null,
  preferred_locale text not null,
  timezone text not null,
  is_emails_on boolean not null default true,
  push_notifications_state Push_Notifications_State not null default 'Idle',
  created_at timestamp not null default now()
);


CREATE TABLE fcm_tokens (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL default auth.uid(),
  fcm_token text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);

create table courses (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  creator_id text NOT NULL default auth.uid()::text,
  title text not null,
  created_at timestamp not null default now()
);

/** 
* Junction Table: User_Courses
* This table establishes a many-to-many relationship between users and courses.
*/
create table user_courses (
  user_id uuid references public.users on delete cascade not null,
  course_id uuid references public.courses on delete cascade not null,
  created_at timestamp not null default now(),
  primary key (user_id, course_id)
);

create table lessons (
  -- UUID from auth.users
  id uuid not null primary key DEFAULT gen_random_uuid(),
  course_id uuid references public.courses on delete cascade,
  creator_id uuid not null references public.users on delete cascade default auth.uid(),
  created_at timestamp not null default now(),
  title text DEFAULT 'Quick lesson' not null,
  whiteboard_data text default '{}' not null,
  starts timestamp with time zone not null,
  ends timestamp with time zone not null
);

create table assignments (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  lesson_id uuid references public.lessons on delete cascade not null,
  title text not null,
  body text default '{}' not null,
  due_date timestamp not null,
  created_at timestamp not null default now()
);

create table submissions (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  assignment_id uuid references public.assignments on delete cascade not null,
  user_id uuid references public.users on delete cascade not null default auth.uid(),
  body text not null,
  title text not null,
  grade int,
  created_at timestamp not null default now()
);

create table notifications (
  -- UUID from auth.users
  id uuid not null primary key DEFAULT gen_random_uuid(),
  recipient_id text not null,
  user_id uuid references public.users on delete SET NULL,
  course_id uuid references public.courses on delete SET NULL,
  lesson_id uuid references public.lessons on delete SET NULL,
  assignment_id uuid references public.assignments on delete SET NULL,
  submission_id uuid references public.submissions on delete SET NULL,
  created_at timestamp with time zone not null default now(),
  type NotificationType not null,
  is_read boolean not null
);

create table chat_messages (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  lesson_id uuid references public.lessons on delete cascade not null,
  reply_id uuid references public.chat_messages on delete cascade,
  creator_id uuid references public.users on delete cascade not null default auth.uid(),
  text text
);

create table chat_files (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  message_id uuid references public.chat_messages on delete cascade not null,
  name text not null,
  ext text not null,
  path text not null,
  size int not null
);

create table sent_announcements (
  -- UUID from auth.users
  id uuid not null primary key DEFAULT gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  lesson_id uuid references public.lessons on delete cascade
);
/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, name, role, avatar, preferred_locale, creator_id, timezone, push_notifications_state)
  values (new.id, new.email, new.raw_user_meta_data->>'name', (new.raw_user_meta_data->>'role')::public.Role, new.raw_user_meta_data->>'avatar', new.raw_user_meta_data->>'preferred_locale', new.raw_user_meta_data->>'creator_id', new.raw_user_meta_data->>'timezone', (new.raw_user_meta_data->>'push_notifications_state')::public.Push_Notifications_State);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


/**
* This trigger automatically update a user entry when a user updates via Supabase Auth.
*/ 
create function public.handle_update_user() 
returns trigger as $$
begin
  update public.users
  set
    name = new.raw_user_meta_data->>'name',
    avatar = new.raw_user_meta_data->>'avatar',
    preferred_locale = new.raw_user_meta_data->>'preferred_locale',
    timezone = new.raw_user_meta_data->>'timezone',
    is_emails_on = (new.raw_user_meta_data->>'is_emails_on')::boolean,
    push_notifications_state = (new.raw_user_meta_data->>'push_notifications_state')::public.Push_Notifications_State
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_update_user();


create or replace function public.get_my_users()
returns setof users as $$
begin
return query
  select * from users
  where id != auth.uid();
end;
$$ language plpgsql;

-- Create a trigger function to insert into user_courses table
create function insert_user_course()
returns trigger as $$
begin
    insert into user_courses (user_id, course_id)
    values (auth.uid(), new.id);
    
    RETURN new;
end;
$$ language plpgsql;

-- Create a trigger on the courses table to execute the function after insert
create trigger on_course_created
after insert on courses
for each row execute function insert_user_course();


-- Create a trigger function to insert into notifications table
create function create_enrollment_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the user being assigned is not the current user
    IF new.user_id != auth.uid() THEN
        -- Insert notification for the assigned user
        INSERT INTO notifications (recipient_id, user_id, course_id, type, is_read)
        VALUES (
            new.user_id,          -- The user being assigned
            auth.uid(),       -- The user who performed the assignment
            new.course_id,         -- The course to which the user was assigned
            'enrollment',-- Notification type
            false                  -- Mark the notification as unread
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger on the courses table to execute the function after insert
create trigger on_user_courses_created
after insert on user_courses
for each row execute function create_enrollment_notification();


CREATE OR REPLACE FUNCTION create_submission_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification with lesson_id and assignment_id
  INSERT INTO notifications (recipient_id, user_id, course_id, lesson_id, assignment_id, type, is_read)
  SELECT 
    u.id,                     -- Recipient ID (user_id of the course creator)
    auth.uid(),               -- Current user who created the submission
    l.course_id,              -- Course ID
    a.lesson_id,              -- Lesson ID from the assignment
    NEW.assignment_id,         -- Assignment ID from the new submission
    'submission',             -- Type of notification
    false                     -- Mark as unread
  FROM assignments a
  JOIN lessons l ON a.lesson_id = l.id
  JOIN courses c ON l.course_id = c.id
  JOIN users u ON u.id::text = c.creator_id  -- Get the creator of the course
  WHERE a.id = NEW.assignment_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER on_submission_created
AFTER INSERT ON submissions
FOR EACH ROW
EXECUTE FUNCTION create_submission_notification();

-- Function to create notifications after an assignment is created
CREATE OR REPLACE FUNCTION create_assignment_notification()
RETURNS TRIGGER AS $$
DECLARE
  lesson_course_id UUID;  -- Renamed to avoid ambiguity
  current_user_id UUID := auth.uid();  -- Get the current authenticated user
  assigned_user RECORD;
BEGIN
  -- Log the assignment creation for debugging
  RAISE NOTICE 'Creating notifications for assignment with lesson_id: %', NEW.lesson_id;

  -- Find the course_id associated with the lesson the assignment belongs to
  SELECT l.course_id INTO lesson_course_id
  FROM lessons l
  WHERE l.id = NEW.lesson_id;

  -- Log the course_id found
  RAISE NOTICE 'Course ID for lesson: %', lesson_course_id;

  -- Insert notifications for each user enrolled in the course, except the current user
  FOR assigned_user IN
    SELECT uc.user_id
    FROM user_courses uc
    WHERE uc.course_id = lesson_course_id
    AND uc.user_id != current_user_id  -- Exclude the current user
  LOOP
    -- Log each user for whom a notification will be created
    RAISE NOTICE 'Creating notification for user: %', assigned_user.user_id;

    -- Insert the notification
    INSERT INTO notifications (recipient_id, user_id, course_id, lesson_id, assignment_id, created_at, type, is_read)
    VALUES (assigned_user.user_id::text, assigned_user.user_id, lesson_course_id, NEW.lesson_id, NEW.id, NOW(), 'assignment', FALSE);
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_assignment_created
AFTER INSERT ON assignments
FOR EACH ROW
EXECUTE FUNCTION create_assignment_notification();

create or replace function public.get_users_not_in_course(p_course_id uuid, p_user_name text)
returns setof public.users as $$
begin
    return query
    select u.*
    from public.users u
    left join public.user_courses uc on u.id = uc.user_id and uc.course_id = p_course_id
    where uc.user_id is null
    and u.name ILIKE '%' || p_user_name || '%'
    and u.creator_id = auth.uid()::text
    and u.id != auth.uid();
end;
$$ language plpgsql;

create or replace function get_unenrolled_courses(p_user_id uuid, p_course_title text)
returns setof public.courses as $$
begin
    return query
    select c.*
    from public.courses c
    left join public.user_courses uc on c.id = uc.course_id and uc.user_id = p_user_id
    where uc.user_id is null
    and c.title ILIKE '%' || p_course_title || '%'
    and c.id in (
        select c2.id
        from public.courses c2
        join public.users u on u.creator_id = auth.uid()::text
        where u.id = p_user_id
    );
end;
$$ language plpgsql;

create or replace function public.delete_auth_users_by_ids(user_ids uuid[])
returns void as $$
begin
    delete from auth.users
    where id = any(user_ids)
      and id in (
        select id from public.users where creator_id = auth.uid()::text
      );
end;
$$ language plpgsql;



create or replace function get_overlapping_lesson(
    p_starts timestamp, 
    p_ends timestamp,
    p_lesson_id uuid DEFAULT NULL
)
returns setof lessons as $$
begin
    return query
    select l.*
    from lessons l
    join user_courses uc on l.course_id = uc.course_id
    where uc.user_id = auth.uid()
      and (
          (l.starts <= p_starts and l.ends > p_starts) -- Case 1: Existing lesson overlaps at the start
          or
          (l.starts < p_ends and l.ends >= p_ends)     -- Case 2: Existing lesson overlaps at the end
          or
          (l.starts >= p_starts and l.ends <= p_ends)     -- Case 3: 
      )
        -- Exclude the lesson if p_lesson_id is provided
      AND (p_lesson_id IS NULL OR l.id != p_lesson_id);

end;
$$ language plpgsql;


CREATE OR REPLACE FUNCTION public.get_upcoming_lessons_users()
RETURNS TABLE (
  id text,
  email text,
  fcm_token text,
  lesson_id text,
  is_emails_on boolean,
  push_notifications_state Push_Notifications_State
)
LANGUAGE sql
AS $$
  SELECT
    u.id,
    u.email,
    COALESCE(ft.fcm_token, '') AS fcm_token,
    l.id AS lesson_id,
    u.is_emails_on,
    u.push_notifications_state
  FROM lessons l
  INNER JOIN user_courses uc ON l.course_id = uc.course_id
  INNER JOIN public.users u ON uc.user_id = u.id
  LEFT JOIN fcm_tokens ft ON u.id = ft.user_id
  WHERE l.starts BETWEEN NOW() AND NOW() + INTERVAL '5 minutes'
    AND l.id NOT IN (
      SELECT sn.lesson_id
      FROM sent_announcements sn
      WHERE sn.user_id = u.id
    );
$$;

create function public.expel_all_users_from_course(
    p_course_id uuid,
    p_user_name text
) 
returns void as $$
begin
    delete from public.user_courses
    where user_id in (
        select u.id
        from public.users u
        left join public.user_courses uc on u.id = uc.user_id and uc.course_id = p_course_id
        where uc.user_id is not null
        and u.name ilike '%' || p_user_name || '%'
        and u.creator_id = auth.uid()::text
    )
    and course_id = p_course_id;
end;
$$ language plpgsql;

CREATE OR REPLACE FUNCTION public.enroll_all_users_in_courses(
    p_courses_ids uuid[]
)
RETURNS void AS $$
BEGIN
  -- Insert all users with the same creator_id as auth.uid() into user_courses table for each provided course_id
  INSERT INTO public.user_courses (user_id, course_id, created_at)
  SELECT u.id, course_id, NOW()
  FROM public.users u
  CROSS JOIN UNNEST(p_courses_ids) AS course_id
  WHERE u.creator_id = auth.uid()::text
  ON CONFLICT DO NOTHING;  -- In case the user is already enrolled in the course, avoid errors
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.delete_courses_by_ids(p_courses_ids uuid[])
RETURNS void AS $$
BEGIN
  DELETE FROM public.courses
  WHERE id = ANY(p_courses_ids);
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION public.delete_lessons_by_ids(p_lessons_ids uuid[])
RETURNS void AS $$
BEGIN
  DELETE FROM public.lessons
  WHERE id = ANY(p_lessons_ids);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.expel_users_from_course(
    p_course_id uuid,
    p_users_ids uuid[]
) 
RETURNS void AS $$
BEGIN
    DELETE FROM public.user_courses
    WHERE user_id = ANY(p_users_ids)
    AND course_id = p_course_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.delete_assignments_by_ids(p_assignments_ids uuid[])
RETURNS void AS $$
BEGIN
  DELETE FROM public.assignments
  WHERE id = ANY(p_assignments_ids);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.delete_submissions_by_ids(p_submissions_ids uuid[])
RETURNS void AS $$
BEGIN
  DELETE FROM public.submissions
  WHERE id = ANY(p_submissions_ids);
END;
$$ LANGUAGE plpgsql;

-- Function to enroll all users in all courses
create or replace function enroll_all_users_in_all_courses()
returns void language plpgsql as $$
begin
  -- Insert all users into all courses
  insert into user_courses (user_id, course_id, created_at)
  select u.id as user_id, c.id as course_id, now() as created_at
  from users u, courses c
  on conflict (user_id, course_id) do nothing;
end;
$$;


create or replace function enroll_users_in_all_courses(users_ids uuid[])
returns void language plpgsql as $$
begin
  -- Insert given users into all courses
  insert into user_courses (user_id, course_id, created_at)
  select unnest(users_ids) as user_id, c.id as course_id, now() as created_at
  from courses c
  on conflict (user_id, course_id) do nothing;
end;
$$;


alter table public.users enable row level security;
create policy "Can insert user's data." on public.users for insert to authenticated;
-- create policy "Can view user's data." on public.users for select to authenticated using (true);
create policy "Can view user's data." on public.users
for select to authenticated using (
  auth.uid() = id
  or auth.uid()::text = creator_id
  or exists (
    select 1
    from public.user_courses uc
    join public.user_courses uc2 on uc.course_id = uc2.course_id
    where uc.user_id = auth.uid()
      and uc2.user_id = id
  )
);
create policy "Update own or creator's user" on public.users for update using ( auth.uid() = id or auth.uid()::text = creator_id );
create policy "Delete own or creator's user" on public.users for delete using ( auth.uid() = id or auth.uid()::text = creator_id );


alter table fcm_tokens enable row level security;

create policy "Insert own" on fcm_tokens for insert to authenticated with check ( user_id = auth.uid() );
create policy "Select own" on fcm_tokens for select using ( auth.uid() = user_id );
create policy "Update own" on fcm_tokens for update using ( auth.uid() = user_id );

-- Courses' policies
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Policy: Insert allowed for any authenticated user with the role 'Teacher'
CREATE POLICY "Can insert for teachers" ON public.courses
FOR INSERT
TO authenticated
WITH CHECK ((SELECT role FROM public.users WHERE id = auth.uid()) = 'Teacher');

-- Policy: Select allowed for any authenticated user assigned to the course
CREATE POLICY "Can select authenticated" ON public.courses
FOR SELECT
TO authenticated
USING ( 
    -- Allow selection if the course was created by the user
    courses.creator_id = auth.uid()::text
    -- Or if the user is assigned to the course in user_courses
    OR exists (
        select 1
        from user_courses uc
        where uc.course_id = courses.id
        and uc.user_id = auth.uid()
    )
 );

-- Policy: Update allowed only for the course creator
CREATE POLICY "Can update own course" ON public.courses
FOR UPDATE
TO authenticated
USING (creator_id = auth.uid()::text);

-- Policy: Delete allowed only for the course creator
CREATE POLICY "Can delete own course" ON public.courses
FOR DELETE
TO authenticated
USING (creator_id = auth.uid()::text);

-- User_courses' policies
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;

-- Policy: Insert allowed if the user is the creator of the course
create policy "can insert if creator of the course" 
on user_courses 
for insert 
TO authenticated
WITH CHECK (
  exists (
    select 1 
    from public.courses c
    where c.id = user_courses.course_id 
    and c.creator_id = auth.uid()::text
  )
);

CREATE OR REPLACE FUNCTION is_in_course(p_course_id uuid, p_user_id uuid)
            returns boolean AS
        $$
        select p_course_id IN (
        select course_id 
        from user_courses 
        where user_id = p_user_id
    )
        $$ stable language sql security definer;

-- Policy: Select allowed if the user is the creator of the course
CREATE POLICY "Can select if user is assigned to the course"
ON public.user_courses
FOR SELECT
TO authenticated
USING (
  is_in_course(user_courses.course_id, auth.uid())
);

-- Policy: Update allowed if the user is the creator of the course
CREATE POLICY "Can update for course creator" ON public.user_courses
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.courses
        WHERE public.courses.id = course_id
        AND public.courses.creator_id = auth.uid()::text
    )
);

-- Policy: Delete allowed if the user is the creator of the course
CREATE POLICY "Can delete for course creator" ON public.user_courses
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.courses
        WHERE courses.id = user_courses.course_id
        AND courses.creator_id = auth.uid()::text
    )
);


--  Lessons' policies
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow insert if the user owns the course
CREATE POLICY "Can insert if owns course"
ON public.lessons
FOR INSERT
to authenticated
with check (
  course_id IS NULL
  OR
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN courses c ON uc.course_id = c.id
    WHERE uc.user_id = auth.uid()
      AND c.id = lessons.course_id
      AND c.creator_id = auth.uid()::text
  )
);

-- Create a policy to allow select if the user is assigned to the course
CREATE POLICY "Can select if assigned to course"
ON lessons
FOR SELECT
USING (
  course_id IS NULL
  OR
  EXISTS (
    SELECT 1
    FROM user_courses uc
    WHERE uc.user_id = auth.uid()
      AND uc.course_id = lessons.course_id
  )
);
-- Create a policy to allow update if the user is assigned to the course and is a Teacher
CREATE POLICY "Can update if assigned and Teacher"
ON lessons
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN users u ON uc.user_id = u.id
    WHERE uc.user_id = auth.uid()
      AND uc.course_id = lessons.course_id
      AND u.role = 'Teacher'
  )
);
-- Create a policy to allow delete if the user is assigned to the course and is a Teacher
CREATE POLICY "Can delete if assigned and Teacher"
ON lessons
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN users u ON uc.user_id = u.id
    WHERE uc.user_id = auth.uid()
      AND uc.course_id = lessons.course_id
      AND u.role = 'Teacher'
  )
);

-- Assignments' policies
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
-- Create a policy to allow insert if the user is assigned to the course the lesson is assigned to and is a Teacher
CREATE POLICY "Can insert if assigned to course and Teacher"
ON assignments
FOR INSERT
with check (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN lessons l ON uc.course_id = l.course_id
    JOIN users u ON uc.user_id = u.id
    WHERE uc.user_id = auth.uid()
      AND l.id = assignments.lesson_id
      AND u.role = 'Teacher'
  )
);
-- Create a policy to allow select if the user is assigned to the course the lesson is assigned to
CREATE POLICY "Can select if assigned to course"
ON assignments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN lessons l ON uc.course_id = l.course_id
    WHERE uc.user_id = auth.uid()
      AND l.id = assignments.lesson_id
  )
);

-- Create a policy to allow update if the user is assigned to the course the lesson is assigned to and is a Teacher
CREATE POLICY "Can update if assigned to course and Teacher"
ON assignments
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN lessons l ON uc.course_id = l.course_id
    JOIN users u ON uc.user_id = u.id
    WHERE uc.user_id = auth.uid()
      AND l.id = assignments.lesson_id
      AND u.role = 'Teacher'
  )
);
-- Create a policy to allow delete if the user is assigned to the course the lesson is assigned to and is a Teacher
CREATE POLICY "Can delete if assigned to course and Teacher"
ON assignments
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN lessons l ON uc.course_id = l.course_id
    JOIN users u ON uc.user_id = u.id
    WHERE uc.user_id = auth.uid()
      AND l.id = assignments.lesson_id
      AND u.role = 'Teacher'
  )
);

-- Submissions' policies
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow insert if the user is assigned to the course the lesson is assigned to and is a Student
CREATE POLICY "Can insert if assigned to course and Student"
ON submissions
FOR INSERT
with check (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN lessons l ON uc.course_id = l.course_id
    JOIN assignments a ON a.lesson_id = l.id
    JOIN users u ON uc.user_id = u.id
    WHERE uc.user_id = auth.uid()
      AND a.id = submissions.assignment_id
      AND u.role = 'Student'
  )
);
-- Create a policy to allow select if the user owns the submission or is assigned to the course the lesson is assigned to and is a Teacher
CREATE POLICY "Can select if owns or assigned to course and Teacher"
ON submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN lessons l ON uc.course_id = l.course_id
    JOIN assignments a ON a.lesson_id = l.id
    JOIN users u ON uc.user_id = u.id
    WHERE (submissions.user_id = auth.uid()  -- Owns the submission
           OR (uc.user_id = auth.uid() AND u.role = 'Teacher'))  -- Assigned to the course and is a Teacher
      AND a.id = submissions.assignment_id
  )
);
-- Create a policy to allow update if the user owns the submission
CREATE POLICY "Can update if owns the submission"
ON submissions
FOR UPDATE
USING (
  submissions.user_id = auth.uid()  -- Owns the submission
);
-- Create a policy to allow delete if the user owns the submission
CREATE POLICY "Can delete if owns the submission"
ON submissions
FOR DELETE
USING (
  submissions.user_id = auth.uid()  -- Owns the submission
);

-- Notifications' policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- Create a policy to allow insert if the user is assigned to the course
CREATE POLICY "Can insert if assigned to course"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    WHERE uc.user_id = auth.uid()
      AND uc.course_id = notifications.course_id
  )
);
-- Create a policy to allow select if the user is assigned to the course
CREATE POLICY "Can select if assigned to course"
ON public.notifications
FOR SELECT
TO authenticated
USING (
 recipient_id = auth.uid()::text
);
CREATE POLICY "Can update if assigned to course"
ON public.notifications
FOR UPDATE
TO authenticated
USING (
 recipient_id = auth.uid()::text
);

-- Chat messagees' policies
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
-- Policy to allow inserting chat messages if user is assigned to the course the lesson belongs to
CREATE POLICY "Can insert if assigned to course"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN lessons l ON uc.course_id = l.course_id
    WHERE uc.user_id = auth.uid()
      AND l.id = chat_messages.lesson_id
  )
  OR
  (
    -- If the lesson has no course_id, allow the insert
    (SELECT l.course_id FROM lessons l WHERE l.id = chat_messages.lesson_id) IS NULL
  )
);
-- Policy to allow selecting chat messages if user is assigned to the course the lesson belongs to
CREATE POLICY "Can select if assigned to course"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM user_courses uc
    JOIN lessons l ON uc.course_id = l.course_id
    WHERE uc.user_id = auth.uid()
      AND l.id = lesson_id
  )
  OR
  (
    -- If the lesson has no course_id, allow the insert
    (SELECT l.course_id FROM lessons l WHERE l.id = chat_messages.lesson_id) IS NULL
  )
);

-- Chat files' policies
ALTER TABLE chat_files ENABLE ROW LEVEL SECURITY;
-- Policy to allow inserting chat files if the user is the creator of the chat message
CREATE POLICY "Can insert if creator of chat message"
ON public.chat_files
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM chat_messages cm
    WHERE cm.id = chat_files.message_id
      AND cm.creator_id = auth.uid()
  )
  OR
  (
    -- If the lesson has no course_id, allow the insert
    (SELECT l.course_id FROM lessons l 
      JOIN chat_messages cm ON cm.lesson_id = l.id 
      WHERE cm.id = chat_files.message_id) IS NULL
  )
);
-- Policy to allow selecting chat files if the user is assigned to the course the lesson belongs to
CREATE POLICY "Can select if assigned to course"
ON public.chat_files
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM chat_messages cm
    JOIN lessons l ON cm.lesson_id = l.id
    JOIN user_courses uc ON l.course_id = uc.course_id
    WHERE cm.id = message_id
      AND uc.user_id = auth.uid()
  )
  OR
  (
    -- If the lesson has no course_id, allow the insert
    (SELECT l.course_id FROM lessons l 
      JOIN chat_messages cm ON cm.lesson_id = l.id 
      WHERE cm.id = chat_files.message_id) IS NULL
  )
);

-- 
ALTER TABLE sent_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can insert only with service role"
ON public.sent_announcements
FOR insert
TO service_role;

CREATE POLICY "Can select only with service role"
ON public.sent_announcements
FOR select
TO service_role;

create POLICY "Can insert into enrolled course" ON storage.objects for insert WITH CHECK (((bucket_id = 'courses'::text) AND (EXISTS ( SELECT 1 FROM user_courses WHERE ((user_courses.user_id = auth.uid()) AND ((user_courses.course_id)::text = (storage.foldername(objects.name))[1]))))));

create POLICY "Can select from enrolled course" ON storage.objects for select using (((bucket_id = 'courses'::text) AND (EXISTS ( SELECT 1 FROM user_courses WHERE ((user_courses.user_id = auth.uid()) AND ((user_courses.course_id)::text = (storage.foldername(objects.name))[1]))))));

CREATE POLICY "Can select any" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');
CREATE POLICY "Can insert any" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'avatars');