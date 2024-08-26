"use client";

import Camera from "@/components/camera";
import { useVideoChat } from "@/hooks/use-video-chat";
import type { FunctionComponent } from "react";

const VideoChat: FunctionComponent = () => {
  // Hooks
  const { cameras, toggleAudio, toggleCamera } = useVideoChat();

  // View
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col gap-3">
        {cameras.map((camera, idx) => (
          <Camera
            toggleCamera={toggleCamera}
            toggleAudio={toggleAudio}
            camera={camera}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
};
export default VideoChat;
