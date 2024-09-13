import { useLessonChannel } from "@/hooks/use-lesson-channel";
import { useUser } from "@/hooks/use-user";
import type { ICamera } from "@/interfaces/camera.interface";
import { Role } from "@/interfaces/user.interface";
import { Event } from "@/types/events.type";
import type { User } from "@/types/users";
import type {
  REALTIME_SUBSCRIBE_STATES,
  RealtimePresenceJoinPayload,
  RealtimePresenceLeavePayload,
} from "@supabase/supabase-js";
import type Peer from "peerjs";
import type { MediaConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";

export const useVideoChat = () => {
  const [cameras, setCameras] = useState<ICamera[]>([]);

  // Hooks
  const channel = useLessonChannel();
  const { user } = useUser();

  // Refs
  const localStreamRef = useRef<MediaStream>();
  const joinedCount = useRef(0);
  const peerRef = useRef<Peer>();
  const isUnmounting = useRef(false);

  const endSession = () => {
    if (peerRef.current) {
      peerRef.current.disconnect();
      peerRef.current.destroy();
      peerRef.current = undefined;

      cameras.forEach((camera) => {
        camera.stream.getTracks().forEach((track) => {
          track.stop();
        });
      });

      setCameras([]);

      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };
  const addCamera = (stream: MediaStream, _user: User) => {
    setCameras((_) => {
      if (!_.find((camera) => camera.stream.id === stream.id)) {
        return [
          ..._,
          {
            stream,
            isCameraEnabled: true,
            isMicEnabled: true,
            user: _user,
          },
        ];
      }
      return _;
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
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        incomingCall.answer(stream);
        incomingCall.on("stream", (remoteStream) => {
          addCamera(remoteStream, incomingCall.metadata.user);
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices: ", error);
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
      isUnmounting.current = true;
    };
  }, []);

  useEffect(() => {
    joinedCount.current = cameras.length;
  }, [cameras]);

  useEffect(() => {
    return () => {
      if (isUnmounting.current) {
        endSession();
      }
    };
  }, [cameras]);

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
