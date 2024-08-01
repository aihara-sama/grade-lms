"use client";

import Camera from "@/components/camera";
import type { ICamera } from "@/interfaces/camera.interface";
import type { ROLES } from "@/interfaces/user.interface";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type Peer from "peerjs";
import type { FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  lessonId: string;
  anonId: string;
  channel: RealtimeChannel;
  userName: string;
  role: ROLES;
}

const VideoChat: FunctionComponent<IProps> = ({
  anonId,
  channel,
  userName,
  role,
}) => {
  const [peer, setPeer] = useState<Peer>();
  const [cameras, setCameras] = useState<ICamera[]>([]);
  const localStreamRef = useRef<MediaStream>();

  const toggleCamera = (id: string) => {
    setCameras((prev) => {
      return prev.map((cam) => {
        if (cam.anonId === id) {
          cam.stream.getVideoTracks().forEach((track) => {
            track.enabled = !cam.isCameraEnabled;
          });
          cam.isCameraEnabled = !cam.isCameraEnabled;
        }
        return cam;
      });
    });
  };
  const toggleAudio = (id: string) => {
    setCameras((prev) => {
      return prev.map((cam) => {
        if (cam.anonId === id) {
          cam.stream.getAudioTracks().forEach((track) => {
            track.enabled = !cam.isMicEnabled;
          });
          cam.isMicEnabled = !cam.isMicEnabled;
        }
        return cam;
      });
    });
  };
  const fireToggleCamera = (id: string) => {
    channel.send({
      type: "broadcast",
      event: "camera:toggle",
      payload: {
        anonId: id,
      },
    });
  };
  const fireToggleAudio = (id: string) => {
    channel.send({
      type: "broadcast",
      event: "audio:toggle",
      payload: {
        anonId: id,
      },
    });
  };

  useEffect(() => {
    channel.on("broadcast", { event: "camera:toggle" }, (payload) => {
      toggleCamera(payload.payload.anonId);
    });
    channel.on("broadcast", { event: "audio:toggle" }, (payload) => {
      toggleAudio(payload.payload.anonId);
    });
  }, []);

  const addCamera = (
    stream: MediaStream,
    id: string,
    _userName: string,
    _role: ROLES
  ) => {
    setCameras((prev) => {
      if (!prev.find((camera) => camera.stream.id === stream.id)) {
        return [
          ...prev,
          {
            stream,
            isCameraEnabled: true,
            isMicEnabled: true,
            anonId: id,
            role: _role,
            userName: _userName,
          },
        ];
      }
      return prev;
    });
  };

  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  const join = async () => {
    channel
      .on("presence", { event: "join" }, (payload) => {
        if (payload.key !== anonId) {
          Object.keys(channel.presenceState())
            .filter((id) => id !== anonId)
            .forEach((id) => {
              const outgoingCall = peer.call(id, localStreamRef.current, {
                metadata: {
                  anonId,
                  role,
                  userName,
                },
              });

              outgoingCall.on("stream", (remoteStream) => {
                addCamera(remoteStream, id, userName, role);
              });
            });
        }
      })
      .on("presence", { event: "leave" }, (payload) => {
        setCameras((prev) =>
          prev.filter((camera) => camera.anonId !== payload.key)
        );
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: anonId,
          });
        }
      });
  };

  useEffect(() => {
    // Handle SSR for navigator
    import("peerjs").then(({ default: Peer }) => {
      setPeer(new Peer(anonId));
    });
  }, []);

  useEffect(() => {
    if (peer) {
      peer.on("open", () => {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            localStreamRef.current = stream;
            setCameras((prev) => [
              ...prev,
              {
                stream,
                isCameraEnabled: true,
                isMicEnabled: true,
                anonId,
                role,
                userName,
              },
            ]);
            join();
          })
          .catch((error) => {
            console.error("Error accessing media devices: ", error);
          });
      });

      peer.on("call", (incomingCall) => {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            incomingCall.answer(stream);
            incomingCall.on("stream", (remoteStream) => {
              addCamera(
                remoteStream,
                incomingCall.metadata.anonId,
                incomingCall.metadata.role,
                incomingCall.metadata.userName
              );
            });
          })
          .catch((error) => {
            console.error("Error accessing media devices: ", error);
          });
      });
    }
    return () => {
      if (peer) {
        peer.disconnect();
        peer.destroy();
      }
    };
  }, [peer]);

  return (
    <div className="flex flex-col flex-[1]">
      <div className="flex flex-col gap-[12px]">
        {cameras.map((camera, idx) => (
          <Camera
            toggleCamera={(id) => {
              toggleCamera(id);
              fireToggleCamera(id);
            }}
            toggleAudio={(id) => {
              toggleAudio(id);
              fireToggleAudio(id);
            }}
            anonId={anonId}
            localStream={localStreamRef.current}
            camera={camera}
            key={idx}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoChat;
