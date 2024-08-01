"use client";

import ResizeHandler from "@/components/resize-handler";
import { useIsLessonHrExpanded } from "@/hooks/useIsLessonHrExpanded";
import { ROLES } from "@/interfaces/user.interface";
import type { Database } from "@/types/supabase.type";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type {
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types/types";
import type { RealtimeChannel } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import type { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ExpandHorizontalIcon from "../icons/expand-horizontal-icon";
import LessonsIcon from "../icons/lessons-icon";
import ShrinkHorizontalcon from "../icons/shrink-horizontal-icon";
import TimeIcon from "../icons/time-icon";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
  }
);

interface IProps {
  userName: string;
  role: ROLES;
  channel: RealtimeChannel;
  lesson: Database["public"]["Tables"]["lessons"]["Row"];
  islessonHrExpanded: boolean;
  setIslessonHrExpanded: Dispatch<SetStateAction<boolean>>;
}

const Whiteboard: FunctionComponent<IProps> = ({ role, channel, lesson }) => {
  const [initialHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight - 300 : 500
  );
  const [whiteboardHeight, setWhiteboardHeight] = useState(500);
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);
  const containerRef = useRef<HTMLDivElement>();
  const pointerEventRef =
    useRef<Parameters<ExcalidrawProps["onPointerUpdate"]>[0]>();
  const { isExpanded } = useIsLessonHrExpanded();

  // useEffect(() => {
  //   if (
  //     role === ROLES.STUDENT ||
  //     role === ROLES.GUEST
  //   ) {
  //     // Limit students' whiteboard
  //     document.body.addEventListener("keydown", (e) => {
  //       e.preventDefault();
  //       e.stopPropagation();
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (role === ROLES.STUDENT || role === ROLES.GUEST) {
      channel.on("broadcast", { event: "whiteboard:change" }, (payload) => {
        excalidrawAPIRef.current?.updateScene({
          elements: payload.payload.elements,
          appState: {
            ...payload.payload.appState,
            // Teacher's cursor
            collaborators: new Map([
              [
                "Teacher",
                {
                  username: "Teacher",
                  pointer: payload.payload.pointerEvent?.pointer,
                  button: payload.payload.pointerEvent?.button,
                },
              ],
            ]),
          },
        });
      });
    }
  }, []);

  const handleInvite = async () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Something went wrong"));
  };

  const handlePointerUpdate = (
    ev: Parameters<ExcalidrawProps["onPointerUpdate"]>[0]
  ) => {
    pointerEventRef.current = ev;
  };

  const handleChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState
  ) => {
    channel.send({
      event: "whiteboard:change",
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

  return (
    <div className="flex-[4]" ref={containerRef}>
      <div className="flex justify-between items-center mb-[12px]">
        <div className="flex items-center gap-[6px] font-bold">
          <LessonsIcon size="sm" />
          <span className="text">{lesson.title}</span>
        </div>
        <div className="flex items-center gap-[12px]">
          <div className="flex items-center text-sm">
            <button className="icon-button">
              <TimeIcon />
            </button>
            29min
          </div>
          <button className="icon-button shadow-md">
            {isExpanded ? <ShrinkHorizontalcon /> : <ExpandHorizontalIcon />}
          </button>
          <button className="primary-button" onClick={handleInvite}>
            Invite
          </button>
        </div>
      </div>
      <div
        className={`relative border border-gray-200 h-[${whiteboardHeight + 100}px] [&>.excalidraw]h-[${whiteboardHeight}px] ${role === ROLES.STUDENT || role === ROLES.GUEST ? "[&>.excalidraw .App-menu_top]hidden [&>.excalidraw .layer-ui__wrapper__footer-right]hidden [&>.excalidraw .undo-redo-buttons]hidden" : ""}`}
      >
        <Excalidraw
          isCollaborating
          onPointerUpdate={
            role === ROLES.TEACHER ? handlePointerUpdate : undefined
          }
          onChange={role === ROLES.TEACHER ? handleChange : undefined}
          excalidrawAPI={(api) => {
            excalidrawAPIRef.current = api;
          }}
          initialData={
            role === ROLES.STUDENT
              ? (function () {
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
                })()
              : (function () {
                  const data = JSON.parse(lesson.whiteboard_data);
                  if (data.appState) data.appState.collaborators = new Map();
                  return data;
                })()
          }
        />
        <ResizeHandler
          containerRef={containerRef}
          initialHeight={initialHeight}
          minHeight={170}
          onChange={(height) => setWhiteboardHeight(height)}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
