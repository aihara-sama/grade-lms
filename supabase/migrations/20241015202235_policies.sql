-- Users' policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role insert into users"
ON public.users
FOR INSERT
TO service_role;

CREATE POLICY "Allow authenticated user select on their own or related users"
ON public.users
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
  OR auth.uid()::TEXT = public.users.creator_id
  OR EXISTS (
    SELECT 1
    FROM public.user_courses uc
    JOIN public.user_courses uc2
      ON uc.course_id = uc2.course_id
    WHERE uc.user_id = auth.uid()
      AND uc2.user_id = public.users.id
  )
);

CREATE POLICY "Allow user or creator to update their own record"
ON public.users
FOR UPDATE
USING (
  auth.uid() = public.users.id
  OR auth.uid()::TEXT = public.users.creator_id
);

CREATE POLICY "Allow user or creator to delete their own record"
ON public.users
FOR DELETE
USING (
  auth.uid() = public.users.id
  OR auth.uid()::TEXT = public.users.creator_id
);


-- FCM tokens' polocies
ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated user to insert their own FCM token"
ON public.fcm_tokens
FOR INSERT
TO authenticated WITH CHECK (
  public.fcm_tokens.user_id = auth.uid()
);

CREATE POLICY "Allow authenticated user to select their own FCM token"
ON public.fcm_tokens
for SELECT
USING (
  public.fcm_tokens.user_id = auth.uid() 
);

CREATE POLICY "Allow authenticated user to update their own FCM token"
ON public.fcm_tokens
FOR UPDATE
USING (
  public.fcm_tokens.user_id = auth.uid()
);


-- Courses' policies
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated user to create course if permitted"
ON public.courses
FOR INSERT
TO authenticated
WITH CHECK (
  can_create_course()
);

CREATE POLICY "Allow authenticated user to select own or enrolled courses"
ON public.courses
FOR SELECT
TO authenticated
USING ( 
  public.courses.creator_id = auth.uid()::TEXT
  OR EXISTS (
    SELECT 1
    FROM public.user_courses uc
    WHERE uc.course_id = public.courses.id
      AND uc.user_id = auth.uid()
  )
 );

CREATE POLICY "Allow course creator to update their own course"
ON public.courses
FOR UPDATE
TO authenticated
USING (
  public.courses.creator_id = auth.uid()::TEXT
);

CREATE POLICY "Allow course creator to delete their own course"
ON public.courses
FOR DELETE
TO authenticated
USING (
  public.courses.creator_id = auth.uid()::TEXT
);


-- User courses' policies
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow course creator to add users to their own course" 
ON public.user_courses 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.courses c
    WHERE c.id = course_id 
      AND c.creator_id = auth.uid()::TEXT
  )
);

CREATE POLICY "Allow authenticated user to select course participants if enrolled"
ON public.user_courses
FOR SELECT
TO authenticated
USING (
  public.is_in_course(
    public.user_courses.course_id, auth.uid()
  )
);

CREATE POLICY "Allow course creator to update user course associations"
ON public.user_courses
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.courses c
    WHERE c.id = public.user_courses.course_id
      AND c.creator_id = auth.uid()::TEXT
  )
);

CREATE POLICY "Allow course creator to delete user course associations"
ON public.user_courses
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.courses c
    WHERE c.id = public.user_courses.course_id
      AND c.creator_id = auth.uid()::TEXT
  )
);


--  Lessons' policies
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated user to insert lesson if in course or creator"
ON public.lessons
FOR INSERT
TO authenticated
WITH CHECK (
  course_id IS NULL
  OR
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    JOIN public.courses c
      ON uc.course_id = c.id
    WHERE uc.user_id = auth.uid()
      AND c.id = public.lessons.course_id
      AND c.creator_id = auth.uid()::TEXT
  )
);

CREATE POLICY "Allow authenticated user to select lesson if enrolled in course"
ON public.lessons
FOR SELECT
USING (
  course_id IS NULL
  OR
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    WHERE uc.user_id = auth.uid()
      AND uc.course_id = public.lessons.course_id
  )
);

CREATE POLICY "Allow lesson creator to update their own lesson"
ON public.lessons
FOR UPDATE
USING (
  public.lessons.creator_id = auth.uid()
);

