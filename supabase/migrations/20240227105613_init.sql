/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
  -- UUID from auth.users
  id uuid references auth.users on delete cascade not null primary key,
  creator_id text,
  name text not null,
  role text not null,
  email text not null,
  fcm_token text
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
  insert into public.users (id, email, name, role, creator_id)
  values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'role', new.raw_user_meta_data->>'creator_id');
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
  title text not null
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
  due_date timestamp not null
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

create table messages (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  lesson_id uuid references public.lessons on delete cascade not null,
  reply_id uuid references public.messages on delete cascade,
  author text not null,
  is_poll BOOLEAN default false not null,
  text text
);

create table polls (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  message_id uuid references public.messages on delete cascade not null,
  title text not null
);

create table poll_options (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  poll_id uuid references public.polls on delete cascade not null,
  title text not null,
  votes int default 0
);

-- Create a function to create a poll with options and a new message
create function create_poll_with_options_and_message(lesson_id uuid, author text, poll_title text, poll_options json)
returns uuid as $$
declare
    message_id uuid;
    poll_id uuid;
begin
    -- Insert a new message
    insert into public.messages (lesson_id, author, is_poll)
    values (lesson_id, author, true)
    returning id into message_id;

    -- Create the poll associated with the message
    insert into public.polls (message_id, title)
    values (message_id, poll_title)
    returning id into poll_id;

    -- Insert poll options
    insert into public.poll_options (poll_id, title)
    select poll_id, option->>'title'
    from json_array_elements(poll_options) as option;

    return message_id;
end;
$$ language plpgsql;

-- Example usage:
-- SELECT create_poll_with_options_and_message('Poll Title', '[{"title": "Option 1"}, {"title": "Option 2"}, {"title": "Option 3"}]');

