import type { Database } from "@/types/supabase.type";
import {
  format,
  hoursToMilliseconds,
  millisecondsToMinutes,
  minutesToMilliseconds,
  startOfDay,
} from "date-fns";
import { memo, type FunctionComponent, type MouseEvent } from "react";

import { useSchedule } from "@/hooks/useSchedule";
import { minToPx } from "@/utils/min-to-px";

interface IProps {
  event: Database["public"]["Tables"]["lessons"]["Row"];
  index: number;
  isSummerDaylight: boolean;
  isInterdayEvent?: boolean;
}

const Event: FunctionComponent<IProps> = ({
  event,
  index,
  isSummerDaylight,
  isInterdayEvent,
}) => {
  const eventStarts = isInterdayEvent
    ? format(startOfDay(event.ends), "yyyy-MM-dd'T'HH:mm:ss")
    : event.starts;
  const duration = +new Date(event.ends) - +new Date(event.starts);
  console.log(millisecondsToMinutes(duration));

  const setSelectedLesson = useSchedule((state) => state.setSelectedLesson);
  const draggingEvent = useSchedule((state) => state.draggingEvent);
  const setPointerOffsetPositionOnEvent = useSchedule(
    (state) => state.setPointerOffsetPositionOnEvent
  );
  const setInitPointerPosition = useSchedule(
    (state) => state.setInitPointerPosition
  );
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
    <>
      <div
        onMouseDown={handlePointerDown}
        onClick={() => setSelectedLesson(event)}
        data-date={new Date(eventStarts)}
        className={`event cursor-pointer opacity-${draggingEvent?.id === event.id ? 0.7 : 1} whitespace-nowrap overflow-ellipsis overflow-hidden pr-1 ${millisecondsToMinutes(duration) === 15 || format(new Date(eventStarts), "HH:mm") === "23:45" ? "flex gap-1 justify-between" : ""}`}
        data-lesson-id={event.id}
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
        {`${event.title}`}
        <div className="flex gap-1">
          <p>{format(new Date(event.starts), "HH:mm")}</p>-
          <p>{format(new Date(event.ends), "HH:mm")}</p>
        </div>
      </div>
    </>
  );
};

export default memo(Event);
