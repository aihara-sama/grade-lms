"use client";

import Tabs from "@/components/tabs";
import VideoChat from "@/components/video-chat";
import Whiteboard from "@/components/whiteboard";
import { useUserName } from "@/hooks/useUserName";
import { ROLES, type IUserMetadata } from "@/interfaces/user.interface";
import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import type { RealtimeChannel, User } from "@supabase/supabase-js";
import { useEffect, useRef, useState, type FunctionComponent } from "react";
import { v4 as uuid } from "uuid";
import ArrowRightIcon from "../icons/arrow-right-icon";
import AssignmentsIcon from "../icons/assignments-icon";
import CameraIcon from "../icons/camera-icon";
import ChatIcon from "../icons/chat-icon";
import Chat from "./chat";
import AssignmentsTab from "./tabs/assignments-Tab";
import UserNamePrompt from "./user-name-prompt";

interface IProps {
  lessonId: string;
  user?: User;
  lesson: Database["public"]["Tables"]["lessons"]["Row"];
}

const Lesson: FunctionComponent<IProps> = ({ lessonId, lesson, user }) => {
  const [isRightSideOpen, setIsRightSideOpen] = useState(true);
  const [islessonHrExpanded, setIslessonHrExpanded] = useState(false);
  const anonIdRef = useRef<string>(uuid());
  const userNameStore = useUserName();
  const userName =
    (user?.user_metadata as IUserMetadata)?.name || userNameStore.userName;
  const role = (user?.user_metadata as IUserMetadata)?.role || ROLES.GUEST;

  const channelRef = useRef<RealtimeChannel>(
    supabaseClient.channel(lesson.id, {
      config: {
        presence: {
          key: anonIdRef.current,
        },
      },
    })
  );

  useEffect(() => {
    userNameStore.setUserName(localStorage.getItem("userName") || "");
  }, []);

  if (userName === null) return null;
  if (userName === "") return <UserNamePrompt />;

  return (
    <div>
      <main className="flex gap-[24px]">
        <Whiteboard
          islessonHrExpanded={islessonHrExpanded}
          setIslessonHrExpanded={setIslessonHrExpanded}
          lesson={lesson}
          role={role}
          userName={userName}
          channel={channelRef.current}
        />

        <div
          className={`pl-[24px] relative border-l-2 border-gray-200 ${isRightSideOpen ? "flex-1" : "flex-[0]"}`}
        >
          <button
            className={`icon-button shadow-md absolute top-2/4 -left-[16px] transform -translate-y-1/2 ${isRightSideOpen ? "[&>.icon]:rotate-0" : "[&>.icon]:rotate-180"}`}
            onClick={() => setIsRightSideOpen((prev) => !prev)}
          >
            <ArrowRightIcon />
          </button>
          <aside
            className={`${isRightSideOpen ? "flex" : "hidden"} flex-col gap-[14px]`}
          >
            <Tabs
              tabs={[
                {
                  title: "Cameras",
                  content: (
                    <VideoChat
                      channel={channelRef.current}
                      anonId={anonIdRef.current}
                      lessonId={lessonId}
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
                      lessonId={lessonId}
                    />
                  ),
                  Icon: <ChatIcon />,
                },
                {
                  title: "Assignments",
                  content: <AssignmentsTab lessonId={lessonId} />,
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

export default Lesson;
