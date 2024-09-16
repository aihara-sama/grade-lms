
/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
CREATE TYPE public.Role AS ENUM ('Teacher', 'Student', 'Guest');
create table users (
  -- UUID from auth.users
  id uuid references auth.users on delete cascade not null primary key,
  creator_id text,
  name text not null,
  role Role not null,
  email text not null,
  avatar text not null,
  preferred_locale text not null,
  fcm_token text,
  timezone text not null,
  is_emails_on boolean not null,
  is_push_notifications_on boolean not null,
  created_at timestamp not null default now()
);
alter table users enable row level security;
create policy "Can view user's data." on users for select using (true);
create policy "Can update own's data." on users for update using (auth.uid() = id);

create table courses (
  -- UUID from auth.users
  id uuid not null primary key DEFAULT gen_random_uuid(),
  -- user_id uuid references auth.users on delete cascade not null,
  title text not null,
  created_at timestamp not null default now()
);
alter table courses enable row level security;
create policy "Can view course's data." on courses for select using (true);
create policy "Can delete course's data." on courses for delete using (true);
create policy "Can update course's data." on courses for update using (true);
create policy "Can insert course's data." on courses for insert with check (true);

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
  created_at timestamp not null default now(),
  title text DEFAULT 'Quick lesson' not null,
  whiteboard_data text default '{}' not null,
  starts timestamp with time zone not null,
  ends timestamp with time zone not null
);

create table sent_notifications (
  -- UUID from auth.users
  id uuid not null primary key DEFAULT gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  lesson_id uuid references public.lessons on delete cascade
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
  user_id uuid references public.users on delete cascade not null,
  body text not null,
  title text not null,
  grade int,
  created_at timestamp not null default now()
);

create table notifications (
  -- UUID from auth.users
  id uuid not null primary key DEFAULT gen_random_uuid(),
  user_id uuid references public.users on delete SET NULL,
  course_id uuid references public.courses on delete SET NULL,
  lesson_id uuid references public.lessons on delete SET NULL,
  assignment_id uuid references public.assignments on delete SET NULL,
  submission_id uuid references public.submissions on delete SET NULL,
  created_at timestamp not null default now(),
  type text not null,
  is_read boolean not null
);

create table chat_messages (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  lesson_id uuid references public.lessons on delete cascade not null,
  reply_id uuid references public.chat_messages on delete cascade,
  author text not null,
  author_avatar text not null,
  author_role Role not null,
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

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, name, role, avatar, preferred_locale, creator_id, timezone, is_emails_on, is_push_notifications_on)
  values (new.id, new.email, new.raw_user_meta_data->>'name', (new.raw_user_meta_data->>'role')::public.Role, new.raw_user_meta_data->>'avatar', new.raw_user_meta_data->>'preferred_locale', new.raw_user_meta_data->>'creator_id', new.raw_user_meta_data->>'timezone', (new.raw_user_meta_data->>'is_emails_on')::boolean, (new.raw_user_meta_data->>'is_push_notifications_on')::boolean);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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

create or replace function get_courses_not_assigned_to_user(p_user_id uuid, p_course_title text)
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



create or replace function delete_all_courses(p_title text)
returns void as $$
begin
  delete from courses
  where id in (
    select course_id
    from user_courses
    join courses on user_courses.course_id = courses.id
    where user_courses.user_id = auth.uid()
      and (courses.title ILIKE '%' || p_title || '%')
  );
end;
$$ language plpgsql;

create policy "Can delete users created by current user" on public.users
for delete
using (auth.uid()::text = creator_id);

alter table auth.users enable row level security;
create policy "Can delete users created by current user" on auth.users
for delete
using (auth.uid()::text = (select creator_id from public.users where id = auth.users.id));

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
    p_user_id uuid, 
    p_lesson_id uuid DEFAULT NULL
)
returns setof lessons as $$
begin
    return query
    select l.*
    from lessons l
    join user_courses uc on l.course_id = uc.course_id
    where uc.user_id = p_user_id
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


CREATE OR REPLACE FUNCTION get_upcoming_lessons_users()
RETURNS TABLE (
  id text,
  email text,
  fcm_token text,
  lesson_id text,
  is_emails_on boolean,
  is_push_notifications_on boolean
)
LANGUAGE sql
AS $$
  SELECT
    u.id,
    u.email,
    u.fcm_token,
    l.id AS lesson_id,
    u.is_emails_on,
    u.is_push_notifications_on
  FROM lessons l
  INNER JOIN user_courses uc ON l.course_id = uc.course_id
  INNER JOIN users u ON uc.user_id = u.id
  WHERE l.starts BETWEEN NOW() AND NOW() + INTERVAL '5 minutes'
    AND l.id NOT IN (
      SELECT sn.lesson_id
      FROM sent_notifications sn
      WHERE sn.user_id = u.id
    );
$$;


CREATE OR REPLACE FUNCTION enroll_all_users(p_course_id uuid)
RETURNS void AS $$
BEGIN
  -- Insert all users with the same creator_id as auth.uid() into user_courses table
  INSERT INTO public.user_courses (user_id, course_id, created_at)
  SELECT u.id, p_course_id, NOW()
  FROM public.users u
  WHERE u.creator_id = auth.uid()::text
  ON CONFLICT DO NOTHING;  -- In case the user is already enrolled in the course, avoid errors
END;
$$ LANGUAGE plpgsql;


create function public.dispel_all_users_from_course(
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

CREATE OR REPLACE FUNCTION public.delete_courses_by_ids(p_courses_ids uuid[])
RETURNS void AS $$
BEGIN
  DELETE FROM public.courses
  WHERE id = ANY(p_courses_ids)
  AND id IN (
    SELECT uc.course_id
    FROM public.user_courses uc
    WHERE uc.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql;


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

CREATE OR REPLACE FUNCTION public.delete_lessons_by_ids(p_lessons_ids uuid[])
RETURNS void AS $$
BEGIN
  DELETE FROM public.lessons
  WHERE id = ANY(p_lessons_ids);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.dispel_users_from_course(
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


CREATE OR REPLACE FUNCTION public.delete_lesson_assignments(
  p_lesson_id uuid,
  p_title text
)
RETURNS void AS $$
BEGIN
  DELETE FROM public.assignments
  WHERE lesson_id = p_lesson_id
  AND title ILIKE '%' || p_title || '%';
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
