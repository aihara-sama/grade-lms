"use client";

import { Event } from "@/types/events.type";
import { db } from "@/utils/supabase/client";
import type { NextPage } from "next";
import Link from "next/link";
import type Peer from "peerjs";
import type { MediaConnection } from "peerjs";
import type { FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

const Camera: FunctionComponent<{
  camera: {
    stream: MediaStream;
    connection?: MediaConnection;
    isMicEnabled: boolean;
    isCameraEnabled: boolean;
    user: { id: string };
  };
  user: { id: string };
}> = ({ camera, user }) => {
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
        muted={camera.user.id === user.id}
      ></video>
      <div className="group-hover:h-[70px] absolute top-[0] left-[0] right-[0] h-[0] flex gap-[6px] text-[white] flex-col justify-center pl-[12px] overflow-hidden [transition:0.2s_height] bg-black bg-opacity-50">
        <p className="text-xs text-slate-200">{camera.user.id}</p>
      </div>
    </div>
  );
};

const Page: NextPage = () => {
  const [cameras, setCameras] = useState<
    {
      stream: MediaStream;
      connection?: MediaConnection;
      isMicEnabled: boolean;
      isCameraEnabled: boolean;
      user: { id: string };
    }[]
  >([]);
  // Hooks
  const user = { id: uuid() };
  const channel = db.channel("id", {
    config: {
      presence: {
        key: user.id,
      },
    },
  });

  // Refs
  const localStreamRef = useRef<MediaStream>();
  const peerRef = useRef<Peer>();

  const addCamera = (stream: MediaStream, _user: { id: string }) => {
    setCameras((_) => {
      return [
        ..._,
        {
          stream,
          isCameraEnabled: true,
          isMicEnabled: true,
          user: _user,
        },
      ];
    });
  };

  const toggleCamera = (userId: string) => {
    setCameras((prev) => {
      return prev.map((cam) => {
        if (cam.user.id === userId) {
          cam.stream.getVideoTracks().forEach((track) => {
            track.enabled = !cam.isCameraEnabled;
          });
          cam.isCameraEnabled = !cam.isCameraEnabled;
        }
        return cam;
      });
    });
  };
  const toggleAudio = (userId: string) => {
    setCameras((prev) => {
      return prev.map((cam) => {
        if (cam.user.id === userId) {
          cam.stream.getAudioTracks().forEach((track) => {
            track.enabled = !cam.isMicEnabled;
          });
          cam.isMicEnabled = !cam.isMicEnabled;
        }
        return cam;
      });
    });
  };

  const onPeerOpen = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(async (stream) => {
        addCamera(stream, user);
        localStreamRef.current = stream;

        const { data } = await db.from("visitors").select("*");

        data.forEach((visitor) => {
          const outgoingCall = peerRef.current.call(
            visitor.id,
            localStreamRef.current,
            {
              metadata: {
                user,
              },
            }
          );

          outgoingCall.once("stream", (remoteStream) => {
            addCamera(remoteStream, visitor);
          });

          outgoingCall.on("close", () => {
            setCameras((_) =>
              _.filter((camera) => camera.user.id !== visitor.id)
            );
          });
        });

        await db.from("visitors").insert({
          id: user.id,
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices: ", error);
      });
  };
  const onPeerCall = (incomingCall: MediaConnection) => {
    incomingCall.answer(localStreamRef.current);
    incomingCall.once("stream", (remoteStream) => {
      addCamera(remoteStream, incomingCall.metadata.user);
    });
    incomingCall.on("close", () => {
      setCameras((_) =>
        _.filter((camera) => camera.user.id !== incomingCall.metadata.user.id)
      );
    });

    incomingCall.on("error", () => {});
  };

  const startSession = () => {
    // Handle SSR for navigator
    import("peerjs").then(({ default: Peer }) => {
      peerRef.current = new Peer(user.id);

      peerRef.current.on("open", onPeerOpen);
      peerRef.current.on("call", onPeerCall);
      peerRef.current.on("close", () => {});

      peerRef.current.on("disconnected", () => {});

      peerRef.current.on("error", () => {});
    });
  };

  useEffect(() => {
    startSession();
    return () => {
      if (peerRef.current) {
        peerRef.current.disconnect();
      }
      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  useEffect(() => {
    channel.on("broadcast", { event: Event.ToggleCamera }, (payload) =>
      toggleCamera(payload.payload.userId)
    );
    channel.on("broadcast", { event: Event.ToggleAudio }, (payload) =>
      toggleAudio(payload.payload.userId)
    );
  }, []);

  return (
    <>
      <Link href="/dashboard">Dashboard</Link>
      {cameras.map((camera, idx) => (
        <Camera user={user} camera={camera} key={idx} />
      ))}
    </>
  );
};

export default Page;
