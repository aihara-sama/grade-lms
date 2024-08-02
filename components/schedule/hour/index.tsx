import Event from "@/components/schedule/event";
import { useSchedule } from "@/hooks/useSchedule";
import type { Database } from "@/types/supabase.type";
import { minToPx } from "@/utils/min-to-px";
import {
  addHours,
  addMinutes,
  hoursToMilliseconds,
  millisecondsToMinutes,
} from "date-fns";
import type { FunctionComponent } from "react";
import { memo } from "react";

interface IProps {
  quarter?: number;
  day: string;
  index: number;
  events: Database["public"]["Tables"]["lessons"]["Row"][];
  draggingEvent?: Database["public"]["Tables"]["lessons"]["Row"];
  hour: number;
}

const isSummerDaylight = (date1: Date, date2: Date) =>
  new Date(+date1).getTimezoneOffset() !== new Date(+date2).getTimezoneOffset();

const Hour: FunctionComponent<IProps> = ({
  day,
  index,
  events,
  draggingEvent,
  quarter,
  hour,
}) => {
  const setSelectedLesson = useSchedule((state) => state.setSelectedLesson);
  const hourEvents = events.filter(
    (lesson) =>
      +new Date(lesson.starts) >= +new Date(hour) &&
      +new Date(lesson.starts) < +addHours(day, index + 1)
  );

  return (
    <>
      {index > 0 &&
        isSummerDaylight(addHours(day, index), addHours(day, index - 1)) && (
          <div
            className="h-[81px] [border-top:1px_solid_#dfdfdf] [border-right:1px_solid_#dfdfdf] relative"
            style={{
              fontSize: "12px",
              padding: "4px 0 0 4px",
              color: "#c6a119",
            }}
          >
            Daylight Saving TIme
          </div>
        )}
      <div
        className="hour h-[81px] [border-top:1px_solid_#dfdfdf] [border-right:1px_solid_#dfdfdf] relative"
        data-date={new Date(hour)}
      >
        {[...Array(4)].map((_, idx) => {
          return (
            <div
              onClick={() =>
                setSelectedLesson({
                  id: undefined,
                  title: "",
                  starts: addMinutes(new Date(hour), idx * 15).toString(),
                  ends: addMinutes(
                    addMinutes(new Date(hour), idx * 15),
                    15
                  ).toString(),
                  course_id: null,
                  whiteboard_data: "{}",
                  created_at: undefined,
                })
              }
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
              key={idx}
              className={`placeholder absolute w-full text-center border-[2px] border-dashed border-[#c3c3c3] rounded-[3px] opacity-0 [transition:0.1s] bg-[white] h-[20px] flex justify-center items-center bg-transparent ${!draggingEvent ? "hover:cursor-pointer hover:opacity-100" : ""} active:bg-light ${quarter === idx * 15 ? "opacity-100" : "opacity-0"}`}
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
        {hourEvents.map((event, idx) => (
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
        ))}
      </div>
    </>
  );
};

export default memo(Hour);
