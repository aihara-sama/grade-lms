"use client";

import EditLessonModal from "@/components/common/modals/edit-lesson-modal";
import ArrowLeftIcon from "@/components/icons/arrow-left-icon";
import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import DraggingEvent from "@/components/schedule/event/dragging-event";
import Hour from "@/components/schedule/hour";
import { useSchedule } from "@/hooks/useSchedule";
import {
  addDays,
  addHours,
  addMinutes,
  differenceInHours,
  format,
  isAfter,
  isEqual,
  millisecondsToMinutes,
  subDays,
} from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import CreateLessonModal from "@/components/common/modals/create-lesson-modal";
import Select from "@/components/common/select";
import { COURSES_GET_LIMIT, THROTTLE_SEARCH_WAIT } from "@/constants";
import { getCourses } from "@/db/course";
import { getWeekLessons, upsertLesson } from "@/db/lesson";
import { useUser } from "@/hooks/use-user";
import type { SelectItem } from "@/interfaces/menu.interface";
import { Role } from "@/interfaces/user.interface";
import type { Lesson } from "@/types/lesson.type";
import { getEventElFromPoints } from "@/utils/DOM/get-event-el-from-points";
import { getEventPlaceholderElFromPoints } from "@/utils/DOM/get-event-placeholder-el-from-points";
import { getEventWidth } from "@/utils/DOM/get-event-width";
import { getWeekDays } from "@/utils/date/get-week-days";
import { execAtStartOfMin } from "@/utils/date/interval-at-start-of-min";
import { throttleSearch } from "@/utils/throttle/throttle-search";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

