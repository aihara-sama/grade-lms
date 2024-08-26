import Event from "@/components/schedule/event";
import { useSchedule } from "@/hooks/useSchedule";
import type { IUserMetadata } from "@/interfaces/user.interface";
import { Role } from "@/interfaces/user.interface";
import type { Lesson } from "@/types/lessons.type";
import { isFirstDateFromYesterdayOrMore } from "@/utils/is-first-date-from-yesterday-or-more";
import { isSummerDaylight } from "@/utils/is-summer-daylight";
import { minToPx } from "@/utils/min-to-px";
import type { User } from "@supabase/supabase-js";
import clsx from "clsx";
import {
  addHours,
  addMilliseconds,
  addMinutes,
  format,
  hoursToMilliseconds,
  millisecondsToMinutes,
  startOfDay,
} from "date-fns";
import type { FunctionComponent } from "react";
import { memo } from "react";

interface IProps {
  quarter?: number;
  day: string;
  index: number;
  events: Lesson[];
  draggingEvent?: Lesson;
  hour: number;
  user: User;
}

const Hour: FunctionComponent<IProps> = ({
  day,
  index,
  events,
  draggingEvent,
  quarter,
  hour,
  user,
}) => {
  const setSelectedLesson = useSchedule((state) => state.setSelectedLesson);
  const hourEvents = events.filter(
    (lesson) =>
      +new Date(lesson.starts) >= +new Date(hour) &&
      +new Date(lesson.starts) < +addHours(day, index + 1)
  );

  const yesterdayEvent = events.filter(
    (lesson) =>
      isFirstDateFromYesterdayOrMore(
        lesson.starts,
        format(hour, "yyyy-MM-dd'T'HH:mm:ss")
      ) && +new Date(lesson.ends) >= +new Date(hour)
  );

  const handleHourClick = (idx: number) => {
    setSelectedLesson({
      id: undefined,
      title: "",
      starts: addMinutes(new Date(hour), idx * 15).toString(),
      ends: addMinutes(addMinutes(new Date(hour), idx * 15), 15).toString(),
      course_id: null,
      whiteboard_data: "{}",
      created_at: undefined,
    });
  };

  return (
    <div>
      {index > 0 &&
        isSummerDaylight(addHours(day, index), addHours(day, index - 1)) && (
          <div className="h-[81px] text-xs pl-1 pt-1 text-orange-400 border border-r-neutral-100 border-t-neutral-100 relative">
            Daylight Saving TIme
          </div>
        )}
      <div
        id="a"
        className={`hour h-[81px] border border-r-neutral-100 border-t-neutral-100 relative `}
        data-date={new Date(hour)}
      >
        {[...Array(4)].map((_, idx) => {
          return (
            <div
              key={idx}
              onClick={() => handleHourClick(idx)}
              data-date={addMinutes(new Date(hour), idx * 15)}
              data-starts={addMinutes(new Date(hour), idx * 15)}
              data-ends={
                draggingEvent &&
                new Date(
                  +addMinutes(new Date(hour), idx * 15) +
                    (+new Date(draggingEvent.ends) -
                      +new Date(draggingEvent.starts))
                )
              }
              data-duration={
                draggingEvent &&
                millisecondsToMinutes(
                  +new Date(
                    +new Date(
                      +addMinutes(new Date(hour), idx * 15) +
                        (+new Date(draggingEvent.ends) -
                          +new Date(draggingEvent.starts))
                    ) - +new Date(draggingEvent.starts)
                  )
                )
              }
              className={`placeholder absolute w-full text-center border-[2px] border-dashed border-[#c3c3c3] rounded-[3px] opacity-0 [transition:0.1s] bg-[white] h-[20px] flex justify-center items-center bg-transparent ${!draggingEvent ? "hover:cursor-pointer hover:opacity-100" : ""} active:bg-gray-100 ${quarter === idx * 15 ? "opacity-100" : "opacity-0"} ${clsx((user.user_metadata as IUserMetadata).role !== Role.Teacher && "pointer-events-none")}`}
              style={{
                top: `${idx * 20}px`,
                height: `${
                  draggingEvent
                    ? minToPx(
                        +new Date(draggingEvent.ends) -
                          +new Date(draggingEvent.starts) +
                          (isSummerDaylight(
                            addHours(day, index),
                            new Date(
                              +addMinutes(new Date(hour), idx * 15) +
                                (+new Date(draggingEvent.ends) -
                                  +new Date(draggingEvent.starts))
                            )
                          )
                            ? hoursToMilliseconds(1)
                            : 0)
                      )
                    : 20
                }px`,
              }}
            ></div>
          );
        })}
        {hourEvents.map((event, idx) => {
          return (
            <Event
              isSummerDaylight={
                index > 0 &&
                isSummerDaylight(
                  addHours(day, index),
                  new Date(
                    +new Date(event.starts) +
                      (+new Date(event.ends) - +new Date(event.starts))
                  )
                )
              }
              event={event}
              key={idx}
              index={idx}
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
                  new Date(
                    +new Date(event.starts) +
                      (+new Date(event.ends) - +new Date(event.starts))
                  )
                )
              }
              event={{
                ...event,
                ends: format(
                  addMilliseconds(
                    startOfDay(hour),
                    +new Date(event.ends) - +startOfDay(new Date(hour))
                  ),
                  "yyyy-MM-dd'T'HH:mm:ss"
                ),
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
