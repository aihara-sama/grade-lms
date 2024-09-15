import { useUser } from "@/hooks/use-user";
import type { ICamera } from "@/interfaces/camera.interface";
import { Role } from "@/interfaces/user.interface";
import { Event } from "@/types/events.type";
import type { User } from "@/types/users";
import { db } from "@/utils/supabase/client";
import type {
  REALTIME_SUBSCRIBE_STATES,
  RealtimePresenceJoinPayload,
  RealtimePresenceLeavePayload,
} from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import type Peer from "peerjs";
import type { MediaConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";

export const useVideoChat = () => {
  const [cameras, setCameras] = useState<ICamera[]>([]);
  console.log({ cameras });

  const { lessonId } = useParams();
  // Hooks
  const { user } = useUser();
  const channel = db.channel(lessonId as string, {
    config: {
      presence: {
        key: user.id,
      },
    },
  });

  // Refs
  const localStreamRef = useRef<MediaStream>();
  const peerRef = useRef<Peer>();

  const endSession = () => {
    if (peerRef.current) {
      peerRef.current.disconnect();
      peerRef.current.destroy();
    }
    localStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    channel.unsubscribe();
  };
  const addCamera = (stream: MediaStream, _user: User) => {
    setCameras((currentCameras) => {
      const existingCameraIndex = currentCameras.findIndex(
        (camera) => camera.stream.id === stream.id
      );

      if (existingCameraIndex !== -1) {
        // Replace the existing camera for the user
        const updatedCameras = [...currentCameras];
        updatedCameras[existingCameraIndex] = {
          stream,
          isCameraEnabled: true,
          isMicEnabled: true,
          user: _user,
        };
        return updatedCameras;
      }

      // Add new camera if no camera for the user exists
      return [
        ...currentCameras,
        {
          stream,
          isCameraEnabled: true,
          isMicEnabled: true,
          user: _user,
        },
      ];
    });
  };

  const fireToggleCamera = (userId: string) => {
    channel.send({
      type: "broadcast",
      event: Event.ToggleCamera,
      payload: {
        userId,
      },
    });
  };
  const fireToggleAudio = (userId: string) => {
    channel.send({
      type: "broadcast",
      event: Event.ToggleAudio,
      payload: {
        userId,
      },
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

  const fireAndToggleCamera = (userId: string) => {
    toggleCamera(userId);
    fireToggleCamera(userId);
  };
  const fireAndToggleAudio = (userId: string) => {
    toggleAudio(userId);
    fireToggleAudio(userId);
  };

  const onPresenceJoin = (
    payload: RealtimePresenceJoinPayload<{ user: User }>
  ) => {
    console.log("onPresenceJoin");

    if (payload.key === user.id) {
      Object.keys(channel.presenceState())
        .filter((id) => id !== user.id)
        .forEach((id) => {
          console.log("Calling...");

          const outgoingCall = peerRef.current.call(
            id,
            localStreamRef.current,
            {
              metadata: {
                user,
              },
            }
          );

          outgoingCall.on("stream", (remoteStream) => {
            console.log("outgoingCall - on:stream");

            addCamera(
              remoteStream,
              channel.presenceState<{ user: User }>()[id][0].user
            );
          });

          outgoingCall.on("error", (error) => {
            alert(error);
          });
        });
    }
  };
  const onPresenceLeave = (
    payload: RealtimePresenceLeavePayload<{ user: User }>
  ) => {
    setCameras((_) =>
      _.filter((camera) => payload.leftPresences[0].user.id !== camera.user.id)
    );
  };
  const onPresenceSubscribe = async (
    status: `${REALTIME_SUBSCRIBE_STATES}`
  ) => {
    if (status === "SUBSCRIBED") {
      await channel.track({
        user,
      });
    }
  };

  const onPeerOpen = () => {
    console.log("onPeerOpen");

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log("git user media");

        channel
          .on("presence", { event: "join" }, onPresenceJoin)
          .on("presence", { event: "leave" }, onPresenceLeave)
          .subscribe(onPresenceSubscribe);

        addCamera(stream, user);
        localStreamRef.current = stream;
      })
      .catch((error) => {
        console.error("Error accessing media devices: ", error);
      });
  };
  const onPeerCall = (incomingCall: MediaConnection) => {
    console.log("onPeerCall");

    incomingCall.answer(localStreamRef.current);
    incomingCall.on("stream", (remoteStream) => {
      console.log("onPeerCall - on:stream");

      addCamera(remoteStream, incomingCall.metadata.user);
    });
    incomingCall.on("error", (error) => {
      alert(error);
    });
  };

  const startSession = () => {
    // Handle SSR for navigator
    import("peerjs").then(({ default: Peer }) => {
      console.log("Peer imported");

      peerRef.current = new Peer(user.id);

      peerRef.current.on("open", onPeerOpen);
      peerRef.current.on("call", onPeerCall);
    });
  };

  useEffect(() => {
    return () => {
      if (peerRef.current) {
        peerRef.current.disconnect();
        peerRef.current.destroy();
      }
      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      channel.unsubscribe();
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

  return {
    cameras: [
      ...cameras.filter(({ user: { role } }) => role === Role.Teacher),
      ...cameras.filter(({ user: { role } }) => role !== Role.Teacher),
    ],
    fireAndToggleAudio,
    fireAndToggleCamera,
    endSession,
    startSession,
  };
};