const Schedule: FunctionComponent = () => {
  // State
  const [days, setDays] = useState<string[]>(getWeekDays());
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [hoveredDate, setHoveredDate] = useState<Date>();
  const [courses, setCourses] = useState<SelectItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<SelectItem>();
  const [value, setValue] = useState(0);

  // Refs
  const isDraggingEventRef = useRef(false);
  const daysRef = useRef<HTMLDivElement>();
  const intervalIDRef = useRef<NodeJS.Timeout>();
  const draggingEventRef = useRef<HTMLDivElement>();
  const hoursLabelsDaysWrapperRef = useRef<HTMLDivElement>();
  const coursesOffsetRef = useRef(COURSES_GET_LIMIT);

  // Hooks
  const t = useTranslations();
  const { user } = useUser();
  const {
    canDropEvent,
    draggingEvent,
    selectedLesson,
    initEventPosition,
    initPointerPosition,
    pointerOffsetPositionOnEvent,
    setCanDropEvent,
    setDraggingEvent,
    setSelectedLesson,
    setInitEventPosition,
    setInitPointerPosition,
    setPointerOffsetPositionOnEvent,
  } = useSchedule();

  // Handlers

  const getMaybeDraggingEvent = (day: string, hour: number) => {
    //  return the dragging event if user hovered over the hour's quarter
    return new Array(4)
      .fill(draggingEvent)
      .find((_, i) =>
        isEqual(hoveredDate, addMinutes(addHours(day, hour), i * 15))
      );
  };
  const getHourQuarter = (day: string, hour: number) => {
    return [0, 15, 30, 45].find((quarter) =>
      isEqual(hoveredDate, addMinutes(addHours(day, hour), quarter))
    );
  };
  const scroll = (direction: "top" | "bottom") => {
    intervalIDRef.current = setInterval(() => {
      hoursLabelsDaysWrapperRef.current.scrollBy(
        0,
        { top: -2, bottom: 2 }[direction]
      );
    }, 2);
  };
  const fetchWeekLessons = async () => {
    try {
      setLessons(await getWeekLessons(days, selectedCourse?.id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const fetchCourses = async () => {
    try {
      setCourses(await getCourses(user.id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const submitUpsertLesson = async (newStart: Date, event: Lesson) => {
    try {
      await upsertLesson({
        ...event,
        starts: newStart.toISOString(),
        ends: new Date(
          addMinutes(
            newStart,
            millisecondsToMinutes(
              +new Date(event.ends) - +new Date(event.starts)
            )
          )
        ).toISOString(),
      });

      toast.success(t("lesson_saved"));
      await fetchWeekLessons();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const onPointerMove = (e: MouseEvent) => {
    if (initPointerPosition && !draggingEvent) {
      const maybeEventEl = getEventElFromPoints(e.clientX, e.clientY);

      setDraggingEvent(
        lessons.find(({ id }) => id === maybeEventEl?.dataset.lessonId)
      );
      setInitEventPosition({
        x:
          e.clientX -
          pointerOffsetPositionOnEvent.pointerX -
          daysRef.current.getBoundingClientRect().left,
        y:
          e.clientY -
          pointerOffsetPositionOnEvent.pointerY +
          hoursLabelsDaysWrapperRef.current.scrollTop -
          hoursLabelsDaysWrapperRef.current.getBoundingClientRect().top -
          6,
      });
    }

    if (draggingEvent) {
      const maybeEventPlaceholderEl = getEventPlaceholderElFromPoints(
        e.clientX - pointerOffsetPositionOnEvent.pointerX + getEventWidth() / 2,
        e.clientY - pointerOffsetPositionOnEvent.pointerY + 10
      );
      if (maybeEventPlaceholderEl) {
        const eventPlaceholderDate = maybeEventPlaceholderEl.dataset.date;

        const eventPlaceholderEnds = new Date(
          +new Date(eventPlaceholderDate) +
            +new Date(draggingEvent.ends) -
            +new Date(draggingEvent.starts)
        );

        const translateX =
          e.clientX -
          pointerOffsetPositionOnEvent.pointerX -
          daysRef.current.getBoundingClientRect().left;
        const translateY =
          e.clientY -
          pointerOffsetPositionOnEvent.pointerY +
          hoursLabelsDaysWrapperRef.current.scrollTop -
          hoursLabelsDaysWrapperRef.current.getBoundingClientRect().top -
          6;

        draggingEventRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

        const canDrop = !lessons
          .filter(({ id }) => id !== draggingEvent.id)
          .find(
            (event) =>
              (+new Date(eventPlaceholderDate) >= +new Date(event.starts) &&
                +new Date(eventPlaceholderDate) < +new Date(event.ends)) ||
              (+new Date(eventPlaceholderEnds) > +new Date(event.starts) &&
                +new Date(eventPlaceholderEnds) <= +new Date(event.ends)) ||
              (+new Date(event.starts) > +new Date(eventPlaceholderDate) &&
                +new Date(event.ends) < +new Date(eventPlaceholderEnds)) ||
              isAfter(new Date(), new Date(eventPlaceholderEnds))
          );

        if (canDrop !== canDropEvent) {
          setCanDropEvent(canDrop);
        }

        setHoveredDate(new Date(eventPlaceholderDate));
      }

      const hoursLabelsDaysWrapperPosition =
        hoursLabelsDaysWrapperRef.current.getBoundingClientRect();

      if (e.clientY < hoursLabelsDaysWrapperPosition.y) {
        if (!intervalIDRef.current) scroll("top");
      } else if (e.clientY > hoursLabelsDaysWrapperPosition.bottom) {
        if (!intervalIDRef.current) scroll("bottom");
      } else if (intervalIDRef.current) {
        clearInterval(intervalIDRef.current);
        intervalIDRef.current = undefined;
      }
    }
  };
  const onMouseUp = async () => {
    if (draggingEvent) {
      if (canDropEvent) {
        await submitUpsertLesson(hoveredDate, draggingEvent);
      }
      draggingEventRef.current = undefined;
      setDraggingEvent(undefined);
      setHoveredDate(undefined);
    }
    setPointerOffsetPositionOnEvent(undefined);
    setInitPointerPosition(undefined);
  };

  const onLessonModalClose = useCallback((mutated?: boolean) => {
    setSelectedLesson(undefined);

    if (mutated) {
      fetchWeekLessons();
    }
  }, []);

  const onCoursesScrollEnd = async (search: string) => {
    const rangeCourses = await getCourses(
      user.id,
      search,
      coursesOffsetRef.current,
      coursesOffsetRef.current + COURSES_GET_LIMIT - 1
    );

    setCourses((prev) => [...prev, ...rangeCourses]);
    coursesOffsetRef.current += rangeCourses.length;
  };

  const fetchCoursesBySearch = useCallback(
    throttleSearch(async (search: string) => {
      try {
        setCourses(await getCourses(user.id, search));
      } catch (error: any) {
        toast.error(error.message);
      }
    }, THROTTLE_SEARCH_WAIT),
    []
  );

  // Effects
  useEffect(() => {
    isDraggingEventRef.current = !!draggingEvent;
  }, [draggingEvent]);
  useEffect(() => {
    fetchCourses();
  }, []);
  useEffect(() => {
    fetchWeekLessons();
  }, [selectedCourse, days]);
  useEffect(() => {
    document.querySelector(`[data-hour-label="8:00 AM"]`).scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (user.role === Role.Teacher) {
      window.addEventListener("mousemove", onPointerMove);
      return () => window.removeEventListener("mousemove", onPointerMove);
    }
    return () => {};
  }, [
    lessons,
    canDropEvent,
    draggingEvent,
    initPointerPosition,
    pointerOffsetPositionOnEvent,
  ]);
  useEffect(() => {
    setDays(getWeekDays());
  }, []);

  useEffect(() => execAtStartOfMin(() => setValue((prev) => prev + 1)), []);

  // View
  return (
    <div onMouseUp={onMouseUp}>
      <h1 className="page-title">Schedule</h1>
      <p className="text-neutral-500">View and manage your schedule</p>
      <hr className="my-2 mb-8" />
      <div className="flex justify-between items-center mb-2">
        <div className="mt-1 flex items-center gap-3">
          <div className="flex gap-1 font-bold">
            <div className="start">{format(days[0], "MMM d")}</div>
            <span>-</span>
            <div className="end">{format(days[days.length - 1], "MMM d")}</div>
          </div>
          <div className="flex">
            <button
              className="icon-button"
              onClick={() => setDays(getWeekDays(subDays(days[0], 7)))}
            >
              <ArrowLeftIcon />
            </button>
            <button
              className="icon-button"
              onClick={() => setDays(getWeekDays(addDays(days[0], 7)))}
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>
        <Select
          label="Course"
          options={courses}
          onChange={(item) => setSelectedCourse(item)}
          defaultValue={selectedCourse}
          useUnselect
          fullWidth
          popperProps={{
            popperClassName: "h-[250px]",
            className: "w-52",
          }}
          onScrollEnd={onCoursesScrollEnd}
          onSearchInputChange={fetchCoursesBySearch}
        />
      </div>

      <hr />

      <div className="flex ml-[75px] mt-1">
        {days.map((day, idx) => (
          <div
            key={idx}
            className="flex-[1] text-center text-sm font-bold py-4"
          >
            {format(new Date(day), "EE")}
          </div>
        ))}
      </div>
      <div
        ref={hoursLabelsDaysWrapperRef}
        className="flex gap-[6px] max-h-[calc(100vh_-_261px)] overflow-auto pt-[6px] pr-[6px]"
      >
        <div className="-mt-[10px] text-sm font-bold">
          {[...Array(24)].map((_, idx) => (
            <div
              key={idx}
              className="h-[81px] relative"
              data-hour-label={format(
                addHours(new Date("01/01/2000"), idx),
                "h:mm a"
              )}
            >
              {format(addHours(new Date("01/01/2000"), idx), "h:mm a")}
            </div>
          ))}
        </div>

        <div className="flex-1" ref={daysRef}>
          <div className="relative flex overflow-hidden">
            {days.map((day, idx) => {
              return (
                <div className="flex-1" key={idx}>
                  {[...Array(differenceInHours(addDays(day, 1), day))].map(
                    (__, i) => (
                      <Hour
                        value={value}
                        key={i}
                        day={day}
                        index={i}
                        events={lessons}
                        hour={+addHours(day, i)}
                        quarter={getHourQuarter(day, i)}
                        draggingEvent={getMaybeDraggingEvent(day, i)}
                      />
                    )
                  )}
                </div>
              );
            })}
            {draggingEvent && (
              <DraggingEvent
                ref={draggingEventRef}
                event={draggingEvent}
                canDropEvent={canDropEvent}
                initEventPosition={initEventPosition}
              />
            )}
          </div>
        </div>
      </div>
      {!!selectedLesson && selectedLesson.id && (
        <EditLessonModal
          onClose={onLessonModalClose}
          lessonId={selectedLesson.id}
        />
      )}
      {!!selectedLesson && !selectedLesson.id && (
        <CreateLessonModal
          onClose={onLessonModalClose}
          courseId={selectedCourse?.id}
          maybeLesson={selectedLesson}
        />
      )}
    </div>
  );
};

export default Schedule;
