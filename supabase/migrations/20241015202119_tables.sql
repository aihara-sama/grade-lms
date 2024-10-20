CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  creator_id TEXT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT NOT NULL,
  preferred_locale TEXT NOT NULL,
  timezone TEXT NOT NULL,
  push_notifications_state public.Push_Notifications_State NOT NULL DEFAULT 'idle',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE public.user_settings (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  is_emails_on BOOLEAN NOT NULL,
  is_pro BOOLEAN NOT NULL,
  role public.Role NOT NULL,
  user_id UUID UNIQUE REFERENCES public.users ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.subscriptions (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id TEXT,
  user_id UUID REFERENCES public.users ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  end_date TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.fcm_tokens (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  fcm_token TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.courses (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id TEXT NOT NULL DEFAULT auth.uid()::TEXT,
  title TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_courses (
  user_id UUID REFERENCES public.users ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);

CREATE TABLE public.lessons (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.users ON DELETE CASCADE DEFAULT auth.uid(),
  title TEXT DEFAULT 'Quick lesson' NOT NULL,
  whiteboard_data TEXT DEFAULT '{}' NOT NULL,
  starts TIMESTAMP WITH TIME ZONE NOT NULL,
  ends TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.assignments (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT DEFAULT '{}' NOT NULL,
  due_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.submissions (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  body TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.grades (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id TEXT NOT NULL DEFAULT auth.uid(),
  submissions_id UUID REFERENCES public.submissions ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.notifications (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id TEXT NOT NULL,
  user_id UUID REFERENCES public.users ON DELETE SET NULL,
  course_id UUID REFERENCES public.courses ON DELETE SET NULL,
  lesson_id UUID REFERENCES public.lessons ON DELETE SET NULL,
  assignment_id UUID REFERENCES public.assignments ON DELETE SET NULL,
  submission_id UUID REFERENCES public.submissions ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  type public.Notification_Type NOT NULL,
  is_read BOOLEAN NOT NULL
);

CREATE TABLE public.chat_messages (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons ON DELETE CASCADE NOT NULL,
  reply_id UUID REFERENCES public.chat_messages ON DELETE CASCADE,
  creator_id UUID REFERENCES public.users ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  text TEXT
);

CREATE TABLE public.chat_files (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.chat_messages ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  ext TEXT NOT NULL,
  path TEXT NOT NULL,
  size int NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

create table announcements (
  id uuid not null primary key DEFAULT gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  lesson_id uuid references public.lessons on delete cascade,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);