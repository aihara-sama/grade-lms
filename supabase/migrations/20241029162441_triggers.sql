CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();

CREATE TRIGGER on_course_created
AFTER INSERT ON public.courses
FOR EACH ROW
EXECUTE PROCEDURE public.insert_user_course();

CREATE TRIGGER on_user_courses_created
AFTER INSERT ON public.user_courses
FOR EACH ROW
EXECUTE PROCEDURE public.create_enrollment_notification();

CREATE TRIGGER on_submission_created
AFTER INSERT ON public.submissions
FOR EACH ROW
EXECUTE PROCEDURE public.create_submission_notification();

CREATE TRIGGER on_assignment_created
AFTER INSERT ON public.assignments
FOR EACH ROW
EXECUTE PROCEDURE public.create_assignment_notification();