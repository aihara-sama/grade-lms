"use client";

import DateInput from "@/components/date-input";
import LessonsIcon from "@/components/icons/lessons-icon";
import SaveIcon from "@/components/icons/save-icon";
import Input from "@/components/input";
import ResizeHandler from "@/components/resize-handler";
import { supabaseClient } from "@/utils/supabase/client";
import { Excalidraw } from "@excalidraw/excalidraw";
import {
  addMinutes,
  format,
  millisecondsToMinutes,
  subMinutes,
} from "date-fns";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import type { Database } from "@/types/supabase.type";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import type { User } from "@supabase/supabase-js";
import type { ChangeEvent, FunctionComponent } from "react";

import "react-datepicker/dist/react-datepicker.css";

interface IProps {
  lesson: Database["public"]["Tables"]["lessons"]["Row"];
  user: User;
}

const LessonPreview: FunctionComponent<IProps> = ({ lesson }) => {
  // State
  const [starts, setStarts] = useState(new Date(lesson.starts));
  const [ends, setEnds] = useState(new Date(lesson.ends));
  const [whiteboardHeight, setWhiteboardHeight] = useState(500);
  const [whiteboardInitialHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight - 300 : 500
  );

  // Refs
  const containerRef = useRef<HTMLDivElement>();
  const whiteboardDataRef = useRef(JSON.parse(lesson.whiteboard_data));
  const excalidrawAPIRef = useRef<ExcalidrawImperativeAPI>(null);

  // Vars
  const duration = +new Date(ends) - +new Date(starts);

  // Handlers
  const handleSave = async () => {
    const { error } = await supabaseClient
      .from("lessons")
      .update({
        starts: format(starts, "yyyy-MM-dd'T'HH:mm:ss"),
        ends: format(ends, "yyyy-MM-dd'T'HH:mm:ss"),
        whiteboard_data: JSON.stringify(whiteboardDataRef.current),
      })
      .eq("id", lesson.id);

    if (error) toast.error(error.message);
    else toast.success("Saved!");
  };
  const handleChangeDate = (date: Date) => {
    setStarts(date);
    setEnds(addMinutes(date, millisecondsToMinutes(duration)));
  };
  const handleChangeDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (+value > millisecondsToMinutes(duration)) {
      setEnds(addMinutes(ends, 15));
    } else if (+value < millisecondsToMinutes(duration) && +value > 15) {
      setEnds(subMinutes(ends, 15));
    }
  };
  const handleSaveWhiteboardData = async () => {
    const { error } = await supabaseClient
      .from("lessons")
      .update({
        whiteboard_data: JSON.stringify(whiteboardDataRef.current),
      })
      .eq("id", lesson.id);

    if (error) toast.error(error.message);
    else toast.success("Saved!");
  };

  return (
    <div className="flex gap-6 mt-3" ref={containerRef}>
      <main className="flex-1">
        <div className="flex items-center mb-3">
          <p className="text-center text-xl font-bold">Whiteboard preview</p>
          <button
            className="icon-button shadow-md ml-auto mr-2"
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
              whiteboardDataRef.current = {
                elements,
                appState,
              };
            }}
          />
          <ResizeHandler
            containerRef={containerRef}
            initialHeight={whiteboardInitialHeight}
            minHeight={170}
            onResize={(height) => setWhiteboardHeight(height)}
          />
        </div>
      </main>
      <aside className="pt-8">
        <DateInput
          date={starts}
          onChange={handleChangeDate}
          label="Starts at"
          popperPlacement="bottom-start"
        />
        <div className="mb-2 mt-3 text-4">Duration:</div>
        <Input
          fullWIdth
          type="number"
          Icon={<LessonsIcon />}
          value={`${millisecondsToMinutes(duration)}`}
          onChange={handleChangeDuration}
        />
        <hr className="mx-0 my-2 border-divider" />
        <button className="primary-button" onClick={handleSave}>
          Save
        </button>
      </aside>
    </div>
  );
};

export default LessonPreview;