CREATE POLICY "Allow lesson creator to delete their own lesson"
ON public.lessons
FOR DELETE
USING (
  public.lessons.creator_id = auth.uid()
);


-- Assignments' policies
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow teachers to insert assignment linked to their course"
ON public.assignments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    JOIN public.lessons l
      ON uc.course_id = l.course_id
    JOIN public.user_settings us
      ON uc.user_id = us.user_id
    WHERE uc.user_id = auth.uid()
      AND l.id = public.assignments.lesson_id
      AND us.role = 'teacher'
  )
);

CREATE POLICY "Allow enrolled users to select assignments linked to their lessons"
ON public.assignments
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    JOIN public.lessons l
      ON uc.course_id = l.course_id
    WHERE uc.user_id = auth.uid()
      AND l.id = public.assignments.lesson_id
  )
);

CREATE POLICY "Allow teachers to update assignments linked to their lessons"
ON public.assignments
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    JOIN public.lessons l
      ON uc.course_id = l.course_id
    JOIN public.user_settings us
      ON uc.user_id = us.user_id
    WHERE uc.user_id = auth.uid()
      AND l.id = public.assignments.lesson_id
      AND us.role = 'teacher'
  )
);

CREATE POLICY "Allow teachers to delete assignments linked to their lessons"
ON public.assignments
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    JOIN public.lessons l
      ON uc.course_id = l.course_id
    JOIN public.user_settings us
      ON uc.user_id = us.user_id
    WHERE uc.user_id = auth.uid()
      AND l.id = public.assignments.lesson_id
      AND us.role = 'teacher'
  )
);


-- Submissions' policies
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow students to insert their submissions for relevant assignments"
ON public.submissions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    JOIN public.lessons l
      ON uc.course_id = l.course_id
    JOIN public.assignments a
      ON a.lesson_id = l.id
    JOIN public.user_settings us
      ON uc.user_id = us.user_id
    WHERE uc.user_id = auth.uid()
      AND a.id = public.submissions.assignment_id
      AND us.role = 'student'
  )
);

CREATE POLICY "Allow students and teachers to select submissions for their lessons"
ON public.submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    JOIN public.lessons l
      ON uc.course_id = l.course_id
    JOIN public.assignments a
      ON a.lesson_id = l.id
    JOIN public.user_settings us
      ON uc.user_id = us.user_id
    WHERE (
      public.submissions.user_id = auth.uid()
      OR (uc.user_id = auth.uid() AND us.role = 'teacher')
    )
      AND a.id = public.submissions.assignment_id
  )
);

CREATE POLICY "Allow students to update their own submissions"
ON public.submissions
FOR UPDATE
USING (
  public.submissions.user_id = auth.uid()
);

CREATE POLICY "Allow students to delete their own submissions"
ON public.submissions
FOR DELETE
USING (
  public.submissions.user_id = auth.uid()
);


-- Submissions' policies
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow course creators to insert grades for valid submissions"
ON public.grades
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.courses c
    JOIN public.lessons l
      ON l.course_id = c.id
    JOIN public.assignments a
      ON a.lesson_id = l.id
    JOIN public.submissions s
      ON s.assignment_id = a.id
    WHERE s.id = public.grades.submissions_id
      AND c.creator_id = auth.uid()::TEXT
  )
);

CREATE POLICY "Allow course creators to update grades they assigned"
ON public.grades
FOR UPDATE
USING (
  public.grades.creator_id = auth.uid()::TEXT
);

CREATE POLICY "Allow course creators and students to view grades for relevant submissions"
ON public.grades
FOR SELECT
USING (
  public.grades.creator_id = auth.uid()::TEXT
  OR EXISTS (
    SELECT 1
    FROM public.submissions s
    WHERE s.id = submissions_id
      AND s.user_id = auth.uid()
  )
);


-- Notifications' policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert notifications for their courses"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    WHERE uc.user_id = auth.uid()
      AND uc.course_id = public.notifications.course_id
  )
);

CREATE POLICY "Allow users to select notifications addressed to them"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  public.notifications.recipient_id = auth.uid()::TEXT
);

CREATE POLICY "Allow users to update their own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (
  public.notifications.recipient_id = auth.uid()::TEXT
);


