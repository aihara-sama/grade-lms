CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER as $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    avatar,
    preferred_locale,
    creator_id,
    timezone
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar',
    NEW.raw_user_meta_data->>'preferred_locale',
    NEW.raw_user_meta_data->>'creator_id',
    NEW.raw_user_meta_data->>'timezone'
  );

  INSERT INTO public.user_settings (
    is_emails_on,
    user_id,
    role
  )
  VALUES (
    FALSE,
    NEW.id,
    (NEW.raw_user_meta_data->>'role')::public.Role
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE FUNCTION insert_user_course() -- NEW: public.courses
RETURNS TRIGGER as $$
BEGIN
  INSERT INTO public.user_courses (user_id, course_id)
  VALUES (auth.uid(), NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION create_enrollment_notification() -- NEW: public.user_courses
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user being assigned is not the current user
  IF NEW.user_id != auth.uid() THEN
    -- Insert notification for the assigned user
    INSERT INTO public.notifications (recipient_id, user_id, course_id, type, is_read)
    VALUES (
      NEW.user_id,          -- The user being assigned
      auth.uid(),       -- The user who performed the assignment
      NEW.course_id,         -- The course to which the user was assigned
      'enrollment',-- Notification type
      FALSE                  -- Mark the notification as unread
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION create_submission_notification() -- NEW: public.submissions
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification with lesson_id AND assignment_id
  INSERT INTO public.notifications (
    recipient_id,
    user_id,
    course_id,
    lesson_id,
    assignment_id,
    type,
    is_read
  )
  SELECT 
    u.id,                     -- Recipient ID (user_id of the course creator)
    auth.uid(),               -- Current user who created the submission
    l.course_id,              -- Course ID
    a.lesson_id,              -- Lesson ID FROM the assignment
    NEW.assignment_id,         -- Assignment ID FROM the NEW submission
    'submission',             -- Type of notification
    FALSE                     -- Mark as unread
  FROM public.assignments a
  JOIN public.lessons l ON a.lesson_id = l.id
  JOIN public.courses c ON l.course_id = c.id
  JOIN public.users u ON u.id::TEXT = c.creator_id  -- Get the creator of the course
  WHERE a.id = NEW.assignment_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.create_assignment_notification() -- NEW: public.assignments
RETURNS TRIGGER AS $$
DECLARE
  lesson_course_id UUID;  -- Renamed to aVOID ambiguity
  current_user_id UUID := auth.uid();  -- Get the current authenticated user
  assigned_user RECORD;
BEGIN
  -- Log the assignment creation for debugging
  RAISE NOTICE 'Creating notifications for assignment with lesson_id: %', NEW.lesson_id;

  -- Find the course_id associated with the lesson the assignment belongs to
  SELECT l.course_id INTO lesson_course_id
  FROM public.lessons l
  WHERE l.id = NEW.lesson_id;

  -- Log the course_id found
  RAISE NOTICE 'Course ID for lesson: %', lesson_course_id;

  -- Insert notifications for each user enrolled IN the course, except the current user
  FOR assigned_user IN
    SELECT uc.user_id
    FROM public.user_courses uc
    WHERE uc.course_id = lesson_course_id
    AND uc.user_id != current_user_id  -- Exclude the current user
  LOOP
    -- Log each user for whom a notification will be created
    RAISE NOTICE 'Creating notification for user: %', assigned_user.user_id;

    -- Insert the notification
    INSERT INTO public.notifications (
      recipient_id,
      user_id,
      course_id,
      lesson_id,
      assignment_id,
      created_at,
      type,
      is_read
    )
    VALUES (
      assigned_user.user_id::TEXT,
      assigned_user.user_id,
      lesson_course_id,
      NEW.lesson_id,
      NEW.id,
      NOW(),
      'assignment',
      FALSE
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Helpers
CREATE FUNCTION is_pro(
  user_uuids UUID[]
) 
RETURNS BOOLEAN AS $$ 
DECLARE 
    has_pro BOOLEAN; 
BEGIN 
    -- Check if any user in the array has an active subscription 
    SELECT EXISTS (
        SELECT 1 
        FROM public.subscriptions 
        WHERE user_id = ANY(user_uuids) 
          AND (end_date IS NULL OR end_date > NOW()) 
    ) INTO has_pro; 

    RETURN has_pro; 
END; 
$$ LANGUAGE plpgsql;

CREATE FUNCTION is_in_course(
  p_course_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT p_course_id IN (
      SELECT course_id 
      FROM public.user_courses uc
      WHERE uc.user_id = p_user_id
    )
  );
END;
$$ stable language plpgsql security definer;

CREATE FUNCTION public.can_create_course()
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
  course_count INT;
BEGIN
  -- Get the ID of the currently authenticated user
  SELECT auth.uid() INTO current_user_id;

  -- Get the number of courses created by the user
  SELECT COUNT(*)
  INTO course_count
  FROM public.courses c
  WHERE c.creator_id = current_user_id::TEXT;

  IF (SELECT role FROM public.user_settings WHERE user_id = current_user_id) != 'teacher' THEN
    RETURN FALSE;
  END IF;

  -- Check if the user is Pro and has created 3 or more courses, deny creation if not
  IF is_pro(ARRAY[current_user_id]) = FALSE AND course_count >= 3 THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


-- RPC
CREATE FUNCTION public.delete_auth_users_by_ids(
  user_ids UUID[]
)
RETURNS VOID as $$
BEGIN
  DELETE FROM auth.users
  WHERE id = any(user_ids)
  AND id IN (
    SELECT id
    FROM public.users
    WHERE creator_id = auth.uid()::TEXT
  );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.get_overlapping_lesson(
  p_starts TIMESTAMP, 
  p_ends TIMESTAMP,
  p_lesson_id UUID DEFAULT NULL
)
RETURNS SETOF public.lessons as $$
BEGIN
  RETURN QUERY
  SELECT l.*
  FROM public.lessons l
  JOIN public.user_courses uc ON l.course_id = uc.course_id
  WHERE uc.user_id = auth.uid()
    AND (
        (l.starts <= p_starts AND l.ends > p_starts) -- Case 1: Existing lesson overlaps at the start
        OR
        (l.starts < p_ends AND l.ends >= p_ends)     -- Case 2: Existing lesson overlaps at the END
        OR
        (l.starts >= p_starts AND l.ends <= p_ends)     -- Case 3: 
    )
      -- Exclude the lesson if p_lesson_id is provided
    AND (p_lesson_id IS NULL OR l.id != p_lesson_id);
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.get_upcoming_lessons_users()
RETURNS TABLE (
  id TEXT,
  email TEXT,
  fcm_token TEXT,
  lesson_id TEXT,
  is_emails_on BOOLEAN,
  push_notifications_state public.Push_Notifications_State
)
LANGUAGE sql
AS $$
  SELECT
    u.id,
    u.email,
    COALESCE(ft.fcm_token, '') AS fcm_token,
    l.id AS lesson_id,
    us.is_emails_on,
    u.push_notifications_state
  FROM public.lessons l
  INNER JOIN public.user_courses uc ON l.course_id = uc.course_id
  INNER JOIN public.users u ON uc.user_id = u.id
  LEFT JOIN public.fcm_tokens ft ON u.id = ft.user_id
  LEFT JOIN public.user_settings us ON u.id = us.user_id
  WHERE l.starts BETWEEN NOW() AND NOW() + INTERVAL '5 minutes'
    AND l.id NOT IN (
      SELECT sn.lesson_id
      FROM public.announcements sn
      WHERE sn.user_id = u.id
    );
$$;

CREATE FUNCTION public.expel_all_users_from_course(
  p_course_id UUID,
  p_user_name TEXT
) 
RETURNS VOID as $$
BEGIN
  DELETE FROM public.user_courses
  WHERE user_id IN (
    SELECT u.id
    FROM public.users u
    LEFT JOIN public.user_courses uc ON u.id = uc.user_id AND uc.course_id = p_course_id
    WHERE uc.user_id is not null
    AND u.name ilike '%' || p_user_name || '%'
    AND u.creator_id = auth.uid()::TEXT
  )
  AND course_id = p_course_id;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.enroll_all_users_in_courses(
  p_courses_ids UUID[]
)
RETURNS VOID AS $$
BEGIN
  -- Insert all users with the same creator_id as auth.uid() into user_courses table for each provided course_id
  INSERT INTO public.user_courses ( user_id, course_id, created_at )
  SELECT u.id, course_id, NOW()
  FROM public.users u
  CROSS JOIN UNNEST(p_courses_ids) AS course_id
  WHERE u.creator_id = auth.uid()::TEXT
  ON CONFLICT DO NOTHING;  -- IN case the user is already enrolled IN the course, aVOID errors
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.delete_courses_by_ids(
  p_courses_ids UUID[]
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.courses
  WHERE id = ANY( p_courses_ids );
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.delete_lessons_by_ids(
  p_lessons_ids UUID[]
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.lessons
  WHERE id = ANY(p_lessons_ids);
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.expel_users_FROM_course(
  p_course_id UUID,
  p_users_ids UUID[]
) 
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.user_courses
  WHERE user_id = ANY(p_users_ids)
  AND course_id = p_course_id;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.delete_assignments_by_ids(
  p_assignments_ids UUID[]
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.assignments
  WHERE id = ANY(p_assignments_ids);
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.delete_submissions_by_ids(
  p_submissions_ids UUID[]
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.submissions
  WHERE id = ANY(p_submissions_ids);
END;
$$ LANGUAGE plpgsql;

-- Function to enroll all users IN all courses
CREATE FUNCTION public.enroll_all_users_in_all_courses()
RETURNS VOID AS $$
BEGIN
  -- Insert all users into all courses
  INSERT INTO public.user_courses (user_id, course_id, created_at)
  SELECT u.id as user_id, c.id as course_id, NOW() as created_at
  FROM public.users u, public.courses c
  ON CONFLICT (user_id, course_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION public.enroll_users_in_all_courses(
  users_ids UUID[]
)
RETURNS VOID as $$
BEGIN
  -- Insert given users into all courses
  INSERT INTO public.user_courses (user_id, course_id, created_at)
  SELECT UNNEST(users_ids) as user_id, c.id as course_id, NOW() as created_at
  FROM courses c
  ON CONFLICT (user_id, course_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;