import { useSchedule } from "@/hooks/useSchedule";
import type { Lesson } from "@/types/lessons.type";
import { minToPx } from "@/utils/min-to-px";
import clsx from "clsx";
import {
  format,
  hoursToMilliseconds,
  millisecondsToMinutes,
  minutesToMilliseconds,
  startOfDay,
} from "date-fns";
import { memo, type FunctionComponent, type MouseEvent } from "react";

interface IProps {
  index: number;
  event: Lesson;
  isSummerDaylight: boolean;
  isInterdayEvent?: boolean;
}

const Event: FunctionComponent<IProps> = ({
  event,
  index,
  isSummerDaylight,
  isInterdayEvent,
}) => {
  // State
  const duration = +new Date(event.ends) - +new Date(event.starts);
  const eventStarts = isInterdayEvent
    ? format(startOfDay(event.ends), "yyyy-MM-dd'T'HH:mm:ss")
    : event.starts;

  // Hooks
  const draggingEvent = useSchedule((state) => state.draggingEvent);

  const setSelectedLesson = useSchedule((state) => state.setSelectedLesson);
  const setPointerOffsetPositionOnEvent = useSchedule(
    (state) => state.setPointerOffsetPositionOnEvent
  );
  const setInitPointerPosition = useSchedule(
    (state) => state.setInitPointerPosition
  );

  // Handlers
  const handlePointerDown = (e: MouseEvent) => {
    setInitPointerPosition({
      pointerX: e.clientX,
      pointerY: e.clientY,
    });
    setPointerOffsetPositionOnEvent({
      pointerX: e.nativeEvent.offsetX,
      pointerY: e.nativeEvent.offsetY,
    });
  };

  return (
    <div
      onClick={() => setSelectedLesson(event)}
      onMouseDown={handlePointerDown}
      data-lesson-id={event.id}
      data-date={new Date(eventStarts)}
      className={`event ${draggingEvent?.id === event.id ? "opacity-80" : "opacity-1"} ${clsx(millisecondsToMinutes(duration) === 15 || (format(new Date(eventStarts), "HH:mm") === "23:45" && "flex gap-1 justify-between"))}`}
      style={{
        top: `${
          minToPx(minutesToMilliseconds(new Date(eventStarts).getMinutes())) +
          (index > 0 ? 1 : 0)
        }px`,
        height: `${
          minToPx(
            +new Date(event.ends) -
              +new Date(eventStarts) +
              +(isSummerDaylight ? hoursToMilliseconds(1) : 0)
          ) - (index > 0 ? 1 : 0)
        }px`,
      }}
    >
      {event.title}
      <div className="flex gap-1">
        <p>{format(new Date(event.starts), "HH:mm")}</p>-
        <p>{format(new Date(event.ends), "HH:mm")}</p>
      </div>
    </div>
  );
};

export default memo(Event);
