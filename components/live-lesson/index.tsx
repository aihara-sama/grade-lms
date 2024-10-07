"use client";

import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import AssignmentsIcon from "@/components/icons/assignments-icon";
import CameraIcon from "@/components/icons/camera-icon";
import ChatIcon from "@/components/icons/chat-icon";
import Chat from "@/components/live-lesson/chat";
import AssignmentsTab from "@/components/live-lesson/tabs/assignments-tab";
import Tabs from "@/components/tabs";
import Whiteboard from "@/components/whiteboard";
import { Role } from "@/enums/role.enum";
import clsx from "clsx";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FunctionComponent,
} from "react";

import Breadcrumbs from "@/components/breadcrumbs";
import Camera from "@/components/camera";
import Container from "@/components/container";
import CoursesIcon from "@/components/icons/courses-icon";
import TimeIcon from "@/components/icons/time-icon";
import { getLesson } from "@/db/client/lesson";
import { useChat } from "@/hooks/use-chat";
import { useLesson } from "@/hooks/use-lesson";
import { useVideoChat } from "@/hooks/use-video-chat";
import { execAtStartOfMin } from "@/utils/date/interval-at-start-of-min";
import { isLessonEnded } from "@/utils/lesson/is-lesson-ended";
import { isLessonEnding } from "@/utils/lesson/is-lesson-ending";
import toast from "react-hot-toast";

const LiveLesson: FunctionComponent = () => {
  // Hooks
  const { lesson, isEnded, setisEnding, setisEnded } = useLesson(
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

          setisEnding(isLessonEnding(data));
          setisEnded(isLessonEnded(data));
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
  const tabs = [
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
      tier: [Role.Teacher, Role.Student, Role.Guest],
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
        tier: [Role.Teacher, Role.Student, Role.Guest],
      },
      {
        title: "Assignments",
        content: <AssignmentsTab lessonId={lesson.id} />,
        Icon: <AssignmentsIcon />,
        tier: [Role.Teacher],
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

    return () => {
      stopExecAtStartOfMin();
    };
  }, [isEnded]);

  useEffect(() => {
    if (activeTab === 1) setIsNewChatMessage(false);
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 1 && messages.length) setIsNewChatMessage(true);
  }, [messages]);

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
          className={` ${clsx({
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
            <Tabs tabs={tabs} onChange={setActiveTab} />
          </aside>
        </div>
      </main>
    </Container>
  );
};
export default LiveLesson;
