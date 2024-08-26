"use client";

import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import SaveIcon from "@/components/icons/save-icon";
import Input from "@/components/input";
import ResizeHandler from "@/components/resize-handler";
import { supabaseClient } from "@/utils/supabase/client";
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
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import type { Lesson } from "@/types/lessons.type";
import type { User } from "@supabase/supabase-js";
import clsx from "clsx";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";

interface IProps {
  lesson: Lesson;
  user: User;
}

const LessonPreview: FunctionComponent<IProps> = ({ lesson, user }) => {
  // State
  const [starts, setStarts] = useState(new Date(lesson.starts));
  const [ends, setEnds] = useState(new Date(lesson.ends));
  const [whiteboardHeight, setWhiteboardHeight] = useState(0);

  // Refs
  const containerRef = useRef<HTMLDivElement>();
  const whiteboardDataRef = useRef(JSON.parse(lesson.whiteboard_data));
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);

  // Vars
  const duration = +new Date(ends) - +new Date(starts);

  // Handlers
  const handleSaveDate = async () => {
    const { error } = await supabaseClient
      .from("lessons")
      .update({
        starts: format(starts, "yyyy-MM-dd'T'HH:mm:ss"),
        ends: format(ends, "yyyy-MM-dd'T'HH:mm:ss"),
        whiteboard_data: JSON.stringify(whiteboardDataRef.current),
      })
      .eq("id", lesson.id);

    if (error) toast.error(error.message);
    else toast.success("Saved!");
  };
  const handleChangeDate = (date: Date) => {
    setStarts(date);
    setEnds(addMinutes(date, millisecondsToMinutes(duration)));
  };
  const handleChangeDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (+value > millisecondsToMinutes(duration)) {
      setEnds(addMinutes(ends, 15));
    } else if (+value < millisecondsToMinutes(duration) && +value > 15) {
      setEnds(subMinutes(ends, 15));
    }
  };
  const handleSaveWhiteboardData = async () => {
    const { error } = await supabaseClient
      .from("lessons")
      .update({
        whiteboard_data: JSON.stringify(whiteboardDataRef.current),
      })
      .eq("id", lesson.id);

    if (error) toast.error(error.message);
    else toast.success("Saved!");
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

  const parseWhiteboardData = () => {
    const data = JSON.parse(lesson.whiteboard_data);
    if (data.appState) data.appState.collaborators = new Map();
    return data;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 mt-3" ref={containerRef}>
      <main className="flex-1">
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2">
            <WhiteboardIcon size="sm" />
            <p className="text-center text-neutral-600 font-bold">
              Whiteboard preview
            </p>
          </div>
          {(user.user_metadata as IUserMetadata).role === Role.Teacher && (
            <button
              className="icon-button shadow-md ml-auto mr-2"
              onClick={handleSaveWhiteboardData}
            >
              <SaveIcon />
            </button>
          )}
        </div>
        <div
          className={`relative border border-gray-200 [&>.excalidraw]:h-[calc(100%-100px)] ${clsx((user.user_metadata as IUserMetadata).role !== Role.Teacher && "student-whiteboard")}`}
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
              (user.user_metadata as IUserMetadata).role === Role.Teacher
                ? onWhiteboardChange
                : undefined
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
          onChange={handleChangeDate}
          label="Starts at"
          popperPlacement="bottom-start"
          disabled={(user.user_metadata as IUserMetadata).role !== Role.Teacher}
        />
        <Input
          className="mt-3 mb-0"
          label="Duration"
          fullWIdth
          type="number"
          Icon={<LessonsIcon />}
          value={`${millisecondsToMinutes(duration)}`}
          onChange={handleChangeDuration}
          disabled={(user.user_metadata as IUserMetadata).role !== Role.Teacher}
        />
        {(user.user_metadata as IUserMetadata).role === Role.Teacher && (
          <button className="primary-button" onClick={handleSaveDate}>
            Save
          </button>
        )}
        <div className="mt-3 sm:mt-auto flex flex-col gap-1">
          {(user.user_metadata as IUserMetadata).role !== Role.Teacher ? (
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
