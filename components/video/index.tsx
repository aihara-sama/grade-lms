import type { FunctionComponent } from "react";
import { memo } from "react";

interface Props {
  stream: MediaStream;
  isMuted: boolean;
}

const Video: FunctionComponent<Props> = memo(function Video({
  stream,
  isMuted,
}) {
  return (
    <video
      ref={(el) => {
        if (el) el.srcObject = stream;
      }}
      autoPlay
      muted={isMuted}
      className="w-full rounded-[8px] h-[236px] object-cover"
    ></video>
  );
});

export default Video;
