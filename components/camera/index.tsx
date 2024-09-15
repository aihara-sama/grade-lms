"use client";

import MicroDisabledIcon from "@/components/icons/micro-disabled-icon";
import MicroIcon from "@/components/icons/micro-icon";
import VideoDisabledIcon from "@/components/icons/video-disabled-icon";
import VideoIcon from "@/components/icons/video-icon";
import { useUser } from "@/hooks/use-user";
import type { ICamera } from "@/interfaces/camera.interface";
import { useEffect, useRef, type FunctionComponent } from "react";

interface Props {
  camera: ICamera;
  toggleCamera: (id: string) => void;
  toggleAudio: (id: string) => void;
}

const Camera: FunctionComponent<Props> = ({
  camera,
  toggleCamera,
  toggleAudio,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const { user } = useUser();

  useEffect(() => {
    videoRef.current.srcObject = camera.stream;
  }, []);

  return (
    <div className="relative flex group">
      <video
        className="w-full rounded-[8px] h-[236px] object-cover"
        ref={videoRef}
        autoPlay
        muted={camera.user.id === user.id}
      ></video>
      <div className="group-hover:h-[70px] absolute top-[0] left-[0] right-[0] h-[0] flex gap-[6px] text-[white] flex-col justify-center pl-[12px] overflow-hidden [transition:0.2s_height] bg-black bg-opacity-50">
        <p className="text-sm">{camera.user.name}</p>
        <p className="text-xs text-slate-200">{camera.user.role}</p>
        <p className="text-xs text-slate-200">{camera.stream.id}</p>
      </div>
      {camera.user.id === user.id && (
        <div className="group-hover:h-[70px] absolute left-[0] right-[0] h-[0] bottom-[0] flex gap-[12px] items-center justify-center [transition:0.2s_height] overflow-hidden bg-black bg-opacity-50">
          <div
            className="size-8 flex justify-center items-center rounded-md bg-transparent border-2 border-divider inter-active"
            onClick={() => toggleCamera(camera.user.id)}
          >
            {camera.isCameraEnabled ? <VideoIcon /> : <VideoDisabledIcon />}
          </div>
          <div
            className="size-8 flex justify-center items-center rounded-md inter-active bg-transparent border-2 border-divider"
            onClick={() => toggleAudio(camera.user.id)}
          >
            {camera.isMicEnabled ? <MicroIcon /> : <MicroDisabledIcon />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
