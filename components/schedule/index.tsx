"use client";

import EditLessonModal from "@/components/common/modals/edit-lesson-modal";
import ArrowLeftIcon from "@/components/icons/arrow-left-icon";
import ArrowRightIcon from "@/components/icons/arrow-right-icon";
import DraggingEvent from "@/components/schedule/event/dragging-event";
import Hour from "@/components/schedule/hour";
import { useSchedule } from "@/hooks/useSchedule";
import { getEventWidth } from "@/utils/get-event-width";
import {
  addDays,
  addHours,
  addMinutes,
  differenceInHours,
  format,
  isEqual,
  millisecondsToMinutes,
  subDays,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import Select from "@/components/common/select";
import { getCoursesByUserId } from "@/db/course";
import {
  getWeekLessons,
  getWeekLessonsByCourseId,
  upsertLesson,
} from "@/db/lesson";
import type { Course } from "@/types/courses.type";
import type { Lesson } from "@/types/lessons.type";
import { getWeekDays } from "@/utils/get-week-days";
import type { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import type { FunctionComponent } from "react";

interface IProps {
  user: User;
}

const Schedule: FunctionComponent<IProps> = ({ user }) => {
  // Zustand
  const canDropEvent = useSchedule((state) => state.canDropEvent);
  const draggingEvent = useSchedule((state) => state.draggingEvent);
  const selectedLesson = useSchedule((state) => state.selectedLesson);
  const initPointerPosition = useSchedule((state) => state.initPointerPosition);
  const pointerOffsetPositionOnEvent = useSchedule(
    (state) => state.pointerOffsetPositionOnEvent
  );

  const setCanDropEvent = useSchedule((state) => state.setCanDropEvent);
  const setDraggingEvent = useSchedule((state) => state.setDraggingEvent);
  const setSelectedLesson = useSchedule((state) => state.setSelectedLesson);
  const setInitEventPosition = useSchedule(
    (state) => state.setInitEventPosition
  );
  const setInitPointerPosition = useSchedule(
    (state) => state.setInitPointerPosition
  );
  const setPointerOffsetPositionOnEvent = useSchedule(
    (state) => state.setPointerOffsetPositionOnEvent
  );

  // State
  const [days, setDays] = useState(getWeekDays());
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [hoveredDate, setHoveredDate] = useState<string>();
  const [courses, setCourses] = useState<Pick<Course, "id" | "title">[]>([]);
  const [selectedCourse, setSelectedCourse] =
    useState<Pick<Course, "id" | "title">>(null);
  const [isEditLessonModalOpen, setIsEditLessonModalOpen] =
    useState(!!selectedLesson);

  // Refs
  const isDraggingEventRef = useRef(false);
  const daysRef = useRef<HTMLDivElement>();
  const intervalIDRef = useRef<NodeJS.Timeout>();
  const draggingEventRef = useRef<HTMLDivElement>();
  const hoursLabelsDaysWrapperRef = useRef<HTMLDivElement>();

  // Hooks
  const t = useTranslations();

  // Handlers
  const fetchWeekLessons = async () => {
    try {
      setLessons(await getWeekLessons(days));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const fetchLessonsByCourseId = async (courseId: string) => {
    try {
      setLessons(await getWeekLessonsByCourseId(days, courseId));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const fetchCourses = async () => {
    try {
      setCourses(await getCoursesByUserId(user.id));
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleSaveLesson = async (newStart: string, event: Lesson) => {
    try {
      await upsertLesson({
        ...event,
        starts: format(newStart, "yyyy-MM-dd'T'HH:mm:ss"),
        ends: format(
          addMinutes(
            new Date(newStart),
            millisecondsToMinutes(
              +new Date(event.ends) - +new Date(event.starts)
            )
          ),
          "yyyy-MM-dd'T'HH:mm:ss"
        ),
      });

      toast.success(t("lesson_saved"));
      await fetchWeekLessons();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const scroll = (direction: "top" | "bottom") => {
    intervalIDRef.current = setInterval(() => {
      hoursLabelsDaysWrapperRef.current.scrollBy(
        0,
        { top: -2, bottom: 2 }[direction]
      );
    }, 2);
  };
  const handlePointerMove = (e: MouseEvent) => {
    // if (isScrolling()) return;
    if (initPointerPosition && !draggingEvent) {
      const hoveredLessonId = (
        document
          .elementsFromPoint(e.clientX, e.clientY)
          .find((el) => el.classList.contains("event")) as HTMLElement
      )?.dataset.lessonId;

      const targetLesson = lessons.find(({ id }) => id === hoveredLessonId);
      setDraggingEvent(targetLesson);
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
      const hoveredDateSlot = (
        document.elementsFromPoint(
          e.clientX -
            pointerOffsetPositionOnEvent.pointerX +
            getEventWidth() / 2,
          e.clientY - pointerOffsetPositionOnEvent.pointerY + 10
        ) as HTMLElement[]
      ).find((el) => el.classList.contains("placeholder"))?.dataset.date;

      const hoveredDateSlotEnds =
        hoveredDateSlot &&
        new Date(
          +new Date(hoveredDateSlot) +
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
      if (hoveredDateSlot) {
        const canDrop = !lessons
          .filter(({ id }) => id !== draggingEvent.id)
          .find(
            (event) =>
              (+new Date(hoveredDateSlot) >= +new Date(event.starts) &&
                +new Date(hoveredDateSlot) < +new Date(event.ends)) ||
              (+new Date(hoveredDateSlotEnds) > +new Date(event.starts) &&
                +new Date(hoveredDateSlotEnds) <= +new Date(event.ends)) ||
              (+new Date(event.starts) > +new Date(hoveredDateSlot) &&
                +new Date(event.ends) < +new Date(hoveredDateSlotEnds))
          );

        if (canDrop !== canDropEvent) {
          setCanDropEvent(canDrop);
        }

        setHoveredDate(hoveredDateSlot);
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
  const handleMouseUp = async () => {
    if (draggingEvent) {
      if (canDropEvent) {
        await handleSaveLesson(hoveredDate, draggingEvent);
      }
      draggingEventRef.current = undefined;
      setDraggingEvent(undefined);
      setHoveredDate(undefined);
    }
    setPointerOffsetPositionOnEvent(undefined);
    setInitPointerPosition(undefined);
  };

  // Effects
  useEffect(() => {
    isDraggingEventRef.current = !!draggingEvent;
  }, [draggingEvent]);
  useEffect(() => {
    fetchCourses();
  }, []);
  useEffect(() => {
    if (selectedCourse) {
      fetchLessonsByCourseId(selectedCourse.id);
    } else {
      fetchWeekLessons();
    }
  }, [selectedCourse, days]);
  useEffect(() => {
    document.querySelector(`[data-hour-label="8:00 AM"]`).scrollIntoView({
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, [
    lessons,
    canDropEvent,
    draggingEvent,
    initPointerPosition,
    pointerOffsetPositionOnEvent,
  ]);

  useEffect(() => {
    setIsEditLessonModalOpen(!!selectedLesson);
  }, [selectedLesson]);

  return (
    <div onMouseUp={handleMouseUp}>
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
        />
      </div>

      <hr />

      <div className="flex ml-[75px] mt-[4px]">
        {days.map((day, idx) => (
          <div
            className="flex-[1] text-center text-sm font-bold px-[0] py-[16px]"
            key={idx}
          >
            {new Date(day).toLocaleString("en-US", {
              weekday: "short",
              day: "2-digit",
            })}
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
                        hour={+addHours(day, i)}
                        draggingEvent={
                          // Check if user hovered over this hour's quarter
                          new Array(4)
                            .fill(draggingEvent)
                            .find((___, index) =>
                              isEqual(
                                hoveredDate,
                                addMinutes(addHours(day, i), index * 15)
                              )
                            )
                        }
                        key={i}
                        day={day}
                        index={i}
                        events={lessons}
                        quarter={[0, 15, 30, 45].find((quarter) =>
                          isEqual(
                            hoveredDate,
                            addMinutes(addHours(day, i), quarter)
                          )
                        )}
                      />
                    )
                  )}
                </div>
              );
            })}
            {draggingEvent && (
              <DraggingEvent ref={draggingEventRef} event={draggingEvent} />
            )}
          </div>
        </div>
      </div>
      <EditLessonModal
        isOpen={isEditLessonModalOpen}
        setIsOpen={(isOpen) => {
          setIsEditLessonModalOpen(isOpen);
          setSelectedLesson(undefined);
        }}
        includeCoursesSelect
        courses={courses}
        lesson={selectedLesson}
        onDone={() => {
          if (selectedCourse) {
            fetchLessonsByCourseId(selectedCourse.id);
          } else {
            fetchWeekLessons();
          }
          setSelectedLesson(undefined);
        }}
      />
    </div>
  );
};

export default Schedule;
