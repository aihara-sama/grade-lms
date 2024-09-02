import Event from "@/components/schedule/event";
import { HOUR } from "@/constants";
import { useUser } from "@/hooks/use-user";
import { useSchedule } from "@/hooks/useSchedule";
import { Role } from "@/interfaces/user.interface";
import type { Lesson } from "@/types/lessons.type";
import { getLessonDuration } from "@/utils/get-lesson-duration";
import { isFirstDateFromYesterdayOrMore } from "@/utils/is-first-date-from-yesterday-or-more";
import { isSummerDaylight } from "@/utils/is-summer-daylight";
import { minToPx } from "@/utils/min-to-px";
import clsx from "clsx";
import {
  addHours,
  addMilliseconds,
  addMinutes,
  format,
  millisecondsToMinutes,
  startOfDay,
} from "date-fns";
import type { FunctionComponent } from "react";
import { memo } from "react";

interface Props {
  quarter?: number;
  day: string;
  index: number;
  events: Lesson[];
  draggingEvent?: Lesson;
  hour: number;
}

const Hour: FunctionComponent<Props> = ({
  day,
  index,
  events,
  draggingEvent,
  quarter,
  hour,
}) => {
  const yesterdayEvent = events.filter(
    (lesson) =>
      isFirstDateFromYesterdayOrMore(
        lesson.starts,
        format(hour, "yyyy-MM-dd'T'HH:mm:ss")
      ) && +new Date(lesson.ends) >= +new Date(hour)
  );

  // Hooks
  const { user } = useUser();
  const setSelectedLesson = useSchedule((state) => state.setSelectedLesson);

  const onEventPlaceholderClick = (min: number) => {
    setSelectedLesson({
      id: undefined,
      title: "",
      starts: addMinutes(new Date(hour), min).toString(),
      ends: addMinutes(new Date(hour), min + 15).toString(),
      course_id: null,
      whiteboard_data: "{}",
      created_at: undefined,
    });
  };

  const getEventPlaceholderHeight = (idx: number) => {
    if (draggingEvent) {
      const duration = getLessonDuration(draggingEvent);

      const date1 = addHours(day, index);
      const date2 = addMinutes(
        new Date(hour),
        idx * 15 + millisecondsToMinutes(duration)
      );

      return minToPx(duration + (isSummerDaylight(date1, date2) ? HOUR : 0));
    }
    return 20;
  };

  return (
    <div>
      {index > 0 &&
        isSummerDaylight(addHours(day, index), addHours(day, index - 1)) && (
          <div className="h-[81px] text-xs pl-1 pt-1 text-orange-400 border border-r-neutral-100 border-t-neutral-100 relative">
            Daylight Saving Time
          </div>
        )}
      <div
        className="h-[81px] border border-r-neutral-100 border-t-neutral-100 relative"
        data-date={new Date(hour)}
      >
        {[...Array(4)].map((_, idx) => {
          return (
            <div
              key={idx}
              onClick={() => onEventPlaceholderClick(idx * 15)}
              data-date={addMinutes(new Date(hour), idx * 15)}
              className={`event-placeholder absolute w-full text-center border-2 border-dashed border-neutral-400 rounded-sm opacity-0 [transition:0.1s] bg-[white] h-5 flex justify-center items-center bg-transparent active:bg-gray-100 ${clsx(
                {
                  "opacity-0": quarter !== idx * 15,
                  "opacity-100": quarter === idx * 15,
                  "pointer-events-none": user.role !== Role.Teacher,
                  "hover:cursor-pointer hover:opacity-100": !draggingEvent,
                }
              )}`}
              style={{
                top: `${idx * 20}px`,
                height: `${getEventPlaceholderHeight(idx)}px`,
              }}
            ></div>
          );
        })}
        {events
          .filter(
            (lesson) =>
              +new Date(lesson.starts) >= +new Date(hour) &&
              +new Date(lesson.starts) < +addHours(day, index + 1)
          )
          .map((event, idx) => {
            return (
              <Event
                key={idx}
                index={idx}
                event={event}
                isSummerDaylight={
                  index > 0 &&
                  isSummerDaylight(
                    addHours(day, index),
                    new Date(+new Date(event.starts) + getLessonDuration(event))
                  )
                }
              />
            );
          })}
        {new Date(hour).getHours() === 0 &&
          yesterdayEvent.map((event, idx) => (
            <Event
              isInterdayEvent
              isSummerDaylight={
                index > 0 &&
                isSummerDaylight(
                  addHours(day, index),
                  new Date(+new Date(event.starts) + getLessonDuration(event))
                )
              }
              event={{
                ...event,
                ends: new Date(
                  addMilliseconds(
                    startOfDay(hour),
                    +new Date(event.ends) - +startOfDay(new Date(hour))
                  )
                ).toISOString(),
              }}
              key={idx}
              index={idx}
            />
          ))}
      </div>
    </div>
  );
};

export default memo(Hour);
