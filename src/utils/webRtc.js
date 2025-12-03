import { io } from "socket.io-client";
import Peer from "simple-peer";
import EventEmitter from "events";
import process from "process";
import { format } from "util";

const serverWebRTCUrl = import.meta.env.VITE_WEBRTC_URL;
const iceServerUrl = import.meta.env.VITE_ICE_SERVER_URL;
const iceServerUsername = import.meta.env.VITE_ICE_SERVER_USERNAME;
const iceServerCredential = import.meta.env.VITE_ICE_SERVER_CREDENTIAL;

const voiceEvents = new EventEmitter();
const peers = new Map();
let socket = null;
let localStream = null;
let currentMeetingId = null;

const iceServers = (() => {
  if (!iceServerUrl) {
    return [{ urls: "stun:stun.l.google.com:19302" }];
  }
  const entry = { urls: iceServerUrl };
  if (iceServerUsername) entry.username = iceServerUsername;
  if (iceServerCredential) entry.credential = iceServerCredential;
  return [entry];
})();

/**
 * Starts a voice chat session using Socket.IO + Peer.js.
 * @param {string} meetingId - Meeting identifier used as the room key on the signaling server.
 * @param {{ onRemoteStream?: (peerId: string, stream: MediaStream) => void, onPeerLeft?: (peerId: string) => void }} callbacks
 * @returns {Promise<{ stop: () => void, localStream: MediaStream }>} helper utilities for cleanup and local audio.
 */
export async function startVoiceChat(meetingId, callbacks = {}) {
  if (!meetingId) throw new Error("meetingId is required to start voice chat");
  if (!serverWebRTCUrl) throw new Error("VITE_WEBRTC_URL is not configured");

  currentMeetingId = meetingId;
  voiceEvents.emit(
    "voice:init",
    format("Bootstrapping voice chat in %s mode", process.env?.NODE_ENV || "development")
  );

  localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  const socketInstance = await createSocket(meetingId);

  const handleRemoteStream = (peerId, stream) => {
    callbacks.onRemoteStream?.(peerId, stream);
    voiceEvents.emit("peer-stream", { peerId, stream });
  };

  const handlePeerLeft = (peerId) => {
    callbacks.onPeerLeft?.(peerId);
    voiceEvents.emit("peer-left", peerId);
  };

  socketInstance.on("introduction", (remotePeers = []) => {
    remotePeers.forEach((peerId) => {
      ensurePeer(peerId, true, handleRemoteStream, handlePeerLeft);
    });
  });

  socketInstance.on("newUserConnected", (peerId) => {
    voiceEvents.emit("peer-joined", peerId);
    // The newcomer will initiate the connection; ensure a peer exists ready to handle incoming signal.
    ensurePeer(peerId, false, handleRemoteStream, handlePeerLeft);
  });

  socketInstance.on("signal", (to, from, data) => {
    if (to !== socketInstance.id) return;
    const peer = ensurePeer(from, false, handleRemoteStream, handlePeerLeft);
    peer?.signal(data);
  });

  socketInstance.on("userDisconnected", (peerId) => {
    teardownPeer(peerId, handlePeerLeft);
  });

  socketInstance.on("disconnect", () => {
    voiceEvents.emit("socket-disconnect", meetingId);
  });

  return {
    stop: () => stopVoiceChat(),
    localStream
  };
}

async function createSocket(meetingId) {
  if (socket) return socket;
  socket = io(serverWebRTCUrl, {
    transports: ["websocket"],
    query: { meetingId }
  });
  return await new Promise((resolve, reject) => {
    socket.on("connect", () => resolve(socket));
    socket.on("connect_error", (err) => reject(err));
  });
}

function ensurePeer(peerId, initiator, onRemoteStream, onPeerLeft) {
  if (!socket || peerId === socket.id) return null;
  if (peers.has(peerId)) return peers.get(peerId);
  const peer = new Peer({
    initiator,
    trickle: false,
    stream: localStream ?? undefined,
    config: { iceServers }
  });
  peer.on("signal", (data) => {
    socket?.emit("signal", peerId, socket.id, data);
  });
  peer.on("stream", (stream) => onRemoteStream?.(peerId, stream));
  peer.on("close", () => teardownPeer(peerId, onPeerLeft));
  peer.on("error", (err) => {
    console.error("Peer error", peerId, err);
    teardownPeer(peerId, onPeerLeft);
  });
  peers.set(peerId, peer);
  return peer;
}

function teardownPeer(peerId, onPeerLeft) {
  const peer = peers.get(peerId);
  if (peer) {
    peer.removeAllListeners();
    peer.destroy();
    peers.delete(peerId);
    onPeerLeft?.(peerId);
  }
}

/**
 * Stops all peers and closes the signaling socket.
 */
export function stopVoiceChat() {
  peers.forEach((peer) => peer.destroy());
  peers.clear();
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
  currentMeetingId = null;
  voiceEvents.removeAllListeners();
}

/**
 * Toggles the local microphone tracks.
 * @param {boolean} enabled - true to allow audio, false to mute microphone.
 */
export function setMicrophoneEnabled(enabled) {
  if (!localStream) return;
  localStream.getAudioTracks().forEach((track) => {
    track.enabled = enabled;
  });
}

export { voiceEvents, currentMeetingId };
