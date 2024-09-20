"use client";

import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import SaveIcon from "@/components/icons/save-icon";
import Input from "@/components/input";
import ResizeHandler from "@/components/resize-handler";
import { Excalidraw } from "@excalidraw/excalidraw";
import { addMinutes, millisecondsToMinutes, subMinutes } from "date-fns";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types/types";
import type { ChangeEvent, FunctionComponent } from "react";

import WhiteboardIcon from "@/components/icons/whiteboard-icon";
import { WHITEBOARD_MIN_HEIGHT } from "@/constants";
import { getOverlappingLessons } from "@/db/lesson";
import { Role } from "@/enums/role.enum";
import { useLesson } from "@/hooks/use-lesson";
import { useUser } from "@/hooks/use-user";
import { DB } from "@/lib/supabase/db";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";

const LessonPreview: FunctionComponent = () => {
  // Hooks
  const t = useTranslations();
  const { user } = useUser();
  const { lesson, isEnded, isOngoing, setLesson } = useLesson();

  // State
  const [starts, setStarts] = useState(new Date(lesson.starts));
  const [ends, setEnds] = useState(new Date(lesson.ends));

  const [whiteboardHeight, setWhiteboardHeight] = useState(0);
  const [whiteboardInitialData, setWhiteboardInitialData] =
    useState<ExcalidrawInitialDataState>();
  const [isSubmittingUpdateLessonDate, setIsSubmittingUpdateLessonDate] =
    useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>();
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);
  const whiteboardDataRef = useRef(JSON.parse(lesson.whiteboard_data));

  // Vars
  const duration = +new Date(ends) - +new Date(starts);

  // Handlers
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
  const changeDateDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (+value > millisecondsToMinutes(duration)) {
      setEnds(addMinutes(ends, 15));
    } else if (+value < millisecondsToMinutes(duration) && +value > 15) {
      setEnds(subMinutes(ends, 15));
    }
  };
  const submitUpdateLessonDate = async () => {
    setIsSubmittingUpdateLessonDate(true);
    try {
      const overlappingLessons = await getOverlappingLessons(
        starts.toISOString(),
        ends.toISOString(),
        user.id,
        lesson.id
      );

      if (overlappingLessons.length) throw new Error(t("lesson_overlaps"));

      const { error, data } = await DB.from("lessons")
        .update({
          starts: starts.toISOString(),
          ends: ends.toISOString(),
        })
        .eq("id", lesson.id)
        .select("*")
        .single();

      if (error) throw new Error(t("failed_to_update_lesson_date"));

      setLesson(data);

      toast.success(t("lesson_date_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingUpdateLessonDate(false);
    }
  };
  const submitUpdateWhiteboardData = async () => {
    const { error } = await DB.from("lessons")
      .update({
        whiteboard_data: JSON.stringify(whiteboardDataRef.current),
      })
      .eq("id", lesson.id);

    if (error) toast.error(error.message);
    else toast.success("Saved!");
  };
  const onDateChange = (date: Date) => {
    setStarts(date);
    setEnds(addMinutes(date, millisecondsToMinutes(duration)));
  };
  const onWhiteboardChange: ExcalidrawProps["onChange"] = (
    elements,
    appState
  ) => {
    whiteboardDataRef.current = {
      elements,
      appState,
    };
  };

  // Effects
  useEffect(() => setWhiteboardInitialData(parseWhiteboardData()), []);

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
    <div className="flex flex-col sm:flex-row gap-6 mt-3" ref={containerRef}>
      <main className="flex-1">
        <div className="border flex items-center px-3 py-2">
          <div className="flex items-center gap-2">
            <WhiteboardIcon size="xs" />
            <p className="text-center text-neutral-600 font-bold text-sm">
              Whiteboard preview
            </p>
          </div>
          {user.role === Role.Teacher && (
            <div
              className="inter-active p-2 border rounded-md ml-auto mr-2"
              onClick={submitUpdateWhiteboardData}
            >
              <SaveIcon />
            </div>
          )}
        </div>
        <div
          className={`relative border border-gray-200 [&>.excalidraw]:h-[calc(100%-25px)] ${clsx(user.role !== Role.Teacher && "student-whiteboard")}`}
          style={{
            height: `${whiteboardHeight}px`,
          }}
        >
          <Excalidraw
            isCollaborating={false}
            excalidrawAPI={(api) => {
              excalidrawAPIRef.current = api;
            }}
            initialData={whiteboardInitialData}
            onChange={
              user.role === Role.Teacher ? onWhiteboardChange : undefined
            }
          />
          <ResizeHandler
            containerRef={containerRef}
            initialHeight={window.innerHeight - 300}
            minHeight={WHITEBOARD_MIN_HEIGHT}
            onResize={setWhiteboardHeight}
          />
        </div>
      </main>
      <aside className="flex flex-col">
        <p className="text-neutral-600 ">Timeline</p>
        <hr className="mb-6" />
        <DateInput
          date={starts}
          onChange={onDateChange}
          label="Starts at"
          popperPlacement="bottom-start"
          disabled={user.role !== Role.Teacher || isOngoing || isEnded}
        />
        <Input
          className="mt-3 mb-0"
          label="Duration"
          fullWidth
          type="number"
          StartIcon={<LessonsIcon />}
          value={`${millisecondsToMinutes(duration)}`}
          onChange={changeDateDuration}
          disabled={user.role !== Role.Teacher || isOngoing || isEnded}
        />
        {user.role === Role.Teacher && (
          <button
            disabled={
              (new Date(lesson.starts).toISOString() === starts.toISOString() &&
                new Date(lesson.ends).toISOString() === ends.toISOString()) ||
              isOngoing ||
              isEnded
            }
            className="primary-button"
            onClick={submitUpdateLessonDate}
          >
            {isSubmittingUpdateLessonDate && (
              <img
                className="loading-spinner"
                src="/assets/gifs/loading-spinner.gif"
                alt=""
              />
            )}
            <span
              className={`${clsx(isSubmittingUpdateLessonDate && "opacity-0")}`}
            >
              Save
            </span>
          </button>
        )}
        <div className="mt-3 sm:mt-auto flex flex-col gap-1">
          <Link
            href={`/dashboard/lessons/${lesson.id}`}
            className={`button warning-button ${clsx(!isOngoing && "disabled")} `}
          >
            Enter class
          </Link>
        </div>
      </aside>
    </div>
  );
};
export default LessonPreview;
