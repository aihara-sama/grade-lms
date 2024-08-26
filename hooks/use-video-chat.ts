import { useLessonChannel } from "@/hooks/use-lesson-channel";
import { useUser } from "@/hooks/use-user";
import type { ICamera } from "@/interfaces/camera.interface";
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
  const [peer, setPeer] = useState<Peer>();
  const [cameras, setCameras] = useState<ICamera[]>([]);

  // Hooks
  const channel = useLessonChannel();
  const { user } = useUser();

  // Refs
  const localStreamRef = useRef<MediaStream>();

  const handleAddCamera = (stream: MediaStream, _user: User) => {
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

  const onPresenceJoin = (
    payload: RealtimePresenceJoinPayload<{ user: User }>
  ) => {
    if (payload.key === user.id) {
      Object.keys(channel.presenceState())
        .filter((id) => id !== user.id)
        .forEach((id) => {
          const outgoingCall = peer.call(id, localStreamRef.current, {
            metadata: {
              user,
            },
          });

          outgoingCall.on("stream", (remoteStream) => {
            handleAddCamera(
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

        handleAddCamera(stream, user);
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
          handleAddCamera(remoteStream, incomingCall.metadata.user);
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices: ", error);
      });
  };
  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);
  useEffect(() => {
    // Handle SSR for navigator
    import("peerjs").then(({ default: Peer }) => {
      setPeer(new Peer(user.id));
    });
  }, []);

  useEffect(() => {
    if (peer) {
      peer.on("open", onPeerOpen);
      peer.on("call", onPeerCall);
    }
    return () => {
      if (peer) {
        peer.disconnect();
        peer.destroy();
      }
    };
  }, [peer]);

  useEffect(() => {
    channel.on("broadcast", { event: Event.ToggleCamera }, (payload) =>
      toggleCamera(payload.payload.userId)
    );
    channel.on("broadcast", { event: Event.ToggleAudio }, (payload) =>
      toggleAudio(payload.payload.userId)
    );
  }, []);

  return { cameras, fireToggleAudio, fireToggleCamera };
};
