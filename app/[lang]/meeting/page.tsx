"use client";

import type { MediaConnection } from "peerjs";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";

const VideoMeetingPage: React.FC = () => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remotePeerIds, setRemotePeerIds] = useState<string[]>([]);
  const [peer, setPeer] = useState<Peer | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement }>({}); // Store refs for remote videos
  const connectionsRef = useRef<{ [key: string]: MediaConnection }>({}); // Store active connections

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
      // Answer the call and stream local video
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
      }

      // Save connection
      connectionsRef.current[call.peer] = call;

      call.on("stream", (remoteStream) => {
        // Create a video element for the new remote peer
        if (!remoteVideoRefs.current[call.peer]) {
          const video = document.createElement("video");
          video.className = "w-80 h-60 bg-black";
          document.getElementById("remote-videos")?.appendChild(video);
          remoteVideoRefs.current[call.peer] = video;
        }

        remoteVideoRefs.current[call.peer].srcObject = remoteStream;
        remoteVideoRefs.current[call.peer].play();
      });

      // Handle call closure
      call.on("close", () => {
        if (remoteVideoRefs.current[call.peer]) {
          remoteVideoRefs.current[call.peer].srcObject = null;
        }
        delete remoteVideoRefs.current[call.peer];
        delete connectionsRef.current[call.peer];
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

  const callPeers = () => {
    if (!peer) return;

    remotePeerIds.forEach((remotePeerId) => {
      if (localStreamRef.current) {
        // Call the remote peer
        const call = peer.call(remotePeerId, localStreamRef.current);

        // Save connection
        connectionsRef.current[remotePeerId] = call;

        call.on("stream", (remoteStream) => {
          // Create a video element for the new remote peer
          if (!remoteVideoRefs.current[remotePeerId]) {
            const video = document.createElement("video");
            video.className = "w-80 h-60 bg-black";
            document.getElementById("remote-videos")?.appendChild(video);
            remoteVideoRefs.current[remotePeerId] = video;
          }

          remoteVideoRefs.current[remotePeerId].srcObject = remoteStream;
          remoteVideoRefs.current[remotePeerId].play();
        });

        // Handle call closure
        call.on("close", () => {
          if (remoteVideoRefs.current[remotePeerId]) {
            remoteVideoRefs.current[remotePeerId].srcObject = null;
          }
          delete remoteVideoRefs.current[remotePeerId];
          delete connectionsRef.current[remotePeerId];
        });
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">PeerJS Video Chat</h1>

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
        </div>
        <div id="remote-videos" className="ml-8">
          <h2 className="text-lg font-bold">Remote Videos</h2>
          {/* Remote videos will be dynamically added here */}
        </div>
      </div>
    </div>
  );
};

export default VideoMeetingPage;
