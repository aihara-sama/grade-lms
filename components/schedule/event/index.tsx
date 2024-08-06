import type { Database } from "@/types/supabase.type";
import { hoursToMilliseconds, minutesToMilliseconds } from "date-fns";
import { memo, type FunctionComponent, type MouseEvent } from "react";

import { useSchedule } from "@/hooks/useSchedule";
import { minToPx } from "@/utils/min-to-px";

interface IProps {
  event: Database["public"]["Tables"]["lessons"]["Row"];
  index: number;
  isSummerDaylight: boolean;
}

const Event: FunctionComponent<IProps> = ({
  event,
  index,
  isSummerDaylight,
}) => {
  console.log({ event });

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
        data-date={new Date(event.starts)}
        className={`event opacity-${draggingEvent?.id === event.id ? 0.7 : 1}`}
        data-lesson-id={event.id}
        style={{
          top: `${
            minToPx(
              minutesToMilliseconds(new Date(event.starts).getMinutes())
            ) + (index > 0 ? 1 : 0)
          }px`,
          height: `${
            minToPx(
              +new Date(event.ends) -
                +new Date(event.starts) +
                +(isSummerDaylight ? hoursToMilliseconds(1) : 0)
            ) - (index > 0 ? 1 : 0)
          }px`,
        }}
      >
        {event.title}
      </div>
    </>
  );
};

export default memo(Event);
