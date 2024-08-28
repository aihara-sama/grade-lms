"use client";

import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import SaveIcon from "@/components/icons/save-icon";
import Input from "@/components/input";
import ResizeHandler from "@/components/resize-handler";
import { db } from "@/utils/supabase/client";
import { Excalidraw } from "@excalidraw/excalidraw";
import {
  addMinutes,
  format,
  millisecondsToMinutes,
  subMinutes,
} from "date-fns";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import type {
  ExcalidrawImperativeAPI,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types/types";
import type { ChangeEvent, FunctionComponent } from "react";

import CalendarIcon from "@/components/icons/calendar-icon";
import WhiteboardIcon from "@/components/icons/whiteboard-icon";
import { WHITEBOARD_MIN_HEIGHT } from "@/constants";
import { useUser } from "@/hooks/use-user";
import { Role } from "@/interfaces/user.interface";
import type { Lesson } from "@/types/lessons.type";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";

interface IProps {
  lesson: Lesson;
}

const LessonPreview: FunctionComponent<IProps> = ({ lesson }) => {
  // State
  const [starts, setStarts] = useState(new Date(lesson.starts));
  const [ends, setEnds] = useState(new Date(lesson.ends));
  const [whiteboardHeight, setWhiteboardHeight] = useState(0);

  // Refs
  const containerRef = useRef<HTMLDivElement>();
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);
  const whiteboardDataRef = useRef(JSON.parse(lesson.whiteboard_data));

  // Vars
  const duration = +new Date(ends) - +new Date(starts);

  // Hooks
  const t = useTranslations();
  const { user } = useUser();

  // Handlers
  const parseWhiteboardData = () => {
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
  const submitUpdateLessonDate = async () => {
    try {
      const { error } = await db
        .from("lessons")
        .update({
          starts: format(starts, "yyyy-MM-dd'T'HH:mm:ss"),
          ends: format(ends, "yyyy-MM-dd'T'HH:mm:ss"),
          whiteboard_data: JSON.stringify(whiteboardDataRef.current),
        })
        .eq("id", lesson.id);

      if (error) throw new Error(t("failed_to_update_lesson_date"));

      toast.success(t("lesson_date_updated"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitUpdateWhiteboardData = async () => {
    const { error } = await db
      .from("lessons")
      .update({
        whiteboard_data: JSON.stringify(whiteboardDataRef.current),
      })
      .eq("id", lesson.id);

    if (error) toast.error(error.message);
    else toast.success("Saved!");
  };

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
              className="interactive p-2 border rounded-md ml-auto mr-2"
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
            initialData={parseWhiteboardData()}
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
      <aside className="pt-12 flex flex-col">
        <p className="text-neutral-600 ">Timeline</p>
        <hr className="mb-6" />
        <DateInput
          date={starts}
          onChange={onDateChange}
          label="Starts at"
          popperPlacement="bottom-start"
          disabled={user.role !== Role.Teacher}
        />
        <Input
          className="mt-3 mb-0"
          label="Duration"
          fullWIdth
          type="number"
          Icon={<LessonsIcon />}
          value={`${millisecondsToMinutes(duration)}`}
          onChange={changeDateDuration}
          disabled={user.role !== Role.Teacher}
        />
        {user.role === Role.Teacher && (
          <button className="primary-button" onClick={submitUpdateLessonDate}>
            Save
          </button>
        )}
        <div className="mt-3 sm:mt-auto flex flex-col gap-1">
          {user.role !== Role.Teacher ? (
            <Link
              href={`/dashboard/lessons/${lesson.id}`}
              className={`button warning-button ${clsx(new Date() <= starts && "disabled")} `}
            >
              Enter class
            </Link>
          ) : (
            <Link
              href={`/dashboard/lessons/${lesson.id}`}
              className="button warning-button"
            >
              Enter class
            </Link>
          )}
          <Link
            className="button link-button flex gap-2 items-center"
            href="/dashboard/schedule"
          >
            Find in schedule <CalendarIcon />
          </Link>
        </div>
      </aside>
    </div>
  );
};
export default LessonPreview;
