"use client";

import type { Database } from "@/types/supabase.type";
import { supabaseClient } from "@/utils/supabase/client";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import type { User } from "@supabase/supabase-js";
import {
  addMinutes,
  format,
  millisecondsToMinutes,
  subMinutes,
} from "date-fns";
import type { ChangeEvent, FunctionComponent } from "react";
import { useRef, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import DateInput from "../date-input";
import LessonsIcon from "../icons/lessons-icon";
import SaveIcon from "../icons/save-icon";
import Input from "../input";
import ResizeHandler from "../resize-handler";

// function millisecondsToHours(milliseconds: number) {
//   return milliseconds / (1000 * 60 * 60);
// }

// function minutesToMilliseconds(minutes: number) {
//   return minutes * 60 * 1000;
// }

// function hoursToMilliseconds(hours: number) {
//   return hours * 60 * 60 * 1000;
// }
interface IProps {
  lesson: Database["public"]["Tables"]["lessons"]["Row"];
  user: User;
}

const LessonPreview: FunctionComponent<IProps> = ({ lesson }) => {
  const whiteboardData = useRef(JSON.parse(lesson.whiteboard_data));
  // const [timeSlots, setTimeSlots] = useState(generateTimeSlots());
  const [starts, setStarts] = useState(new Date(lesson.starts));
  const [ends, setEnds] = useState(new Date(lesson.ends));
  const duration = +new Date(ends) - +new Date(starts);
  const [initialHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight - 300 : 500
  );
  const [whiteboardHeight, setWhiteboardHeight] = useState(500);
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);
  const containerRef = useRef<HTMLDivElement>();

  const handleSaveWhiteboardData = async () => {
    const { error } = await supabaseClient
      .from("lessons")
      .update({
        whiteboard_data: JSON.stringify(whiteboardData.current),
      })
      .eq("id", lesson.id);

    if (error) toast.error(error.message);
    else toast.success("Saved!");
  };

  // const handleChangeDate = (date: Date) => {
  //   const selectedStartsDate = new Date(starts);
  //   const selectedEndsDate = new Date(ends);
  //   selectedStartsDate.setDate(date.getDate());
  //   selectedEndsDate.setDate(date.getDate());
  //   setStarts(selectedStartsDate);
  //   setEnds(selectedEndsDate);
  // };

  // const handleChangeTime = (
  //   time: string,
  //   setFromOrTo: Dispatch<SetStateAction<Date>>
  // ) => {
  //   const selectedTime = time.split(" ")[0]; // Extract the time part without AM/PM
  //   const selectedPeriod = time.split(" ")[1]; // Extract the AM/PM part

  //   // Convert the selected time to a Date object
  //   const selectedDateTime = new Date(starts);
  //   const [hours, minutes] = selectedTime.split(":");
  //   selectedDateTime.setHours(parseInt(hours, 10));
  //   selectedDateTime.setMinutes(parseInt(minutes, 10));
  //   selectedDateTime.setSeconds(0);

  //   // Adjust the hours if PM is selected
  //   if (selectedPeriod === "PM") {
  //     selectedDateTime.setHours(selectedDateTime.getHours() + 12);
  //   }

  //   // Update the state with the selected time
  //   setFromOrTo(selectedDateTime);
  // };
  const handleChangeDate = (date: Date) => {
    setStarts(date);
    setEnds(addMinutes(date, millisecondsToMinutes(duration)));
  };
  const handleSave = async () => {
    const { error } = await supabaseClient
      .from("lessons")
      .update({
        starts: format(starts, "yyyy-MM-dd'T'HH:mm:ss"),
        ends: format(ends, "yyyy-MM-dd'T'HH:mm:ss"),
        whiteboard_data: JSON.stringify(whiteboardData.current),
      })
      .eq("id", lesson.id);

    if (error) toast.error(error.message);
    else toast.success("Saved!");
  };

  const handleChangeDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (+value > millisecondsToMinutes(duration)) {
      setEnds(addMinutes(ends, 15));
    } else if (+value < millisecondsToMinutes(duration) && +value > 15) {
      setEnds(subMinutes(ends, 15));
    }
  };
  return (
    <div className="flex gap-[24px] mt-[12px]" ref={containerRef}>
      <main className="flex-[1]">
        <div className="flex items-center mb-[12px]">
          <p className="text-center text-xl font-bold">Whiteboard preview</p>
          <button
            className="icon-button shadow-md ml-auto mr-[8px] hover:bg-gray-100 active:bg-gray-200"
            onClick={handleSaveWhiteboardData}
          >
            <SaveIcon />
          </button>
        </div>
        <div
          className="relative border border-gray-200 [&>.excalidraw]:h-[calc(100%-100px)]"
          style={{
            height: `${whiteboardHeight}px`,
          }}
        >
          <Excalidraw
            isCollaborating={false}
            excalidrawAPI={(api) => {
              excalidrawAPIRef.current = api;
            }}
            initialData={(function () {
              const data = JSON.parse(lesson.whiteboard_data);
              if (data.appState) data.appState.collaborators = new Map();
              return data;
            })()}
            onChange={(elements, appState) => {
              whiteboardData.current = {
                elements,
                appState,
              };
            }}
          />
          <ResizeHandler
            containerRef={containerRef}
            initialHeight={initialHeight}
            minHeight={170}
            onChange={(height) => setWhiteboardHeight(height)}
          />
        </div>
      </main>
      <aside className="pt-[33px]">
        {/* <button className="outline-button w-full">
          <CalendarIcon />
          {format(new Date(starts), "EEEE, MMM d hh:mm a")}
        </button> */}
        <DateInput
          date={starts}
          onChange={handleChangeDate}
          useBottomSpacing
          label="Starts at"
          popperPlacement="bottom-start"
        />
        <div className="mb-[8px] mt-[12px] text-[15px]">Duration:</div>
        <Input
          type="number"
          Icon={<LessonsIcon />}
          value={`${millisecondsToMinutes(duration)}`}
          onChange={handleChangeDuration}
        />
        <hr className="mx-[0] my-[8px] border-divider" />
        <button className="primary-button w-full" onClick={handleSave}>
          Save
        </button>
      </aside>
    </div>
  );
};

export default LessonPreview;
