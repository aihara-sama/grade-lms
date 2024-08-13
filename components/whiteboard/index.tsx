"use client";

import ExpandHorizontalIcon from "@/components/icons/expand-horizontal-icon";
import LessonsIcon from "@/components/icons/lessons-icon";
import TimeIcon from "@/components/icons/time-icon";
import ResizeHandler from "@/components/resize-handler";
import { useIsLessonHrExpanded } from "@/hooks/useIsLessonHrExpanded";
import { ROLES } from "@/interfaces/user.interface";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import BaseModal from "@/components/common/modals/base-modal";
import InviteIcon from "@/components/icons/invite-icon";
import ShrinkHorizontalIcon from "@/components/icons/shrink-horizontal-icon";
import Input from "@/components/input";
import LiveTime from "@/components/live-time";
import type { Lesson } from "@/types/lessons.type";
import { supabaseClient } from "@/utils/supabase/client";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type {
  AppState,
  ExcalidrawImperativeAPI,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types/types";
import type { RealtimeChannel } from "@supabase/supabase-js";
import clsx from "clsx";
import { format, minutesToMilliseconds } from "date-fns";
import type { ChangeEvent, FunctionComponent } from "react";

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
  lesson: Lesson;
}

const Whiteboard: FunctionComponent<IProps> = ({ role, channel, lesson }) => {
  // State
  const [isExtendLessonModalOpen, setIsExtendLessonModalOpen] = useState(false);
  const [whiteboardHeight, setWhiteboardHeight] = useState(500);
  const [whiteboardInitialHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight - 200 : 500
  );
  const [extendLessonByMin, setExtendLessonByMin] = useState(15);

  // Refs
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);
  const containerRef = useRef<HTMLDivElement>();
  const pointerEventRef =
    useRef<Parameters<ExcalidrawProps["onPointerUpdate"]>[0]>();

  // Hooks
  const { isExpanded, setIsExpanded } = useIsLessonHrExpanded();

  // Effects
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

  // Handlers
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
  const handleChangeExtendLesson = (e: ChangeEvent<HTMLInputElement>) => {
    const extendBy = +e.target.value;

    if (extendBy > extendLessonByMin) {
      setExtendLessonByMin(extendBy + 14);
    } else if (extendBy < extendLessonByMin && extendBy > 15) {
      setExtendLessonByMin(extendBy - 14);
    }
  };

  const handleExtendLesson = async () => {
    const { error } = await supabaseClient
      .from("lessons")
      .update({
        ends: format(
          +new Date(lesson.ends) + minutesToMilliseconds(extendLessonByMin),
          "yyyy-MM-dd'T'HH:mm:ss"
        ),
      })
      .eq("id", lesson.id);

    if (error) {
      toast(error.message);
    } else {
      toast("Lesson extended");
      setIsExtendLessonModalOpen(false);
    }
  };

  return (
    <div className="flex-[4]" ref={containerRef}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 font-bold">
          <LessonsIcon size="sm" />
          <span className="text">{lesson.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm gap-2">
            <TimeIcon />
            <p className="text-neutral-600 font-bold">
              <LiveTime date={new Date(lesson.ends)} /> left
            </p>
            <button
              className="text-link"
              onClick={() => setIsExtendLessonModalOpen(true)}
            >
              Extend?
            </button>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="icon-button shadow-md"
          >
            {isExpanded ? <ShrinkHorizontalIcon /> : <ExpandHorizontalIcon />}
          </button>
          <button className="icon-button" onClick={handleInvite}>
            <InviteIcon size="sm" />
          </button>
        </div>
      </div>
      <div
        className={`relative border border-gray-200 [&>.excalidraw]:h-[calc(100%-100px)] ${clsx(role !== ROLES.TEACHER) && "hide-whiteboard-elements"}`}
        style={{
          height: `${whiteboardHeight}px`,
        }}
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
          initialHeight={whiteboardInitialHeight}
          minHeight={170}
          onResize={(height) => setWhiteboardHeight(height)}
        />
      </div>
      {isExtendLessonModalOpen && (
        <BaseModal
          header="Extend lesson"
          setIsOpen={() => setIsExtendLessonModalOpen(false)}
          isOpen={isExtendLessonModalOpen}
        >
          <div>
            <div>
              <Input
                value={`${extendLessonByMin}`}
                onChange={handleChangeExtendLesson}
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
                onClick={handleExtendLesson}
              >
                Save
              </button>
            </div>
          </div>
        </BaseModal>
      )}
    </div>
  );
};

export default Whiteboard;
