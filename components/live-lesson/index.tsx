"use client";

import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import CameraIcon from "@/components/icons/camera-icon";
import ChatIcon from "@/components/icons/chat-icon";
import Chat from "@/components/live-lesson/chat";
import AssignmentsTab from "@/components/live-lesson/tabs/assignments-tab";
import UserNamePrompt from "@/components/live-lesson/user-name-prompt";
import Tabs from "@/components/tabs";
import VideoChat from "@/components/video-chat";
import Whiteboard from "@/components/whiteboard";
import { useUserName } from "@/hooks/useUserName";
import { Role, type IUserMetadata } from "@/interfaces/user.interface";
import { supabaseClient } from "@/utils/supabase/client";
import clsx from "clsx";
import { useEffect, useRef, useState, type FunctionComponent } from "react";
import { v4 as uuid } from "uuid";

import Breadcrumbs from "@/components/breadcrumbs";
import CoursesIcon from "@/components/icons/courses-icon";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import type { RealtimeChannel, User } from "@supabase/supabase-js";

interface IProps {
  user?: User;
  lesson: Lesson & { course: Course };
}

const LiveLesson: FunctionComponent<IProps> = ({ lesson, user }) => {
  // State
  const [isAsideOpen, setIsAsideOpen] = useState(true);

  // Refs
  const anonIdRef = useRef<string>(uuid());
  const channelRef = useRef<RealtimeChannel>(
    supabaseClient.channel(lesson.id, {
      config: {
        presence: {
          key: anonIdRef.current,
        },
      },
    })
  );

  // Hooks
  const userNameStore = useUserName();

  // Vars
  const role = (user?.user_metadata as IUserMetadata)?.role || Role.GUEST;
  const userName =
    (user?.user_metadata as IUserMetadata)?.name || userNameStore.userName;

  // Effects
  useEffect(() => {
    userNameStore.setUserName(localStorage.getItem("userName") || "");
  }, []);

  // View
  if (userName === null) return null;
  if (userName === "") return <UserNamePrompt />;

  return (
    <div>
      {lesson.course && (
        <Breadcrumbs
          Icon={<CoursesIcon />}
          items={[
            { title: "Courses", href: "/dashboard/courses" },
            {
              title: lesson.course?.title,
              href: `/dashboard/courses/${lesson.course.id}/overview`,
            },
            {
              title: "Lessons",
              href: `/dashboard/courses/${lesson.course.id}/lessons`,
            },
            {
              isCurrentPage: true,
              title: lesson?.title,
              href: `/dashboard/courses/${lesson.course.id}/lessons/${lesson?.id}/overview`,
            },
          ]}
        />
      )}
      <main className="flex gap-6 mt-4">
        <Whiteboard
          lesson={lesson}
          role={role}
          userName={userName}
          channel={channelRef.current}
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
            <Tabs
              tabs={[
                {
                  title: "Cameras",
                  content: (
                    <VideoChat
                      channel={channelRef.current}
                      anonId={anonIdRef.current}
                      lessonId={lesson.id}
                      role={role}
                      userName={userName}
                    />
                  ),
                  Icon: <CameraIcon />,
                },
                {
                  title: "Messages",
                  content: (
                    <Chat
                      userRole={role}
                      channel={channelRef.current}
                      userName={userName}
                      lessonId={lesson.id}
                      avatar={
                        role === Role.GUEST
                          ? "default-abatar"
                          : (user.user_metadata as IUserMetadata).avatar
                      }
                    />
                  ),
                  Icon: <ChatIcon />,
                },
                role === Role.TEACHER && {
                  title: "Assignments",
                  content: <AssignmentsTab lessonId={lesson.id} />,
                  Icon: <AssignmentsIcon />,
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
