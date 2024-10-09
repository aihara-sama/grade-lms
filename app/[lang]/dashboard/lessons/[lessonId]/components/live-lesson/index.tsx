"use client";

import Chat from "@/app/[lang]/dashboard/lessons/[lessonId]/components/live-lesson/chat";
import AssignmentsTab from "@/app/[lang]/dashboard/lessons/[lessonId]/components/live-lesson/tabs/assignments-tab";
import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import CameraIcon from "@/components/icons/camera-icon";
import ChatIcon from "@/components/icons/chat-icon";
import Whiteboard from "@/components/lesson/whiteboard";
import clsx from "clsx";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
} from "react";

import Breadcrumbs from "@/components/common/breadcrumbs";
import Camera from "@/components/common/camera";
import BasicTabs from "@/components/common/tabs/basic-tabs";
import CoursesIcon from "@/components/icons/courses-icon";
import TimeIcon from "@/components/icons/time-icon";
import Container from "@/components/layout/container";
import { getLesson } from "@/db/client/lesson";
import { useChat } from "@/hooks/use-chat";
import { useLesson } from "@/hooks/use-lesson";
import { useVideoChat } from "@/hooks/use-video-chat";
import type { Tab } from "@/interfaces/tabs.interface";
import { execAtStartOfMin } from "@/utils/date/interval-at-start-of-min";
import { isLessonEnded } from "@/utils/lesson/is-lesson-ended";
import { isLessonEnding } from "@/utils/lesson/is-lesson-ending";
import toast from "react-hot-toast";

const LiveLesson: FunctionComponent = () => {
  // Hooks
  const { lesson, isEnded, setIsEnding, setIsEnded } = useLesson(
    (state) => state
  );

  const { cameras, toggleAudio, toggleCamera, endSession, startSession } =
    useVideoChat();
  const { messages } = useChat();

  const stopExecAtStartOfMin = useMemo(
    () =>
      execAtStartOfMin(async () => {
        try {
          const data = await getLesson(lesson.id);

          if (!isLessonEnded(data)) setIsEnding(isLessonEnding(data));

          setIsEnded(isLessonEnded(data));
        } catch (error: any) {
          console.error(error);
        }
      }),
    []
  );

  // State
  const [isAsideOpen, setIsAsideOpen] = useState(true);
  const [isNewChatMessage, setIsNewChatMessage] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Refs
  const activeTabRef = useRef(activeTab);

  // Vars
  const tabs: Tab[] = [
    {
      title: "Cameras",
      content: (
        <div
          className={`flex flex-col flex-1 ${clsx({
            "max-h-[calc(100vh-196px)]": !lesson.course_id,
            "max-h-[calc(100vh-216px)]": !!lesson.course_id,
          })} overflow-auto`}
        >
          <div className="flex flex-col gap-3">
            {isEnded ? (
              <div className="mt-5 flex flex-col items-center gap-4 text-neutral-500">
                <div> This session has ended</div>
                <TimeIcon size="md" />
              </div>
            ) : (
              cameras.map((camera, idx) => (
                <Camera
                  toggleCamera={toggleCamera}
                  toggleAudio={toggleAudio}
                  camera={camera}
                  key={idx}
                />
              ))
            )}
          </div>
        </div>
      ),
      Icon: <CameraIcon />,
      tier: ["teacher", "student", "guest"],
    },
  ];

  if (lesson.course_id) {
    tabs.push(
      {
        title: "Messages",
        content: <Chat lesson={lesson} />,
        Icon: (
          <div className="relative">
            <ChatIcon />
            {isNewChatMessage && (
              <div className="absolute right-[7px] top-[7px] w-[10px] h-[10px] bg-red-500 rounded-[50%] border border-white"></div>
            )}
          </div>
        ),
        tier: ["teacher", "student", "guest"],
      },
      {
        title: "Assignments",
        content: <AssignmentsTab lessonId={lesson.id} />,
        Icon: <AssignmentsIcon />,
        tier: ["teacher"],
      }
    );
  }

  // Effects
  useEffect(() => {
    if (!isEnded) startSession();
  }, []);

  useEffect(() => {
    if (isEnded) {
      endSession();
      stopExecAtStartOfMin();

      toast.success("The lesson has ended");
    }
  }, [isEnded]);

  useEffect(() => {
    if (activeTab === 1) setIsNewChatMessage(false);
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 1 && messages.length) setIsNewChatMessage(true);
  }, [messages]);

  useEffect(() => stopExecAtStartOfMin, []);

  return (
    <Container fullWidth={true}>
      {lesson.course && (
        <Breadcrumbs
          Icon={<CoursesIcon />}
          items={[
            {
              title: "Courses",
              href: `/dashboard/courses`,
            },
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
        <Whiteboard />
        <div
          className={`${clsx({
            "h-[calc(100vh-132px)]": !lesson.course_id,
            "h-[calc(100vh-152px)]": !!lesson.course_id,
          })}  pl-6 flex relative border-l-2 border-gray-200 ${isAsideOpen ? "flex-1" : "flex-[0]"}`}
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
            <BasicTabs tabs={tabs} onChange={setActiveTab} />
          </aside>
        </div>
      </main>
    </Container>
  );
};
export default LiveLesson;
