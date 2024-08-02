"use client";

import type { ICamera } from "@/interfaces/camera.interface";
import { useEffect, useRef, type FunctionComponent } from "react";
import MicroDisabledIcon from "../icons/micro-disabled-icon";
import MicroIcon from "../icons/micro-icon";
import RemoveUserIcon from "../icons/remove-user-icon";
import VideoDisabledIcon from "../icons/video-disabled-icon";
import VideoIcon from "../icons/video-icon";

interface IProps {
  anonId: string;
  camera: ICamera;
  localStream: MediaStream;
  toggleCamera: (id: string) => void;
  toggleAudio: (id: string) => void;
}

const Camera: FunctionComponent<IProps> = ({
  camera,
  anonId,
  toggleCamera,
  toggleAudio,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current.srcObject = camera.stream;
  }, []);

  return (
    <div className="relative flex group">
      <video
        className="w-full rounded-[8px] h-[236px] object-cover"
        ref={videoRef}
        autoPlay
        muted={camera.anonId === anonId}
      ></video>
      {/* {!isCameraEnabled && <div className="absolute left-[0] right-[0] bottom-[0] top-[0] bg-black"></div>} */}
      <div className="group-hover:h-[70px] absolute top-[0] left-[0] right-[0] h-[0] flex gap-[6px] text-[white] flex-col justify-center pl-[12px] overflow-hidden [transition:0.2s_height] bg-black bg-opacity-50">
        <p className="text-sm">{camera.userName}</p>
        <p className="text-xs text-slate-200">{camera.role}</p>
      </div>
      <div className="group-hover:h-[70px] absolute left-[0] right-[0] h-[0] bottom-[0] flex gap-[12px] items-center justify-center [transition:0.2s_height] overflow-hidden bg-black bg-opacity-50">
        <button
          className="icon-button bg-transparent border-2 border-divider"
          onClick={() => toggleCamera(camera.anonId)}
        >
          {camera.isCameraEnabled ? <VideoIcon /> : <VideoDisabledIcon />}
        </button>
        <button
          className="icon-button bg-transparent border-2 border-divider"
          onClick={() => toggleAudio(camera.anonId)}
        >
          {camera.isMicEnabled ? <MicroIcon /> : <MicroDisabledIcon />}
        </button>
        {camera.anonId !== anonId && (
          <button className="icon-button bg-transparent border-2 border-divider">
            <RemoveUserIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default Camera;
