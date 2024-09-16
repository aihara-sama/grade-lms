"use client";

import ResizeHandler from "@/components/resize-handler";
import { useIsLessonHrExpanded } from "@/hooks/useIsLessonHrExpanded";
import { Role } from "@/interfaces/user.interface";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
// import toast from "react-hot-toast";
import ExtendLessonModal from "@/components/common/modals/extend-lesson-modal";
import InviteIcon from "@/components/icons/invite-icon";
import WhiteboardIcon from "@/components/icons/whiteboard-icon";
import LessonStatus from "@/components/lesson-status";
import ExtendLessonTemplate from "@/components/toast-templates/extend-lesson-template";
import { useLessonChannel } from "@/hooks/use-lesson-channel";
import { useUser } from "@/hooks/use-user";
import { Event } from "@/types/events.type";
import type { Lesson } from "@/types/lessons.type";
import { isLessonOngoing } from "@/utils/is-lesson-ongoing";
import { db } from "@/utils/supabase/client";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type {
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types/types";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";
import toast from "react-hot-toast";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

interface Props {
  lesson: Lesson;
  isLessonEnding: boolean;
  onLessonExtended: () => void;
}

const Whiteboard: FunctionComponent<Props> = ({
  lesson,
  isLessonEnding,
  onLessonExtended,
}) => {
  // Hooks
  const t = useTranslations();
  const channel = useLessonChannel();
  const { user } = useUser();
  const { setIsExpanded } = useIsLessonHrExpanded();

  // State
  const [isExtendLessonModalOpen, setIsExtendLessonModalOpen] = useState(false);
  const [whiteboardHeight, setWhiteboardHeight] = useState(500);
  const [whiteboardInitialHeight] = useState(window.innerHeight - 200);
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
      .then(() => toast.success(t("invite_copied")))
      .catch(() => toast.error(t("something_went_wrong")));
  };

  const submitUpdateWhiteboardData = async (data: string) => {
    const { error } = await db
      .from("lessons")
      .update({
        whiteboard_data: data,
      })
      .eq("id", lesson.id);

    if (error) toast.error(t("failed_to_save_whiteboar_data"));
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
  const onExtendLessonModalClose = (mutated?: boolean) => {
    setIsExtendLessonModalOpen(false);

    if (mutated) onLessonExtended();
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

  useEffect(() => {
    if (isLessonEnding) {
      toast(
        ({ id }) => (
          <ExtendLessonTemplate
            duration={5000}
            onExtendClick={() => {
              toast.dismiss(id);
              setIsExtendLessonModalOpen(true);
            }}
          />
        ),
        {
          duration: 5000,
        }
      );
    }
  }, [isLessonEnding]);

  useEffect(() => {
    if (user.role !== Role.Teacher) {
      const excalidrawCanvas = document.querySelector(".student-whiteboard");

      excalidrawCanvas.addEventListener("contextmenu", (event) => {
        event.stopPropagation(); // Prevent double-click from propagating
        event.preventDefault();
      });
    }
  }, []);
  return (
    <div className="flex-[4]" ref={rootRef}>
      <div className="border flex items-center px-3 py-2 justify-between gap-3">
        <div className="flex items-center gap-2 font-bold">
          <WhiteboardIcon size="xs" />
          <span className="text-center text-neutral-600 font-bold text-sm whitespace-nowrap">
            {lesson.title}
          </span>
        </div>
        <div className="flex gap-3 items-center">
          <LessonStatus showTimeLeft />
          {isLessonOngoing(lesson) && user.role === Role.Teacher && (
            <button
              className="text-link"
              onClick={() => setIsExtendLessonModalOpen(true)}
            >
              Extend?
            </button>
          )}
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
      {isExtendLessonModalOpen && (
        <ExtendLessonModal lesson={lesson} onClose={onExtendLessonModalClose} />
      )}
    </div>
  );
};
export default Whiteboard;