-- Chat messagees' policies
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert messages for their lessons"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    JOIN public.lessons l
      ON uc.course_id = l.course_id
    WHERE uc.user_id = auth.uid()
      AND l.id = public.chat_messages.lesson_id
  )
  OR
  (
    (
      SELECT l.course_id
      FROM public.lessons l
      WHERE l.id = public.chat_messages.lesson_id
    ) IS NULL
  )
);

CREATE POLICY "Allow authenticated users to select messages from their lessons"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_courses uc
    JOIN public.lessons l
      ON uc.course_id = l.course_id
    WHERE uc.user_id = auth.uid()
      AND l.id = public.chat_messages.lesson_id
  )
  OR
  (
    (
      SELECT l.course_id
      FROM public.lessons l
      WHERE l.id = public.chat_messages.lesson_id
    ) IS NULL
  )
);


-- Chat files' policies
ALTER TABLE public.chat_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to insert files for their chat messages"
ON public.chat_files
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.chat_messages cm
    WHERE cm.id = public.chat_files.message_id
      AND cm.creator_id = auth.uid()
  )
  OR
  (
    (
      SELECT l.course_id
      FROM public.lessons l 
      JOIN public.chat_messages cm
        ON cm.lesson_id = l.id 
      WHERE cm.id = public.chat_files.message_id
    ) IS NULL
  )
);

CREATE POLICY "Allow authenticated users to select files from their chat messages"
ON public.chat_files
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.chat_messages cm
    JOIN public.lessons l
      ON cm.lesson_id = l.id
    JOIN public.user_courses uc
      ON l.course_id = uc.course_id
    WHERE cm.id = public.chat_files.message_id
      AND uc.user_id = auth.uid()
  )
  OR
  (
    (
      SELECT l.course_id
      FROM public.lessons l 
      JOIN public.chat_messages cm
        ON cm.lesson_id = l.id 
      WHERE cm.id = public.chat_files.message_id
    ) IS NULL
  )
);

-- User settings' policies
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to insert user settings"
ON public.user_settings
FOR INSERT
TO service_role;

CREATE POLICY "Allow authenticated users to select user settings"
ON public.user_settings
FOR SELECT
TO authenticated
using (
  TRUE
);

CREATE POLICY "Allow service role to update user settings"
ON public.user_settings
FOR UPDATE
TO service_role;

-- Subcriptions' policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to insert subscriptions"
ON public.subscriptions
FOR INSERT
TO service_role;

CREATE POLICY "Allow current users to select subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
using (
  auth.uid() = public.subscriptions.user_id
);

CREATE POLICY "Allow service role to update subscriptions"
ON public.user_settings
FOR UPDATE
TO service_role;

-- Announcements' policies 
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role to insert announcements"
ON public.announcements
FOR INSERT
TO service_role;

CREATE POLICY "Allow service role to select announcements"
ON public.announcements
FOR SELECT
TO service_role;


-- Storage's policies
CREATE POLICY "Allow insertion of objects in 'courses' bucket for enrolled users"
ON storage.objects
FOR INSERT
WITH CHECK (
  (
    (bucket_id = 'courses'::TEXT)
    AND (
      EXISTS (
        SELECT 1
        FROM public.user_courses uc
        WHERE (
          (uc.user_id = auth.uid())
          AND ((uc.course_id)::TEXT = (storage.foldername(objects.name))[1])
        )
      )
    )
  )
);

CREATE POLICY "Allow selection of objects in 'courses' bucket for authenticated users"
ON storage.objects
FOR SELECT
USING (
  (
    (bucket_id = 'courses'::TEXT)
    AND (
      EXISTS (
        SELECT 1
        FROM public.user_courses uc
        WHERE (
          (uc.user_id = auth.uid())
          AND ((uc.course_id)::TEXT = (storage.foldername(objects.name))[1])
        )
      )
    )
  )
);

CREATE POLICY "Allow selection of objects in 'avatars' bucket for all users"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'avatars'
);

CREATE POLICY "Allow insertion of objects in 'avatars' bucket for all users"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'avatars'
);

CREATE POLICY "Allow selection of objects in 'paypal-certs' bucket for service role"
ON storage.objects
FOR SELECT
TO service_role
USING (
  bucket_id = 'paypal-certs'
);

CREATE POLICY "Allow insertion of objects in 'paypal-certs' bucket for service role"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (
  bucket_id = 'paypal-certs'
);