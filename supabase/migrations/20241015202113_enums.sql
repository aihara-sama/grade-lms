CREATE TYPE public.Role AS ENUM ('teacher', 'student', 'guest');

CREATE TYPE public.Push_Notifications_State AS ENUM ('idle', 'on', 'off');

CREATE TYPE public.Notification_Type AS ENUM ('enrollment', 'submission', 'assignment');