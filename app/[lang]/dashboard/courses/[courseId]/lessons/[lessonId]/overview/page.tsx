"use client";

import LessonsIcon from "@/components/icons/lessons-icon";
import SaveIcon from "@/components/icons/save-icon";
import { Excalidraw } from "@excalidraw/excalidraw";
import { addMinutes, millisecondsToMinutes, subMinutes } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types/types";
import type { ChangeEvent, FunctionComponent } from "react";

import Header from "@/app/[lang]/dashboard/lessons/[lessonId]/components/live-lesson/header";
import BasicInput from "@/components/common/inputs/basic-input";
import DateInput from "@/components/common/inputs/date-input";
import ResizeHandler from "@/components/common/resize-handler";
import WhiteboardIcon from "@/components/icons/whiteboard-icon";
import Container from "@/components/layout/container";
import LoadingSpinner from "@/components/utilities/loading-spinner";
import { WHITEBOARD_MIN_HEIGHT } from "@/constants";
import { getOverlappingLessons, updateLesson } from "@/db/client/lesson";
import { Role } from "@/enums/role.enum";
import { useLesson } from "@/hooks/use-lesson";
import { useUser } from "@/hooks/use-user";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";

const Page: FunctionComponent = () => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);
  const { lesson, isEnded, isOngoing, setLesson } = useLesson((state) => state);

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
  const isSaveButtonDisabled = () => {
    return (
      (new Date(lesson.starts).toISOString() === starts.toISOString() &&
        new Date(lesson.ends).toISOString() === ends.toISOString()) ||
      isOngoing ||
      isEnded
    );
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
      const { count } = await getOverlappingLessons(
        starts.toISOString(),
        ends.toISOString(),
        lesson.id
      );

      if (count) throw new Error(t("error.lesson_overlaps"));

      const data = await updateLesson({
        starts: starts.toISOString(),
        ends: ends.toISOString(),
        id: lesson.id,
      });

      setLesson({
        ...lesson,
        starts: data.starts,
        ends: data.ends,
      });

      toast.success(t("success.lesson_date_updated"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingUpdateLessonDate(false);
    }
  };
  const submitUpdateWhiteboardData = async () => {
    try {
      await updateLesson({
        id: lesson.id,
        whiteboard_data: JSON.stringify(whiteboardDataRef.current),
      });

      toast.success(t("common.saved"));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onDateChange = useCallback(
    (date: Date) => {
      setStarts(date);
      setEnds(addMinutes(date, millisecondsToMinutes(duration)));
    },
    [duration]
  );
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
    <Container ref={containerRef}>
      <Header course={lesson.course} />
      <div className="flex flex-col sm:flex-row gap-6 mt-3">
        <main className="flex-1">
          <div className="border flex items-center px-3 py-2">
            <div className="flex items-center gap-2">
              <WhiteboardIcon size="xs" />
              <p className="text-center text-neutral-600 font-bold text-sm">
                {t("lesson.whiteboard_preview")}
              </p>
            </div>
            {user.role === "teacher" && (
              <div
                className="inter-active p-2 border rounded-md ml-auto mr-2"
                onClick={submitUpdateWhiteboardData}
              >
                <SaveIcon />
              </div>
            )}
          </div>
          <div
            className={`relative border border-gray-200 [&>.excalidraw]:h-[calc(100%-25px)] ${clsx(user.role !== "teacher" && "student-whiteboard")}`}
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
                user.role === "teacher" ? onWhiteboardChange : undefined
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
          <p className="text-neutral-600 ">{t("lesson.timeline")}</p>
          <hr className="mb-6" />
          <DateInput
            date={starts}
            onChange={onDateChange}
            label={t("labels.starts_at")}
            popperPlacement="bottom-start"
            disabled={user.role !== "teacher" || isOngoing || isEnded}
          />
          <BasicInput
            className="mt-3 mb-0"
            label={t("labels.duration")}
            fullWidth
            type="number"
            StartIcon={<LessonsIcon />}
            value={`${millisecondsToMinutes(duration)}`}
            onChange={changeDateDuration}
            disabled={user.role !== "teacher" || isOngoing || isEnded}
          />
          {user.role === "teacher" && (
            <button
              className="primary-button"
              disabled={isSaveButtonDisabled()}
              onClick={submitUpdateLessonDate}
            >
              {isSubmittingUpdateLessonDate && <LoadingSpinner />}
              <span
                className={`${clsx(isSubmittingUpdateLessonDate && "opacity-0")}`}
              >
                {t("buttons.save")}
              </span>
            </button>
          )}
          <div className="mt-3 sm:mt-auto flex flex-col gap-1">
            <Link
              href={`/dashboard/lessons/${lesson.id}`}
              className={`button warning-button ${clsx(!isOngoing && "disabled")} `}
            >
              {t("buttons.enter_class")}
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
};

export default Page;
