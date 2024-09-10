"use client";

import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import CameraIcon from "@/components/icons/camera-icon";
import ChatIcon from "@/components/icons/chat-icon";
import Chat from "@/components/live-lesson/chat";
import AssignmentsTab from "@/components/live-lesson/tabs/assignments-tab";
import Tabs from "@/components/tabs";
import Whiteboard from "@/components/whiteboard";
import { Role } from "@/interfaces/user.interface";
import clsx from "clsx";
import { useEffect, useState, type FunctionComponent } from "react";

import Breadcrumbs from "@/components/breadcrumbs";
import Camera from "@/components/camera";
import CoursesIcon from "@/components/icons/courses-icon";
import TimeIcon from "@/components/icons/time-icon";
import { useVideoChat } from "@/hooks/use-video-chat";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import { execAtStartOfMin } from "@/utils/interval-at-start-of-min";
import { isLessonEnded } from "@/utils/is-lesson-ended";
import { db } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface Props {
  lesson: Lesson & { course: Course };
}

const LiveLesson: FunctionComponent<Props> = ({ lesson }) => {
  // State
  const [isAsideOpen, setIsAsideOpen] = useState(true);
  const [isLessonEnding, setIsLessonEnding] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(lesson);
  const {
    cameras,
    fireAndToggleAudio,
    fireAndToggleCamera,
    endSession,
    startSession,
  } = useVideoChat();

  const t = useTranslations();

  const fetchLesson = async () => {
    try {
      const { data, error } = await db
        .from("lessons")
        .select("*, course:courses(*)")
        .eq("id", lesson.id)
        .single();

      if (error) throw new Error(t("something_went_wrong"));

      setCurrentLesson(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const tabs = [
    {
      title: "Cameras",
      content: (
        <div className="flex flex-col flex-1">
          <div className="flex flex-col gap-3">
            {isLessonEnded(new Date(lesson.ends)) ? (
              <div className="mt-5 flex flex-col items-center gap-4 text-neutral-500">
                <div> This session has ended</div>
                <TimeIcon size="md" />
              </div>
            ) : (
              cameras.map((camera, idx) => (
                <Camera
                  toggleCamera={fireAndToggleCamera}
                  toggleAudio={fireAndToggleAudio}
                  camera={camera}
                  key={idx}
                />
              ))
            )}
          </div>
        </div>
      ),
      Icon: <CameraIcon />,
      tier: [Role.Teacher, Role.Student, Role.Guest],
    },
    {
      title: "Messages",
      content: <Chat lesson={lesson} />,
      Icon: <ChatIcon />,
      tier: [Role.Teacher, Role.Student, Role.Guest],
    },
  ];

  if (lesson.course_id) {
    tabs.push({
      title: "Assignments",
      content: (
        <AssignmentsTab
          lessonId={currentLesson.id}
          courseId={currentLesson.course_id}
        />
      ),
      Icon: <AssignmentsIcon />,
      tier: [Role.Teacher],
    });
  }
  useEffect(() => {
    if (!isLessonEnded(new Date(lesson.ends))) startSession();
  }, []);
  useEffect(() => {
    if (isLessonEnded(new Date(lesson.ends))) endSession();
  }, [lesson]);
  useEffect(() => {
    if (!isLessonEnded(new Date(lesson.ends)))
      execAtStartOfMin(async (stop) => {
        try {
          const { data, error } = await db
            .from("lessons")
            .select("ends")
            .eq("id", lesson.id)
            .single();

          if (error) throw new Error(error.message);

          const timeRemains = +new Date(data.ends) - +new Date();

          if (isLessonEnded(new Date(data.ends))) {
            endSession();
            setCurrentLesson((_) => ({ ..._ }));
            toast.success("The lesson has ended");

            stop();
          }

          if (timeRemains <= 1000 * 60) {
            setIsLessonEnding(true);
          }
        } catch (error: any) {
          console.error(error);
        }
      });
  }, []);

  return (
    <div>
      {currentLesson.course && (
        <Breadcrumbs
          Icon={<CoursesIcon />}
          items={[
            { title: "Courses", href: "/dashboard/courses" },
            {
              title: currentLesson.course.title,
              href: `/dashboard/courses/${currentLesson.course.id}/overview`,
            },
            {
              title: "Lessons",
              href: `/dashboard/courses/${currentLesson.course.id}/lessons`,
            },
            {
              title: currentLesson.title,
              href: `/dashboard/courses/${currentLesson.course.id}/lessons/${currentLesson.id}/overview`,
            },
          ]}
        />
      )}
      <main className="flex gap-6 mt-4">
        <Whiteboard
          isLessonEnding={isLessonEnding}
          onLessonExtended={fetchLesson}
          lesson={currentLesson}
        />
        <div
          className={`pl-6 flex relative border-l-2 border-gray-200 ${isAsideOpen ? "flex-1" : "flex-[0]"}`}
        >
          <button
            className={`icon-button shadow-md absolute top-2/4 -left-[16px] transform -translate-y-1/2 ${clsx(isAsideOpen && "[&>.icon]:rotate-180")}`}
            onClick={() => setIsAsideOpen((prev) => !prev)}
          >
            <ArrowRightIcon />
          </button>
          <aside
            className={`${isAsideOpen ? "flex" : "hidden"} flex-col gap-3 w-[350px]`}
          >
            <Tabs tabs={tabs} />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default LiveLesson;
