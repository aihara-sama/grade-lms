"use client";

import type { Database } from "@/types/supabase.type";
import type { MutableRefObject } from "react";
import { forwardRef, memo, useEffect, useState } from "react";

import DraggingEvent from "@/components/schedule/event/dragging-event";
import Hour from "@/components/schedule/hour";
import { getEventWidth } from "@/helpers/get-event-width";
import { useSchedule } from "@/hooks/useSchedule";
import {
  addDays,
  addHours,
  addMinutes,
  differenceInHours,
  isEqual,
} from "date-fns";

interface IProps {
  lessons: Database["public"]["Tables"]["lessons"]["Row"][];
  days: string[];
  draggingEventRef: MutableRefObject<HTMLDivElement>;

  handleSaveLesson: (
    newStart: string,
    draggingEvent: Database["public"]["Tables"]["lessons"]["Row"]
  ) => Promise<void>;
  hoursLabelsDaysWrapperRef: MutableRefObject<HTMLDivElement>;
}

const Days = forwardRef<HTMLDivElement, IProps>(function Days(
  {
    days,
    lessons,
    hoursLabelsDaysWrapperRef,
    handleSaveLesson,
    draggingEventRef,
  },
  ref
) {
  const setCanDropEvent = useSchedule((state) => state.setCanDropEvent);
  const draggingEvent = useSchedule((state) => state.draggingEvent);
  const canDropEvent = useSchedule((state) => state.canDropEvent);
  const initPointerPosition = useSchedule((state) => state.initPointerPosition);
  const setDraggingEvent = useSchedule((state) => state.setDraggingEvent);
  const pointerOffsetPositionOnEvent = useSchedule(
    (state) => state.pointerOffsetPositionOnEvent
  );

  const [hoveredDate, setHoveredDate] = useState<string>();

  const setPointerOffsetPositionOnEvent = useSchedule(
    (state) => state.setPointerOffsetPositionOnEvent
  );
  const setInitPointerPosition = useSchedule(
    (state) => state.setInitPointerPosition
  );
  const setInitEventPosition = useSchedule(
    (state) => state.setInitEventPosition
  );

  // const draggingEventRef = useRef<HTMLDivElement>();
  // const daysRef = useRef<HTMLDivElement>();

  // const draggingEvent = useZustandRefState(useSchedule, "draggingEvent");
  // const canDropEvent = useZustandRefState(useSchedule, "canDropEvent");
  // const pointerOffsetPositionOnEvent = useZustandRefState(
  //   useSchedule,
  //   "pointerOffsetPositionOnEvent"
  // );
  // const initPointerPosition = useZustandRefState(
  //   useSchedule,
  //   "initPointerPosition"
  // );
  // console.log({ initPointerPosition });

  // const setDraggingEvent = useZustandRefHook(useSchedule, "setDraggingEvent");

  const handlePointerMove = (e: MouseEvent) => {
    if (initPointerPosition && !draggingEvent) {
      const hoveredLessonId = (
        document
          .elementsFromPoint(e.clientX, e.clientY)
          .find((el) => el.classList.contains("event")) as HTMLElement
      )?.dataset.lessonId;

      const targetLesson = lessons.find(({ id }) => id === hoveredLessonId);
      setDraggingEvent(targetLesson);
      setInitEventPosition({
        x: e.clientX - pointerOffsetPositionOnEvent.pointerX,
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

      draggingEventRef.current.style.transform = `translate(${e.clientX - pointerOffsetPositionOnEvent.pointerX}px, ${e.clientY - pointerOffsetPositionOnEvent.pointerY + hoursLabelsDaysWrapperRef.current.scrollTop - hoursLabelsDaysWrapperRef.current.getBoundingClientRect().top - 6}px)`;
      if (hoveredDateSlot) {
        const canDrop = !lessons
          .filter(({ id }) => id !== draggingEvent.id)
          .find(
            (event) =>
              (+new Date(hoveredDateSlot) >= +new Date(event.starts) &&
                +new Date(hoveredDateSlot) < +new Date(event.ends)) ||
              (+new Date(hoveredDateSlotEnds) > +new Date(event.starts) &&
                +new Date(hoveredDateSlotEnds) < +new Date(event.ends))
          );
        // console.log({ canDrop, canDropEvent, hoveredDateSlot });

        if (canDrop !== canDropEvent) {
          setCanDropEvent(canDrop);
        }

        setHoveredDate(hoveredDateSlot);
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

  useEffect(() => {
    document.querySelector(`[data-hour-label="8:00 AM"]`).scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handlePointerMove);
    hoursLabelsDaysWrapperRef.current.addEventListener("scroll", (e) => {
      console.log({ e });
    });
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, [
    lessons,
    canDropEvent,
    draggingEvent,
    initPointerPosition,
    pointerOffsetPositionOnEvent,
  ]);

  return (
    <div className="flex-[1]" ref={ref} onMouseUp={handleMouseUp}>
      <div className="relative flex overflow-hidden">
        {days.map((day, idx) => {
          return (
            <div className="flex-[1]" key={idx}>
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
  );
});

export default memo(Days);
