import type { Lesson } from "@/types/lesson.type";
import { minToPx } from "@/utils/date/min-to-px";
import { getEventWidth } from "@/utils/DOM/get-event-width";
import clsx from "clsx";
import { format } from "date-fns";
import { forwardRef, memo } from "react";

interface Props {
  event: Lesson;
  canDropEvent: boolean;
  initEventPosition: { x: number; y: number };
  hoveredDate: Date;
}
const DraggingEvent = forwardRef<HTMLDivElement, Props>(function DraggingEvent(
  { event, canDropEvent, initEventPosition, hoveredDate },
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
      {hoveredDate && (
        <>
          <br />
          {format(new Date(hoveredDate), "HH:mm")}
          {" - "}
          {format(
            new Date(
              new Date(
                +hoveredDate + +new Date(event.ends) - +new Date(event.starts)
              )
            ),
            "HH:mm"
          )}
        </>
      )}
    </div>
  );
});
export default memo(DraggingEvent);
