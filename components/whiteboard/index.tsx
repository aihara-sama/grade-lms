"use client";

import ExpandHorizontalIcon from "@/components/icons/expand-horizontal-icon";
import TimeIcon from "@/components/icons/time-icon";
import ResizeHandler from "@/components/resize-handler";
import { useIsLessonHrExpanded } from "@/hooks/useIsLessonHrExpanded";
import { Role } from "@/interfaces/user.interface";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";
import BaseModal from "@/components/common/modals/base-modal";
import InviteIcon from "@/components/icons/invite-icon";
import ShrinkHorizontalIcon from "@/components/icons/shrink-horizontal-icon";
import WhiteboardIcon from "@/components/icons/whiteboard-icon";
import Input from "@/components/input";
import LiveTime from "@/components/live-time";
import { extendLesson } from "@/db/lesson";
import { useLessonChannel } from "@/hooks/use-lesson-channel";
import { useUser } from "@/hooks/use-user";
import { Event } from "@/types/events.type";
import type { Lesson } from "@/types/lessons.type";
import { isLessonEnded } from "@/utils/is-lesson-ended";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type {
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types/types";
import clsx from "clsx";
import { minutesToMilliseconds } from "date-fns";
import { useTranslations } from "next-intl";
import type { ChangeEvent, FunctionComponent } from "react";
import { toast } from "react-toastify";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

interface IProps {
  lesson: Lesson;
  onLessonExtended: () => void;
}

const Whiteboard: FunctionComponent<IProps> = ({
  lesson,
  onLessonExtended,
}) => {
  // Hooks
  const t = useTranslations();
  const channel = useLessonChannel();
  const { user } = useUser();
  const { isExpanded, setIsExpanded } = useIsLessonHrExpanded();

  // State
  const [isExtendLessonModalOpen, setIsExtendLessonModalOpen] = useState(false);
  const [whiteboardHeight, setWhiteboardHeight] = useState(500);
  const [whiteboardInitialHeight] = useState(window.innerHeight - 200);
  const [extendLessonByMin, setExtendLessonByMin] = useState(15);
  const [whiteboardInitialData, setWhiteboardInitialData] =
    useState<ExcalidrawInitialDataState>();

  // Refs
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);
  const rootRef = useRef<HTMLDivElement>();
  const pointerEventRef =
    useRef<Parameters<ExcalidrawProps["onPointerUpdate"]>[0]>();

  // Handlers
  const invite = async () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() =>
        toast.success(<div className="text-red-600">{t("invite_copied")}</div>)
      )
      .catch(() => toast.error("Something went wrong"));
  };
  const onPointerUpdate: ExcalidrawProps["onPointerUpdate"] = (event) => {
    pointerEventRef.current = event;
  };
  const fireWhiteboardChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState
  ) => {
    channel.send({
      event: Event.WhiteboardChange,
      type: "broadcast",
      payload: {
        elements,
        appState: {
          selectionElement: appState.selectionElement,
          selectedElementIds: appState.selectedElementIds,
          viewBackgroundColor: appState.viewBackgroundColor,
          theme: appState.theme,
        },
        pointerEvent: pointerEventRef.current,
      },
    });
  };
  const onExtendLessonInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const extendBy = +e.target.value;

    if (extendBy > extendLessonByMin) {
      setExtendLessonByMin(extendBy + 14);
    } else if (extendBy < extendLessonByMin && extendBy > 15) {
      setExtendLessonByMin(extendBy - 14);
    }
  };
  const submitExtendLesson = async () => {
    try {
      await extendLesson(lesson, minutesToMilliseconds(extendLessonByMin));

      setIsExtendLessonModalOpen(false);
      toast(t("lesson_extended"));
      onLessonExtended();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onWhiteboardChange = (payload: {
    payload: {
      elements: readonly ExcalidrawElement[];
      appState: Pick<
        AppState,
        | "selectionElement"
        | "selectedElementIds"
        | "viewBackgroundColor"
        | "theme"
      >;
      pointerEvent: Parameters<ExcalidrawProps["onPointerUpdate"]>[0];
    };
  }) => {
    excalidrawAPIRef.current?.updateScene({
      elements: payload.payload.elements,
      appState: {
        ...payload.payload.appState,
        // Teacher's cursor
        collaborators: new Map([
          [
            Role.Teacher,
            {
              username: Role.Teacher,
              pointer: payload.payload.pointerEvent?.pointer,
              button: payload.payload.pointerEvent?.button,
            },
          ],
        ]),
      },
    });
  };
  const parseWhiteboardData = () => {
    if (user.role === Role.Student) {
      const data = JSON.parse(lesson.whiteboard_data);

      if (data.appState) {
        data.appState.collaborators = new Map();
        data.appState.activeTool = {
          type: "hand",
          locked: false,
          lastActiveTool: {
            type: "hand",
            customType: null,
          },
          customType: null,
        };
      }
      return data;
    }
    const data = JSON.parse(lesson.whiteboard_data);
    if (data.appState) data.appState.collaborators = new Map();

    return data;
  };

  // Effects
  useEffect(() => {
    if ([Role.Student, Role.Guest].includes(user.role as Role)) {
      channel.on(
        "broadcast",
        { event: Event.WhiteboardChange },
        onWhiteboardChange
      );
    }
  }, []);
  useEffect(() => setWhiteboardInitialData(parseWhiteboardData()), []);
  useEffect(() => setIsExpanded(true), []);

  return (
    <div className="flex-[4]" ref={rootRef}>
      <div className="border flex items-center px-3 py-2 justify-between">
        <div className="flex items-center gap-2 font-bold">
          <WhiteboardIcon size="xs" />
          <span className="text-center text-neutral-600 font-bold text-sm">
            {lesson.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isLessonEnded(new Date(lesson.ends)) ? (
            <p className="text-yellow-600 ml-1">This lesson has ended</p>
          ) : (
            <div className="flex items-center text-sm">
              <TimeIcon />
              <p className="text-neutral-600 font-bold ml-1">
                <LiveTime date={new Date(lesson.ends)} /> left
              </p>
              {user.role === Role.Teacher && (
                <button
                  className="text-link"
                  onClick={() => setIsExtendLessonModalOpen(true)}
                >
                  Extend?
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="icon-button "
          >
            {isExpanded ? <ShrinkHorizontalIcon /> : <ExpandHorizontalIcon />}
          </button>
          {user.role === Role.Teacher && (
            <button className="icon-button" onClick={invite}>
              <InviteIcon size="sm" />
            </button>
          )}
        </div>
      </div>
      <div
        className={`relative border border-gray-200 [&>.excalidraw]:h-[calc(100%-25px)] ${clsx(user.role !== Role.Teacher && "student-whiteboard")}`}
        style={{
          height: `${whiteboardHeight}px`,
        }}
      >
        <Excalidraw
          isCollaborating
          onPointerUpdate={
            user.role === Role.Teacher ? onPointerUpdate : undefined
          }
          onChange={
            user.role === Role.Teacher ? fireWhiteboardChange : undefined
          }
          excalidrawAPI={(api) => {
            excalidrawAPIRef.current = api;
          }}
          initialData={whiteboardInitialData}
        />
        <ResizeHandler
          containerRef={rootRef}
          initialHeight={whiteboardInitialHeight}
          minHeight={170}
          onResize={(height) => setWhiteboardHeight(height)}
        />
      </div>
      <BaseModal
        isExpanded={false}
        title="Extend lesson"
        setIsOpen={() => setIsExtendLessonModalOpen(false)}
        isOpen={isExtendLessonModalOpen}
      >
        <div>
          <div>
            <Input
              value={`${extendLessonByMin}`}
              onChange={onExtendLessonInputChange}
              autoFocus
              fullWIdth
              Icon={<TimeIcon />}
              type="number"
              label="Add minutes"
            />
          </div>
          <div className="flex gap-3">
            <button
              className="outline-button ml-auto w-auto"
              onClick={() => setIsExtendLessonModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="primary-button w-auto"
              onClick={submitExtendLesson}
            >
              Save
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};
export default Whiteboard;
