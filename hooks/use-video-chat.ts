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
    if (payload.key === user.id) {
      Object.keys(channel.presenceState())
        .filter((id) => id !== user.id)
        .forEach((id) => {
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
            addCamera(
              remoteStream,
              channel.presenceState<{ user: User }>()[id][0].user
            );
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
    alert("on peer open");

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
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
    incomingCall.answer(localStreamRef.current);
    incomingCall.on("stream", (remoteStream) => {
      addCamera(remoteStream, incomingCall.metadata.user);
    });
  };

  const startSession = () => {
    // Handle SSR for navigator
    import("peerjs").then(({ default: Peer }) => {
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
