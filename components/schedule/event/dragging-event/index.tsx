import type { Lesson } from "@/types/lessons.type";
import { getEventWidth } from "@/utils/get-event-width";
import { minToPx } from "@/utils/min-to-px";
import clsx from "clsx";
import { forwardRef, memo } from "react";

interface Props {
  event: Lesson;
  canDropEvent: boolean;
  initEventPosition: { x: number; y: number };
}
const DraggingEvent = forwardRef<HTMLDivElement, Props>(function DraggingEvent(
  { event, canDropEvent, initEventPosition },
  ref
) {
  return (
    <div
      className={`event absolute top-0 left-0 ${clsx(canDropEvent === false && "cursor-not-allowed")}`}
      ref={ref}
      style={{
        height: `${minToPx(+new Date(event.ends) - +new Date(event.starts))}px`,
        width: `${getEventWidth()}px`,
        ...(initEventPosition.x &&
          initEventPosition.y && {
            transform: `translate(${initEventPosition.x}px, ${initEventPosition.y}px)`,
          }),
      }}
    >
      {event.title}
    </div>
  );
});

export default memo(DraggingEvent);
