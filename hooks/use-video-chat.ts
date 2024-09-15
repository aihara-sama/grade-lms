import { useUser } from "@/hooks/use-user";
import type { ICamera } from "@/interfaces/camera.interface";
import { Event } from "@/types/events.type";
import type { User } from "@/types/users";
import { db } from "@/utils/supabase/client";
import type {
  REALTIME_SUBSCRIBE_STATES,
  RealtimePresenceJoinPayload,
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

  const onPresenceJoin = (
    payload: RealtimePresenceJoinPayload<{ user: User }>
  ) => {
    if (payload.key === user.id) {
      Object.keys(channel.presenceState())
        .filter((id) => id !== user.id)
        .forEach((id) => {
          peerRef.current.connect(id).on("open", () => {
            const outgoingCall = peerRef.current.call(
              id,
              localStreamRef.current,
              {
                metadata: {
                  user,
                },
              }
            );

            outgoingCall.once("stream", (remoteStream) => {
              addCamera(
                remoteStream,
                channel.presenceState<{ user: User }>()[id][0].user
              );
            });

            outgoingCall.on("close", () => {
              alert(`outgoing call close${id}`);

              setCameras((_) => _.filter((camera) => camera.user.id !== id));
            });
            outgoingCall.on("error", (err) => {
              alert(`outgoing call error ${err} ${id}`);
            });
          });
        });
    }
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
    incomingCall.once("stream", (remoteStream) => {
      addCamera(remoteStream, incomingCall.metadata.user);
    });
    incomingCall.on("close", () => {
      alert(`incomingCall close ${incomingCall.metadata.user.id}`);

      setCameras((_) =>
        _.filter((camera) => camera.user.id !== incomingCall.metadata.user.id)
      );
    });

    incomingCall.on("error", (err) => {
      alert(`incoming call error ${err} ${incomingCall.metadata.user.id}`);
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
    cameras,
    toggleAudio,
    toggleCamera,
    endSession,
    startSession,
  };
};
