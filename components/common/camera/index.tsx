"use client";

import StreamVideo from "@/components/common/videos/stream-video";
import MicroDisabledIcon from "@/components/icons/micro-disabled-icon";
import MicroIcon from "@/components/icons/micro-icon";
import VideoDisabledIcon from "@/components/icons/video-disabled-icon";
import VideoIcon from "@/components/icons/video-icon";
import { useUser } from "@/hooks/use-user";
import type { Camera as ICamera } from "@/interfaces/camera.interface";
import { useTranslations } from "next-intl";
import { type FunctionComponent } from "react";

interface Props {
  camera: ICamera;
  toggleCamera: (id: string) => void;
  toggleAudio: (id: string) => void;
}

const Camera: FunctionComponent<Props> = ({
  camera,
  toggleAudio,
  toggleCamera,
}) => {
  // Hooks
  const t = useTranslations();
  const user = useUser((state) => state.user);

  // View
  return (
    <div className="relative flex group bg-black rounded-[8px]">
      {!camera.isCameraEnabled && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-24 bg-green-700 rounded-full flex items-center justify-center">
          <span className="text-4xl text-white">
            {camera.user.name[0].toUpperCase()}
          </span>
        </div>
      )}
      <StreamVideo
        isMuted={camera.user.id === user.id}
        stream={camera.stream}
      />
      <div className="group-hover:h-[70px] absolute top-[0] left-[0] right-[0] h-[0] flex gap-[6px] text-[white] flex-col justify-center pl-[12px] overflow-hidden [transition:0.2s_height] bg-black bg-opacity-50">
        <p className="text-sm">{camera.user.name}</p>
        <p className="text-xs text-slate-200">
          {t(`roles.${camera.user.role}`)}
        </p>
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
