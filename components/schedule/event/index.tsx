import { HOUR } from "@/constants";
import { useSchedule } from "@/hooks/useSchedule";
import type { Lesson } from "@/types/lessons.type";
import { isDstObserved } from "@/utils/is-summer-daylight";
import { minToPx } from "@/utils/min-to-px";
import clsx from "clsx";
import {
  addHours,
  format,
  millisecondsToMinutes,
  minutesToMilliseconds,
  startOfDay,
} from "date-fns";
import { memo, type FunctionComponent, type MouseEvent } from "react";

interface Props {
  index: number;
  event: Lesson;
  isSummerDaylight: boolean;
  isInterdayEvent?: boolean;
}

const Event: FunctionComponent<Props> = ({ event, index, isInterdayEvent }) => {
  // State
  const duration = +new Date(event.ends) - +new Date(event.starts);
  const eventStarts = isInterdayEvent
    ? format(startOfDay(event.ends), "yyyy-MM-dd'T'HH:mm:ss")
    : event.starts;

  const isBeforeMidnight = format(new Date(eventStarts), "HH:mm") === "23:45";
  const isQuarter = millisecondsToMinutes(duration) === 15;

  // Hooks
  const draggingEvent = useSchedule((state) => state.draggingEvent);

  const isStartDST =
    isDstObserved(addHours(eventStarts, 1)) &&
    !isDstObserved(new Date(eventStarts));

  const isEndDST =
    isDstObserved(new Date(eventStarts)) &&
    !isDstObserved(addHours(eventStarts, 1));

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

  const getHeight = () => {
    if (isStartDST) return minToPx(duration + HOUR);
    if (isEndDST) return 20;

    return minToPx(+new Date(event.ends) - +new Date(eventStarts));
  };

  const getEventStyles = () => {
    return {
      top: `${
        minToPx(minutesToMilliseconds(new Date(eventStarts).getMinutes())) +
        (index > 0 ? 1 : 0)
      }px`,
      height: `${getHeight()}px`,
    };
  };

  const eventClassNames = `event ${draggingEvent?.id === event.id ? "opacity-80" : "opacity-1"} ${clsx((isQuarter || isBeforeMidnight || isEndDST) && "flex gap-1 justify-between")}`;

  return (
    <div
      onClick={() => setSelectedLesson(event)}
      onMouseDown={handlePointerDown}
      data-lesson-id={event.id}
      data-date={new Date(eventStarts)}
      className={eventClassNames}
      style={getEventStyles()}
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
