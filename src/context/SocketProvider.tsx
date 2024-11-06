// /SocketProvider.tsx
"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string, senderId: string, receiverId: string) => void;
  messages: { roomId: string; message: string; senderId: string }[];
  joinRoom: (senderId: string, receiverId: string) => void;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("SocketContext is undefined");
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<{ roomId: string; message: string; senderId: string }[]>([]);

  const joinRoom = useCallback(
    (senderId: string, receiverId: string) => {
      if (socket) {
        socket.emit("join-room", { senderId, receiverId });
      }
    },
    [socket]
  );

  const sendMessage = useCallback(
    (msg: string, senderId: string, receiverId: string) => {
      if (socket) {
        socket.emit("send-message", { senderId, receiverId, message: msg });
      }
    },
    [socket]
  );

  const onMessageReceived = useCallback((data: { roomId: string; message: string; senderId: string }) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000"); // Adjust URL if necessary
    setSocket(_socket);

    _socket.on("receive-message", onMessageReceived);

    return () => {
      _socket.off("receive-message", onMessageReceived);
      _socket.disconnect();
    };
  }, [onMessageReceived]);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, joinRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
