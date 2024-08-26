
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
  created_at timestamp not null default now()
);
alter table users enable row level security;
create policy "Can view user's data." on users for select using (true);
create policy "Can update own's data." on users for update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, name, role, avatar, preferred_locale, creator_id)
  values (new.id, new.email, new.raw_user_meta_data->>'name', (new.raw_user_meta_data->>'role')::public.Role, new.raw_user_meta_data->>'avatar', new.raw_user_meta_data->>'preferred_locale', new.raw_user_meta_data->>'creator_id');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


/** 
* Courses
*/
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

/** 
* Lessons
*/
create table lessons (
  -- UUID from auth.users
  id uuid not null primary key DEFAULT gen_random_uuid(),
  course_id uuid references public.courses on delete cascade,
  created_at timestamp not null default now(),
  title text DEFAULT 'Quick lesson' not null,
  whiteboard_data text default '{}' not null,
  starts timestamp not null,
  ends timestamp not null
);
/** 
* Notifications
*/
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

-- Create a function to create a lesson and its assignments
create function create_lesson_with_assignments(new_course_id uuid, new_title text, new_starts timestamp, new_ends timestamp, new_assignments json)
returns uuid as $$
declare
    lesson_id uuid;
begin
    insert into public.lessons (course_id, title, starts, ends)
    values (new_course_id, new_title, new_starts, new_ends)
    returning id into lesson_id;

    insert into public.assignments (lesson_id, title, body, due_date)
    select lesson_id, assignment->>'title', assignment->>'body', assignment->>'due_date'
    from json_array_elements(new_assignments) as assignment;

    return lesson_id;
end;
$$ language plpgsql;

-- Example usage:
-- SELECT create_lesson_with_assignments('<course_id>', 'Lesson Title', '2024-03-03 12:00:00', '2024-03-03 14:00:00', '[{"dueDate": "2024-03-05 12:00:00", "title": "Assignment 1", "body": "Assignment 1 description"}, {"dueDate": "2024-03-08 12:00:00", "title": "Assignment 2", "body": "Assignment 2 description"}]');





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

create or replace function public.get_users_not_in_course(p_course_id uuid)
returns setof public.users as $$
begin
    return query
    select u.*
    from public.users u
    left join public.user_courses uc on u.id = uc.user_id and uc.course_id = p_course_id
    where uc.user_id is null;
end;
$$ language plpgsql;

create or replace function public.get_courses_not_assigned_to_user(p_user_id uuid)
returns setof public.courses as $$
begin
    return query
    select c.*
    from public.courses c
    left join public.user_courses uc on c.id = uc.course_id and uc.user_id = p_user_id
    where uc.user_id is null;
end;
$$ language plpgsql;


create or replace function delete_courses_by_title_and_user_id(p_user_id uuid, p_title text)
returns void as $$
begin
  delete from courses
  where id in (
    select course_id
    from user_courses
    join courses on user_courses.course_id = courses.id
    where user_courses.user_id = p_user_id
      and (p_title = '' or courses.title ILIKE '%' || p_title || '%')
  );
end;
$$ language plpgsql;


-- Step 1: Create the trigger function to delete from auth.users
create or replace function delete_auth_user()
returns trigger as $$
begin
  delete from auth.users
  where id = old.id; -- Match by the same UUID
  return old;
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