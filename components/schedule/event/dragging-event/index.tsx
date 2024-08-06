import { useSchedule } from "@/hooks/useSchedule";
import type { Database } from "@/types/supabase.type";
import { getEventWidth } from "@/utils/get-event-width";
import { minToPx } from "@/utils/min-to-px";
import { forwardRef, memo } from "react";

interface IProps {
  event: Database["public"]["Tables"]["lessons"]["Row"];
}

const DraggingEvent = forwardRef<HTMLDivElement, IProps>(function DraggingEvent(
  { event },
  ref
) {
  // const initPointerPosition = useSchedule((state) => state.initPointerPosition);
  const initEventPosition = useSchedule((state) => state.initEventPosition);
  const canDrop = useSchedule((state) => state.canDropEvent);

  // const pointerOffsetPositionOnEvent = useSchedule(
  //   (state) => state.pointerOffsetPositionOnEvent
  // );

  return (
    <div
      className={`dragging-event event absolute top-0 left-0 ${canDrop === false ? "cursor-not-allowed" : ""}`}
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
