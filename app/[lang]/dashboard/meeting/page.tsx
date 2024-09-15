"use client";

import { useUser } from "@/hooks/use-user";
import { db } from "@/utils/supabase/client";
import type {
  REALTIME_SUBSCRIBE_STATES,
  RealtimePresenceJoinPayload,
  User,
} from "@supabase/supabase-js";
import type { MediaConnection } from "peerjs";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";

type RemotePeer = {
  id: string;
  stream: MediaStream;
};

const VideoMeetingPage: React.FC = () => {
  const peerRef = useRef<Peer>();
  const [remotePeerIds, setRemotePeerIds] = useState<string[]>([]);
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const connectionsRef = useRef<{ [key: string]: MediaConnection }>({});
  const { user } = useUser();

  const channel = db.channel("room name", {
    config: {
      presence: {
        key: user.id,
      },
    },
  });

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current
      ?.getVideoTracks()
      .find((track) => track.kind === "video");

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current
      ?.getAudioTracks()
      .find((track) => track.kind === "audio");

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    }
  };

  const onPresenceJoin = (
    payload: RealtimePresenceJoinPayload<{ user: User }>
  ) => {
    console.log("onPresenceJoin");

    if (payload.key === user.id) {
      console.log("payload.key === user.id");

      Object.keys(channel.presenceState())
        .filter((id) => id !== user.id)
        .forEach((id) => {
          console.log(`calling - ${id}`);

          const call = peerRef.current.call(id, localStreamRef.current);

          connectionsRef.current[id] = call;

          call.on("stream", (remoteStream) => {
            setRemotePeers((prevPeers) => {
              if (!prevPeers.find((peer) => peer.id === user.id))
                return [...prevPeers, { id: user.id, stream: remoteStream }];
              return prevPeers;
            });
          });

          call.on("close", () => {
            setRemotePeers((prevPeers) =>
              prevPeers.filter(({ id: _id }) => _id !== id)
            );
            delete connectionsRef.current[id];
          });
          call.on("error", (error) => {
            console.log(`Error while calling${error}`);
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
    channel
      .on("presence", { event: "join" }, onPresenceJoin)
      .subscribe(onPresenceSubscribe);
  };

  const onPeerCall = (call: MediaConnection) => {
    call.answer(localStreamRef.current);
    connectionsRef.current[user.id] = call;

    call.on("stream", (remoteStream) => {
      setRemotePeers((prevPeers) => {
        if (!prevPeers.find((peer) => peer.id === user.id))
          return [...prevPeers, { id: user.id, stream: remoteStream }];
        return prevPeers;
      });
    });

    call.on("close", () => {
      setRemotePeers((prevPeers) =>
        prevPeers.filter(({ id }) => id !== user.id)
      );
      delete connectionsRef.current[user.id];
    });
  };

  useEffect(() => {
    // Handle incoming connections

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;

        peerRef.current = new Peer(user.id);

        // Get own Peer ID
        peerRef.current.on("open", onPeerOpen);
        peerRef.current.on("call", onPeerCall);

        // Initialize Peer
      });
  }, []);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">PeerJS Video Chat</h1>
      0.
      {/* Display Peer ID */}
      <div className="my-4">
        <p>Your user ID: {user.id}</p>
        <textarea
          placeholder="Enter remote peer IDs, separated by commas"
          value={remotePeerIds.join(",")}
          onChange={(e) =>
            setRemotePeerIds(e.target.value.split(",").map((id) => id.trim()))
          }
          className="border p-2 rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Call Peers
        </button>
      </div>
      {/* Video elements */}
      <div className="flex">
        <div>
          <h2 className="text-lg font-bold">Your Video (Always Present)</h2>
          <video
            ref={localVideoRef}
            autoPlay
            className="w-80 h-60 bg-black"
            muted
          />

          {/* Toggle Buttons for Video and Audio */}
          <div className="flex mt-4">
            <button
              onClick={toggleVideo}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              {videoEnabled ? "Turn Off Video" : "Turn On Video"}
            </button>
            <button
              onClick={toggleAudio}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              {audioEnabled ? "Turn Off Audio" : "Turn On Audio"}
            </button>
          </div>
        </div>
        <div className="ml-8">
          <h2 className="text-lg font-bold">Remote Videos</h2>
          <div className="flex flex-wrap">
            {remotePeers.map((remotePeer) => (
              <div key={remotePeer.id} className="w-80 h-60 bg-black m-2">
                <video
                  autoPlay
                  ref={(el) => {
                    if (el) {
                      el.srcObject = remotePeer.stream;
                    }
                  }}
                  className="w-full h-full"
                />
                <p className="text-center text-sm">Peer ID: {remotePeer.id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoMeetingPage;
