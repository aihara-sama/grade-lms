"use client";

import Camera from "@/components/camera";
import { useEffect, useRef, useState } from "react";

import type { ICamera } from "@/interfaces/camera.interface";
import type { Role } from "@/interfaces/user.interface";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type Peer from "peerjs";
import type { FunctionComponent } from "react";

interface IProps {
  lessonId: string;
  anonId: string;
  channel: RealtimeChannel;
  userName: string;
  role: Role;
}

const VideoChat: FunctionComponent<IProps> = ({
  anonId,
  channel,
  userName,
  role,
}) => {
  // State
  const [peer, setPeer] = useState<Peer>();
  const [cameras, setCameras] = useState<ICamera[]>([]);
  console.log({ cameras });

  // Refs
  const localStreamRef = useRef<MediaStream>();

  // Handlers

  const addCamera = (
    stream: MediaStream,
    id: string,
    _userName: string,
    _role: Role
  ) => {
    console.log({ stream, id, _userName, _role });

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
  const join = async () => {
    channel
      .on("presence", { event: "join" }, (payload) => {
        console.log("presence - join", { payload });

        if (payload.key === anonId) {
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
                addCamera(
                  remoteStream,
                  id,
                  // @ts-ignore
                  channel.presenceState()[id][0].userName,
                  // @ts-ignore
                  channel.presenceState()[id][0].role
                );
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
            role,
            userName,
          });
        }
      });
  };
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

  // Effects
  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);
  useEffect(() => {
    channel.on("broadcast", { event: "camera:toggle" }, (payload) => {
      toggleCamera(payload.payload.anonId);
    });
    channel.on("broadcast", { event: "audio:toggle" }, (payload) => {
      toggleAudio(payload.payload.anonId);
    });
  }, []);
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
            console.log("on peer open");

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

      // When smdb joins
      peer.on("call", (incomingCall) => {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            incomingCall.answer(stream);
            incomingCall.on("stream", (remoteStream) => {
              console.log("smbd joined", { remoteStream, incomingCall });

              addCamera(
                remoteStream,
                incomingCall.metadata.anonId,
                incomingCall.metadata.userName,
                incomingCall.metadata.role
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

  // View
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col gap-3">
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
            role={role}
          />
        ))}
      </div>
    </div>
  );
};
export default VideoChat;
