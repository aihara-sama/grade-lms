"use client";

import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";

const VideoMeetingPage: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remotePeerId, setRemotePeerId] = useState<string>("");
  const [peer, setPeer] = useState<Peer | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Initialize Peer
    const newPeer = new Peer();
    setPeer(newPeer);

    // Get own Peer ID
    newPeer.on("open", (id) => {
      setPeerId(id);
    });

    // Handle incoming connection (remote user calls)
    newPeer.on("call", (call) => {
      // Answer the call and stream local video
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
      }

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        }
      });
    });

    // Get local media stream and display it
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream; // Save the local stream

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
        }
      });

    // Cleanup on unmount or navigating away
    return () => {
      if (newPeer) {
        newPeer.disconnect(); // Disconnect peer connection
        newPeer.destroy(); // Destroy peer to ensure connection is closed
      }

      // Stop all media tracks
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const callPeer = () => {
    if (!remotePeerId || !peer) return;

    if (localStreamRef.current) {
      // Call the remote peer
      const call = peer.call(remotePeerId, localStreamRef.current);

      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">PeerJS Video Chat</h1>

      {/* Display Peer ID */}
      <div className="my-4">
        <p>Your Peer ID: {peerId}</p>
        <input
          type="text"
          placeholder="Enter remote peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={callPeer}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Call Peer
        </button>
      </div>

      {/* Video elements */}
      <div className="flex">
        <div>
          <h2 className="text-lg font-bold">Your Video (Always Present)</h2>
          <video ref={localVideoRef} className="w-80 h-60 bg-black" muted />
        </div>
        <div className="ml-8">
          <h2 className="text-lg font-bold">Remote Video</h2>
          <video ref={remoteVideoRef} className="w-80 h-60 bg-black" />
        </div>
      </div>
    </div>
  );
};

export default VideoMeetingPage;
