import { Event } from "@/enums/event.enum";
import { useUser } from "@/hooks/use-user";
import type { Camera } from "@/interfaces/camera.interface";
import { DB } from "@/lib/supabase/db";
import type { User } from "@/types/user.type";
import type {
  REALTIME_SUBSCRIBE_STATES,
  RealtimePresenceJoinPayload,
  RealtimePresenceLeavePayload,
} from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import type Peer from "peerjs";
import type { MediaConnection } from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";

export const useVideoChat = () => {
  // State
  const [cameras, setCameras] = useState<Camera[]>([]);

  // Hooks
  const user = useUser((state) => state.user);
  const { lessonId } = useParams();

  // Refs
  const peerRef = useRef<Peer>();
  const joinedOnceRef = useRef(false);
  const localStreamRef = useRef<MediaStream>();
  const outgoingCallRef = useRef<MediaConnection>();
  const channelRef = useRef(
    DB.channel(lessonId as string, {
      config: {
        presence: {
          key: user.id,
        },
        broadcast: {
          self: false,
        },
      },
    })
  );

  // Handlers
  const addCamera = (
    stream: MediaStream,
    _user: User,
    isCameraEnabled = true,
    isMicEnabled = true
  ) => {
    setCameras((_) => {
      const maybeCameraIndex = _.findIndex(
        ({ user: { id } }) => id === _user.id
      );

      if (maybeCameraIndex !== -1) {
        // If the camera exists, replace the stream and return the updated camera list
        const updatedCamera = {
          ..._[maybeCameraIndex],
          stream,
        };

        return [
          ..._.slice(0, maybeCameraIndex),
          updatedCamera,
          ..._.slice(maybeCameraIndex + 1),
        ];
      }

      // If the camera does not exist, add a new camera
      return [
        ..._,
        {
          stream,
          isCameraEnabled,
          isMicEnabled,
          user: _user,
        },
      ];
    });
  };

  const renegotiate = (constraints: MediaStreamConstraints) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        addCamera(
          stream,
          user,
          constraints.video as boolean,
          constraints.audio as boolean
        );
        console.log({ stream });

        Object.keys(channelRef.current.presenceState())
          .filter((id) => id !== user.id)
          .forEach((id) => {
            const outgoingCall = peerRef.current.call(id, stream, {
              metadata: {
                user,
              },
            });

            outgoingCall.on("close", () => {
              setCameras((_) => _.filter((camera) => camera.user.id !== id));
            });
          });
      });
  };

  const toggleCamera = useCallback(async (userId: string) => {
    setCameras((prev) => {
      return prev.map((cam) => {
        if (cam.user.id === userId) {
          cam.stream.getVideoTracks().forEach((track) => {
            track.stop();
          });
          if (cam.user.id === user.id) {
            channelRef.current.track({
              user,
              isCameraEnabled: !cam.isCameraEnabled,
              isMicEnabled: cam.isMicEnabled,
            });
            if (cam.isCameraEnabled) {
              //
            } else {
              renegotiate({
                audio: true,
                video: !cam.isCameraEnabled,
              });
            }
          }

          cam.isCameraEnabled = !cam.isCameraEnabled;
        }
        return cam;
      });
    });
  }, []);
  const toggleAudio = useCallback((userId: string) => {
    setCameras((prev) => {
      return prev.map((cam) => {
        if (cam.user.id === userId) {
          cam.stream.getAudioTracks().forEach((track) => {
            track.enabled = !cam.isMicEnabled;
          });

          if (cam.user.id === user.id) {
            channelRef.current.track({
              user,
              isCameraEnabled: cam.isCameraEnabled,
              isMicEnabled: !cam.isMicEnabled,
            });
          }

          cam.isMicEnabled = !cam.isMicEnabled;
        }
        return cam;
      });
    });
  }, []);

  const fireToggleCamera = (userId: string) => {
    toggleCamera(userId);
    channelRef.current.send({
      event: Event.ToggleCamera,
      type: "broadcast",
      payload: {
        userId,
      },
    });
  };
  const fireToggleAudio = (userId: string) => {
    channelRef.current.send({
      event: Event.ToggleAudio,
      type: "broadcast",
      payload: {
        userId,
      },
    });
  };

  const onPresenceJoin = (
    payload: RealtimePresenceJoinPayload<{ user: User }>
  ) => {
    if (joinedOnceRef.current === false && payload.key === user.id) {
      Object.keys(channelRef.current.presenceState())
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

          outgoingCall.once("stream", (remoteStream) => {
            addCamera(
              remoteStream,
              channelRef.current.presenceState<{
                user: User;
                isCameraEnabled: boolean;
                isMicEnabled: boolean;
              }>()[id][0].user,
              channelRef.current.presenceState<{
                user: User;
                isCameraEnabled: boolean;
                isMicEnabled: boolean;
              }>()[id][0].isCameraEnabled,
              channelRef.current.presenceState<{
                user: User;
                isCameraEnabled: boolean;
                isMicEnabled: boolean;
              }>()[id][0].isMicEnabled
            );
          });

          outgoingCall.on("close", () => {
            setCameras((_) => _.filter((camera) => camera.user.id !== id));
          });

          outgoingCallRef.current = outgoingCall;
        });

      joinedOnceRef.current = true;
    }
  };
  const onPresenceLeave = (
    payload: RealtimePresenceLeavePayload<{ user: User }>
  ) => {
    if (!channelRef.current.presenceState()[payload.leftPresences[0].user.id]) {
      setCameras((_) =>
        _.filter(
          (camera) => payload.leftPresences[0].user.id !== camera.user.id
        )
      );
    }
  };
  const onPresenceSubscribe = async (
    status: `${REALTIME_SUBSCRIBE_STATES}`
  ) => {
    if (status === "SUBSCRIBED") {
      await channelRef.current.track({
        user,
      });
    }
  };

  const onPeerOpen = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        channelRef.current
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
    incomingCall.once("stream", (remoteStream) => {
      console.log({ remoteStream, videoTracks: remoteStream.getVideoTracks() });

      addCamera(remoteStream, incomingCall.metadata.user);
    });
    incomingCall.on("close", () => {
      setCameras((_) =>
        _.filter((camera) => camera.user.id !== incomingCall.metadata.user.id)
      );
    });
  };

  const startSession = () => {
    // Handle SSR for navigator
    import("peerjs").then(({ default: Peer }) => {
      peerRef.current = new Peer(user.id, {});

      peerRef.current.on("open", onPeerOpen);
      peerRef.current.on("call", onPeerCall);
    });
  };
  const endSession = () => {
    if (peerRef.current) {
      peerRef.current.disconnect();
      peerRef.current.destroy();
    }
    localStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    channelRef.current.unsubscribe();
  };
  useEffect(() => {
    channelRef.current.on(
      "broadcast",
      { event: Event.ToggleCamera },
      (payload) => {
        toggleCamera(payload.payload.userId);
      }
    );
    channelRef.current.on(
      "broadcast",
      { event: Event.ToggleAudio },
      (payload) => toggleAudio(payload.payload.userId)
    );
  }, []);

  // Effects
  useEffect(() => {
    return () => {
      if (peerRef.current) {
        peerRef.current.disconnect();
        peerRef.current.destroy();
      }
      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      channelRef.current.unsubscribe();
    };
  }, [lessonId]);

  return {
    cameras,
    fireToggleAudio,
    fireToggleCamera,
    endSession,
    startSession,
  };
};
