"use client";

import type { MediaConnection } from "peerjs";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";

type RemotePeer = {
  id: string;
  stream: MediaStream;
};

const VideoMeetingPage: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remotePeerIds, setRemotePeerIds] = useState<string[]>([]);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const connectionsRef = useRef<{ [key: string]: MediaConnection }>({});

  useEffect(() => {
    // Initialize Peer
    const newPeer = new Peer();
    setPeer(newPeer);

    // Get own Peer ID
    newPeer.on("open", (id) => {
      setPeerId(id);
    });

    // Handle incoming connections
    newPeer.on("call", (call) => {
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
      }

      connectionsRef.current[call.peer] = call;

      call.on("stream", (remoteStream) => {
        setRemotePeers((prevPeers) => [
          ...prevPeers,
          { id: call.peer, stream: remoteStream },
        ]);
      });

      call.on("close", () => {
        setRemotePeers((prevPeers) =>
          prevPeers.filter(({ id }) => id !== call.peer)
        );
        delete connectionsRef.current[call.peer];
      });
    });

    // Get local media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
        }
      });

    return () => {
      if (newPeer) {
        newPeer.disconnect();
        newPeer.destroy();
      }
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const callPeers = () => {
    if (!peer) return;

    remotePeerIds.forEach((remotePeerId) => {
      if (localStreamRef.current) {
        const call = peer.call(remotePeerId, localStreamRef.current);

        connectionsRef.current[remotePeerId] = call;

        call.on("stream", (remoteStream) => {
          setRemotePeers((prevPeers) => [
            ...prevPeers,
            { id: remotePeerId, stream: remoteStream },
          ]);
        });

        call.on("close", () => {
          setRemotePeers((prevPeers) =>
            prevPeers.filter(({ id }) => id !== remotePeerId)
          );
          delete connectionsRef.current[remotePeerId];
        });
      }
    });
  };

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">PeerJS Video Chat</h1>
      0.
      {/* Display Peer ID */}
      <div className="my-4">
        <p>Your Peer ID: {peerId}</p>
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
        <div>
          <h2 className="text-lg font-bold">Your Video (Always Present)</h2>
          <video ref={localVideoRef} className="w-80 h-60 bg-black" muted />

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
                  ref={(el) => {
                    if (el) {
                      el.srcObject = remotePeer.stream;
                      el.play();
                    }
                  }}
                  className="w-full h-full"
                  playsInline
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
