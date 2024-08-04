"use client";

import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import CameraIcon from "@/components/icons/camera-icon";
import ChatIcon from "@/components/icons/chat-icon";
import Chat from "@/components/live-lesson/chat";
import AssignmentsTab from "@/components/live-lesson/tabs/assignments-Tab";
import UserNamePrompt from "@/components/live-lesson/user-name-prompt";
import Tabs from "@/components/tabs";
import VideoChat from "@/components/video-chat";
import Whiteboard from "@/components/whiteboard";
import { useUserName } from "@/hooks/useUserName";
import { ROLES, type IUserMetadata } from "@/interfaces/user.interface";
import { supabaseClient } from "@/utils/supabase/client";
import clsx from "clsx";
import { useEffect, useRef, useState, type FunctionComponent } from "react";
import { v4 as uuid } from "uuid";

import type { Lesson } from "@/types/lessons.type";
import type { RealtimeChannel, User } from "@supabase/supabase-js";

interface IProps {
  user?: User;
  lesson: Lesson;
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
  const role = (user?.user_metadata as IUserMetadata)?.role || ROLES.GUEST;
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
      <main className="flex gap-6">
        <Whiteboard
          lesson={lesson}
          role={role}
          userName={userName}
          channel={channelRef.current}
        />

        <div
          className={`pl-6 relative border-l-2 border-gray-200 ${isAsideOpen ? "flex-1" : "flex-[0]"}`}
        >
          <button
            className={`icon-button shadow-md absolute top-2/4 -left-[16px] transform -translate-y-1/2 ${clsx(isAsideOpen && "[&>.icon]:rotate-180")}`}
            onClick={() => setIsAsideOpen((prev) => !prev)}
          >
            <ArrowRightIcon />
          </button>
          <aside
            className={`${isAsideOpen ? "flex" : "hidden"} flex-col gap-3`}
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
                      channel={channelRef.current}
                      userName={userName}
                      lessonId={lesson.id}
                    />
                  ),
                  Icon: <ChatIcon />,
                },
                {
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
