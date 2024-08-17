import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import Input from "@/components/input";
import { getNextMorning } from "@/utils/get-next-morning";
import { supabaseClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

import BaseModal from "@/components/common/modals/base-modal";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { ROLES } from "@/interfaces/user.interface";
import type { Assignment } from "@/types/assignments.type";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { Notification } from "@/types/notifications";
import { getNotificationChannel } from "@/utils/get-notification-channel";
import type { User } from "@supabase/supabase-js";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useEffect, useState } from "react";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onDone: () => void;
  assignmentId?: string;
  user: User;
  course: Course;
  lesson: Lesson;
}
const CreateAssignmentModal: FunctionComponent<IProps> = ({
  onDone,
  assignmentId,
  user,
  course,
  lesson,
  isOpen,
  setIsOpen,
}) => {
  // States
  const [assignment, setAssignment] = useState<
    Omit<Assignment, "id" | "created_at">
  >({
    lesson_id: lesson.id,
    title: "",
    body: "{}",
    due_date: format(getNextMorning(), "yyyy-MM-dd'T'HH:mm:ss"),
  });

  // Vars

  // Handlers
  const handleCreateAssignment = async () => {
    const { error: assignmentErr, data: assignmentData } = await supabaseClient
      .from("assignments")
      .insert(assignment)
      .select("id")
      .single();

    if (assignmentErr) {
      toast.error("Something went wrong");
    } else {
      const { error: coursesErr, data: courses } = await supabaseClient
        .from("courses")
        .select("users(id)")
        .neq("users.id", user.id);

      if (coursesErr) {
        toast.error("Something went wrong");
      } else {
        const { error: notificationsErr } = await supabaseClient
          .from("notifications")
          .insert(
            courses[0].users.map(({ id }) => ({
              user_id: id,
              assignment_id: assignmentData.id,
              course_id: course.id,
              lesson_id: lesson.id,
              is_read: false,
              type: "assignment",
            })) as Notification[]
          )
          .select("*")
          .single();

        const room =
          (user.user_metadata as IUserMetadata).role === ROLES.TEACHER
            ? user.id
            : (user.user_metadata as IUserMetadata).creator_id;

        getNotificationChannel(room).send({
          event: "notification",
          type: "broadcast",
        });

        if (notificationsErr) {
          toast.error("Something went wrong");
        } else {
          toast.success("Assignment created");
          onDone();
        }
      }
    }
  };
  const handleChangeDate = (date: Date) => {
    setAssignment((_assignment) => ({
      ..._assignment,
      due_date: format(date, "yyyy-MM-dd'T'HH:mm:ss"),
    }));
  };

  // Effects
  useEffect(() => {
    if (assignmentId) {
      (async () => {
        const { data, error } = await supabaseClient
          .from("assignments")
          .select("*")
          .eq("id", assignmentId)
          .single();
        if (error) {
          toast.error(error.message);
        } else {
          setAssignment(data);
        }
      })();
    }
  }, []);

  return (
    <BaseModal
      width="lg"
      setIsOpen={setIsOpen}
      isOpen={isOpen}
      title="Assignment"
    >
      <div>
        <Input
          fullWIdth
          Icon={<LessonsIcon size="xs" />}
          placeholder="Assignment name"
          name="title"
          onChange={(e) =>
            setAssignment((prev) => ({ ...prev, title: e.target.value }))
          }
          value={assignment.title}
        />
        <p>Description</p>
        <div className="min-h-[320px]">
          {" "}
          <Editor
            onChange={(data) =>
              setAssignment((prev) => ({
                ...prev,
                body: JSON.stringify(data),
              }))
            }
            data={JSON.parse(assignment.body)}
          />
        </div>

        <div className="flex gap-3 items-center mt-3">
          <div className="pr-3 border-r-2 border-gray-200">
            <DateInput
              date={new Date(assignment.due_date)}
              onChange={handleChangeDate}
              label="Due date"
              popperPlacement="top-start"
            />
          </div>
          <button className="outline-button">Create & add another</button>
          <button
            disabled={!assignment.title}
            className="primary-button"
            onClick={handleCreateAssignment}
          >
            Create
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default CreateAssignmentModal;
