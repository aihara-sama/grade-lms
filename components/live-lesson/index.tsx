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
import { useState, type FunctionComponent } from "react";

import Breadcrumbs from "@/components/breadcrumbs";
import Camera from "@/components/camera";
import CoursesIcon from "@/components/icons/courses-icon";
import { useVideoChat } from "@/hooks/use-video-chat";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";

interface IProps {
  lesson: Lesson & { course: Course };
}

const LiveLesson: FunctionComponent<IProps> = ({ lesson }) => {
  // State
  const [isAsideOpen, setIsAsideOpen] = useState(true);
  const { cameras, toggleAudio, toggleCamera } = useVideoChat();

  return (
    <div>
      {lesson.course && (
        <Breadcrumbs
          Icon={<CoursesIcon />}
          items={[
            { title: "Courses", href: "/dashboard/courses" },
            {
              title: lesson.course.title,
              href: `/dashboard/courses/${lesson.course.id}/overview`,
            },
            {
              title: "Lessons",
              href: `/dashboard/courses/${lesson.course.id}/lessons`,
            },
            {
              title: lesson.title,
              href: `/dashboard/courses/${lesson.course.id}/lessons/${lesson.id}/overview`,
            },
          ]}
        />
      )}
      <main className="flex gap-6 mt-4">
        <Whiteboard lesson={lesson} />

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
            <Tabs
              tabs={[
                {
                  title: "Cameras",
                  content: (
                    <div className="flex flex-col flex-1">
                      <div className="flex flex-col gap-3">
                        {cameras.map((camera, idx) => (
                          <Camera
                            toggleCamera={toggleCamera}
                            toggleAudio={toggleAudio}
                            camera={camera}
                            key={idx}
                          />
                        ))}
                      </div>
                    </div>
                  ),
                  Icon: <CameraIcon />,
                  tier: [Role.Teacher, Role.Student, Role.Guest],
                },
                {
                  title: "Messages",
                  content: <Chat lessonId={lesson.id} />,
                  Icon: <ChatIcon />,
                  tier: [Role.Teacher, Role.Student, Role.Guest],
                },
                {
                  title: "Assignments",
                  content: <AssignmentsTab lessonId={lesson.id} />,
                  Icon: <AssignmentsIcon />,
                  tier: [Role.Teacher],
                },
              ]}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default LiveLesson;
