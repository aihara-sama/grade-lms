import { HOUR } from "@/constants";
import type { Lesson } from "@/types/lessons.type";
import { getEventWidth } from "@/utils/get-event-width";
import { getLessonDuration } from "@/utils/get-lesson-duration";
import { isDstObserved } from "@/utils/is-summer-daylight";
import { minToPx } from "@/utils/min-to-px";
import clsx from "clsx";
import {
  addHours,
  addMinutes,
  format,
  millisecondsToMinutes,
  subHours,
} from "date-fns";
import { forwardRef, memo } from "react";

interface Props {
  event: Lesson;
  canDropEvent: boolean;
  initEventPosition: { x: number; y: number };
  newStarts?: Date;
}
const DraggingEvent = forwardRef<HTMLDivElement, Props>(function DraggingEvent(
  { event, canDropEvent, initEventPosition, newStarts },
  ref
) {
  const isQuarter = millisecondsToMinutes(getLessonDuration(event)) === 15;
  const isBeforeMidnight =
    newStarts && format(new Date(newStarts), "HH:mm") === "23:45";

  const isStartDST =
    newStarts &&
    isDstObserved(addHours(newStarts, 1)) &&
    !isDstObserved(newStarts);

  const isEndDST =
    newStarts &&
    isDstObserved(newStarts) &&
    !isDstObserved(addHours(newStarts, 1));

  const isPrevHourEndDST =
    newStarts &&
    isDstObserved(subHours(newStarts, 1)) &&
    !isDstObserved(addHours(subHours(newStarts, 1), 1));

  const getEventHeight = () => {
    const duration = +new Date(event.ends) - +new Date(event.starts);

    // if (isEndDST) return 15;
    if (isStartDST) return minToPx(duration + HOUR);
    return minToPx(duration);
  };

  const getEventStyles = () => {
    const width = getEventWidth();

    return {
      height: `${getEventHeight()}px`,
      width: `${isEndDST || isPrevHourEndDST ? width / 2 : width}px`,
    };
  };

  return (
    <div
      className={`event absolute top-0 left-0 ${clsx(canDropEvent === false && "cursor-not-allowed")} ${clsx((isQuarter || isBeforeMidnight || isEndDST) && "flex gap-1 justify-between")}`}
      ref={ref}
      style={{
        ...getEventStyles(),
        ...(initEventPosition.x &&
          initEventPosition.y && {
            transform: `translate(${initEventPosition.x}px, ${initEventPosition.y}px)`,
          }),
      }}
    >
      {event.title}
      {newStarts && (
        <div className="flex gap-1">
          <p>{format(newStarts, "HH:mm")}</p>-
          <p>
            {format(
              addMinutes(
                newStarts,
                millisecondsToMinutes(getLessonDuration(event))
              ),
              "HH:mm"
            )}
          </p>
        </div>
      )}
    </div>
  );
});
export default memo(DraggingEvent);
