"use client";

import ExtendLessonModal from "@/components/common/modals/extend-lesson-modal";
import ExtendLessonPrompt from "@/components/common/prompts/extend-lesson-prompt";
import ResizeHandler from "@/components/common/resize-handler";
import InviteIcon from "@/components/icons/invite-icon";
import WhiteboardIcon from "@/components/icons/whiteboard-icon";
import LessonStatus from "@/components/lesson/lesson-status";
import { Event } from "@/enums/event.enum";
import { Role } from "@/enums/role.enum";
import { useLesson } from "@/hooks/use-lesson";
import { useLessonChannel } from "@/hooks/use-lesson-channel";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import { throttleFetch } from "@/utils/throttle/throttle-fetch";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type {
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types/types";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

const Whiteboard: FunctionComponent = () => {
  // Hooks
  const user = useUser((state) => state.user);
  const channel = useLessonChannel();
  const { lesson, isEnding, isOngoing } = useLesson((state) => state);

  const t = useTranslations();

  // State
  const [isExtendLessonModal, setIsExtendLessonModal] = useState(false);
  const [whiteboardHeight, setWhiteboardHeight] = useState(500);
  const [whiteboardInitialHeight] = useState(
    window.innerHeight - (lesson.course_id ? 205 : 185)
  );
  const [whiteboardInitialData, setWhiteboardInitialData] =
    useState<ExcalidrawInitialDataState>();

  // Refs
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);
  const rootRef = useRef<HTMLDivElement>();
  const pointerEventRef =
    useRef<Parameters<ExcalidrawProps["onPointerUpdate"]>[0]>();

  // Handlers
  const copyInviteLink = async () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success(t("success.invite_copied")))
      .catch(() => toast.error(t("error.something_went_wrong")));
  };

  const parseWhiteboardData = () => {
    if (user.role === Role.Student) {
      const data = JSON.parse(lesson.whiteboard_data);

      if (!data.appState) data.appState = {};

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
      return data;
    }
    const data = JSON.parse(lesson.whiteboard_data);
    if (data.appState) data.appState.collaborators = new Map();

    return data;
  };

  const submitUpdateWhiteboardData = throttleFetch(async (data: string) => {
    const { error } = await DB.from("lessons")
      .update({
        whiteboard_data: data,
      })
      .eq("id", lesson.id);

    if (error) toast.error(t("error.failed_to_save_whiteboar_data"));
  });

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
    submitUpdateWhiteboardData(JSON.stringify({ elements, appState }));
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
  useEffect(() => {
    if (isEnding) {
      toast(
        ({ id }) => (
          <ExtendLessonPrompt
            duration={5000}
            onExtendClick={() => {
              setIsExtendLessonModal(true);

              toast.dismiss(id);
            }}
          />
        ),
        {
          duration: 5000,
        }
      );
    }
  }, [isEnding]);
  useEffect(() => {
    if (user.role !== "Teacher") {
      const excalidrawCanvas = document.querySelector(".student-whiteboard");

      excalidrawCanvas.addEventListener("contextmenu", (event) => {
        event.stopPropagation(); // Prevent double-click from propagating
        event.preventDefault();
      });
    }
  }, []);

  // View
  return (
    <div className="flex-[4]" ref={rootRef}>
      <div className="border flex items-center px-3 py-2 justify-between gap-3">
        <div className="flex items-center gap-2 font-bold overflow-hidden w-[14px] flex-1">
          <div className="flex-shrink-0">
            <WhiteboardIcon size="xs" />
          </div>
          <span className="text-neutral-600 font-bold text-sm whitespace-nowrap truncate">
            {lesson.title}
          </span>
        </div>
        <div className="flex gap-3 items-center flex-shrink-0">
          <LessonStatus showTimeLeft />
          {isOngoing && user.role === Role.Teacher && (
            <button
              className="text-link"
              onClick={() => setIsExtendLessonModal(true)}
            >
              Extend?
            </button>
          )}
          {user.role === Role.Teacher && !lesson.course_id && (
            <button className="icon-button" onClick={copyInviteLink}>
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
      {isExtendLessonModal && (
        <ExtendLessonModal onClose={() => setIsExtendLessonModal(false)} />
      )}
    </div>
  );
};
export default Whiteboard;
