"use client";

import Camera from "@/components/camera";
import { useUser } from "@/hooks/use-user";
import type { ICamera } from "@/interfaces/camera.interface";
import { DB } from "@/lib/supabase/db";
import type { User } from "@/types/users";
import type { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";

const VideoMeetingPage: React.FC = () => {
  const [remotePeerIds, setRemotePeerIds] = useState<string[]>([]);
  const peerRef = useRef<Peer>();
  const localStreamRef = useRef<MediaStream | null>(null);
  const [cameras, setCameras] = useState<ICamera[]>([]);

  const { user } = useUser();
  const channel = DB.channel("id", {
    config: {
      presence: {
        key: user.id,
      },
    },
  });

  const onPresenceSubscribe = async (
    status: `${REALTIME_SUBSCRIBE_STATES}`
  ) => {
    if (status === "SUBSCRIBED") {
      await channel.track({
        user,
      });
    }
  };

  const callPeers = async (payload: any) => {
    console.log("callPeers");

    if (payload.key === user.id) {
      Object.keys(channel.presenceState())
        .filter((id) => id !== user.id)
        .forEach((id) => {
          if (localStreamRef.current) {
            // Call the remote peer
            const call = peerRef.current.call(id, localStreamRef.current, {
              metadata: {
                user,
              },
            });

            // Save connection

            call.once("stream", (remoteStream) => {
              // Add new remote peer to the state
              // setRemotePeers((prevPeers) => [
              //   ...prevPeers,
              //   { id, stream: remoteStream },
              // ]);
              setCameras((_) => [
                ..._,
                {
                  stream: remoteStream,
                  user: channel.presenceState<{ user: User }>()[id][0].user,
                  isCameraEnabled: true,
                  isMicEnabled: true,
                },
              ]);
            });

            // Handle call closure
            call.on("close", () => {
              setCameras((_) => _.filter((camera) => camera.user.id !== id));
            });
          }
        });
    }
  };

  useEffect(() => {
    // Initialize Peer
    peerRef.current = new Peer(user.id);

    // Get own Peer ID
    peerRef.current.on("open", async () => {
      // Get local media stream and display it
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(async (stream) => {
          localStreamRef.current = stream; // Save the local stream

          setCameras((_) => [
            ..._,
            {
              stream,
              user,
              isCameraEnabled: true,
              isMicEnabled: true,
            },
          ]);

          channel
            .on("presence", { event: "join" }, callPeers)
            .subscribe(onPresenceSubscribe);
        });
    });

    // Handle incoming connections
    peerRef.current.on("call", (call) => {
      // Answer the call and stream local video
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
      }

      // Save connection

      call.once("stream", (remoteStream) => {
        // Add new remote peer to the state
        setCameras((_) => [
          ..._,
          {
            stream: remoteStream,
            user: call.metadata.user,
            isCameraEnabled: true,
            isMicEnabled: true,
          },
        ]);
      });

      // Handle call closure
      call.on("close", () => {
        setCameras((_) => _.filter((camera) => camera.user.id !== call.peer));
      });
    });

    // Cleanup on unmount or navigating away
    return () => {
      if (peerRef.current) {
        peerRef.current.disconnect(); // Disconnect peer connection
        peerRef.current.destroy(); // Destroy peer to ensure connection is closed
      }

      // Stop all media tracks
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">PeerJS Video Chat</h1>

      {/* Display Peer ID */}
      <div className="my-4">
        <textarea
          placeholder="Enter remote peer IDs, separated by commas"
          value={remotePeerIds.join(",")}
          onChange={(e) =>
            setRemotePeerIds(e.target.value.split(",").map((id) => id.trim()))
          }
          className="border p-2 rounded"
        />
        <button
          onClick={callPeers}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Call Peers
        </button>
      </div>

      {/* Video elements */}
      <div className="flex">
        <div className="ml-8">
          <h2 className="text-lg font-bold">Remote Videos</h2>
          <div className="flex flex-wrap">
            {/* Dynamically render remote video elements */}
            {cameras.map((camera, idx) => (
              <Camera
                toggleCamera={() => {}}
                toggleAudio={() => {}}
                camera={camera}
                key={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoMeetingPage;
